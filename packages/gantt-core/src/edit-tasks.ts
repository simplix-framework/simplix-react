import { compileCalendars } from "./calendar";
import type { WorkingTime } from "./calendar";
import { ELAPSED_TIME } from "./calendar";
import { ScheduleError } from "./errors";
import { subtreeEnd } from "./outline";
import type { Minutes } from "./time";
import type { Assignment, DurationUnit, Id, Project, Schedule, Task } from "./types";

/** Row index of a task. @throws ScheduleError `unknown-reference` when there is no such task. */
export function taskIndex(project: Project, id: Id): number {
  const index = project.tasks.findIndex((task) => task.id === id);
  if (index === -1) throw new ScheduleError("unknown-reference", `No task "${id}"`, [id]);
  return index;
}

/** Returns the project with one task replaced by what `change` returns for it. */
export function changeTask(project: Project, id: Id, change: (task: Task) => Task): Project {
  const index = taskIndex(project, id);
  const tasks = project.tasks.slice();
  tasks[index] = change(tasks[index]);
  return { ...project, tasks };
}

/** An id no record of the collection uses: one more than the largest numeric id. */
export function nextId(records: readonly { id: Id }[]): Id {
  let max = 0;
  for (const record of records) {
    const value = Number(record.id);
    if (Number.isInteger(value) && value > max) max = value;
  }
  return String(max + 1);
}

/**
 * A new task with the defaults of the project: one estimated day, scheduled
 * automatically, as soon as possible (as late as possible in a project
 * scheduled from its finish).
 */
export function createTask(project: Project, patch: Partial<Task> = {}): Task {
  return {
    id: nextId(project.tasks),
    name: "",
    outlineLevel: 1,
    mode: "auto",
    duration: project.minutesPerDay,
    durationUnit: "d",
    estimated: true,
    constraintType: project.scheduleFrom === "finish" ? "alap" : "asap",
    type: "fixed-units",
    percentComplete: 0,
    priority: 500,
    ...patch,
  };
}

/**
 * Inserts a row at `index` (the end when omitted). An outline level deeper
 * than one under the row before it is pulled up to that depth.
 */
export function insertTask(project: Project, task: Task, index: number = project.tasks.length): Project {
  if (project.tasks.some((existing) => existing.id === task.id)) {
    throw new ScheduleError("duplicate-id", `Task id "${task.id}" is used twice`, [task.id]);
  }
  const at = Math.max(0, Math.min(index, project.tasks.length));
  const maxLevel = at === 0 ? 1 : project.tasks[at - 1].outlineLevel + 1;
  const tasks = project.tasks.slice();
  tasks.splice(at, 0, { ...task, outlineLevel: Math.max(1, Math.min(task.outlineLevel, maxLevel)) });
  return { ...project, tasks };
}

/** Removes tasks with every task under them, and the links, assignments and baseline entries that name them. */
export function removeTasks(project: Project, ids: readonly Id[]): Project {
  const removed = new Set<Id>();
  for (const id of ids) {
    const index = taskIndex(project, id);
    for (let i = index; i < subtreeEnd(project.tasks, index); i++) removed.add(project.tasks[i].id);
  }
  const tasks = project.tasks.filter((task) => !removed.has(task.id));
  // A row whose parent went keeps a valid depth: never more than one under the row before it.
  for (let i = 0; i < tasks.length; i++) {
    const maxLevel = i === 0 ? 1 : tasks[i - 1].outlineLevel + 1;
    if (tasks[i].outlineLevel > maxLevel) tasks[i] = { ...tasks[i], outlineLevel: maxLevel };
  }
  const baselines: Record<number, Record<Id, Project["baselines"][number][Id]>> = {};
  for (const [number, baseline] of Object.entries(project.baselines)) {
    baselines[Number(number)] = Object.fromEntries(Object.entries(baseline).filter(([id]) => !removed.has(id)));
  }
  return {
    ...project,
    tasks,
    links: project.links.filter((link) => !removed.has(link.predecessorId) && !removed.has(link.successorId)),
    assignments: project.assignments.filter((assignment) => !removed.has(assignment.taskId)),
    baselines,
  };
}

/** Changes fields of a task as given, with no side effect on other fields. */
export function updateTask(project: Project, id: Id, patch: Partial<Omit<Task, "id">>): Project {
  return changeTask(project, id, (task) => ({ ...task, ...patch }));
}

function taskTime(project: Project, task: Task): WorkingTime {
  if (task.elapsed) return ELAPSED_TIME;
  const time = compileCalendars(project.calendars).get(task.calendarId ?? project.calendarId);
  if (!time) {
    throw new ScheduleError("unknown-reference", `Task "${task.id}" names a missing calendar`, [task.id]);
  }
  return time;
}

/** Work of each assignment after the task's duration changed, by the task's type. */
function reworkAssignments(project: Project, task: Task, duration: number): Assignment[] {
  return project.assignments.map((assignment) => {
    if (assignment.taskId !== task.id) return assignment;
    // Fixed work keeps the work and spreads it over the new duration.
    if (task.type === "fixed-work") {
      return duration > 0 ? { ...assignment, units: assignment.work / duration } : assignment;
    }
    return { ...assignment, work: Math.round(duration * assignment.units) };
  });
}

/**
 * Sets a task's duration. Assignments follow the task's type: fixed work
 * changes their units, the other types change their work. A recorded actual
 * finish is dropped, so a finished task ends where the new duration puts it.
 */
export function setTaskDuration(
  project: Project,
  id: Id,
  minutes: number,
  options: { unit?: DurationUnit; elapsed?: boolean; estimated?: boolean } = {},
): Project {
  if (!Number.isFinite(minutes) || minutes < 0) {
    throw new ScheduleError("invalid-duration", `Not a duration for task "${id}": ${minutes}`, [id]);
  }
  const task = project.tasks[taskIndex(project, id)];
  const next: Task = {
    ...task,
    duration: minutes,
    durationUnit: options.unit ?? task.durationUnit,
    elapsed: options.elapsed ?? task.elapsed,
    estimated: options.estimated ?? false,
  };
  if (next.mode === "manual" && next.manualStart !== undefined) delete next.manualFinish;
  // A recorded finish belongs to the old duration; the finish now follows the actual start.
  delete next.actualFinish;
  return { ...changeTask(project, id, () => next), assignments: reworkAssignments(project, task, minutes) };
}

/**
 * Moves a task to start at `start`, keeping its duration. An automatic task
 * gets a start-no-earlier-than constraint (finish-no-later-than keeps its
 * meaning in a project scheduled from its finish); a manual task takes the
 * date as typed. A task that has started moves its actual start with it.
 */
export function setTaskStart(project: Project, id: Id, start: Minutes): Project {
  return changeTask(project, id, (current) => {
    let task = current;
    if (task.actualStart !== undefined) {
      // A started task is held at its actual start, so that is the date to move.
      task = { ...task, actualStart: start };
      delete task.actualFinish;
    }
    if (task.mode === "manual") {
      const next: Task = { ...task, manualStart: start };
      delete next.manualFinish;
      return next;
    }
    if (project.scheduleFrom === "finish") {
      const finish = taskTime(project, task).add(taskTime(project, task).snapForward(start), task.duration);
      return { ...task, constraintType: "finish-no-later-than", constraintDate: finish };
    }
    return { ...task, constraintType: "start-no-earlier-than", constraintDate: start };
  });
}

/**
 * Moves a task's finish to `finish`, keeping its start: the duration becomes
 * the working time between the two.
 *
 * @throws ScheduleError `invalid-date` when the finish is before the start.
 */
export function setTaskFinish(project: Project, schedule: Schedule, id: Id, finish: Minutes): Project {
  const task = project.tasks[taskIndex(project, id)];
  const scheduled = schedule.tasks.get(id);
  if (!scheduled) throw new ScheduleError("unknown-reference", `No schedule for task "${id}"`, [id]);
  if (finish < scheduled.start) {
    throw new ScheduleError("invalid-date", `Task "${id}" cannot finish before it starts`, [id]);
  }
  const duration = taskTime(project, task).workBetween(scheduled.start, finish);
  const next = setTaskDuration(project, id, duration);
  if (task.mode !== "manual") return next;
  return changeTask(next, id, (changed) => ({ ...changed, manualStart: scheduled.start, manualFinish: finish }));
}

/**
 * Moves a task's start to `start`, keeping its finish: the duration becomes
 * the working time between the two.
 *
 * @throws ScheduleError `invalid-date` when the start is after the finish.
 */
export function setTaskStartKeepingFinish(project: Project, schedule: Schedule, id: Id, start: Minutes): Project {
  const task = project.tasks[taskIndex(project, id)];
  const scheduled = schedule.tasks.get(id);
  if (!scheduled) throw new ScheduleError("unknown-reference", `No schedule for task "${id}"`, [id]);
  if (start > scheduled.finish) {
    throw new ScheduleError("invalid-date", `Task "${id}" cannot start after it finishes`, [id]);
  }
  const duration = taskTime(project, task).workBetween(start, scheduled.finish);
  const next = setTaskStart(setTaskDuration(project, id, duration), id, start);
  if (task.mode !== "manual") return next;
  return changeTask(next, id, (changed) => ({ ...changed, manualStart: start, manualFinish: scheduled.finish }));
}

/**
 * Records progress. Above zero the scheduled start becomes the actual start,
 * and at 100 the scheduled finish becomes the actual finish; zero clears
 * both. On a summary task the value goes to every task under it.
 */
export function setPercentComplete(project: Project, schedule: Schedule, id: Id, percent: number): Project {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new ScheduleError("invalid-operation", `Percent complete out of range for task "${id}": ${percent}`, [id]);
  }
  const index = taskIndex(project, id);
  const end = subtreeEnd(project.tasks, index);
  const tasks = project.tasks.slice();
  for (let i = index; i < end; i++) {
    const isSummary = i + 1 < tasks.length && tasks[i + 1].outlineLevel > tasks[i].outlineLevel;
    if (isSummary) continue;
    const scheduled = schedule.tasks.get(tasks[i].id);
    if (!scheduled) throw new ScheduleError("unknown-reference", `No schedule for task "${tasks[i].id}"`, [tasks[i].id]);
    const next: Task = { ...tasks[i], percentComplete: percent };
    if (percent === 0) {
      delete next.actualStart;
      delete next.actualFinish;
    } else {
      next.actualStart = next.actualStart ?? scheduled.start;
      if (percent === 100) next.actualFinish = next.actualFinish ?? scheduled.finish;
      else delete next.actualFinish;
    }
    tasks[i] = next;
  }
  return { ...project, tasks };
}
