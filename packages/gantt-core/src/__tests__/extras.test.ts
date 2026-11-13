import { describe, expect, it } from "vitest";

import { computeCosts } from "../costs";
import { addCustomField, addRecurringTask, clearSplits, recurrenceDays, removeCustomField, setCustomValue, splitTask } from "../edit-extras";
import { addResource, assignResource } from "../edit-links";
import { computeSchedule } from "../schedule";
import { formatLocalDate, formatLocalDateTime } from "../time";
import { DAY, at, link, project, span, task } from "./fixtures";

const day = (d: number): string => formatLocalDate(d * 1440);

describe("split tasks", () => {
  const base = project([task("a", 4), task("b", 1)], [link("a", "b")]);

  it("pauses the work, pushes the finish and the successor, and keeps the duration", () => {
    const split = splitTask(base, computeSchedule(base), "a", at("2014-10-21T08:00"), 2 * DAY);
    expect(split.tasks[0].splits).toEqual([{ offset: 2 * DAY, gap: 2 * DAY }]);
    const s = computeSchedule(split);
    expect(span(s, "a")).toBe("10-17 08:00 > 10-24 17:00");
    expect(s.tasks.get("a")?.duration).toBe(4 * DAY);
    expect(s.tasks.get("a")?.segments.map((x) => `${formatLocalDateTime(x.start).slice(5, 16)}>${formatLocalDateTime(x.finish).slice(5, 16)}`)).toEqual([
      "10-17T08:00>10-20T17:00",
      "10-23T08:00>10-24T17:00",
    ]);
    expect(span(s, "b")).toBe("10-27 08:00 > 10-27 17:00");
    expect(s.tasks.get("a")?.totalSlack).toBe(0);
    expect(span(computeSchedule(clearSplits(split, "a")), "a")).toBe("10-17 08:00 > 10-22 17:00");
  });

  it("splits a second time inside a later stretch", () => {
    const once = splitTask(base, computeSchedule(base), "a", at("2014-10-21T08:00"), DAY);
    const twice = splitTask(once, computeSchedule(once), "a", at("2014-10-23T08:00"), DAY);
    expect(twice.tasks[0].splits).toEqual([{ offset: 2 * DAY, gap: DAY }, { offset: 3 * DAY, gap: DAY }]);
    expect(computeSchedule(twice).tasks.get("a")?.segments).toHaveLength(3);
  });

  it("refuses a split outside the work, of a summary task or with no pause", () => {
    const s = computeSchedule(base);
    for (const run of [
      () => splitTask(base, s, "a", at("2014-10-17T08:00"), DAY),
      () => splitTask(base, s, "a", at("2014-11-01T08:00"), DAY),
      () => splitTask(base, s, "a", at("2014-10-21T08:00"), 0),
      () => splitTask(project([task("p", 0), task("c", 2, { outlineLevel: 2 })]), computeSchedule(project([task("p", 0), task("c", 2, { outlineLevel: 2 })])), "p", at("2014-10-20T08:00"), DAY),
    ]) {
      expect(run).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
    }
  });
});

describe("costs", () => {
  it("adds up rates, costs per use, fixed costs and the tasks under a summary", () => {
    let p = project([task("phase", 0, { fixedCost: 100 }), task("a", 2, { outlineLevel: 2, fixedCost: 50 }), task("b", 1, { outlineLevel: 2 }), task("off", 1, { outlineLevel: 2, inactive: true, fixedCost: 999 })]);
    p = addResource(p, { id: "dev", name: "dev", standardRate: 10, costPerUse: 5 });
    p = addResource(p, { id: "steel", name: "steel", type: "material", standardRate: 20 });
    p = assignResource(assignResource(assignResource(p, "a", "dev"), "b", "dev", 0.5), "b", "steel", 3);
    const costs = computeCosts(p);
    expect(costs.get("a")).toEqual({ work: 2 * DAY, cost: 50 + 16 * 10 + 5 });
    expect(costs.get("b")).toEqual({ work: DAY / 2, cost: 4 * 10 + 5 + 3 * 20 });
    expect(costs.get("phase")).toEqual({ work: 2.5 * DAY, cost: 100 + 215 + 105 });
  });
});

describe("custom fields", () => {
  it("adds a field, takes values of its kind and drops them with the field", () => {
    let p = addCustomField(project([task("a", 1)]), { name: "Owner", type: "text" });
    p = addCustomField(p, { name: "Risk", type: "number" });
    expect(p.customFields).toEqual([{ id: "1", name: "Owner", type: "text" }, { id: "2", name: "Risk", type: "number" }]);
    p = setCustomValue(setCustomValue(p, "a", "1", "Kim"), "a", "2", 3);
    expect(p.tasks[0].custom).toEqual({ "1": "Kim", "2": 3 });
    expect(() => setCustomValue(p, "a", "2", "high")).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
    expect(() => setCustomValue(p, "a", "9", 1)).toThrowError(expect.objectContaining({ code: "unknown-reference" }));
    expect(setCustomValue(p, "a", "1", undefined).tasks[0].custom).toEqual({ "2": 3 });
    const removed = removeCustomField(p, "2");
    expect(removed.customFields).toHaveLength(1);
    expect(removed.tasks[0].custom).toEqual({ "1": "Kim" });
  });
});

describe("recurring tasks", () => {
  const base = project([task("a", 1)]);
  const from = at("2014-10-17T00:00");

  it("finds the days of each kind of recurrence", () => {
    expect(recurrenceDays(base, { frequency: "daily", interval: 1, from, count: 3 }).map(day)).toEqual(["2014-10-17", "2014-10-20", "2014-10-21"]);
    expect(recurrenceDays(base, { frequency: "weekly", interval: 2, weekdays: [1, 3], from, until: at("2014-11-12T00:00") }).map(day)).toEqual([
      "2014-10-27", "2014-10-29", "2014-11-10", "2014-11-12",
    ]);
    expect(recurrenceDays(base, { frequency: "monthly", interval: 1, monthDay: 31, from, count: 3 }).map(day)).toEqual(["2014-10-31", "2014-12-31", "2015-01-31"]);
    for (const bad of [
      { frequency: "daily", interval: 0, from, count: 1 },
      { frequency: "daily", interval: 1, from },
      { frequency: "weekly", interval: 1, from, count: 1 },
      { frequency: "daily", interval: 1, from, count: 501 },
    ] as const) {
      expect(() => recurrenceDays(base, bad)).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
    }
  });

  it("adds a summary task with one task per occurrence, each on its day", () => {
    const p = addRecurringTask(base, { name: "Review", duration: 120, recurrence: { frequency: "weekly", interval: 1, weekdays: [5], from, count: 3 } });
    expect(p.tasks.map((t) => `${t.name}:${t.outlineLevel}`)).toEqual(["a:1", "Review:1", "Review 1:2", "Review 2:2", "Review 3:2"]);
    const s = computeSchedule(p);
    const occurrences = [...s.tasks.values()].filter((t) => t.parentId !== null).map((t) => formatLocalDateTime(t.start).slice(0, 16));
    expect(occurrences).toEqual(["2014-10-17T08:00", "2014-10-24T08:00", "2014-10-31T08:00"]);
    expect([...s.tasks.values()][1]).toMatchObject({ summary: true, start: at("2014-10-17T08:00"), finish: at("2014-10-31T10:00") });
  });
});
