import { compileCalendars } from "./calendar";
import type { WorkingTime } from "./calendar";
import { changeTask } from "./edit-tasks";
import { buildNetwork } from "./network";
import type { Network } from "./network";
import { findOverallocations } from "./resources";
import type { Overallocation } from "./resources";
import { computeSchedule } from "./schedule";
import type { Minutes } from "./time";
import type { Id, Project, Schedule, Task } from "./types";

const UNIT_EPSILON = 1e-9;

/** Outcome of leveling: the delayed project and what could not be resolved. */
export interface LevelingResult {
  project: Project;
  /** Overallocations left because no task in them may be delayed. */
  unresolved: Overallocation[];
}

/** Removes every delay leveling added. */
export function clearLeveling(project: Project): Project {
  if (!project.tasks.some((task) => task.levelingDelay)) return project;
  return {
    ...project,
    tasks: project.tasks.map((task) => {
      if (!task.levelingDelay) return task;
      const next: Task = { ...task };
      delete next.levelingDelay;
      return next;
    }),
  };
}

function mayDelay(task: Task): boolean {
  return (
    task.mode === "auto" &&
    !task.elapsed &&
    task.priority < 1000 &&
    task.percentComplete === 0 &&
    task.actualStart === undefined &&
    task.constraintType === "asap"
  );
}

/** Row indexes of the tasks without rows under them that a row stands for: itself, or every such row under it. */
function leavesOf(net: Network, index: number, into: number[]): void {
  if (!net.outline.summary[index]) {
    into.push(index);
    return;
  }
  for (const child of net.outline.children[index]) leavesOf(net, child, into);
}

/** For every non-summary row, the non-summary rows whose dates its own dates depend on. */
function predecessorRows(net: Network): Map<number, Set<number>> {
  const result = new Map<number, Set<number>>();
  net.tasks.forEach((_, index) => {
    if (net.outline.summary[index]) return;
    const rows = new Set<number>();
    // A link into a summary task binds every task under it, so walk up the outline.
    for (let at = index; at !== -1; at = net.outline.parent[at]) {
      for (const link of net.incoming[at]) {
        const found: number[] = [];
        leavesOf(net, net.outline.indexById.get(link.predecessorId) as number, found);
        for (const row of found) rows.add(row);
      }
    }
    result.set(index, rows);
  });
  return result;
}

interface Booking {
  start: Minutes;
  finish: Minutes;
  units: number;
}

/**
 * The instant a task must wait for to fit beside the bookings already placed
 * on one resource, or `null` when it fits where it is.
 */
function waitUntil(
  placed: readonly Booking[],
  time: WorkingTime,
  capacity: number,
  units: number,
  start: Minutes,
  finish: Minutes,
): Minutes | null {
  if (units > capacity + UNIT_EPSILON) return null;
  const overlapping = placed.filter((booking) => booking.start < finish && booking.finish > start);
  if (overlapping.length === 0) return null;
  const points = [...new Set([start, finish, ...overlapping.flatMap((b) => [b.start, b.finish])])]
    .filter((point) => point >= start && point <= finish)
    .sort((a, b) => a - b);
  for (let k = 0; k + 1 < points.length; k++) {
    const from = points[k];
    const to = points[k + 1];
    const inside = overlapping.filter((booking) => booking.start <= from && booking.finish >= to);
    let running = inside.reduce((sum, booking) => sum + booking.units, 0);
    if (running + units <= capacity + UNIT_EPSILON || time.workBetween(from, to) === 0) continue;
    // Wait for as many of the bookings in the way to end as it takes to make room.
    for (const booking of inside.sort((a, b) => a.finish - b.finish)) {
      running -= booking.units;
      if (running + units <= capacity + UNIT_EPSILON) return booking.finish;
    }
  }
  return null;
}

/** The rows ready to be placed, the one to place next first. */
function readyRows(net: Network, schedule: Schedule, waiting: ReadonlyMap<number, ReadonlySet<number>>): number[] {
  const ready: number[] = [];
  for (const [index, predecessors] of waiting) {
    let free = true;
    for (const row of predecessors) {
      if (waiting.has(row)) {
        free = false;
        break;
      }
    }
    if (free) ready.push(index);
  }
  return ready.sort((x, y) => {
    const a = schedule.tasks.get(net.tasks[x].id);
    const b = schedule.tasks.get(net.tasks[y].id);
    if (!a || !b) return x - y;
    return net.tasks[y].priority - net.tasks[x].priority || a.start - b.start || a.totalSlack - b.totalSlack || x - y;
  });
}

/**
 * Resolves overallocated work resources by delaying tasks.
 *
 * Earlier delays are cleared first. Tasks are then placed one at a time, each
 * after the tasks it depends on; among the tasks ready to be placed the
 * highest priority goes first, then the earliest start, then the least total
 * slack, then the highest row. A task that does not fit beside the tasks
 * already placed on one of its resources waits until it does.
 *
 * Only an automatic as-soon-as-possible task that has not started and whose
 * priority is under 1000 is delayed. Links and constraints keep holding,
 * since a delay only ever moves a task later.
 */
export function levelResources(project: Project): LevelingResult {
  let current = clearLeveling(project);
  let schedule = computeSchedule(current);
  const net = buildNetwork(current);
  const calendars = compileCalendars(current.calendars);
  const projectTime = calendars.get(current.calendarId) as WorkingTime;
  const resources = new Map(current.resources.filter((r) => r.type === "work").map((r) => [r.id, r]));
  const waiting = predecessorRows(net);
  const placed = new Map<Id, Booking[]>();

  while (waiting.size > 0) {
    const index = readyRows(net, schedule, waiting)[0];
    waiting.delete(index);
    const task = net.tasks[index];
    const mine = current.assignments.filter((a) => a.taskId === task.id && resources.has(a.resourceId));
    if (mine.length === 0 || !net.outline.active[index]) continue;

    // Every wait moves the task past at least one placed booking, which bounds the loop.
    const limit = [...placed.values()].reduce((sum, list) => sum + list.length, 0) + 1;
    for (let step = 0; step < limit && mayDelay(task); step++) {
      const at = schedule.tasks.get(task.id);
      if (!at || at.finish <= at.start) break;
      let target: Minutes | null = null;
      for (const assignment of mine) {
        const resource = resources.get(assignment.resourceId);
        if (!resource) continue;
        const time = (resource.calendarId === undefined ? undefined : calendars.get(resource.calendarId)) ?? projectTime;
        const until = waitUntil(placed.get(resource.id) ?? [], time, resource.maxUnits, assignment.units, at.start, at.finish);
        if (until !== null && (target === null || until > target)) target = until;
      }
      if (target === null) break;
      const delay = net.clocks[index].primary.workBetween(at.start, target);
      if (delay <= 0) break;
      const delayed = changeTask(current, task.id, (t) => ({ ...t, levelingDelay: (t.levelingDelay ?? 0) + delay }));
      const next = computeSchedule(delayed);
      // A constraint can hold the task where it is; it then stays overallocated.
      if ((next.tasks.get(task.id)?.start ?? at.start) <= at.start) break;
      current = delayed;
      schedule = next;
    }

    const at = schedule.tasks.get(task.id);
    if (!at || at.finish <= at.start) continue;
    for (const assignment of mine) {
      const list = placed.get(assignment.resourceId) ?? [];
      list.push({ start: at.start, finish: at.finish, units: assignment.units });
      placed.set(assignment.resourceId, list);
    }
  }
  return { project: current, unresolved: findOverallocations(current, schedule) };
}
