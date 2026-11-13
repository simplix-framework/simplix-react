import { taskIndex } from "./edit-tasks";
import { ScheduleError } from "./errors";
import { buildOutline, isAncestor, subtreeEnd } from "./outline";
import type { Assignment, Id, Link, Project, Task } from "./types";

/**
 * Drops every link that joins a summary task to a task under it. A change of
 * the outline can turn an ordinary link into one, and such a link is a cycle.
 */
function dropAncestorLinks(project: Project): Project {
  const outline = buildOutline(project.tasks);
  const links = project.links.filter((link) => {
    const from = outline.indexById.get(link.predecessorId) as number;
    const to = outline.indexById.get(link.successorId) as number;
    return !isAncestor(outline, from, to) && !isAncestor(outline, to, from);
  });
  return links.length === project.links.length ? project : { ...project, links };
}

/** Row indexes of the given tasks, without rows that sit under another given task. */
function topmostRows(project: Project, ids: readonly Id[]): number[] {
  const rows = [...new Set(ids.map((id) => taskIndex(project, id)))].sort((a, b) => a - b);
  const result: number[] = [];
  let coveredUntil = 0;
  for (const row of rows) {
    if (row < coveredUntil) continue;
    result.push(row);
    coveredUntil = subtreeEnd(project.tasks, row);
  }
  return result;
}

function shiftLevels(tasks: Task[], from: number, to: number, delta: number): void {
  for (let i = from; i < to; i++) tasks[i] = { ...tasks[i], outlineLevel: tasks[i].outlineLevel + delta };
}

/**
 * Moves tasks one level deeper, with the tasks under them. A task with no
 * earlier row at its own level has nothing to go under and stays.
 */
export function indentTasks(project: Project, ids: readonly Id[]): Project {
  const tasks = project.tasks.slice();
  for (const row of topmostRows(project, ids)) {
    if (row === 0 || tasks[row - 1].outlineLevel < tasks[row].outlineLevel) continue;
    shiftLevels(tasks, row, subtreeEnd(tasks, row), 1);
  }
  return dropAncestorLinks({ ...project, tasks });
}

/**
 * Moves tasks one level up, with the tasks under them. The rows that followed
 * a task at its old level end up under it.
 */
export function outdentTasks(project: Project, ids: readonly Id[]): Project {
  const tasks = project.tasks.slice();
  for (const row of topmostRows(project, ids)) {
    if (tasks[row].outlineLevel === 1) continue;
    shiftLevels(tasks, row, subtreeEnd(tasks, row), -1);
  }
  return dropAncestorLinks({ ...project, tasks });
}

/**
 * Moves a task and the tasks under it so the task lands before the row now at
 * `beforeIndex` (the end when it equals the row count), at `outlineLevel` or
 * as deep as the row above allows.
 *
 * @throws ScheduleError `invalid-operation` when the target is inside the
 * moved rows.
 */
export function moveTask(project: Project, id: Id, beforeIndex: number, outlineLevel?: number): Project {
  const from = taskIndex(project, id);
  const end = subtreeEnd(project.tasks, from);
  if (beforeIndex > from && beforeIndex < end) {
    throw new ScheduleError("invalid-operation", `Task "${id}" cannot move under itself`, [id]);
  }
  const block = project.tasks.slice(from, end);
  const rest = [...project.tasks.slice(0, from), ...project.tasks.slice(end)];
  const at = Math.max(0, Math.min(beforeIndex > from ? beforeIndex - block.length : beforeIndex, rest.length));
  const maxLevel = at === 0 ? 1 : rest[at - 1].outlineLevel + 1;
  const level = Math.max(1, Math.min(outlineLevel ?? block[0].outlineLevel, maxLevel));
  const delta = level - block[0].outlineLevel;
  const moved = block.map((task) => ({ ...task, outlineLevel: task.outlineLevel + delta }));
  const tasks = [...rest.slice(0, at), ...moved, ...rest.slice(at)];
  // Rows that followed the block may now sit too deep under the row before them.
  for (let i = 1; i < tasks.length; i++) {
    const limit = tasks[i - 1].outlineLevel + 1;
    if (tasks[i].outlineLevel > limit) tasks[i] = { ...tasks[i], outlineLevel: limit };
  }
  if (tasks[0].outlineLevel !== 1) tasks[0] = { ...tasks[0], outlineLevel: 1 };
  return dropAncestorLinks({ ...project, tasks });
}

/** Tasks lifted out of a project together with the links and assignments among them. */
export interface TaskClipboard {
  tasks: readonly Task[];
  links: readonly Link[];
  assignments: readonly Assignment[];
}

/** Copies tasks with the tasks under them, the links between the copied tasks and their assignments. */
export function copyTasks(project: Project, ids: readonly Id[]): TaskClipboard {
  const tasks: Task[] = [];
  for (const row of topmostRows(project, ids)) {
    const end = subtreeEnd(project.tasks, row);
    const delta = 1 - project.tasks[row].outlineLevel;
    for (let i = row; i < end; i++) {
      tasks.push({ ...project.tasks[i], outlineLevel: project.tasks[i].outlineLevel + delta });
    }
  }
  const copied = new Set(tasks.map((task) => task.id));
  return {
    tasks,
    links: project.links.filter((link) => copied.has(link.predecessorId) && copied.has(link.successorId)),
    assignments: project.assignments.filter((assignment) => copied.has(assignment.taskId)),
  };
}

/**
 * Inserts copied tasks before the row at `beforeIndex`, at `outlineLevel` or
 * as deep as the row above allows. Every pasted record gets a new id from
 * `createId`, and progress is not carried over.
 */
export function pasteTasks(
  project: Project,
  clipboard: TaskClipboard,
  beforeIndex: number,
  createId: (kind: "task" | "link" | "assignment") => Id,
  outlineLevel = 1,
): Project {
  if (clipboard.tasks.length === 0) return project;
  const at = Math.max(0, Math.min(beforeIndex, project.tasks.length));
  const maxLevel = at === 0 ? 1 : project.tasks[at - 1].outlineLevel + 1;
  const delta = Math.max(1, Math.min(outlineLevel, maxLevel)) - 1;
  const idMap = new Map<Id, Id>();
  const pasted = clipboard.tasks.map((task) => {
    const id = createId("task");
    idMap.set(task.id, id);
    const next: Task = { ...task, id, outlineLevel: task.outlineLevel + delta, percentComplete: 0 };
    delete next.actualStart;
    delete next.actualFinish;
    return next;
  });
  const tasks = [...project.tasks.slice(0, at), ...pasted, ...project.tasks.slice(at)];
  const end = at + pasted.length;
  for (let i = end; i < tasks.length; i++) {
    const limit = tasks[i - 1].outlineLevel + 1;
    if (tasks[i].outlineLevel > limit) tasks[i] = { ...tasks[i], outlineLevel: limit };
  }
  return {
    ...project,
    tasks,
    links: [
      ...project.links,
      ...clipboard.links.map((link) => ({
        ...link,
        id: createId("link"),
        predecessorId: idMap.get(link.predecessorId) as Id,
        successorId: idMap.get(link.successorId) as Id,
      })),
    ],
    assignments: [
      ...project.assignments,
      ...clipboard.assignments.map((assignment) => ({
        ...assignment,
        id: createId("assignment"),
        taskId: idMap.get(assignment.taskId) as Id,
      })),
    ],
  };
}
