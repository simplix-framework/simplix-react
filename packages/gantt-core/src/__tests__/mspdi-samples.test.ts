import { describe, expect, it } from "vitest";
import { readMspdi, writeMspdi } from "../mspdi";
import { childElement, childElements, childText, parseXml } from "../mspdi/xml";
import { dayIndexOf, parseLocalDateTime } from "../time";
import type { WorkCalendar } from "../types";
import { listSamples, readSample, scheduleFromFile } from "./mspdi-oracle";

const samples = listSamples();

describe("MSPDI sample files", () => {
  it("finds every sample", () => {
    expect(samples.length).toBe(122);
  });

  it.each(samples)("reads %s", (file) => {
    const { project } = readMspdi(readSample(file));
    expect(project.calendars.length).toBeGreaterThan(0);
  });

  it.each(samples)("round-trips %s", (file) => {
    const xml = readSample(file);
    const first = readMspdi(xml).project;
    const second = readMspdi(writeMspdi(first, scheduleFromFile(xml))).project;
    expect(second).toEqual(first);
  });
});

/**
 * Days of every exception, keyed `day:working-ranges`, from the model. Two
 * recurrences landing on one day count once, as Microsoft Project lists it.
 */
function modelDays(calendar: WorkCalendar): string[] {
  const out: string[] = [];
  for (const e of calendar.exceptions ?? []) {
    for (let d = e.fromDay; d <= e.toDay; d++) {
      out.push(`${d}:${JSON.stringify(e.ranges)}`);
    }
  }
  return [...new Set(out)].sort();
}

describe("recurring calendar exceptions", () => {
  const files = samples.filter((f) => f.startsWith("calendar-recurring-exceptions/"));

  it.each(files)("expands %s to the days Microsoft Project listed as DayType 0", (file) => {
    const xml = readSample(file);
    const { project, warnings } = readMspdi(xml);
    expect(warnings.filter((w) => w.code === "recurrence-skipped")).toEqual([]);
    const root = parseXml(xml);
    for (const calEl of childElements(childElement(root, "Calendars") ?? root, "Calendar")) {
      const id = (childText(calEl, "UID") ?? "").trim();
      const legacy: string[] = [];
      for (const wd of childElements(childElement(calEl, "WeekDays") ?? calEl, "WeekDay")) {
        if (childText(wd, "DayType")?.trim() !== "0") {
          continue;
        }
        const period = childElement(wd, "TimePeriod");
        const from = dayIndexOf(parseLocalDateTime(childText(period ?? wd, "FromDate") ?? ""));
        const to = dayIndexOf(parseLocalDateTime(childText(period ?? wd, "ToDate") ?? ""));
        const ranges = childElements(childElement(wd, "WorkingTimes") ?? wd, "WorkingTime").map((t) => {
          const [fh, fm] = (childText(t, "FromTime") ?? "").split(":").map(Number);
          const [th, tm] = (childText(t, "ToTime") ?? "").split(":").map(Number);
          return { from: (fh ?? 0) * 60 + (fm ?? 0), to: (th ?? 0) * 60 + (tm ?? 0) };
        });
        for (let d = from; d <= to; d++) {
          legacy.push(`${d}:${JSON.stringify(ranges)}`);
        }
      }
      const calendar = project.calendars.find((c) => c.id === id);
      expect(calendar).toBeDefined();
      expect(modelDays(calendar as WorkCalendar)).toEqual([...new Set(legacy)].sort());
    }
  });
});
