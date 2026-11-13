import { describe, expect, it } from "vitest";

import { setBaseline } from "../baseline";
import { computeCosts } from "../costs";
import { diffProjects } from "../diff";
import { addLink, addResource, assignResource, updateAssignment } from "../edit-links";
import { indentTasks } from "../edit-outline";
import { removeTasks, setPercentComplete, setTaskDuration, updateTask } from "../edit-tasks";
import { computeEarnedValue, rescheduleUncompletedWork } from "../progress";
import { resourceUsage } from "../resources";
import { computeSchedule } from "../schedule";
import { dayIndexOf } from "../time";
import { DAY, at, link, project, span, task } from "./fixtures";

describe("rescheduling to the status date", () => {
  const status = at("2014-10-22T08:00");

  it("moves a task that has not started, pauses one in progress and leaves a finished one", () => {
    let p = project([task("done", 1), task("running", 4), task("waiting", 1), task("later", 1, { constraintType: "start-no-earlier-than", constraintDate: at("2014-10-27T08:00") })], [], { statusDate: status });
    let s = computeSchedule(p);
    p = setPercentComplete(setPercentComplete(p, s, "done", 100), s, "running", 50);
    s = computeSchedule(p);
    const next = rescheduleUncompletedWork(p, s);
    const r = computeSchedule(next);
    expect(span(r, "done")).toBe("10-17 08:00 > 10-17 17:00");
    // Two days done by Monday evening; the rest resumes on the status date.
    expect(next.tasks[1].splits).toEqual([{ offset: 2 * DAY, gap: DAY }]);
    expect(span(r, "running")).toBe("10-17 08:00 > 10-23 17:00");
    expect(span(r, "waiting")).toBe("10-22 08:00 > 10-22 17:00");
    expect(span(r, "later")).toBe("10-27 08:00 > 10-27 17:00");
    expect(rescheduleUncompletedWork(next, r)).toBe(next);
    expect(() => rescheduleUncompletedWork({ ...p, statusDate: undefined }, s)).toThrowError(expect.objectContaining({ code: "invalid-date" }));
  });
});

describe("earned value", () => {
  it("measures planned, earned and actual cost against the baseline", () => {
    let p = project([task("phase", 0), task("a", 4, { outlineLevel: 2 }), task("b", 2, { outlineLevel: 2 })], [link("a", "b")], { statusDate: at("2014-10-20T17:00") });
    p = addResource(p, { id: "dev", name: "dev", standardRate: 100 });
    p = assignResource(assignResource(p, "a", "dev"), "b", "dev");
    p = setBaseline(p, computeSchedule(p));
    expect(p.baselines[0].a.cost).toBe(3200);
    p = updateTask(setPercentComplete(p, computeSchedule(p), "a", 25), "a", { actualCost: 1000 });
    const ev = computeEarnedValue(p, computeSchedule(p));
    // Half of a's four baseline days lie before the status date; a quarter of it is done.
    expect(ev.get("a")).toEqual({ budget: 3200, plannedValue: 1600, earnedValue: 800, actualCost: 1000, scheduleVariance: -800, costVariance: -200, schedulePerformance: 0.5, costPerformance: 0.8 });
    expect(ev.get("b")).toMatchObject({ budget: 1600, plannedValue: 0, earnedValue: 0, schedulePerformance: null, costPerformance: null });
    expect(ev.get("phase")).toMatchObject({ budget: 4800, plannedValue: 1600, earnedValue: 800, actualCost: 1000 });
    expect(ev.get("")).toEqual(ev.get("phase"));
  });
});

describe("resource rates, overtime and contours", () => {
  it("costs a task at the rate in effect when it starts, and overtime at its own rate", () => {
    let p = project([task("a", 1), task("b", 1)], [link("a", "b")]);
    p = addResource(p, { id: "dev", name: "dev", standardRate: 10, overtimeRate: 15, rates: [{ from: at("2014-10-20T00:00"), standardRate: 20 }] });
    p = assignResource(assignResource(p, "a", "dev"), "b", "dev");
    const s = computeSchedule(p);
    expect(computeCosts(p, s).get("a")?.cost).toBe(80);
    expect(computeCosts(p, s).get("b")?.cost).toBe(160);
    expect(computeCosts(p).get("b")?.cost).toBe(80);
    // Two of a's eight hours as overtime: six hours of duration, and the two cost more.
    const overtime = updateAssignment(p, p.assignments[0].id, { overtimeWork: 120 });
    expect(overtime.tasks[0].duration).toBe(360);
    expect(computeCosts(overtime, computeSchedule(overtime)).get("a")?.cost).toBe(60 + 30);
    expect(() => updateAssignment(p, p.assignments[0].id, { overtimeWork: 999 })).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
  });

  it("weights the daily work of an assignment by its contour", () => {
    let p = project([task("a", 4)]);
    p = addResource(p, { id: "dev", name: "dev" });
    p = assignResource(p, "a", "dev");
    const usage = (contour: "flat" | "front-loaded" | "back-loaded" | "bell"): number[] => {
      const shaped = updateAssignment(p, p.assignments[0].id, { contour });
      return resourceUsage(shaped, computeSchedule(shaped), dayIndexOf(at("2014-10-17")), dayIndexOf(at("2014-10-22"))).get("dev")!.work.map((m) => Math.round(m));
    };
    expect(usage("flat")).toEqual([480, 0, 0, 480, 480, 480]);
    const front = usage("front-loaded");
    expect(front[0]).toBeGreaterThan(front[3]);
    expect(front[3]).toBeGreaterThan(front[5]);
    expect(usage("back-loaded")[5]).toBeGreaterThan(usage("back-loaded")[0]);
    const bell = usage("bell");
    expect(bell[3]).toBeGreaterThan(bell[0]);
    expect(bell[4]).toBeGreaterThan(bell[5]);
  });
});

describe("changes between two versions", () => {
  const base = project([task("a", 1), task("b", 1), task("c", 1)], [link("a", "b")]);

  it("lists added, updated and removed records and nothing that stayed", () => {
    expect(diffProjects(base, base)).toEqual([]);
    const longer = setTaskDuration(base, "b", 3 * DAY);
    expect(diffProjects(base, longer)).toEqual([{ entity: "task", kind: "updated", id: "b", value: longer.tasks[1] }]);
    const linked = addLink(base, { predecessorId: "b", successorId: "c" });
    expect(diffProjects(base, linked)).toEqual([{ entity: "link", kind: "added", id: "1", value: linked.links[1] }]);
    expect(diffProjects(base, removeTasks(base, ["a"]))).toEqual([
      { entity: "task", kind: "removed", id: "a" },
      { entity: "task-order", kind: "updated", order: ["b", "c"] },
      { entity: "link", kind: "removed", id: "a>b" },
    ]);
  });

  it("reports an outline change as the task and settings, calendars and baselines by what differs", () => {
    const indented = indentTasks(base, ["c"]);
    expect(diffProjects(base, indented)).toEqual([{ entity: "task", kind: "updated", id: "c", value: indented.tasks[2] }]);
    const renamed = { ...base, name: "next", statusDate: 5 };
    expect(diffProjects(base, renamed)).toEqual([{ entity: "project", kind: "updated", value: { name: "next", statusDate: 5 } }]);
    const saved = setBaseline(base, computeSchedule(base), 2);
    expect(diffProjects(base, saved)).toEqual([{ entity: "baseline", kind: "updated", number: 2, value: saved.baselines[2] }]);
    expect(diffProjects(saved, base)).toEqual([{ entity: "baseline", kind: "updated", number: 2, value: undefined }]);
  });
});
