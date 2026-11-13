import { describe, expect, it } from "vitest";

import { readMspdi } from "../mspdi";
import { computeSchedule } from "../schedule";
import { formatLocalDateTime } from "../time";
import type { TaskSchedule } from "../types";
import { listSamples, readSample, scheduleFromFile } from "./mspdi-oracle";

const DATES = ["start", "finish", "earlyStart", "earlyFinish"] as const;
const LATE = ["lateStart", "lateFinish"] as const;

function differences(actual: TaskSchedule, expected: TaskSchedule, manual: boolean): string[] {
  const found: string[] = [];
  // Microsoft Project does not read a manually scheduled task's late dates and
  // critical flag off its links the way it does for an automatic task, so only
  // the dates that place the task are compared for one.
  for (const key of manual ? DATES : [...DATES, ...LATE]) {
    if (actual[key] !== expected[key]) {
      found.push(`${key} ${formatLocalDateTime(actual[key])} != ${formatLocalDateTime(expected[key])}`);
    }
  }
  if (manual) return found;
  for (const key of ["totalSlack", "freeSlack", "critical"] as const) {
    if (actual[key] !== expected[key]) found.push(`${key} ${actual[key]} != ${expected[key]}`);
  }
  return found;
}

describe("against the dates Microsoft Project computed", () => {
  // Every sample is a plan Microsoft Project scheduled and saved with its results.
  // Reading the plan and scheduling it here has to give the same results.
  const samples = listSamples();
  let automatic = 0;
  let manual = 0;

  it.each(samples)("%s", (name) => {
    const xml = readSample(name);
    const project = readMspdi(xml).project;
    const expected = scheduleFromFile(xml);
    const actual = computeSchedule(project);
    const mismatches: string[] = [];
    for (const [id, want] of expected.tasks) {
      const got = actual.tasks.get(id);
      if (!got) continue;
      const isManual = project.tasks[got.index].mode === "manual";
      if (isManual) manual += 1;
      else automatic += 1;
      for (const difference of differences(got, want, isManual)) mismatches.push(`task ${id}: ${difference}`);
    }
    expect(mismatches).toEqual([]);
  });

  it("compared enough tasks to mean something", () => {
    expect(automatic).toBeGreaterThan(1000);
    expect(manual).toBeGreaterThan(500);
  });
});
