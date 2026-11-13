import { compileCalendars } from "./calendar";
import type { WorkingTime } from "./calendar";
import { buildNetwork } from "./network";
import type { Network, Span } from "./network";
import { placeOne, rollUpAncestors, segmentsOf } from "./passes";
import type { Dates } from "./passes";
import { findOverallocations } from "./resources";
import type { Overallocation } from "./resources";
import { computeSchedule } from "./schedule";
import type { Minutes } from "./time";
import type { Id, Project, Task, TaskSplit } from "./types";

const UNIT_EPSILON = 1e-9;

/** Outcome of leveling: the delayed project and what could not be resolved. */
export interface LevelingResult {
  project: Project;
  /** Overallocations left because no task in them may be delayed. */
  unresolved: Overallocation[];
}

/** What leveling may do to resolve an overallocation. */
export interface LevelingOptions {
  /** Delays a task only as far as its total slack reaches, so the project's finish does not move. */
  withinSlack?: boolean;
  /** Pauses a task that has already begun when the conflict starts, instead of moving all of it. */
  split?: boolean;
}

function leveled(task: Task): boolean {
  return Boolean(task.levelingDelay) || (task.splits ?? []).some((split) => split.leveled);
}

/** Removes every delay and every pause leveling added. */
export function clearLeveling(project: Project): Project {
  if (!project.tasks.some(leveled)) return project;
  return {
    ...project,
    tasks: project.tasks.map((task) => {
      if (!leveled(task)) return task;
      const next: Task = { ...task };
      delete next.levelingDelay;
      const splits = (task.splits ?? []).filter((split) => !split.leveled);
      if (splits.length > 0) next.splits = splits;
      else delete next.splits;
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

/** Where a task runs into the bookings already placed on one resource, and when room opens up. */
interface Conflict {
  from: Minutes;
  until: Minutes;
}

/** The first conflict of a stretch of work with the bookings placed on one resource, or `null` when it fits. */
function conflictIn(
  placed: readonly Booking[],
  time: WorkingTime,
  capacity: number,
  units: number,
  start: Minutes,
  finish: Minutes,
): Conflict | null {
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
    // Room opens when as many of the bookings in the way have ended as it takes.
    for (const booking of inside.sort((a, b) => a.finish - b.finish)) {
      running -= booking.units;
      if (running + units <= capacity + UNIT_EPSILON) return { from, until: booking.finish };
    }
  }
  return null;
}

/** Splits that cut the task's work, in order: the ones the scheduler draws segments from. */
function effectiveSplits(task: Task): TaskSplit[] {
  return [...(task.splits ?? [])]
    .filter((split) => split.gap > 0 && split.offset > 0 && split.offset < task.duration)
    .sort((a, b) => a.offset - b.offset);
}

/**
 * Resolves overallocated work resources by delaying tasks.
 *
 * Earlier leveling is cleared first. Tasks are then placed one at a time,
 * each after the tasks it depends on; among the tasks ready to be placed the
 * highest priority goes first, then the earliest start, then the least total
 * slack, then the highest row. A task that does not fit beside the tasks
 * already placed on one of its resources waits until it does, or with the
 * `split` option pauses where the conflict begins and resumes after it.
 *
 * Only an automatic as-soon-as-possible task that has not started and whose
 * priority is under 1000 is moved. Links and constraints keep holding, since
 * leveling only ever moves work later. A project scheduled from its finish is
 * returned as it is, with its overallocations reported.
 */
export function levelResources(project: Project, options: LevelingOptions = {}): LevelingResult {
  const cleared = clearLeveling(project);
  const initial = computeSchedule(cleared);
  if (cleared.scheduleFrom !== "start") return { project: cleared, unresolved: findOverallocations(cleared, initial) };

  const net = buildNetwork(cleared);
  const calendars = compileCalendars(cleared.calendars);
  const projectTime = calendars.get(cleared.calendarId) as WorkingTime;
  const resources = new Map(cleared.resources.filter((r) => r.type === "work").map((r) => [r.id, r]));
  const dates: Dates = { start: [], finish: [] };
  const slack: number[] = [];
  net.tasks.forEach((task, i) => {
    const at = initial.tasks.get(task.id);
    dates.start[i] = at?.start ?? cleared.start;
    dates.finish[i] = at?.finish ?? cleared.start;
    slack[i] = at?.totalSlack ?? 0;
  });
  const assignmentsOf = new Map<Id, { resourceId: Id; units: number }[]>();
  for (const assignment of cleared.assignments) {
    if (!resources.has(assignment.resourceId)) continue;
    const list = assignmentsOf.get(assignment.taskId) ?? [];
    list.push({ resourceId: assignment.resourceId, units: assignment.units });
    assignmentsOf.set(assignment.taskId, list);
  }

  // Placement order: a row is ready once every row it depends on is placed.
  const predecessors = predecessorRows(net);
  const successors = new Map<number, number[]>();
  const waitingOn = new Map<number, number>();
  for (const [index, rows] of predecessors) {
    waitingOn.set(index, rows.size);
    for (const row of rows) {
      const list = successors.get(row) ?? [];
      list.push(index);
      successors.set(row, list);
    }
  }
  const before = (x: number, y: number): number =>
    net.tasks[y].priority - net.tasks[x].priority || dates.start[x] - dates.start[y] || slack[x] - slack[y] || x - y;
  const ready = [...waitingOn].filter(([, count]) => count === 0).map(([index]) => index);
  ready.sort(before);

  const placed = new Map<Id, Booking[]>();
  const changed = new Map<number, Task>();
  while (ready.length > 0) {
    const index = ready.shift() as number;
    let task = net.tasks[index];
    const time = net.clocks[index].primary;
    const mine = net.outline.active[index] ? (assignmentsOf.get(task.id) ?? []) : [];
    let span: Span = placeOne(net, dates, index, cleared.start, task);
    let added = 0;

    // Every round moves work past at least one placed booking, which bounds the loop.
    const limit = [...placed.values()].reduce((sum, list) => sum + list.length, 0) + 1;
    for (let step = 0; step < limit && mine.length > 0 && mayDelay(task) && span.finish > span.start; step++) {
      const segments = segmentsOf(task, time, span);
      let conflict: (Conflict & { segment: number }) | null = null;
      segments.forEach((segment, k) => {
        for (const assignment of mine) {
          const resource = resources.get(assignment.resourceId);
          if (!resource) continue;
          const resourceTime = (resource.calendarId === undefined ? undefined : calendars.get(resource.calendarId)) ?? projectTime;
          const found = conflictIn(placed.get(resource.id) ?? [], resourceTime, resource.maxUnits, assignment.units, segment.start, segment.finish);
          if (found && (conflict === null || found.from < conflict.from)) conflict = { ...found, segment: k };
        }
      });
      if (conflict === null) break;
      const hit: Conflict & { segment: number } = conflict;
      const segment = segments[hit.segment];
      const splits = effectiveSplits(task);
      const atSegmentStart = time.workBetween(segment.start, hit.from) <= 0;
      const wait = time.workBetween(atSegmentStart || !options.split ? segment.start : hit.from, hit.until);
      if (wait <= 0 || (options.withinSlack && added + wait > slack[index])) break;
      let next: Task;
      if (hit.segment === 0 && (atSegmentStart || !options.split)) {
        next = { ...task, levelingDelay: (task.levelingDelay ?? 0) + wait };
      } else if (atSegmentStart || !options.split) {
        // The stretch after a pause is in the way: the pause before it grows.
        next = { ...task, splits: splits.map((split, k) => (k === hit.segment - 1 ? { ...split, gap: split.gap + wait } : split)) };
      } else {
        const workedBefore = hit.segment === 0 ? 0 : splits[hit.segment - 1].offset;
        const offset = workedBefore + time.workBetween(segment.start, hit.from);
        next = { ...task, splits: [...splits, { offset, gap: wait, leveled: true }].sort((a, b) => a.offset - b.offset) };
      }
      const moved = placeOne(net, dates, index, cleared.start, next);
      // A constraint can hold the task where it is; it then stays overallocated.
      if (moved.start === span.start && moved.finish === span.finish) break;
      task = next;
      span = moved;
      added += wait;
    }

    if (task !== net.tasks[index]) changed.set(index, task);
    dates.start[index] = span.start;
    dates.finish[index] = span.finish;
    rollUpAncestors(net, dates, index);
    if (span.finish > span.start) {
      for (const segment of segmentsOf(task, time, span)) {
        for (const assignment of mine) {
          const list = placed.get(assignment.resourceId) ?? [];
          list.push({ start: segment.start, finish: segment.finish, units: assignment.units });
          placed.set(assignment.resourceId, list);
        }
      }
    }
    for (const successor of successors.get(index) ?? []) {
      const count = (waitingOn.get(successor) as number) - 1;
      waitingOn.set(successor, count);
      if (count > 0) continue;
      // Keep the ready list in placement order.
      let at = ready.length;
      while (at > 0 && before(successor, ready[at - 1]) < 0) at -= 1;
      ready.splice(at, 0, successor);
    }
  }

  const result: Project = changed.size === 0 ? cleared : { ...cleared, tasks: cleared.tasks.map((task, i) => changed.get(i) ?? task) };
  return { project: result, unresolved: findOverallocations(result, computeSchedule(result)) };
}
