import { compileCalendars } from "./calendar";
import { ScheduleError } from "./errors";
import type { Baseline, BaselineEntry, Id, Project, Schedule } from "./types";

const MAX_BASELINE_NUMBER = 10;

function checkNumber(number: number): void {
  if (!Number.isInteger(number) || number < 0 || number > MAX_BASELINE_NUMBER) {
    throw new ScheduleError("invalid-operation", `Baseline number must be 0 to ${MAX_BASELINE_NUMBER}: ${number}`);
  }
}

/**
 * Saves the scheduled dates as a baseline. With `taskIds` only those tasks
 * are saved and the other entries of the baseline stay.
 */
export function setBaseline(project: Project, schedule: Schedule, number = 0, taskIds?: readonly Id[]): Project {
  checkNumber(number);
  const selected = taskIds ? new Set(taskIds) : null;
  const entries: Record<Id, BaselineEntry> = selected ? { ...project.baselines[number] } : {};
  for (const [id, task] of schedule.tasks) {
    if (selected && !selected.has(id)) continue;
    entries[id] = { start: task.start, finish: task.finish, duration: task.duration };
  }
  return { ...project, baselines: { ...project.baselines, [number]: entries } };
}

/** Deletes a baseline, or with `taskIds` only those tasks' entries. */
export function clearBaseline(project: Project, number = 0, taskIds?: readonly Id[]): Project {
  checkNumber(number);
  const baselines: Record<number, Baseline> = { ...project.baselines };
  if (!taskIds) {
    delete baselines[number];
    return { ...project, baselines };
  }
  const removed = new Set(taskIds);
  baselines[number] = Object.fromEntries(Object.entries(baselines[number] ?? {}).filter(([id]) => !removed.has(id)));
  return { ...project, baselines };
}

/** How far a task has moved from its baseline, in working minutes on the project calendar. Positive is later or longer. */
export interface BaselineVariance {
  start: number;
  finish: number;
  duration: number;
}

/** Compares the schedule with a baseline, for every task the baseline holds. */
export function baselineVariance(project: Project, schedule: Schedule, number = 0): Map<Id, BaselineVariance> {
  checkNumber(number);
  const time = compileCalendars(project.calendars).get(project.calendarId);
  if (!time) throw new ScheduleError("unknown-reference", `The project names a missing calendar "${project.calendarId}"`);
  const result = new Map<Id, BaselineVariance>();
  for (const [id, entry] of Object.entries(project.baselines[number] ?? {})) {
    const task = schedule.tasks.get(id);
    if (!task) continue;
    result.set(id, {
      start: time.workBetween(entry.start, task.start),
      finish: time.workBetween(entry.finish, task.finish),
      duration: task.duration - entry.duration,
    });
  }
  return result;
}
