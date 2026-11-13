import { ScheduleError } from "./errors";
import { MINUTES_PER_DAY, dayIndexOf, weekdayOfDay } from "./time";
import type { Minutes } from "./time";
import type { Id, WorkCalendar, WorkingRange } from "./types";

/** Days searched for working time before a calendar is declared to have none. */
const SEARCH_LIMIT_DAYS = 3660;

const NO_RANGES: readonly WorkingRange[] = [];
const FULL_DAY: readonly WorkingRange[] = [{ from: 0, to: MINUTES_PER_DAY }];

/**
 * Working-time arithmetic over one calendar.
 *
 * Two instants can bound the same working moment: 17:00 on Friday and 08:00
 * on Monday have no working time between them. A start is written at the
 * later of the two ({@link WorkingTime.snapForward}) and a finish at the
 * earlier ({@link WorkingTime.snapBackward}).
 */
export interface WorkingTime {
  readonly id: Id;
  /** Working ranges of a day, in order and without overlap. */
  rangesOfDay(day: number): readonly WorkingRange[];
  /** The earliest instant at or after `t` at which work can begin. */
  snapForward(t: Minutes): Minutes;
  /** The latest instant at or before `t` at which work can end. */
  snapBackward(t: Minutes): Minutes;
  /** True when `t` lies inside a working range or on one of its ends. */
  touchesWork(t: Minutes): boolean;
  /**
   * The earliest instant by which `minutes` of work starting at `t` are done.
   * Zero minutes returns `t` unchanged; a negative count runs backward.
   */
  add(t: Minutes, minutes: number): Minutes;
  /**
   * The latest instant from which `minutes` of work end by `t`. Zero minutes
   * returns `t` unchanged; a negative count runs forward.
   */
  subtract(t: Minutes, minutes: number): Minutes;
  /** Working minutes from `a` to `b`; negative when `b` is earlier. */
  workBetween(a: Minutes, b: Minutes): number;
}

function createWorkingTime(id: Id, resolveDay: (day: number) => readonly WorkingRange[]): WorkingTime {
  const cache = new Map<number, readonly WorkingRange[]>();
  const rangesOfDay = (day: number): readonly WorkingRange[] => {
    let ranges = cache.get(day);
    if (ranges === undefined) {
      ranges = resolveDay(day);
      cache.set(day, ranges);
    }
    return ranges;
  };

  const noWork = (): ScheduleError =>
    new ScheduleError("no-working-time", `Calendar "${id}" has no working time within ${SEARCH_LIMIT_DAYS} days`, [id]);

  const snapForward = (t: Minutes): Minutes => {
    let day = dayIndexOf(t);
    let minute = t - day * MINUTES_PER_DAY;
    for (let i = 0; i <= SEARCH_LIMIT_DAYS; i++) {
      for (const r of rangesOfDay(day)) {
        if (minute < r.to) return day * MINUTES_PER_DAY + Math.max(minute, r.from);
      }
      day += 1;
      minute = 0;
    }
    throw noWork();
  };

  const snapBackward = (t: Minutes): Minutes => {
    let day = dayIndexOf(t);
    let minute = t - day * MINUTES_PER_DAY;
    for (let i = 0; i <= SEARCH_LIMIT_DAYS; i++) {
      const ranges = rangesOfDay(day);
      for (let k = ranges.length - 1; k >= 0; k--) {
        const r = ranges[k];
        if (minute > r.from) return day * MINUTES_PER_DAY + Math.min(minute, r.to);
      }
      day -= 1;
      minute = MINUTES_PER_DAY;
    }
    throw noWork();
  };

  const touchesWork = (t: Minutes): boolean => {
    const day = dayIndexOf(t);
    const minute = t - day * MINUTES_PER_DAY;
    if (rangesOfDay(day).some((r) => minute >= r.from && minute <= r.to)) return true;
    // Midnight also closes a range that runs to the end of the previous day.
    return minute === 0 && rangesOfDay(day - 1).some((r) => r.to === MINUTES_PER_DAY);
  };

  const forward = (t: Minutes, minutes: number): Minutes => {
    let remaining = minutes;
    let day = dayIndexOf(t);
    let minute = t - day * MINUTES_PER_DAY;
    let idle = 0;
    while (idle <= SEARCH_LIMIT_DAYS) {
      for (const r of rangesOfDay(day)) {
        if (minute >= r.to) continue;
        const from = Math.max(minute, r.from);
        const available = r.to - from;
        if (available >= remaining) return day * MINUTES_PER_DAY + from + remaining;
        remaining -= available;
        idle = 0;
      }
      day += 1;
      minute = 0;
      idle += 1;
    }
    throw noWork();
  };

  const backward = (t: Minutes, minutes: number): Minutes => {
    let remaining = minutes;
    let day = dayIndexOf(t);
    let minute = t - day * MINUTES_PER_DAY;
    let idle = 0;
    while (idle <= SEARCH_LIMIT_DAYS) {
      const ranges = rangesOfDay(day);
      for (let k = ranges.length - 1; k >= 0; k--) {
        const r = ranges[k];
        if (minute <= r.from) continue;
        const to = Math.min(minute, r.to);
        const available = to - r.from;
        if (available >= remaining) return day * MINUTES_PER_DAY + to - remaining;
        remaining -= available;
        idle = 0;
      }
      day -= 1;
      minute = MINUTES_PER_DAY;
      idle += 1;
    }
    throw noWork();
  };

  const add = (t: Minutes, minutes: number): Minutes => {
    if (minutes === 0) return t;
    return minutes > 0 ? forward(t, minutes) : backward(t, -minutes);
  };

  const subtract = (t: Minutes, minutes: number): Minutes => {
    if (minutes === 0) return t;
    return minutes > 0 ? backward(t, minutes) : forward(t, -minutes);
  };

  const workBetween = (a: Minutes, b: Minutes): number => {
    if (a === b) return 0;
    if (a > b) return -workBetween(b, a);
    let total = 0;
    const firstDay = dayIndexOf(a);
    const lastDay = dayIndexOf(b);
    for (let day = firstDay; day <= lastDay; day++) {
      const base = day * MINUTES_PER_DAY;
      for (const r of rangesOfDay(day)) {
        const from = Math.max(base + r.from, a);
        const to = Math.min(base + r.to, b);
        if (to > from) total += to - from;
      }
    }
    return total;
  };

  return { id, rangesOfDay, snapForward, snapBackward, touchesWork, add, subtract, workBetween };
}

function validateRanges(calendarId: Id, ranges: readonly WorkingRange[]): void {
  let previousEnd = 0;
  for (const r of ranges) {
    if (!Number.isInteger(r.from) || !Number.isInteger(r.to) || r.from < previousEnd || r.to <= r.from || r.to > MINUTES_PER_DAY) {
      throw new ScheduleError(
        "invalid-calendar",
        `Calendar "${calendarId}" has a working range that is empty, out of order or outside the day`,
        [calendarId],
      );
    }
    previousEnd = r.to;
  }
}

/** Working time that never stops. An elapsed duration or lag is counted on it. */
export const ELAPSED_TIME: WorkingTime = createWorkingTime("elapsed", () => FULL_DAY);

/**
 * Builds the working-time arithmetic of every calendar of a project.
 *
 * @throws ScheduleError `duplicate-id`, `unknown-reference` or `cycle` for a
 * broken base-calendar chain, `invalid-calendar` for a malformed range, and
 * `no-working-time` for a week pattern without a working day.
 */
export function compileCalendars(calendars: readonly WorkCalendar[]): Map<Id, WorkingTime> {
  const byId = new Map<Id, WorkCalendar>();
  for (const calendar of calendars) {
    if (byId.has(calendar.id)) {
      throw new ScheduleError("duplicate-id", `Calendar id "${calendar.id}" is used twice`, [calendar.id]);
    }
    byId.set(calendar.id, calendar);
  }

  for (const calendar of calendars) {
    if (calendar.weekDays.length !== 7) {
      throw new ScheduleError("invalid-calendar", `Calendar "${calendar.id}" needs seven weekdays`, [calendar.id]);
    }
    for (const ranges of calendar.weekDays) if (ranges) validateRanges(calendar.id, ranges);
    for (const week of calendar.workWeeks ?? []) {
      if (week.weekDays.length !== 7 || week.toDay < week.fromDay) {
        throw new ScheduleError("invalid-calendar", `Calendar "${calendar.id}" has a malformed work week`, [calendar.id]);
      }
      for (const ranges of week.weekDays) if (ranges) validateRanges(calendar.id, ranges);
    }
    for (const exception of calendar.exceptions ?? []) {
      if (exception.toDay < exception.fromDay) {
        throw new ScheduleError("invalid-calendar", `Calendar "${calendar.id}" has an exception that ends before it starts`, [
          calendar.id,
        ]);
      }
      validateRanges(calendar.id, exception.ranges);
    }
    const seen = new Set<Id>([calendar.id]);
    let baseId = calendar.baseCalendarId;
    while (baseId !== undefined) {
      const base = byId.get(baseId);
      if (!base) {
        throw new ScheduleError("unknown-reference", `Calendar "${calendar.id}" names a missing base calendar "${baseId}"`, [
          calendar.id,
          baseId,
        ]);
      }
      if (seen.has(baseId)) {
        throw new ScheduleError("cycle", `Calendar "${calendar.id}" is its own base calendar`, [...seen]);
      }
      seen.add(baseId);
      baseId = base.baseCalendarId;
    }
  }

  const resolveDay = (calendar: WorkCalendar, day: number, weekday: number): readonly WorkingRange[] => {
    for (const exception of calendar.exceptions ?? []) {
      if (day >= exception.fromDay && day <= exception.toDay) return exception.ranges;
    }
    for (const week of calendar.workWeeks ?? []) {
      if (day >= week.fromDay && day <= week.toDay) {
        const ranges = week.weekDays[weekday];
        if (ranges) return ranges;
      }
    }
    const own = calendar.weekDays[weekday];
    if (own) return own;
    const base = calendar.baseCalendarId === undefined ? undefined : byId.get(calendar.baseCalendarId);
    return base ? resolveDay(base, day, weekday) : NO_RANGES;
  };

  const weekdayWorks = (calendar: WorkCalendar, weekday: number): boolean => {
    const own = calendar.weekDays[weekday];
    if (own) return own.length > 0;
    const base = calendar.baseCalendarId === undefined ? undefined : byId.get(calendar.baseCalendarId);
    return base ? weekdayWorks(base, weekday) : false;
  };

  const compiled = new Map<Id, WorkingTime>();
  for (const calendar of calendars) {
    if (![0, 1, 2, 3, 4, 5, 6].some((weekday) => weekdayWorks(calendar, weekday))) {
      throw new ScheduleError("no-working-time", `Calendar "${calendar.id}" has no working weekday`, [calendar.id]);
    }
    compiled.set(
      calendar.id,
      createWorkingTime(calendar.id, (day) => resolveDay(calendar, day, weekdayOfDay(day))),
    );
  }
  return compiled;
}

/** Working time that is working in both calendars. */
export function intersectWorkingTime(a: WorkingTime, b: WorkingTime): WorkingTime {
  return createWorkingTime(`${a.id}&${b.id}`, (day) => {
    const result: WorkingRange[] = [];
    const left = a.rangesOfDay(day);
    const right = b.rangesOfDay(day);
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      const from = Math.max(left[i].from, right[j].from);
      const to = Math.min(left[i].to, right[j].to);
      if (to > from) result.push({ from, to });
      if (left[i].to < right[j].to) i += 1;
      else j += 1;
    }
    return result;
  });
}

const WORKDAY: readonly WorkingRange[] = [
  { from: 8 * 60, to: 12 * 60 },
  { from: 13 * 60, to: 17 * 60 },
];

/** A Monday to Friday calendar working 08:00 to 12:00 and 13:00 to 17:00. */
export function standardCalendar(id: Id = "standard", name = "Standard"): WorkCalendar {
  return { id, name, weekDays: [[], WORKDAY, WORKDAY, WORKDAY, WORKDAY, WORKDAY, []] };
}

/** A calendar working around the clock on every day. */
export function continuousCalendar(id: Id = "24-hours", name = "24 Hours"): WorkCalendar {
  return { id, name, weekDays: [FULL_DAY, FULL_DAY, FULL_DAY, FULL_DAY, FULL_DAY, FULL_DAY, FULL_DAY] };
}
