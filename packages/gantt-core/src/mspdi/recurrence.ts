import { daysFromCivil, toCivil, weekdayOfDay, MINUTES_PER_DAY } from "../time";

/** The recurrence fields of an MSPDI calendar Exception, as numbers. */
export interface MspdiRecurrence {
  /** 1 daily, 2 yearly by date, 3 yearly by weekday, 4 monthly by date, 5 monthly by weekday, 6 weekly, 7 every n days. */
  type: number;
  fromDay: number;
  toDay: number;
  /** Count of occurrences; bounds the expansion only when `byOccurrences`. */
  occurrences?: number;
  byOccurrences: boolean;
  period?: number;
  /** Bit mask, 1 Sunday to 64 Saturday. */
  daysOfWeek?: number;
  /** 3 Sunday to 9 Saturday. */
  monthItem?: number;
  /** 0 first to 3 fourth, 4 last. */
  monthPosition?: number;
  /** 0 January to 11 December. */
  month?: number;
  monthDay?: number;
}

/** Days a recurrence covers: inclusive day-index ranges, in date order. */
export type ExpansionResult = { ok: true; ranges: { fromDay: number; toDay: number }[] } | { ok: false; reason: string };

const MAX_OCCURRENCES = 10000;

function daysInMonth(year: number, month: number): number {
  return daysFromCivil(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1) - daysFromCivil(year, month, 1);
}

/** Day of the nth (0 to 3) or last (4) given weekday in a month, or undefined for a bad position. */
function weekdayInMonth(year: number, month: number, weekday: number, position: number): number | undefined {
  const first = daysFromCivil(year, month, 1);
  if (position >= 0 && position <= 3) {
    const offset = (weekday - weekdayOfDay(first) + 7) % 7;
    return first + offset + position * 7;
  }
  if (position === 4) {
    const last = first + daysInMonth(year, month) - 1;
    return last - ((weekdayOfDay(last) - weekday + 7) % 7);
  }
  return undefined;
}

function weekdayOfMonthItem(item: number | undefined): number | undefined {
  return item !== undefined && item >= 3 && item <= 9 ? item - 3 : undefined;
}

/**
 * Lists the days of a recurring exception. Each kind is expanded only in the
 * form the reference files confirm; any other form is reported as not
 * expanded with the reason.
 */
export function expandRecurrence(r: MspdiRecurrence): ExpansionResult {
  if (r.toDay < r.fromDay) {
    return { ok: false, reason: "ends before it starts" };
  }
  if (r.type === 1) {
    return { ok: true, ranges: [{ fromDay: r.fromDay, toDay: r.toDay }] };
  }
  const limit = r.byOccurrences && r.occurrences !== undefined ? r.occurrences : MAX_OCCURRENCES;
  const days: number[] = [];
  const accept = (day: number): "stop" | "next" => {
    if (day > r.toDay || days.length >= limit) {
      return "stop";
    }
    if (day >= r.fromDay) {
      days.push(day);
    }
    return "next";
  };
  const period = r.period ?? 1;
  if (period < 1 || !Number.isInteger(period)) {
    return { ok: false, reason: `period ${period} is not a positive whole number` };
  }

  switch (r.type) {
    case 7: {
      for (let day = r.fromDay; accept(day) === "next"; day += period);
      break;
    }
    case 6: {
      const mask = r.daysOfWeek ?? 0;
      const weekday = [1, 2, 4, 8, 16, 32, 64].indexOf(mask);
      if (weekday < 0) {
        return { ok: false, reason: `weekly recurrence on day mask ${mask} (only a single weekday is expanded)` };
      }
      const weekStart = r.fromDay - weekdayOfDay(r.fromDay);
      for (let day = weekStart + weekday; accept(day) === "next"; day += 7 * period);
      break;
    }
    case 4:
    case 5: {
      const start = toCivil(r.fromDay * MINUTES_PER_DAY);
      const weekday = weekdayOfMonthItem(r.monthItem);
      if (r.type === 5 && weekday === undefined) {
        return { ok: false, reason: `monthly recurrence on month item ${r.monthItem ?? "none"}` };
      }
      for (let k = 0; ; k += period) {
        const monthIndex = start.year * 12 + (start.month - 1) + k;
        const year = Math.floor(monthIndex / 12);
        const month = (monthIndex % 12) + 1;
        let day: number | undefined;
        if (r.type === 4) {
          const monthDay = r.monthDay ?? 0;
          if (monthDay < 1 || monthDay > daysInMonth(year, month)) {
            return { ok: false, reason: `monthly recurrence on day ${monthDay}, which ${year}-${month} lacks` };
          }
          day = daysFromCivil(year, month, monthDay);
        } else {
          day = weekdayInMonth(year, month, weekday ?? 0, r.monthPosition ?? -1);
          if (day === undefined) {
            return { ok: false, reason: `monthly recurrence at position ${r.monthPosition ?? "none"}` };
          }
        }
        if (accept(day) === "stop") {
          break;
        }
      }
      break;
    }
    case 2:
    case 3: {
      const month = (r.month ?? -1) + 1;
      if (month < 1 || month > 12) {
        return { ok: false, reason: `yearly recurrence in month ${r.month ?? "none"}` };
      }
      const weekday = weekdayOfMonthItem(r.monthItem);
      if (r.type === 3 && weekday === undefined) {
        return { ok: false, reason: `yearly recurrence on month item ${r.monthItem ?? "none"}` };
      }
      for (let year = toCivil(r.fromDay * MINUTES_PER_DAY).year; ; year++) {
        let day: number | undefined;
        if (r.type === 2) {
          const monthDay = r.monthDay ?? 0;
          if (monthDay < 1 || monthDay > daysInMonth(year, month)) {
            return { ok: false, reason: `yearly recurrence on day ${monthDay}, which ${year}-${month} lacks` };
          }
          day = daysFromCivil(year, month, monthDay);
        } else {
          day = weekdayInMonth(year, month, weekday ?? 0, r.monthPosition ?? -1);
          if (day === undefined) {
            return { ok: false, reason: `yearly recurrence at position ${r.monthPosition ?? "none"}` };
          }
        }
        if (accept(day) === "stop") {
          break;
        }
      }
      break;
    }
    default:
      return { ok: false, reason: `recurrence type ${r.type}` };
  }
  return { ok: true, ranges: days.map((day) => ({ fromDay: day, toDay: day })) };
}
