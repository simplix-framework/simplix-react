import { buildNetwork } from "./network";
import type { Network, Span } from "./network";
import { backwardPass, forwardPass, heldSpan, lagAfter, lagTime, predecessorDate, segmentsOf, spanLength, successorDate } from "./passes";
import type { Dates, Preset } from "./passes";
import type { Minutes } from "./time";
import type { Id, LinkSchedule, Project, Schedule, ScheduleConflict, TaskSchedule } from "./types";

function spanOf(dates: Dates, index: number): Span {
  return { start: dates.start[index], finish: dates.finish[index] };
}

function extent(net: Network, dates: Dates, fallback: Minutes): Span {
  let start = Infinity;
  let finish = -Infinity;
  net.tasks.forEach((_, i) => {
    if (!net.outline.active[i] || net.outline.summary[i]) return;
    start = Math.min(start, dates.start[i]);
    finish = Math.max(finish, dates.finish[i]);
  });
  return start === Infinity ? { start: fallback, finish: fallback } : { start, finish };
}

interface Passes {
  early: Dates;
  late: Dates;
  scheduled: Dates;
}

function runPasses(net: Network): Passes {
  const { project, tasks, outline } = net;
  const held: Preset = (i) => heldSpan(net, i);
  const completed: Preset = (i) => {
    const task = tasks[i];
    return task.actualStart !== undefined && task.actualFinish !== undefined
      ? { start: task.actualStart, finish: task.actualFinish }
      : null;
  };
  // A row placed against the project's far end instead of its scheduling end.
  const placedLate = (i: number): boolean =>
    !outline.summary[i] && tasks[i].mode === "auto" && tasks[i].constraintType === "alap" && heldSpan(net, i) === null;
  const placedEarly = (i: number): boolean =>
    !outline.summary[i] && tasks[i].mode === "auto" && tasks[i].constraintType === "asap" && heldSpan(net, i) === null;

  if (project.scheduleFrom === "start") {
    const early = forwardPass(net, project.start, held);
    const finish = extent(net, early, project.start).finish;
    const late = backwardPass(net, finish, completed);
    if (!tasks.some((_, i) => placedLate(i))) return { early, late, scheduled: early };
    const pushed = backwardPass(net, finish, (i) => (placedLate(i) ? null : spanOf(early, i)));
    // A late placement never moves a task ahead of its early dates.
    const scheduled = backwardPass(net, finish, (i) =>
      placedLate(i) && pushed.start[i] > early.start[i] ? spanOf(pushed, i) : spanOf(early, i),
    );
    return { early, late, scheduled };
  }

  const anchor = project.finish as Minutes;
  const late = backwardPass(net, anchor, held);
  const start = extent(net, late, anchor).start;
  const early = forwardPass(net, start, held);
  if (!tasks.some((_, i) => placedEarly(i))) return { early, late, scheduled: late };
  const pulled = forwardPass(net, start, (i) => (placedEarly(i) ? null : spanOf(late, i)));
  const scheduled = forwardPass(net, start, (i) =>
    placedEarly(i) && pulled.start[i] < late.start[i] ? spanOf(pulled, i) : spanOf(late, i),
  );
  return { early, late, scheduled };
}

function constraintBroken(net: Network, index: number, span: Span): boolean {
  const task = net.tasks[index];
  const date = task.constraintDate;
  if (date === undefined) return false;
  const time = net.clocks[index].primary;
  // Working time between the two instants; zero when they bound the same working moment.
  const startAfter = time.workBetween(date, span.start);
  const finishAfter = time.workBetween(date, span.finish);
  switch (task.constraintType) {
    case "must-start-on":
      return startAfter !== 0;
    case "must-finish-on":
      return finishAfter !== 0;
    case "start-no-earlier-than":
      return startAfter < 0;
    case "start-no-later-than":
      return startAfter > 0;
    case "finish-no-earlier-than":
      return finishAfter < 0;
    case "finish-no-later-than":
      return finishAfter > 0;
    default:
      return false;
  }
}

function summaryProgress(net: Network, index: number): number {
  let weighted = 0;
  let total = 0;
  let sum = 0;
  let count = 0;
  const visit = (i: number): void => {
    if (net.outline.summary[i]) {
      for (const child of net.outline.children[i]) if (net.outline.active[child]) visit(child);
      return;
    }
    const task = net.tasks[i];
    weighted += task.duration * task.percentComplete;
    total += task.duration;
    sum += task.percentComplete;
    count += 1;
  };
  visit(index);
  if (total > 0) return Math.round(weighted / total);
  return count > 0 ? Math.round(sum / count) : 0;
}

/**
 * Computes the dates, slack, critical path and conflicts of a project.
 *
 * A project scheduled from its start places each task as early as its links
 * and constraints allow and reads late dates back from the resulting finish;
 * one scheduled from its finish does the reverse. A summary task takes its
 * dates from the tasks under it, and a link on a summary task binds every
 * task under it.
 *
 * @throws ScheduleError when the project cannot be scheduled at all: a
 * duplicate id, a broken outline, a reference to a missing task or calendar,
 * a negative duration, a constraint without its date, a calendar without
 * working time or a dependency cycle. A broken link, constraint or deadline
 * is returned in `conflicts` instead.
 */
export function computeSchedule(project: Project): Schedule {
  const net = buildNetwork(project);
  const { tasks, outline } = net;
  const { early, late, scheduled } = runPasses(net);
  const bounds = extent(net, scheduled, project.scheduleFrom === "start" ? project.start : (project.finish as Minutes));
  const conflicts: ScheduleConflict[] = [];

  const links = new Map<Id, LinkSchedule>();
  // Smallest working-time gap to a successor, by predecessor row.
  const gapToSuccessor = new Array<number>(tasks.length).fill(Infinity);
  for (const link of project.links) {
    const p = outline.indexById.get(link.predecessorId) as number;
    const s = outline.indexById.get(link.successorId) as number;
    if (!outline.active[p] || !outline.active[s]) {
      links.set(link.id, { id: link.id, violated: false, driving: false });
      continue;
    }
    const required = lagAfter(net, link, predecessorDate(link, scheduled, p), p, s);
    const gap = lagTime(net, s).workBetween(required, successorDate(link, scheduled, s));
    gapToSuccessor[p] = Math.min(gapToSuccessor[p], gap);
    links.set(link.id, { id: link.id, violated: gap < 0, driving: gap === 0 && heldSpan(net, s) === null });
    if (gap < 0) conflicts.push({ kind: "link-violated", taskId: link.successorId, linkId: link.id });
  }

  const result = new Map<Id, TaskSchedule>();
  const critical = new Array<boolean>(tasks.length).fill(false);
  // Children come after their parent in row order, so walk backward to settle summaries last.
  for (let i = tasks.length - 1; i >= 0; i--) {
    const task = tasks[i];
    const time = net.clocks[i].primary;
    const span = spanOf(scheduled, i);
    const summary = outline.summary[i];
    const totalSlack = Math.min(
      time.workBetween(early.start[i], late.start[i]),
      time.workBetween(early.finish[i], late.finish[i]),
    );
    const freeSlack = Math.max(
      0,
      gapToSuccessor[i] === Infinity ? time.workBetween(span.finish, bounds.finish) : gapToSuccessor[i],
    );
    const percentComplete = summary ? summaryProgress(net, i) : task.percentComplete;
    critical[i] = summary
      ? outline.children[i].some((child) => critical[child])
      : outline.active[i] && percentComplete < 100 && totalSlack <= project.criticalSlackLimit;

    if (outline.active[i] && !summary) {
      if (constraintBroken(net, i, span)) conflicts.push({ kind: "constraint-violated", taskId: task.id });
      if (task.deadline !== undefined && time.workBetween(task.deadline, span.finish) > 0) {
        conflicts.push({ kind: "deadline-missed", taskId: task.id });
      }
      // Only a task held at typed or actual dates can sit ahead of the project start by mistake;
      // a dated constraint that puts a task there is the plan's own choice.
      if (project.scheduleFrom === "start" && span.start < project.start && heldSpan(net, i) !== null) {
        conflicts.push({ kind: "before-project-start", taskId: task.id });
      }
      if (project.scheduleFrom === "finish" && span.finish > (project.finish as Minutes)) {
        conflicts.push({ kind: "after-project-finish", taskId: task.id });
      }
    }

    result.set(task.id, {
      id: task.id,
      index: i,
      parentId: outline.parent[i] === -1 ? null : tasks[outline.parent[i]].id,
      wbs: outline.wbs[i],
      summary,
      milestone: !summary && (task.milestone === true || span.start === span.finish),
      start: span.start,
      finish: span.finish,
      segments: summary ? [span] : segmentsOf(task, time, span),
      duration: Math.max(0, time.workBetween(span.start, span.finish) - (summary ? 0 : spanLength(task) - task.duration)),
      earlyStart: early.start[i],
      earlyFinish: early.finish[i],
      lateStart: late.start[i],
      lateFinish: late.finish[i],
      totalSlack,
      freeSlack,
      critical: critical[i],
      percentComplete,
      calendarId: time.id,
    });
  }

  // Report rows in display order.
  const ordered = new Map<Id, TaskSchedule>();
  for (const task of tasks) ordered.set(task.id, result.get(task.id) as TaskSchedule);
  return { start: bounds.start, finish: bounds.finish, tasks: ordered, links, conflicts };
}
