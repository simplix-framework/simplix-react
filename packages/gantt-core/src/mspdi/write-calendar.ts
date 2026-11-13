import { formatClockTime, formatLocalDateTime, MINUTES_PER_DAY } from "../time";
import type { CalendarException, WeekPattern, WorkCalendar, WorkingRange } from "../types";
import { formatFlag } from "./codes";
import { compareDaySpans } from "./read-calendar";
import type { XmlWriter } from "./xml";

function dayStart(day: number): string {
  return formatLocalDateTime(day * MINUTES_PER_DAY);
}

/** End of a day as Microsoft Project writes it, 23:59 on that day. */
function dayEnd(day: number): string {
  return formatLocalDateTime(day * MINUTES_PER_DAY + MINUTES_PER_DAY - 1);
}

/** A clock time, with the end of the day written as 00:00:00. */
function clock(minuteOfDay: number): string {
  return minuteOfDay === MINUTES_PER_DAY ? "00:00:00" : formatClockTime(minuteOfDay);
}

function writeTimePeriod(w: XmlWriter, fromDay: number, toDay: number): void {
  w.start("TimePeriod").leaf("FromDate", dayStart(fromDay)).leaf("ToDate", dayEnd(toDay)).end();
}

function writeWorkingTimes(w: XmlWriter, ranges: readonly WorkingRange[]): void {
  if (ranges.length === 0) {
    return;
  }
  w.start("WorkingTimes");
  for (const r of ranges) {
    w.start("WorkingTime").leaf("FromTime", clock(r.from)).leaf("ToTime", clock(r.to)).end();
  }
  w.end();
}

function writeWeekDays(w: XmlWriter, days: WeekPattern, exceptions: readonly CalendarException[]): void {
  if (days.every((d) => d === null) && exceptions.length === 0) {
    return;
  }
  w.start("WeekDays");
  days.forEach((ranges, i) => {
    if (ranges === null) {
      return;
    }
    w.start("WeekDay").leaf("DayType", String(i + 1)).leaf("DayWorking", formatFlag(ranges.length > 0));
    writeWorkingTimes(w, ranges);
    w.end();
  });
  // Dated days in the form Microsoft Project 2002 and 2003 read.
  for (const e of exceptions) {
    w.start("WeekDay").leaf("DayType", "0").leaf("DayWorking", formatFlag(e.ranges.length > 0));
    writeTimePeriod(w, e.fromDay, e.toDay);
    writeWorkingTimes(w, e.ranges);
    w.end();
  }
  w.end();
}

/**
 * Writes one Calendar element. Each exception is written as a dated daily
 * exception covering its days, sorted by date, and repeated as a DayType 0
 * week day for older readers.
 */
export function writeCalendar(w: XmlWriter, calendar: WorkCalendar): void {
  const exceptions = [...(calendar.exceptions ?? [])].sort(compareDaySpans);
  const isBase = calendar.baseCalendarId === undefined;
  w.start("Calendar")
    .leaf("UID", calendar.id)
    .leaf("Name", calendar.name)
    .leaf("IsBaseCalendar", formatFlag(isBase))
    .leaf("IsBaselineCalendar", "0")
    .leaf("BaseCalendarUID", isBase ? "-1" : calendar.baseCalendarId);
  writeWeekDays(w, calendar.weekDays, exceptions);
  if (exceptions.length > 0) {
    w.start("Exceptions");
    for (const e of exceptions) {
      w.start("Exception").leaf("EnteredByOccurrences", "0");
      writeTimePeriod(w, e.fromDay, e.toDay);
      w.leaf("Occurrences", String(e.toDay - e.fromDay + 1))
        .leaf("Name", e.name === "" ? undefined : e.name)
        .leaf("Type", "1")
        .leaf("DayWorking", formatFlag(e.ranges.length > 0));
      writeWorkingTimes(w, e.ranges);
      w.end();
    }
    w.end();
  }
  const workWeeks = [...(calendar.workWeeks ?? [])].sort(compareDaySpans);
  if (workWeeks.length > 0) {
    w.start("WorkWeeks");
    for (const ww of workWeeks) {
      w.start("WorkWeek");
      writeTimePeriod(w, ww.fromDay, ww.toDay);
      w.leaf("Name", ww.name === "" ? undefined : ww.name).start("WeekDays");
      ww.weekDays.forEach((ranges, i) => {
        if (ranges === null) {
          return;
        }
        w.start("WeekDay").leaf("DayType", String(i + 1)).leaf("DayWorking", formatFlag(ranges.length > 0));
        writeWorkingTimes(w, ranges);
        w.end();
      });
      w.end().end();
    }
    w.end();
  }
  w.end();
}
