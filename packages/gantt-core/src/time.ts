import { ScheduleError } from "./errors";

/**
 * An instant on the project's own wall clock, in whole minutes counted from
 * 1970-01-01T00:00. No time zone is applied anywhere in the engine: a project
 * plan is written in one local clock, as MS Project XML is.
 */
export type Minutes = number;

export const MINUTES_PER_DAY = 1440;

/** Calendar fields of an instant. `month` is 1-12, `weekday` is 0 (Sunday) to 6. */
export interface CivilDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
}

/** Days from 1970-01-01 to the given proleptic Gregorian date. */
export function daysFromCivil(year: number, month: number, day: number): number {
  const y = month <= 2 ? year - 1 : year;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

/** Index of the day an instant falls on, counted from 1970-01-01. */
export function dayIndexOf(t: Minutes): number {
  return Math.floor(t / MINUTES_PER_DAY);
}

/** Weekday of a day index: 0 is Sunday. */
export function weekdayOfDay(day: number): number {
  return (((day + 4) % 7) + 7) % 7;
}

/** Splits an instant into calendar fields. */
export function toCivil(t: Minutes): CivilDateTime {
  const dayIndex = dayIndexOf(t);
  const minuteOfDay = t - dayIndex * MINUTES_PER_DAY;
  const z = dayIndex + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const day = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const month = mp < 10 ? mp + 3 : mp - 9;
  const year = yoe + era * 400 + (month <= 2 ? 1 : 0);
  return {
    year,
    month,
    day,
    hour: Math.floor(minuteOfDay / 60),
    minute: minuteOfDay % 60,
    weekday: weekdayOfDay(dayIndex),
  };
}

/** Builds an instant from calendar fields. */
export function fromCivil(year: number, month: number, day: number, hour = 0, minute = 0): Minutes {
  return daysFromCivil(year, month, day) * MINUTES_PER_DAY + hour * 60 + minute;
}

const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/;

/**
 * Reads `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM[:SS]` as an instant on the project
 * clock. Seconds are dropped.
 */
export function parseLocalDateTime(text: string): Minutes {
  const m = LOCAL_DATE_TIME.exec(text.trim());
  if (!m) {
    throw new ScheduleError("invalid-date", `Not a local date-time: "${text}"`);
  }
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hour = m[4] === undefined ? 0 : Number(m[4]);
  const minute = m[5] === undefined ? 0 : Number(m[5]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 24 || minute > 59) {
    throw new ScheduleError("invalid-date", `Date-time out of range: "${text}"`);
  }
  const t = fromCivil(Number(m[1]), month, day, hour, minute);
  // A day the month does not have (February 30) would roll into the next month.
  if (hour < 24 && toCivil(t).day !== day) {
    throw new ScheduleError("invalid-date", `No such date: "${text}"`);
  }
  return t;
}

function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}

/** Writes an instant as `YYYY-MM-DDTHH:MM:00`. */
export function formatLocalDateTime(t: Minutes): string {
  const c = toCivil(t);
  return `${pad(c.year, 4)}-${pad(c.month)}-${pad(c.day)}T${pad(c.hour)}:${pad(c.minute)}:00`;
}

/** Writes the date of an instant as `YYYY-MM-DD`. */
export function formatLocalDate(t: Minutes): string {
  return formatLocalDateTime(t).slice(0, 10);
}

const CLOCK_TIME = /^(\d{1,2}):(\d{2})(?::\d{2})?$/;

/** Reads `HH:MM[:SS]` as minutes after midnight. */
export function parseClockTime(text: string): number {
  const m = CLOCK_TIME.exec(text.trim());
  if (!m || Number(m[1]) > 24 || Number(m[2]) > 59) {
    throw new ScheduleError("invalid-date", `Not a clock time: "${text}"`);
  }
  return Number(m[1]) * 60 + Number(m[2]);
}

/** Writes minutes after midnight as `HH:MM:00`. */
export function formatClockTime(minuteOfDay: number): string {
  return `${pad(Math.floor(minuteOfDay / 60))}:${pad(minuteOfDay % 60)}:00`;
}
