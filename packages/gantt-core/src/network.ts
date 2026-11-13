import { ELAPSED_TIME, compileCalendars, intersectWorkingTime } from "./calendar";
import type { WorkingTime } from "./calendar";
import { ScheduleError } from "./errors";
import { buildOutline } from "./outline";
import type { Outline } from "./outline";
import type { Minutes } from "./time";
import type { Id, Link, Project, Task } from "./types";

/** A start and the finish that belongs to it. */
export interface Span {
  start: Minutes;
  finish: Minutes;
}

/** Places a task of a given duration on the calendars it works on. */
export interface TaskClock {
  /** Calendar the task's lag and slack are counted on. */
  primary: WorkingTime;
  /** The earliest placement that starts at or after `bound`. */
  fromStart(bound: Minutes, duration: number): Span;
  /** The latest placement that finishes at or before `bound`. */
  fromFinish(bound: Minutes, duration: number): Span;
}

function createClock(primary: WorkingTime, members: readonly WorkingTime[]): TaskClock {
  return {
    primary,
    fromStart(bound, duration) {
      if (duration === 0) {
        const t = primary.touchesWork(bound) ? bound : primary.snapForward(bound);
        return { start: t, finish: t };
      }
      let start = Infinity;
      let finish = -Infinity;
      for (const time of members) {
        const s = time.snapForward(bound);
        start = Math.min(start, s);
        finish = Math.max(finish, time.add(s, duration));
      }
      return { start, finish };
    },
    fromFinish(bound, duration) {
      if (duration === 0) {
        const t = primary.touchesWork(bound) ? bound : primary.snapBackward(bound);
        return { start: t, finish: t };
      }
      let start = Infinity;
      let finish = -Infinity;
      for (const time of members) {
        const f = time.snapBackward(bound);
        finish = Math.max(finish, f);
        start = Math.min(start, time.subtract(f, duration));
      }
      return { start, finish };
    },
  };
}

const ELAPSED_CLOCK: TaskClock = {
  primary: ELAPSED_TIME,
  fromStart: (bound, duration) => ({ start: bound, finish: bound + duration }),
  fromFinish: (bound, duration) => ({ start: bound - duration, finish: bound }),
};

/** A validated project laid out for the scheduling passes, by row index. */
export interface Network {
  project: Project;
  tasks: readonly Task[];
  outline: Outline;
  projectTime: WorkingTime;
  calendars: ReadonlyMap<Id, WorkingTime>;
  clocks: readonly TaskClock[];
  /** Links that take part in scheduling, by the row index of their successor. */
  incoming: readonly (readonly Link[])[];
  /** The same links by the row index of their predecessor. */
  outgoing: readonly (readonly Link[])[];
  /**
   * Evaluation order. Entry `2 * i` gathers what row `i` inherits and entry
   * `2 * i + 1` computes its dates; every entry comes after all it depends on.
   */
  order: readonly number[];
}

function requireCalendar(calendars: ReadonlyMap<Id, WorkingTime>, id: Id, owner: string): WorkingTime {
  const time = calendars.get(id);
  if (!time) {
    throw new ScheduleError("unknown-reference", `${owner} names a missing calendar "${id}"`, [id]);
  }
  return time;
}

function buildClocks(project: Project, outline: Outline, calendars: ReadonlyMap<Id, WorkingTime>, projectTime: WorkingTime): TaskClock[] {
  const resourceCalendar = new Map<Id, Id | undefined>();
  for (const resource of project.resources) {
    if (resource.type === "work") resourceCalendar.set(resource.id, resource.calendarId);
  }
  const assigned = new Map<Id, Id[]>();
  for (const assignment of project.assignments) {
    if (!resourceCalendar.has(assignment.resourceId)) continue;
    const list = assigned.get(assignment.taskId);
    if (list) list.push(assignment.resourceId);
    else assigned.set(assignment.taskId, [assignment.resourceId]);
  }

  return project.tasks.map((task, index) => {
    if (outline.summary[index]) return createClock(projectTime, [projectTime]);
    if (task.elapsed) return ELAPSED_CLOCK;
    const own = task.calendarId === undefined ? undefined : requireCalendar(calendars, task.calendarId, `Task "${task.id}"`);
    const primary = own ?? projectTime;
    if (own && task.ignoreResourceCalendar) return createClock(primary, [primary]);

    const members = new Map<Id, WorkingTime>();
    for (const resourceId of assigned.get(task.id) ?? []) {
      const calendarId = resourceCalendar.get(resourceId);
      if (calendarId === undefined) {
        members.set(primary.id, primary);
        continue;
      }
      const resourceTime = requireCalendar(calendars, calendarId, `Resource "${resourceId}"`);
      const time = own ? intersectWorkingTime(own, resourceTime) : resourceTime;
      members.set(time.id, time);
    }
    return createClock(primary, members.size > 0 ? [...members.values()] : [primary]);
  });
}

/**
 * Validates a project and lays it out for scheduling.
 *
 * @throws ScheduleError for a duplicate id, a broken outline, a reference to a
 * missing task or calendar, a negative duration, a constraint without its
 * date, and a dependency cycle (a link between a summary task and a task
 * under it is one).
 */
export function buildNetwork(project: Project): Network {
  const tasks = project.tasks;
  const outline = buildOutline(tasks);
  const calendars = compileCalendars(project.calendars);
  const projectTime = requireCalendar(calendars, project.calendarId, "The project");

  for (const task of tasks) {
    if (!Number.isFinite(task.duration) || task.duration < 0) {
      throw new ScheduleError("invalid-duration", `Task "${task.id}" has a negative or non-numeric duration`, [task.id]);
    }
    if (task.constraintType !== "asap" && task.constraintType !== "alap" && task.constraintDate === undefined) {
      throw new ScheduleError("invalid-date", `Task "${task.id}" has a ${task.constraintType} constraint without a date`, [
        task.id,
      ]);
    }
  }
  if (project.scheduleFrom === "finish" && project.finish === undefined) {
    throw new ScheduleError("invalid-date", "A project scheduled from its finish needs a finish date");
  }

  const incoming: Link[][] = tasks.map(() => []);
  const outgoing: Link[][] = tasks.map(() => []);
  const linkIds = new Set<Id>();
  for (const link of project.links) {
    if (linkIds.has(link.id)) {
      throw new ScheduleError("duplicate-id", `Link id "${link.id}" is used twice`, [link.id]);
    }
    linkIds.add(link.id);
    const from = outline.indexById.get(link.predecessorId);
    const to = outline.indexById.get(link.successorId);
    if (from === undefined || to === undefined) {
      throw new ScheduleError("unknown-reference", `Link "${link.id}" names a missing task`, [link.id]);
    }
    if (from === to) {
      throw new ScheduleError("cycle", `Link "${link.id}" joins task "${link.predecessorId}" to itself`, [link.predecessorId]);
    }
    if (link.lagMode === "percent" && outline.summary[from]) {
      throw new ScheduleError("invalid-duration", `Link "${link.id}" takes a percent lag from a summary task`, [link.id]);
    }
    if (!outline.active[from] || !outline.active[to]) continue;
    incoming[to].push(link);
    outgoing[from].push(link);
  }

  // Kahn's algorithm over two entries per row: 2i gathers, 2i + 1 computes.
  const n = tasks.length;
  const dependents: number[][] = Array.from({ length: 2 * n }, () => []);
  const pending = new Array<number>(2 * n).fill(0);
  const edge = (from: number, to: number): void => {
    dependents[from].push(to);
    pending[to] += 1;
  };
  for (let i = 0; i < n; i++) {
    edge(2 * i, 2 * i + 1);
    const parentIndex = outline.parent[i];
    if (parentIndex !== -1) {
      edge(2 * parentIndex, 2 * i);
      edge(2 * i + 1, 2 * parentIndex + 1);
    }
    for (const link of outgoing[i]) {
      edge(2 * i + 1, 2 * (outline.indexById.get(link.successorId) as number));
    }
  }
  const order: number[] = [];
  for (let node = 0; node < 2 * n; node++) if (pending[node] === 0) order.push(node);
  for (let head = 0; head < order.length; head++) {
    for (const next of dependents[order[head]]) {
      pending[next] -= 1;
      if (pending[next] === 0) order.push(next);
    }
  }
  if (order.length < 2 * n) {
    const ids = tasks.filter((_, i) => pending[2 * i] > 0 || pending[2 * i + 1] > 0).map((task) => task.id);
    throw new ScheduleError("cycle", `Tasks depend on each other in a cycle: ${ids.join(", ")}`, ids);
  }

  return {
    project,
    tasks,
    outline,
    projectTime,
    calendars,
    clocks: buildClocks(project, outline, calendars, projectTime),
    incoming,
    outgoing,
    order,
  };
}
