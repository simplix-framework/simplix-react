import type { WorkingTime } from "./calendar";
import type { Network, Span } from "./network";
import type { Minutes } from "./time";
import type { Link, Task } from "./types";

/** Start and finish of every row, by row index. */
export interface Dates {
  start: number[];
  finish: number[];
}

/** Returns the dates a row is held at, or `null` to have the pass place it. */
export type Preset = (index: number) => Span | null;

function startsFromStart(link: Link): boolean {
  return link.type === "SS" || link.type === "SF";
}

function endsAtStart(link: Link): boolean {
  return link.type === "FS" || link.type === "SS";
}

/** Working minutes a task takes from start to finish: its work and the pauses its splits add. */
export function spanLength(task: Task): number {
  let length = task.duration;
  for (const split of task.splits ?? []) length += split.gap;
  return length;
}

/** Calendar a link's lag is counted on: the successor's, or the project's for an elapsed successor. */
export function lagTime(net: Network, successor: number): WorkingTime {
  return net.tasks[successor].elapsed ? net.projectTime : net.clocks[successor].primary;
}

function lagMinutes(net: Network, link: Link, predecessor: number): number {
  return link.lagMode === "percent" ? Math.round((net.tasks[predecessor].duration * link.lag) / 100) : link.lag;
}

/** The earliest instant a link allows its successor's date, given the predecessor's date. */
export function lagAfter(net: Network, link: Link, base: Minutes, predecessor: number, successor: number): Minutes {
  if (link.lag === 0) return base;
  if (link.lagMode === "elapsed") return base + link.lag;
  return lagTime(net, successor).add(base, lagMinutes(net, link, predecessor));
}

/** The latest instant a link allows its predecessor's date, given the successor's date. */
export function lagBefore(net: Network, link: Link, base: Minutes, predecessor: number, successor: number): Minutes {
  if (link.lag === 0) return base;
  if (link.lagMode === "elapsed") return base - link.lag;
  return lagTime(net, successor).subtract(base, lagMinutes(net, link, predecessor));
}

/** The predecessor date a link reads. */
export function predecessorDate(link: Link, dates: Dates, predecessor: number): Minutes {
  return startsFromStart(link) ? dates.start[predecessor] : dates.finish[predecessor];
}

/** The successor date a link bounds. */
export function successorDate(link: Link, dates: Dates, successor: number): Minutes {
  return endsAtStart(link) ? dates.start[successor] : dates.finish[successor];
}

/**
 * The dates a task keeps whatever its links say: recorded actual dates, or
 * the dates typed on a manually scheduled task.
 */
export function heldSpan(net: Network, index: number): Span | null {
  const task = net.tasks[index];
  const clock = net.clocks[index];
  if (task.actualStart !== undefined) {
    if (task.actualFinish !== undefined) return { start: task.actualStart, finish: task.actualFinish };
    return { start: task.actualStart, finish: clock.fromStart(task.actualStart, spanLength(task)).finish };
  }
  if (task.mode !== "manual") return null;
  if (task.manualStart !== undefined && task.manualFinish !== undefined) {
    return { start: task.manualStart, finish: task.manualFinish };
  }
  if (task.manualStart !== undefined) {
    return { start: task.manualStart, finish: clock.fromStart(task.manualStart, spanLength(task)).finish };
  }
  if (task.manualFinish !== undefined) {
    return { start: clock.fromFinish(task.manualFinish, spanLength(task)).start, finish: task.manualFinish };
  }
  return null;
}

function rollUp(net: Network, index: number, dates: Dates): Span | null {
  const all = net.outline.children[index];
  const active = all.filter((child) => net.outline.active[child]);
  const rows = active.length > 0 ? active : all;
  let start = Infinity;
  let finish = -Infinity;
  for (const child of rows) {
    start = Math.min(start, dates.start[child]);
    finish = Math.max(finish, dates.finish[child]);
  }
  return rows.length > 0 ? { start, finish } : null;
}

function placeForward(net: Network, index: number, anchor: Minutes, startBound: number, finishBound: number): Span {
  const task = net.tasks[index];
  const clock = net.clocks[index];
  const honor = net.project.honorConstraints;
  const date = task.constraintDate as Minutes;
  // The anchor is the earliest start of a task unless a dated start says
  // otherwise: a start-no-earlier-than or must-start-on date may lie ahead of it.
  let lower = Math.max(anchor, startBound);
  let finishLower = finishBound;
  switch (task.constraintType) {
    case "start-no-earlier-than":
      lower = Math.max(startBound, date);
      break;
    case "must-start-on":
      lower = honor ? date : Math.max(startBound, date);
      break;
    case "finish-no-earlier-than":
      finishLower = Math.max(finishLower, date);
      break;
    case "must-finish-on":
      if (!honor) finishLower = Math.max(finishLower, date);
      break;
    default:
      break;
  }
  let span = clock.fromStart(lower, spanLength(task));
  if (span.finish < finishLower) span = clock.fromFinish(finishLower, spanLength(task));
  // A leveling delay moves the task from wherever its links and constraint put it.
  if (task.levelingDelay) {
    span = clock.fromStart(clock.primary.add(span.start, task.levelingDelay), spanLength(task));
  }
  if (!honor) return span;
  switch (task.constraintType) {
    case "must-start-on":
      return clock.fromStart(date, spanLength(task));
    case "must-finish-on":
      return clock.fromFinish(date, spanLength(task));
    case "start-no-later-than":
      return clock.primary.workBetween(date, span.start) > 0 ? clock.fromStart(date, spanLength(task)) : span;
    case "finish-no-later-than":
      return clock.primary.workBetween(date, span.finish) > 0 ? clock.fromFinish(date, spanLength(task)) : span;
    default:
      return span;
  }
}

function placeBackward(net: Network, index: number, anchor: Minutes, startBound: number, finishBound: number): Span {
  const task = net.tasks[index];
  const clock = net.clocks[index];
  const date = task.constraintDate as Minutes;
  let upper = Math.min(anchor, finishBound);
  let startUpper = startBound;
  if (task.deadline !== undefined) upper = Math.min(upper, task.deadline);
  switch (task.constraintType) {
    case "finish-no-later-than":
    case "must-finish-on":
      upper = Math.min(upper, date);
      break;
    case "start-no-later-than":
    case "must-start-on":
      startUpper = Math.min(startUpper, date);
      break;
    default:
      break;
  }
  const span = clock.fromFinish(upper, spanLength(task));
  return span.start > startUpper ? clock.fromStart(startUpper, spanLength(task)) : span;
}

/**
 * Places every row as early as its predecessors, its constraint and the
 * anchor allow. Rows the preset holds keep their dates.
 */
export function forwardPass(net: Network, anchor: Minutes, preset: Preset): Dates {
  const n = net.tasks.length;
  const dates: Dates = { start: new Array<number>(n).fill(anchor), finish: new Array<number>(n).fill(anchor) };
  const startBound = new Array<number>(n).fill(-Infinity);
  const finishBound = new Array<number>(n).fill(-Infinity);
  const { outline } = net;

  for (const node of net.order) {
    const i = node >> 1;
    if ((node & 1) === 0) {
      const parent = outline.parent[i];
      let s = parent === -1 ? -Infinity : startBound[parent];
      let f = parent === -1 ? -Infinity : finishBound[parent];
      for (const link of net.incoming[i]) {
        const p = outline.indexById.get(link.predecessorId) as number;
        const bound = lagAfter(net, link, predecessorDate(link, dates, p), p, i);
        if (endsAtStart(link)) s = Math.max(s, bound);
        else f = Math.max(f, bound);
      }
      startBound[i] = s;
      finishBound[i] = f;
      continue;
    }
    const span = outline.summary[i]
      ? rollUp(net, i, dates)
      : (preset(i) ?? placeForward(net, i, anchor, startBound[i], finishBound[i]));
    if (span) {
      dates.start[i] = span.start;
      dates.finish[i] = span.finish;
    }
  }
  return dates;
}

/**
 * Places every row as late as its successors, its constraint, its deadline
 * and the anchor allow. Rows the preset holds keep their dates.
 */
export function backwardPass(net: Network, anchor: Minutes, preset: Preset): Dates {
  const n = net.tasks.length;
  const dates: Dates = { start: new Array<number>(n).fill(anchor), finish: new Array<number>(n).fill(anchor) };
  const startBound = new Array<number>(n).fill(Infinity);
  const finishBound = new Array<number>(n).fill(Infinity);
  const { outline } = net;

  for (let k = net.order.length - 1; k >= 0; k--) {
    const node = net.order[k];
    const i = node >> 1;
    if ((node & 1) === 0) {
      if (outline.summary[i]) {
        const span = rollUp(net, i, dates);
        if (span) {
          dates.start[i] = span.start;
          dates.finish[i] = span.finish;
        }
      }
      continue;
    }
    const parent = outline.parent[i];
    let s = parent === -1 ? Infinity : startBound[parent];
    let f = parent === -1 ? Infinity : finishBound[parent];
    for (const link of net.outgoing[i]) {
      const succ = outline.indexById.get(link.successorId) as number;
      const bound = lagBefore(net, link, successorDate(link, dates, succ), i, succ);
      if (startsFromStart(link)) s = Math.min(s, bound);
      else f = Math.min(f, bound);
    }
    startBound[i] = s;
    finishBound[i] = f;
    if (outline.summary[i]) continue;
    const span = preset(i) ?? placeBackward(net, i, anchor, s, f);
    dates.start[i] = span.start;
    dates.finish[i] = span.finish;
  }
  return dates;
}
