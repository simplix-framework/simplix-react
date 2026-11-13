import { compileCalendars } from "./calendar";
import { computeCosts } from "./costs";
import { ScheduleError } from "./errors";
import { buildOutline } from "./outline";
import type { Minutes } from "./time";
import type { Id, Project, Schedule, Task, TaskSplit } from "./types";

/**
 * Moves work that has not been done to after `date` (the status date when
 * omitted). A task that has not started gets a start-no-earlier-than
 * constraint at the date; a task in progress pauses where its completed work
 * ends and resumes at the date. Finished, manual and summary tasks are left.
 *
 * @throws ScheduleError `invalid-date` when no date is given and the project
 * has no status date.
 */
export function rescheduleUncompletedWork(project: Project, schedule: Schedule, date: Minutes | undefined = project.statusDate): Project {
  if (date === undefined) throw new ScheduleError("invalid-date", "Rescheduling needs a status date");
  const calendars = compileCalendars(project.calendars);
  const outline = buildOutline(project.tasks);
  let changed = false;
  const tasks = project.tasks.map((task, index): Task => {
    const at = schedule.tasks.get(task.id);
    if (!at || outline.summary[index] || !outline.active[index] || task.mode !== "auto" || task.percentComplete >= 100 || task.elapsed) return task;
    const time = calendars.get(task.calendarId ?? project.calendarId);
    if (!time) return task;
    if (task.percentComplete === 0 && task.actualStart === undefined) {
      if (time.workBetween(at.start, date) <= 0) return task;
      changed = true;
      return { ...task, constraintType: "start-no-earlier-than", constraintDate: date };
    }
    // In progress: the done part stays, the rest resumes at the date.
    const done = Math.round((task.duration * task.percentComplete) / 100);
    if (done <= 0 || done >= task.duration) return task;
    const earlier = (task.splits ?? []).filter((split) => split.offset < done);
    const pausedBefore = earlier.reduce((sum, split) => sum + split.gap, 0);
    const doneThrough = time.add(at.start, done + pausedBefore);
    const gap = time.workBetween(doneThrough, date);
    // A pause already standing at that point and reaching the date leaves nothing to move.
    const standing = (task.splits ?? []).find((split) => split.offset === done);
    if (gap <= 0 || (standing && standing.gap >= gap)) return task;
    changed = true;
    const splits: TaskSplit[] = [...(task.splits ?? []).filter((split) => split.offset !== done), { offset: done, gap }];
    splits.sort((a, b) => a.offset - b.offset);
    // The work already done happened where it is scheduled: holding the start there keeps the
    // pause measured from it, however the tasks before this one move afterwards.
    return { ...task, splits, actualStart: task.actualStart ?? at.start };
  });
  return changed ? { ...project, tasks } : project;
}

/** Earned value figures of one task, or of the tasks under a summary task. */
export interface EarnedValue {
  /** Budget at completion: the baseline cost, or the current cost when the baseline holds none. */
  budget: number;
  /** Planned value: the share of the budget the baseline had scheduled by the status date. */
  plannedValue: number;
  /** Earned value: the share of the budget the completed work stands for. */
  earnedValue: number;
  /** Actual cost: the recorded one, or the earned value when none is recorded. */
  actualCost: number;
  scheduleVariance: number;
  costVariance: number;
  /** Earned over planned value; `null` when nothing was planned yet. */
  schedulePerformance: number | null;
  /** Earned value over actual cost; `null` when nothing has been spent. */
  costPerformance: number | null;
}

function figures(budget: number, plannedValue: number, earnedValue: number, actualCost: number): EarnedValue {
  return {
    budget,
    plannedValue,
    earnedValue,
    actualCost,
    scheduleVariance: earnedValue - plannedValue,
    costVariance: earnedValue - actualCost,
    schedulePerformance: plannedValue > 0 ? earnedValue / plannedValue : null,
    costPerformance: actualCost > 0 ? earnedValue / actualCost : null,
  };
}

/**
 * Computes earned value against a baseline as of a date (the status date when
 * omitted).
 *
 * A task's planned value is its budget times the share of its baseline
 * working time that lies before the date; its earned value is its budget
 * times its percent complete. A summary task adds up the tasks under it, and
 * the entry under the empty id holds the whole project.
 *
 * @throws ScheduleError `invalid-date` when no date is given and the project
 * has no status date.
 */
export function computeEarnedValue(project: Project, schedule: Schedule, baselineNumber = 0, date: Minutes | undefined = project.statusDate): Map<Id, EarnedValue> {
  if (date === undefined) throw new ScheduleError("invalid-date", "Earned value needs a status date");
  const time = compileCalendars(project.calendars).get(project.calendarId);
  if (!time) throw new ScheduleError("unknown-reference", `The project names a missing calendar "${project.calendarId}"`);
  const outline = buildOutline(project.tasks);
  const costs = computeCosts(project, schedule);
  const baseline = project.baselines[baselineNumber] ?? {};
  const sums = project.tasks.map(() => [0, 0, 0, 0]);
  project.tasks.forEach((task, index) => {
    if (outline.summary[index] || !outline.active[index]) return;
    const entry = baseline[task.id];
    const at = schedule.tasks.get(task.id);
    const budget = entry?.cost ?? costs.get(task.id)?.cost ?? 0;
    const from = entry?.start ?? at?.start ?? date;
    const to = entry?.finish ?? at?.finish ?? date;
    const planned = time.workBetween(from, to);
    const elapsed = Math.max(0, Math.min(planned, time.workBetween(from, Math.min(Math.max(date, from), to))));
    // A milestone is planned in full once its date has passed.
    const share = planned > 0 ? elapsed / planned : date >= to ? 1 : 0;
    const earned = (budget * task.percentComplete) / 100;
    sums[index] = [budget, budget * share, earned, task.actualCost ?? earned];
  });
  const total = [0, 0, 0, 0];
  for (let i = project.tasks.length - 1; i >= 0; i--) {
    if (!outline.active[i]) continue;
    const parent = outline.parent[i];
    const target = parent === -1 ? total : sums[parent];
    for (let k = 0; k < 4; k++) target[k] += sums[i][k];
  }
  const result = new Map<Id, EarnedValue>();
  project.tasks.forEach((task, i) => result.set(task.id, figures(sums[i][0], sums[i][1], sums[i][2], sums[i][3])));
  result.set("", figures(total[0], total[1], total[2], total[3]));
  return result;
}
