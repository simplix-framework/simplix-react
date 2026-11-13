import { ScheduleError } from "./errors";
import { formatClockTime, parseClockTime } from "./time";
import type { Project, WorkingRange } from "./types";

/** The plan-level settings of a project: everything but its records. */
export type ProjectSettings = Omit<Project, "calendars" | "tasks" | "links" | "resources" | "assignments" | "baselines">;

/**
 * Changes plan-level settings.
 *
 * @throws ScheduleError `unknown-reference` for a calendar the project does
 * not hold, and `invalid-date` for a project scheduled from a finish it does
 * not have.
 */
export function updateProject(project: Project, patch: Partial<ProjectSettings>): Project {
  const next: Project = { ...project, ...patch };
  if (!next.calendars.some((calendar) => calendar.id === next.calendarId)) {
    throw new ScheduleError("unknown-reference", `No calendar "${next.calendarId}"`, [next.calendarId]);
  }
  if (next.scheduleFrom === "finish" && next.finish === undefined) {
    throw new ScheduleError("invalid-date", "A project scheduled from its finish needs a finish date");
  }
  return next;
}

const RANGE_TEXT = /^(\d{1,2}:\d{2})\s*[-~]\s*(\d{1,2}:\d{2})$/;

/**
 * Reads the working time of a day as it is typed: `08:00-12:00, 13:00-17:00`.
 * Empty text is a non-working day.
 *
 * @throws ScheduleError `invalid-calendar` when a range cannot be read, is
 * empty, or does not come after the one before it.
 */
export function parseWorkingRanges(text: string): WorkingRange[] {
  const ranges: WorkingRange[] = [];
  for (const part of text.split(",")) {
    const entry = part.trim();
    if (entry === "") continue;
    const m = RANGE_TEXT.exec(entry);
    if (!m) throw new ScheduleError("invalid-calendar", `Not a working time: "${entry}"`);
    const from = parseClockTime(m[1]);
    // A range may run to the end of the day, written 24:00 or 00:00.
    const to = parseClockTime(m[2]) === 0 ? 1440 : parseClockTime(m[2]);
    const previousEnd = ranges.length === 0 ? 0 : ranges[ranges.length - 1].to;
    if (to <= from || from < previousEnd) {
      throw new ScheduleError("invalid-calendar", `Working times must be in order and not empty: "${text}"`);
    }
    ranges.push({ from, to });
  }
  return ranges;
}

/** Writes the working time of a day as `08:00-12:00, 13:00-17:00`. */
export function formatWorkingRanges(ranges: readonly WorkingRange[]): string {
  return ranges.map((range) => `${formatClockTime(range.from).slice(0, 5)}-${formatClockTime(range.to).slice(0, 5)}`).join(", ");
}
