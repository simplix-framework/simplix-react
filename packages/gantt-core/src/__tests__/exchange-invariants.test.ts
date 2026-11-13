import { describe, expect, it } from "vitest";

import { computeCosts } from "../costs";
import { mspdiExportLosses, readMspdi, writeMspdi } from "../mspdi";
import { computeSchedule } from "../schedule";
import type { CustomValue, Project, WorkContour } from "../types";
import { generator, randomProject } from "./random-plans";

const CONTOURS: WorkContour[] = ["flat", "back-loaded", "front-loaded", "bell"];

/** A random plan with resources, rates, costs, assignments and a custom field of every type. */
function costedPlan(seed: number): Project {
  const random = generator(seed * 7 + 3);
  const base = randomProject(seed);
  // Amounts in hundredths, as money is entered.
  const money = (): number => random(500000) / 100;
  const resources = Array.from({ length: 1 + random(4) }, (_, i) => ({
    id: `r${i}`,
    name: `Resource ${i}`,
    type: random(5) === 0 ? ("material" as const) : ("work" as const),
    maxUnits: 1 + random(3),
    ...(random(4) > 0 ? { standardRate: money() } : {}),
    ...(random(3) === 0 ? { overtimeRate: money() } : {}),
    ...(random(3) === 0 ? { costPerUse: money() } : {}),
    ...(random(4) === 0 ? { rates: [{ from: base.start + (1 + random(30)) * 1440, standardRate: money() }] } : {}),
  }));
  const isSummary = (i: number): boolean => i + 1 < base.tasks.length && base.tasks[i + 1].outlineLevel > base.tasks[i].outlineLevel;
  const assignments = base.tasks.flatMap((task, i) => {
    if (isSummary(i) || random(2) === 0) return [];
    const work = task.duration;
    const overtimeWork = work > 0 && random(4) === 0 ? Math.min(work, 60) : 0;
    const contour = CONTOURS[random(4)];
    return [{ id: `a${i}`, taskId: task.id, resourceId: `r${random(resources.length)}`, units: 1, work, ...(overtimeWork > 0 ? { overtimeWork } : {}), ...(contour !== "flat" ? { contour } : {}) }];
  });
  const tasks = base.tasks.map((task) => {
    const custom: Record<string, CustomValue> = {
      ...(random(3) === 0 ? { note: `note ${random(1000)} <&>` } : {}),
      ...(random(3) === 0 ? { score: random(100000) / 1000 } : {}),
      ...(random(3) === 0 ? { review: base.start + random(60) * 1440 + random(24) * 60 } : {}),
      ...(random(3) === 0 ? { signed: true } : {}),
    };
    return {
      ...task,
      ...(random(4) === 0 ? { fixedCost: money() } : {}),
      ...(random(6) === 0 ? { actualCost: money() } : {}),
      ...(Object.keys(custom).length > 0 ? { custom } : {}),
    };
  });
  return {
    ...base,
    tasks,
    resources,
    assignments,
    currencyCode: "KRW",
    customFields: [
      { id: "note", name: "Note", type: "text" },
      { id: "score", name: "Score", type: "number" },
      { id: "review", name: "Review", type: "date" },
      { id: "signed", name: "Signed", type: "flag" },
    ],
  };
}

/** The ids Microsoft Project XML gives the plan's custom fields. */
const FIELD_IDS: Record<string, string> = { note: "text1", score: "number1", review: "date1", signed: "flag1" };

describe("random plans through Microsoft Project XML", () => {
  it("come back with the same dates, costs, resources, assignments and custom values", () => {
    let values = 0;
    for (const seed of Array.from({ length: 120 }, (_, i) => i + 1)) {
      const plan = costedPlan(seed);
      const schedule = computeSchedule(plan);
      expect(mspdiExportLosses(plan), `seed ${seed}`).toEqual([]);
      const { project: read, warnings } = readMspdi(writeMspdi(plan, schedule));
      expect(warnings, `seed ${seed}`).toEqual([]);
      const again = computeSchedule(read);
      const costs = computeCosts(plan, schedule);
      const costsAgain = computeCosts(read, again);
      for (const task of plan.tasks) {
        const where = `seed ${seed}, task ${task.id}`;
        expect([again.tasks.get(task.id)?.start, again.tasks.get(task.id)?.finish], where).toEqual([schedule.tasks.get(task.id)?.start, schedule.tasks.get(task.id)?.finish]);
        expect(costsAgain.get(task.id), where).toEqual(costs.get(task.id));
        const back = read.tasks.find((t) => t.id === task.id);
        expect([back?.fixedCost, back?.actualCost], where).toEqual([task.fixedCost, task.actualCost]);
        const expected = Object.fromEntries(Object.entries(task.custom ?? {}).map(([id, value]) => [FIELD_IDS[id], value]));
        expect(back?.custom ?? {}, where).toEqual(expected);
        values += Object.keys(expected).length;
      }
      expect(read.resources, `seed ${seed}`).toEqual(plan.resources);
      expect(read.assignments, `seed ${seed}`).toEqual(plan.assignments);
      expect(read.currencyCode).toBe("KRW");
    }
    // The plans do carry custom values often enough for the check to mean something.
    expect(values).toBeGreaterThan(500);
  });
});
