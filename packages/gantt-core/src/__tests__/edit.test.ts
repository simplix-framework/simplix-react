import { describe, expect, it } from "vitest";

import { baselineVariance, clearBaseline, setBaseline } from "../baseline";
import { addLink, addResource, assignResource, removeAssignments, removeCalendar, updateAssignment } from "../edit-links";
import { copyTasks, indentTasks, moveTask, outdentTasks, pasteTasks } from "../edit-outline";
import {
  createTask,
  insertTask,
  removeTasks,
  setPercentComplete,
  setTaskDuration,
  setTaskFinish,
  setTaskStart,
  setTaskStartKeepingFinish,
} from "../edit-tasks";
import { formatWorkingRanges, parseWorkingRanges, updateProject } from "../edit-project";
import { commit, createHistory, redo, undo, undoLabel } from "../history";
import { findOverallocations, resourceUsage } from "../resources";
import { clearLeveling, levelResources } from "../leveling";
import { computeSchedule } from "../schedule";
import { dayIndexOf } from "../time";
import type { Project } from "../types";
import { DAY, at, link, project, span, task } from "./fixtures";

const levels = (p: Project): string => p.tasks.map((t) => `${t.id}:${t.outlineLevel}`).join(" ");

describe("rows", () => {
  const base = project([task("a", 1), task("b", 1), task("c", 1), task("d", 1)], [link("a", "b"), link("b", "c")]);

  it("indents under the row above and drops the link that would become a cycle", () => {
    const next = indentTasks(base, ["b", "c"]);
    expect(levels(next)).toBe("a:1 b:2 c:2 d:1");
    expect(next.links.map((l) => l.id)).toEqual(["b>c"]);
    expect(() => computeSchedule(next)).not.toThrow();
    expect(indentTasks(base, ["a"])).toEqual(base);
  });

  it("outdents with the rows under it and adopts the rows that followed", () => {
    const nested = project([task("a", 1), task("b", 1, { outlineLevel: 2 }), task("c", 1, { outlineLevel: 3 }), task("d", 1, { outlineLevel: 2 })]);
    expect(levels(outdentTasks(nested, ["b"]))).toBe("a:1 b:1 c:2 d:2");
  });

  it("moves a row with the rows under it", () => {
    const nested = project([task("a", 1), task("b", 1, { outlineLevel: 2 }), task("c", 1), task("d", 1)]);
    expect(levels(moveTask(nested, "a", 4))).toBe("c:1 d:1 a:1 b:2");
    expect(levels(moveTask(nested, "d", 1, 2))).toBe("a:1 d:2 b:2 c:1");
    expect(levels(moveTask(nested, "c", 0))).toBe("c:1 a:1 b:2 d:1");
    expect(() => moveTask(nested, "a", 1)).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
  });

  it("removes a row with everything that names it", () => {
    const withBaseline = setBaseline(base, computeSchedule(base));
    const next = removeTasks(withBaseline, ["b"]);
    expect(next.tasks.map((t) => t.id)).toEqual(["a", "c", "d"]);
    expect(next.links).toEqual([]);
    expect(Object.keys(next.baselines[0])).toEqual(["a", "c", "d"]);
  });

  it("inserts a new row no deeper than the row above allows", () => {
    const next = insertTask(base, createTask(base, { id: "n", outlineLevel: 5 }), 1);
    expect(levels(next)).toBe("a:1 n:2 b:1 c:1 d:1");
    expect(() => insertTask(base, createTask(base, { id: "a" }))).toThrowError(expect.objectContaining({ code: "duplicate-id" }));
  });

  it("pastes copies with new ids, their inner links and no progress", () => {
    const source = project([task("a", 1, { percentComplete: 50, actualStart: at("2014-10-17T08:00") }), task("b", 1, { outlineLevel: 2 }), task("c", 1)], [link("a", "c"), link("b", "c")]);
    const clip = copyTasks(source, ["a", "b", "c"]);
    let n = 0;
    const next = pasteTasks(source, clip, 3, (kind) => `${kind}-${++n}`);
    expect(levels(next)).toBe("a:1 b:2 c:1 task-1:1 task-2:2 task-3:1");
    expect(next.links.slice(2).map((l) => `${l.predecessorId}>${l.successorId}`)).toEqual(["task-1>task-3", "task-2>task-3"]);
    expect(next.tasks[3]).toMatchObject({ percentComplete: 0 });
    expect(next.tasks[3].actualStart).toBeUndefined();
  });
});

describe("dates", () => {
  const base = project([task("a", 2), task("b", 1)], [link("a", "b")]);

  it("moves an automatic task with a start-no-earlier-than constraint", () => {
    const next = setTaskStart(base, "a", at("2014-10-21T08:00"));
    expect(next.tasks[0]).toMatchObject({ constraintType: "start-no-earlier-than" });
    const s = computeSchedule(next);
    expect(span(s, "a")).toBe("10-21 08:00 > 10-22 17:00");
    expect(span(s, "b")).toBe("10-23 08:00 > 10-23 17:00");
  });

  it("resizes from either end", () => {
    const s = computeSchedule(base);
    const longer = setTaskFinish(base, s, "a", at("2014-10-22T17:00"));
    expect(longer.tasks[0].duration).toBe(4 * DAY);
    const shorter = setTaskStartKeepingFinish(base, s, "a", at("2014-10-20T08:00"));
    expect(shorter.tasks[0].duration).toBe(DAY);
    expect(span(computeSchedule(shorter), "a")).toBe("10-20 08:00 > 10-20 17:00");
    expect(() => setTaskFinish(base, s, "a", at("2014-10-16T17:00"))).toThrowError(expect.objectContaining({ code: "invalid-date" }));
    expect(() => setTaskStartKeepingFinish(base, s, "a", at("2014-10-21T08:00"))).toThrowError(
      expect.objectContaining({ code: "invalid-date" }),
    );
  });

  it("pins a started task and frees it again at zero", () => {
    const s = computeSchedule(base);
    const started = setPercentComplete(base, s, "b", 50);
    expect(started.tasks[1].actualStart).toBe(at("2014-10-21T08:00"));
    const delayed = computeSchedule(setTaskDuration(started, "a", 5 * DAY));
    expect(span(delayed, "b")).toBe("10-21 08:00 > 10-21 17:00");
    expect(delayed.links.get("a>b")?.violated).toBe(true);
    const done = setPercentComplete(started, s, "b", 100);
    expect(computeSchedule(done).tasks.get("b")?.critical).toBe(false);
    expect(setPercentComplete(done, s, "b", 0).tasks[1].actualStart).toBeUndefined();
  });

  it("moves and stretches a finished task by its actual dates", () => {
    const done = setPercentComplete(base, computeSchedule(base), "a", 100);
    const longer = computeSchedule(setTaskDuration(done, "a", 4 * DAY));
    expect(span(longer, "a")).toBe("10-17 08:00 > 10-22 17:00");
    expect(span(longer, "b")).toBe("10-23 08:00 > 10-23 17:00");
    const moved = computeSchedule(setTaskStart(done, "a", at("2014-10-20T08:00")));
    expect(span(moved, "a")).toBe("10-20 08:00 > 10-21 17:00");
  });

  it("saves a baseline and measures the slip against it", () => {
    const saved = setBaseline(base, computeSchedule(base));
    const slipped = setTaskDuration(saved, "a", 4 * DAY);
    const variance = baselineVariance(slipped, computeSchedule(slipped));
    expect(variance.get("a")).toEqual({ start: 0, finish: 2 * DAY, duration: 2 * DAY });
    expect(variance.get("b")).toEqual({ start: 2 * DAY, finish: 2 * DAY, duration: 0 });
    expect(clearBaseline(saved).baselines).toEqual({});
    expect(() => setBaseline(base, computeSchedule(base), 11)).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
  });
});

describe("links", () => {
  const base = project([task("a", 1), task("b", 1, { outlineLevel: 2 }), task("c", 1)]);

  it("refuses a duplicate, a loop and a link inside a summary task", () => {
    const linked = addLink(base, { predecessorId: "b", successorId: "c" });
    expect(linked.links[0]).toMatchObject({ type: "FS", lag: 0, id: "1" });
    expect(() => addLink(linked, { predecessorId: "c", successorId: "b" })).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
    expect(() => addLink(base, { predecessorId: "a", successorId: "b" })).toThrowError(expect.objectContaining({ code: "invalid-operation" }));
    expect(() => addLink(linked, { predecessorId: "c", successorId: "a" })).toThrowError(expect.objectContaining({ code: "cycle" }));
  });
});

describe("resources", () => {
  const staffed = (patch = {}): Project => {
    let p = project([task("a", 4, patch), task("b", 2)]);
    p = addResource(p, { id: "r1", name: "Kim" });
    p = addResource(p, { id: "r2", name: "Lee" });
    return assignResource(p, "a", "r1");
  };

  it("shares the work of an effort-driven task and shortens it", () => {
    const p = assignResource(staffed({ effortDriven: true }), "a", "r2");
    expect(p.tasks[0].duration).toBe(2 * DAY);
    expect(p.assignments.map((a) => a.work)).toEqual([2 * DAY, 2 * DAY]);
    const back = removeAssignments(p, [p.assignments[1].id]);
    expect(back.tasks[0].duration).toBe(4 * DAY);
  });

  it("adds work when the task is not effort-driven", () => {
    const p = assignResource(staffed(), "a", "r2", 0.5);
    expect(p.tasks[0].duration).toBe(4 * DAY);
    expect(p.assignments.map((a) => a.work)).toEqual([4 * DAY, 2 * DAY]);
  });

  it("settles units, work and duration by the task type", () => {
    const fixedUnits = staffed();
    expect(updateAssignment(fixedUnits, fixedUnits.assignments[0].id, { work: 2 * DAY }).tasks[0].duration).toBe(2 * DAY);
    expect(updateAssignment(fixedUnits, fixedUnits.assignments[0].id, { units: 0.5 }).assignments[0].work).toBe(2 * DAY);
    const fixedDuration = staffed({ type: "fixed-duration" });
    const halved = updateAssignment(fixedDuration, fixedDuration.assignments[0].id, { work: 2 * DAY });
    expect(halved.tasks[0].duration).toBe(4 * DAY);
    expect(halved.assignments[0].units).toBe(0.5);
    const fixedWork = staffed({ type: "fixed-work" });
    expect(updateAssignment(fixedWork, fixedWork.assignments[0].id, { units: 2 }).tasks[0].duration).toBe(2 * DAY);
    expect(setTaskDuration(fixedWork, "a", 8 * DAY).assignments[0].units).toBe(0.5);
  });

  it("finds an overallocation, reports daily usage and levels it away", () => {
    const p = assignResource(staffed(), "b", "r1");
    const s = computeSchedule(p);
    expect(findOverallocations(p, s)).toEqual([
      { resourceId: "r1", from: at("2014-10-17T08:00"), to: at("2014-10-20T17:00"), units: 2, taskIds: ["a", "b"] },
    ]);
    const usage = resourceUsage(p, s, dayIndexOf(at("2014-10-17")), dayIndexOf(at("2014-10-22"))).get("r1");
    expect(usage?.work).toEqual([960, 0, 0, 960, 480, 480]);
    expect(usage?.capacity).toEqual([480, 0, 0, 480, 480, 480]);

    const leveled = levelResources(p);
    expect(leveled.unresolved).toEqual([]);
    const after = computeSchedule(leveled.project);
    expect(findOverallocations(leveled.project, after)).toEqual([]);
    expect(span(after, "a")).toBe("10-17 08:00 > 10-22 17:00");
    expect(span(after, "b")).toBe("10-23 08:00 > 10-24 17:00");
    expect(clearLeveling(leveled.project)).toEqual(p);
  });

  it("leaves an overallocation it may not resolve", () => {
    let p = assignResource(staffed({ priority: 1000 }), "b", "r1");
    p = { ...p, tasks: p.tasks.map((t) => ({ ...t, priority: 1000 })) };
    expect(levelResources(p).unresolved).toHaveLength(1);
  });

  it("schedules a task on its resource's calendar", () => {
    let p = staffed();
    p = { ...p, calendars: [...p.calendars, { id: "sat", name: "Sat", baseCalendarId: "standard", weekDays: [null, null, null, null, null, null, [{ from: 480, to: 960 }]] }] };
    p = { ...p, resources: p.resources.map((r) => (r.id === "r1" ? { ...r, calendarId: "sat" } : r)) };
    expect(span(computeSchedule(p), "a")).toBe("10-17 08:00 > 10-21 17:00");
    expect(() => removeCalendar(p, "sat")).toThrowError(expect.objectContaining({ code: "invalid-operation", ids: ["r1"] }));
  });
});

describe("history", () => {
  it("undoes and redoes whole states and drops the redo branch on a new change", () => {
    let h = createHistory(1, 2);
    h = commit(h, 2, "two");
    h = commit(h, 3, "three");
    h = commit(h, 3, "same");
    h = commit(h, 4, "four");
    expect(h.past.map((e) => e.state)).toEqual([2, 3]);
    expect(undoLabel(h)).toBe("four");
    h = undo(undo(h));
    expect(h.present).toBe(2);
    expect(undo(h)).toBe(h);
    h = redo(h);
    expect(h.present).toBe(3);
    h = commit(h, 9, "nine");
    expect(redo(h)).toBe(h);
  });
});

describe("project settings", () => {
  it("changes plan-level settings and refuses ones that cannot be scheduled", () => {
    const base = project([task("a", 1)]);
    const next = updateProject(base, { name: "renamed", statusDate: at("2014-10-20T17:00") });
    expect(next).toMatchObject({ name: "renamed", statusDate: at("2014-10-20T17:00") });
    expect(next.tasks).toBe(base.tasks);
    expect(() => updateProject(base, { calendarId: "missing" })).toThrowError(expect.objectContaining({ code: "unknown-reference" }));
    expect(() => updateProject(base, { scheduleFrom: "finish" })).toThrowError(expect.objectContaining({ code: "invalid-date" }));
  });

  it("round-trips working time text", () => {
    const ranges = parseWorkingRanges("08:00-12:00, 13:00 ~ 17:00");
    expect(ranges).toEqual([{ from: 480, to: 720 }, { from: 780, to: 1020 }]);
    expect(formatWorkingRanges(ranges)).toBe("08:00-12:00, 13:00-17:00");
    expect(parseWorkingRanges("")).toEqual([]);
    expect(parseWorkingRanges("22:00-00:00")).toEqual([{ from: 1320, to: 1440 }]);
    expect(formatWorkingRanges([{ from: 1320, to: 1440 }])).toBe("22:00-24:00");
    for (const text of ["8-12", "12:00-08:00", "08:00-12:00, 11:00-13:00"]) {
      expect(() => parseWorkingRanges(text)).toThrowError(expect.objectContaining({ code: "invalid-calendar" }));
    }
  });
});
