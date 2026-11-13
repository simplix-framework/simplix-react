import { describe, expect, it } from "vitest";

import { compileCalendars, continuousCalendar, intersectWorkingTime, standardCalendar } from "../calendar";
import { formatDuration, formatPredecessors, parseDuration, parsePredecessors } from "../duration";
import { ScheduleError } from "../errors";
import { dayIndexOf, formatLocalDateTime, parseLocalDateTime, toCivil } from "../time";
import type { WorkCalendar } from "../types";
import { at, link } from "./fixtures";

const sizes = { minutesPerDay: 480, minutesPerWeek: 2400, daysPerMonth: 20 };
const fmt = formatLocalDateTime;

describe("time", () => {
  it("round-trips local date-times across leap years and eras", () => {
    for (const text of ["1970-01-01T00:00:00", "1969-12-31T23:59:00", "2000-02-29T12:30:00", "2024-12-31T17:00:00", "2100-03-01T08:00:00"]) {
      expect(fmt(parseLocalDateTime(text))).toBe(text);
    }
    expect(toCivil(at("2014-10-17T08:00")).weekday).toBe(5);
  });

  it("rejects a date the month does not have", () => {
    expect(() => parseLocalDateTime("2023-02-30")).toThrowError(ScheduleError);
    expect(() => parseLocalDateTime("2023-13-01")).toThrowError(ScheduleError);
    expect(() => parseLocalDateTime("yesterday")).toThrowError(ScheduleError);
  });
});

describe("working time", () => {
  const time = compileCalendars([standardCalendar()]).get("standard")!;
  const friday5pm = at("2014-10-17T17:00");
  const monday8am = at("2014-10-20T08:00");

  it("writes one working moment as a start or as a finish", () => {
    expect(time.snapForward(friday5pm)).toBe(monday8am);
    expect(time.snapBackward(monday8am)).toBe(friday5pm);
    expect(time.snapForward(at("2014-10-17T12:30"))).toBe(at("2014-10-17T13:00"));
    expect(time.snapBackward(at("2014-10-17T12:30"))).toBe(at("2014-10-17T12:00"));
    expect(time.workBetween(friday5pm, monday8am)).toBe(0);
  });

  it("adds to the end of a range and subtracts to the start of one", () => {
    expect(fmt(time.add(at("2014-10-17T08:00"), 480))).toBe("2014-10-17T17:00:00");
    expect(fmt(time.add(friday5pm, 480))).toBe("2014-10-20T17:00:00");
    expect(fmt(time.subtract(at("2014-10-20T17:00"), 480))).toBe("2014-10-20T08:00:00");
    expect(fmt(time.subtract(monday8am, 240))).toBe("2014-10-17T13:00:00");
    expect(time.add(friday5pm, 0)).toBe(friday5pm);
  });

  it("inverts add with workBetween for any start and amount", () => {
    let seed = 7;
    const random = (n: number): number => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return Math.floor(seed / 65536) % n;
    };
    for (let i = 0; i < 500; i++) {
      const start = at("2014-10-01T00:00") + random(60 * 24 * 60);
      const amount = 1 + random(5000);
      const end = time.add(start, amount);
      expect(time.workBetween(start, end)).toBe(amount);
      expect(time.workBetween(time.subtract(end, amount), end)).toBe(amount);
      expect(time.subtract(end, amount)).toBe(time.snapForward(start));
    }
  });

  it("resolves a day through exceptions, work weeks, the week pattern and the base", () => {
    const day = (text: string): number => dayIndexOf(at(text));
    const base = standardCalendar();
    const derived: WorkCalendar = {
      id: "site",
      name: "Site",
      baseCalendarId: "standard",
      weekDays: [null, null, null, null, null, null, [{ from: 480, to: 720 }]],
      workWeeks: [
        { fromDay: day("2014-11-03"), toDay: day("2014-11-09"), weekDays: [null, [], null, null, null, null, null] },
      ],
      exceptions: [
        { fromDay: day("2014-10-22"), toDay: day("2014-10-22"), ranges: [] },
        { fromDay: day("2014-10-26"), toDay: day("2014-10-26"), ranges: [{ from: 600, to: 660 }] },
      ],
    };
    const site = compileCalendars([base, derived]).get("site")!;
    expect(site.rangesOfDay(day("2014-10-21"))).toHaveLength(2);
    expect(site.rangesOfDay(day("2014-10-22"))).toEqual([]);
    expect(site.rangesOfDay(day("2014-10-25"))).toEqual([{ from: 480, to: 720 }]);
    expect(site.rangesOfDay(day("2014-10-26"))).toEqual([{ from: 600, to: 660 }]);
    expect(site.rangesOfDay(day("2014-11-03"))).toEqual([]);
    expect(site.rangesOfDay(day("2014-11-04"))).toHaveLength(2);
  });

  it("keeps a moment that spans midnight on a continuous calendar", () => {
    const always = compileCalendars([continuousCalendar()]).get("24-hours")!;
    const midnight = at("2014-10-18T00:00");
    expect(always.snapForward(midnight)).toBe(midnight);
    expect(always.snapBackward(midnight)).toBe(midnight);
    expect(always.add(at("2014-10-17T23:00"), 120)).toBe(at("2014-10-18T01:00"));
  });

  it("intersects two calendars", () => {
    const morning: WorkCalendar = { ...standardCalendar("am"), weekDays: standardCalendar().weekDays.map((r) => (r && r.length ? [{ from: 360, to: 600 }] : [])) };
    const both = compileCalendars([standardCalendar(), morning]);
    const shared = intersectWorkingTime(both.get("standard")!, both.get("am")!);
    expect(shared.rangesOfDay(dayIndexOf(at("2014-10-17")))).toEqual([{ from: 480, to: 600 }]);
  });

  it("rejects calendars that cannot be used", () => {
    const empty: WorkCalendar = { id: "x", name: "x", weekDays: [[], [], [], [], [], [], []] };
    expect(() => compileCalendars([empty])).toThrowError(expect.objectContaining({ code: "no-working-time" }));
    const loop: WorkCalendar = { ...standardCalendar("a"), baseCalendarId: "b" };
    expect(() => compileCalendars([loop, { ...standardCalendar("b"), baseCalendarId: "a" }])).toThrowError(
      expect.objectContaining({ code: "cycle" }),
    );
    const overlap: WorkCalendar = { id: "o", name: "o", weekDays: [[], [{ from: 480, to: 720 }, { from: 700, to: 900 }], [], [], [], [], []] };
    expect(() => compileCalendars([overlap])).toThrowError(expect.objectContaining({ code: "invalid-calendar" }));
  });
});

describe("duration text", () => {
  it.each([
    ["3d", 1440, "3d"],
    ["1.5w", 3600, "1.5w"],
    ["4 hours", 240, "4h"],
    ["2ed", 2880, "2ed"],
    ["5d?", 2400, "5d?"],
    ["1mo", 9600, "1mo"],
    ["90", 43200, "90d"],
  ])("reads %s", (text, minutes, written) => {
    const value = parseDuration(text, sizes);
    expect(value.minutes).toBe(minutes);
    expect(formatDuration(value, sizes)).toBe(written);
  });

  it("rejects text that is not a duration", () => {
    for (const text of ["", "d", "3 fortnights", "2e", "abc"]) {
      expect(() => parseDuration(text, sizes)).toThrowError(expect.objectContaining({ code: "invalid-duration" }));
    }
  });

  it("round-trips a predecessor list", () => {
    const refs = parsePredecessors("3, 4SS+2d; 5FF-1.5h, 6FS+50%, 7SF+1ed", sizes);
    expect(refs).toEqual([
      { row: 3, type: "FS", lag: 0, lagMode: "working", lagUnit: "d" },
      { row: 4, type: "SS", lag: 960, lagMode: "working", lagUnit: "d" },
      { row: 5, type: "FF", lag: -90, lagMode: "working", lagUnit: "h" },
      { row: 6, type: "FS", lag: 50, lagMode: "percent", lagUnit: "d" },
      { row: 7, type: "SF", lag: 1440, lagMode: "elapsed", lagUnit: "d" },
    ]);
    const links = refs.map((ref) => link(String(ref.row), "x", ref.type, 0, { lag: ref.lag, lagMode: ref.lagMode, lagUnit: ref.lagUnit }));
    expect(formatPredecessors(links, Number, sizes)).toBe("3,4SS+2d,5FF-1.5h,6FS+50%,7SF+1ed");
    expect(() => parsePredecessors("3XX", sizes)).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
  });
});
