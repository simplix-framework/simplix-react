import { dayIndexOf, parseClockTime, parseLocalDateTime, MINUTES_PER_DAY } from "../time";
import type { CalendarException, CalendarWorkWeek, WeekPattern, WorkCalendar, WorkingRange } from "../types";
import { parseFlag, parseNumber } from "./codes";
import { expandRecurrence, type MspdiRecurrence } from "./recurrence";
import type { MspdiWarning } from "./warnings";
import { childElement, childElements, childText, type XmlElement } from "./xml";

function optionalNumber(el: XmlElement, name: string): number | undefined {
  const text = childText(el, name);
  return text === undefined || text.trim() === "" ? undefined : parseNumber(text, name);
}

function readWorkingTimes(el: XmlElement, calendarId: string, warnings: MspdiWarning[]): WorkingRange[] {
  const container = childElement(el, "WorkingTimes");
  if (!container) {
    return [];
  }
  const ranges: WorkingRange[] = [];
  for (const wt of childElements(container, "WorkingTime")) {
    const fromText = childText(wt, "FromTime");
    const toText = childText(wt, "ToTime");
    if (fromText === undefined || toText === undefined) {
      continue;
    }
    const from = parseClockTime(fromText);
    let to = parseClockTime(toText);
    if (to === 0) {
      to = MINUTES_PER_DAY;
    } else if (to <= from) {
      warnings.push({
        code: "working-time-overnight",
        id: calendarId,
        message: `Working time ${fromText} to ${toText} crosses midnight and is cut at midnight`,
      });
      to = MINUTES_PER_DAY;
    }
    ranges.push({ from, to });
  }
  return ranges.sort((a, b) => a.from - b.from);
}

/** Working ranges of a WeekDay or Exception: empty when the day does not work. */
function readDayRanges(el: XmlElement, calendarId: string, warnings: MspdiWarning[]): WorkingRange[] {
  const working = childText(el, "DayWorking");
  if (working === undefined || !parseFlag(working, "DayWorking")) {
    return [];
  }
  const ranges = readWorkingTimes(el, calendarId, warnings);
  if (ranges.length === 0) {
    warnings.push({
      code: "working-day-without-hours",
      id: calendarId,
      message: "A day marked working has no working times and is read as non-working",
    });
  }
  return ranges;
}

function readDayRange(el: XmlElement): { fromDay: number; toDay: number } | undefined {
  const period = childElement(el, "TimePeriod");
  const from = period && childText(period, "FromDate");
  const to = period && childText(period, "ToDate");
  if (from === undefined || to === undefined) {
    return undefined;
  }
  return { fromDay: dayIndexOf(parseLocalDateTime(from)), toDay: dayIndexOf(parseLocalDateTime(to)) };
}

function readWeekDays(container: XmlElement | undefined, calendarId: string, warnings: MspdiWarning[]): WeekPattern {
  const days: (WorkingRange[] | null)[] = [null, null, null, null, null, null, null];
  if (!container) {
    return days;
  }
  for (const wd of childElements(container, "WeekDay")) {
    const type = optionalNumber(wd, "DayType");
    if (type !== undefined && type >= 1 && type <= 7) {
      days[type - 1] = readDayRanges(wd, calendarId, warnings);
    }
  }
  return days;
}

function readException(el: XmlElement, calendarId: string, warnings: MspdiWarning[]): CalendarException[] {
  const span = readDayRange(el);
  if (!span) {
    return [];
  }
  const name = childText(el, "Name");
  const ranges = readDayRanges(el, calendarId, warnings);
  const recurrence: MspdiRecurrence = {
    type: optionalNumber(el, "Type") ?? 1,
    fromDay: span.fromDay,
    toDay: span.toDay,
    occurrences: optionalNumber(el, "Occurrences"),
    byOccurrences: parseFlag(childText(el, "EnteredByOccurrences") ?? "0", "EnteredByOccurrences"),
    period: optionalNumber(el, "Period"),
    daysOfWeek: optionalNumber(el, "DaysOfWeek"),
    monthItem: optionalNumber(el, "MonthItem"),
    monthPosition: optionalNumber(el, "MonthPosition"),
    month: optionalNumber(el, "Month"),
    monthDay: optionalNumber(el, "MonthDay"),
  };
  const expanded = expandRecurrence(recurrence);
  if (!expanded.ok) {
    warnings.push({
      code: "recurrence-skipped",
      id: calendarId,
      message: `Calendar ${calendarId}: exception "${name ?? ""}" is skipped, ${expanded.reason} is not expanded`,
    });
    return [];
  }
  return expanded.ranges.map((r) => ({ ...(name ? { name } : {}), fromDay: r.fromDay, toDay: r.toDay, ranges }));
}

function readLegacyExceptions(weekDays: XmlElement | undefined, calendarId: string, warnings: MspdiWarning[]): CalendarException[] {
  if (!weekDays) {
    return [];
  }
  const out: CalendarException[] = [];
  for (const wd of childElements(weekDays, "WeekDay")) {
    if (optionalNumber(wd, "DayType") !== 0) {
      continue;
    }
    const span = readDayRange(wd);
    if (span) {
      out.push({ fromDay: span.fromDay, toDay: span.toDay, ranges: readDayRanges(wd, calendarId, warnings) });
    }
  }
  return out;
}

function readWorkWeeks(el: XmlElement, calendarId: string, warnings: MspdiWarning[]): CalendarWorkWeek[] {
  const container = childElement(el, "WorkWeeks");
  if (!container) {
    return [];
  }
  const out: CalendarWorkWeek[] = [];
  for (const ww of childElements(container, "WorkWeek")) {
    const span = readDayRange(ww);
    if (!span) {
      continue;
    }
    const name = childText(ww, "Name");
    out.push({
      ...(name ? { name } : {}),
      fromDay: span.fromDay,
      toDay: span.toDay,
      weekDays: readWeekDays(childElement(ww, "WeekDays"), calendarId, warnings),
    });
  }
  return out.sort(compareDaySpans);
}

/** Orders dated spans by first day, then last day. Used with a stable sort, equal spans keep their order. */
export function compareDaySpans(a: { fromDay: number; toDay: number }, b: { fromDay: number; toDay: number }): number {
  return a.fromDay - b.fromDay || a.toDay - b.toDay;
}

/**
 * Reads one MSPDI Calendar. Dated exceptions come from the Exceptions list,
 * with recurring ones expanded into their days; a calendar without that list
 * takes them from its DayType 0 week days.
 */
export function readCalendar(el: XmlElement, warnings: MspdiWarning[]): WorkCalendar {
  const id = (childText(el, "UID") ?? "").trim();
  const isBase = parseFlag(childText(el, "IsBaseCalendar") ?? "0", "IsBaseCalendar");
  const baseUid = childText(el, "BaseCalendarUID")?.trim();
  const weekDaysEl = childElement(el, "WeekDays");
  const exceptionEls = childElements(childElement(el, "Exceptions") ?? el, "Exception");
  const exceptions = (
    exceptionEls.length > 0
      ? exceptionEls.flatMap((e) => readException(e, id, warnings))
      : readLegacyExceptions(weekDaysEl, id, warnings)
  ).sort(compareDaySpans);
  const workWeeks = readWorkWeeks(el, id, warnings);
  return {
    id,
    name: childText(el, "Name") ?? "",
    ...(!isBase && baseUid !== undefined && baseUid !== "-1" ? { baseCalendarId: baseUid } : {}),
    weekDays: readWeekDays(weekDaysEl, id, warnings),
    ...(workWeeks.length > 0 ? { workWeeks } : {}),
    ...(exceptions.length > 0 ? { exceptions } : {}),
  };
}
