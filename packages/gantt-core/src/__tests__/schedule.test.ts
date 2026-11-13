import { describe, expect, it } from "vitest";

import { ScheduleError } from "../errors";
import { computeSchedule } from "../schedule";
import { DAY, at, late, link, project, span, task } from "./fixtures";

describe("link types", () => {
  // Expected values are the ones Microsoft Project 2007 saved for the same plan
  // (task-links-project2007-mspdi.xml): start Friday 2014-10-17, eight pairs of one-day tasks.
  const pairs: [string, number, string, string, string, number][] = [
    // type, lag days, successor span, predecessor late, successor late, predecessor total slack (days)
    ["FS", 10, "11-03 08:00 > 11-03 17:00", "10-17 08:00 > 10-17 17:00", "11-03 08:00 > 11-03 17:00", 0],
    ["SF", 2, "10-20 08:00 > 10-20 17:00", "10-31 08:00 > 10-31 17:00", "11-03 08:00 > 11-03 17:00", 10],
    ["SS", 2, "10-21 08:00 > 10-21 17:00", "10-30 08:00 > 10-30 17:00", "11-03 08:00 > 11-03 17:00", 9],
    ["FF", 2, "10-21 08:00 > 10-21 17:00", "10-30 08:00 > 10-30 17:00", "11-03 08:00 > 11-03 17:00", 9],
  ];
  const tasks = pairs.flatMap(([type]) => [task(`${type}1`, 1), task(`${type}2`, 1)]);
  const links = pairs.map(([type, lag]) => link(`${type}1`, `${type}2`, type as "FS", lag));
  const schedule = computeSchedule(project(tasks, links));

  it.each(pairs)("%s with a %i day lag", (type, _lag, successorSpan, predecessorLate, successorLate, slackDays) => {
    expect(span(schedule, `${type}1`)).toBe("10-17 08:00 > 10-17 17:00");
    expect(span(schedule, `${type}2`)).toBe(successorSpan);
    expect(late(schedule, `${type}1`)).toBe(predecessorLate);
    expect(late(schedule, `${type}2`)).toBe(successorLate);
    expect(schedule.tasks.get(`${type}1`)?.totalSlack).toBe(slackDays * DAY);
    expect(schedule.tasks.get(`${type}1`)?.freeSlack).toBe(0);
    expect(schedule.tasks.get(`${type}1`)?.critical).toBe(slackDays === 0);
  });

  it("gives the last task of a chain free slack up to the project finish", () => {
    expect(schedule.tasks.get("SS2")?.freeSlack).toBe(9 * DAY);
    expect(schedule.finish).toBe(at("2014-11-03T17:00"));
  });
});

describe("constraints", () => {
  it("starts no earlier than the date", () => {
    const s = computeSchedule(
      project([task("a", 2, { constraintType: "start-no-earlier-than", constraintDate: at("2014-10-22T08:00") })]),
    );
    expect(span(s, "a")).toBe("10-22 08:00 > 10-23 17:00");
  });

  it("holds a must-start-on date against a link and reports the link", () => {
    const s = computeSchedule(
      project(
        [task("a", 3), task("b", 1, { constraintType: "must-start-on", constraintDate: at("2014-10-20T08:00") })],
        [link("a", "b")],
      ),
    );
    expect(span(s, "b")).toBe("10-20 08:00 > 10-20 17:00");
    expect(s.links.get("a>b")?.violated).toBe(true);
    expect(s.conflicts).toContainEqual({ kind: "link-violated", taskId: "b", linkId: "a>b" });
    expect(s.tasks.get("a")?.totalSlack).toBe(-2 * DAY);
  });

  it("lets the link win when constraints are not honoured", () => {
    const s = computeSchedule(
      project(
        [task("a", 3), task("b", 1, { constraintType: "must-start-on", constraintDate: at("2014-10-20T08:00") })],
        [link("a", "b")],
        { honorConstraints: false },
      ),
    );
    expect(span(s, "b")).toBe("10-22 08:00 > 10-22 17:00");
    expect(s.conflicts).toContainEqual({ kind: "constraint-violated", taskId: "b" });
  });

  it("places an as-late-as-possible task against its successor", () => {
    const s = computeSchedule(
      project([task("a", 1, { constraintType: "alap" }), task("b", 5), task("c", 1)], [link("a", "c"), link("b", "c")]),
    );
    expect(span(s, "a")).toBe("10-23 08:00 > 10-23 17:00");
    expect(span(s, "c")).toBe("10-24 08:00 > 10-24 17:00");
  });

  it("reports a missed deadline and turns the slack negative", () => {
    const s = computeSchedule(project([task("a", 3, { deadline: at("2014-10-20T17:00") })]));
    expect(s.conflicts).toContainEqual({ kind: "deadline-missed", taskId: "a" });
    expect(s.tasks.get("a")?.totalSlack).toBe(-DAY);
  });
});

describe("outline", () => {
  const tasks = [
    task("phase", 0),
    task("a", 2, { outlineLevel: 2, percentComplete: 50 }),
    task("b", 2, { outlineLevel: 2 }),
    task("after", 1),
  ];
  const s = computeSchedule(project(tasks, [link("a", "b"), link("phase", "after")]));

  it("rolls a summary task up from the tasks under it", () => {
    expect(span(s, "phase")).toBe("10-17 08:00 > 10-22 17:00");
    expect(s.tasks.get("phase")).toMatchObject({ summary: true, duration: 4 * DAY, percentComplete: 25, wbs: "1" });
    expect(s.tasks.get("b")).toMatchObject({ parentId: "phase", wbs: "1.2" });
  });

  it("schedules a successor of a summary task after its last task", () => {
    expect(span(s, "after")).toBe("10-23 08:00 > 10-23 17:00");
  });

  it("applies a link into a summary task to every task under it", () => {
    const linked = computeSchedule(project([task("first", 1), ...tasks.slice(0, 3)], [link("first", "phase")]));
    expect(span(linked, "a")).toBe("10-20 08:00 > 10-21 17:00");
    expect(span(linked, "b")).toBe("10-20 08:00 > 10-21 17:00");
  });

  it("rejects a link between a summary task and a task under it", () => {
    expect(() => computeSchedule(project(tasks, [link("phase", "a")]))).toThrowError(ScheduleError);
  });
});

describe("other inputs", () => {
  it("rejects a dependency cycle and names the tasks", () => {
    const run = (): unknown => computeSchedule(project([task("a", 1), task("b", 1)], [link("a", "b"), link("b", "a")]));
    expect(run).toThrowError(expect.objectContaining({ code: "cycle", ids: ["a", "b"] }));
  });

  it("keeps a manual task where it was typed and reports the link it breaks", () => {
    const s = computeSchedule(
      project(
        [task("a", 3), task("b", 1, { mode: "manual", manualStart: at("2014-10-17T08:00") })],
        [link("a", "b")],
      ),
    );
    expect(span(s, "b")).toBe("10-17 08:00 > 10-17 17:00");
    expect(s.links.get("a>b")?.violated).toBe(true);
  });

  it("counts an elapsed duration through the weekend", () => {
    const s = computeSchedule(project([task("a", 0, { duration: 3 * 1440, elapsed: true })]));
    expect(span(s, "a")).toBe("10-17 08:00 > 10-20 08:00");
  });

  it("puts a milestone at its predecessor's finish", () => {
    const s = computeSchedule(project([task("a", 1), task("m", 0)], [link("a", "m")]));
    expect(span(s, "m")).toBe("10-17 17:00 > 10-17 17:00");
    expect(s.tasks.get("m")?.milestone).toBe(true);
  });

  it("takes a lead as a negative lag", () => {
    const s = computeSchedule(project([task("a", 3), task("b", 1)], [link("a", "b", "FS", -1)]));
    expect(span(s, "b")).toBe("10-21 08:00 > 10-21 17:00");
  });

  it("leaves an inactive task out of the plan", () => {
    const s = computeSchedule(project([task("a", 5, { inactive: true }), task("b", 1)], [link("a", "b")]));
    expect(span(s, "b")).toBe("10-17 08:00 > 10-17 17:00");
    expect(s.finish).toBe(at("2014-10-17T17:00"));
  });

  it("schedules backward from a project finish", () => {
    const s = computeSchedule(
      project(
        [task("a", 2, { constraintType: "alap" }), task("b", 1, { constraintType: "alap" })],
        [link("a", "b")],
        { scheduleFrom: "finish", finish: at("2014-10-24T17:00") },
      ),
    );
    expect(span(s, "b")).toBe("10-24 08:00 > 10-24 17:00");
    expect(span(s, "a")).toBe("10-22 08:00 > 10-23 17:00");
    expect(s.start).toBe(at("2014-10-22T08:00"));
    expect(s.tasks.get("a")?.totalSlack).toBe(0);
  });
});

describe("every constraint type on an unlinked task", () => {
  const date = at("2014-10-22T08:00");
  const finishDate = at("2014-10-22T17:00");
  const early = at("2014-10-13T08:00");
  it.each([
    ["asap", undefined, "10-17 08:00 > 10-20 17:00"],
    ["alap", undefined, "10-17 08:00 > 10-20 17:00"],
    ["must-start-on", date, "10-22 08:00 > 10-23 17:00"],
    ["must-finish-on", finishDate, "10-21 08:00 > 10-22 17:00"],
    ["start-no-earlier-than", date, "10-22 08:00 > 10-23 17:00"],
    ["start-no-later-than", date, "10-17 08:00 > 10-20 17:00"],
    ["finish-no-earlier-than", finishDate, "10-21 08:00 > 10-22 17:00"],
    ["finish-no-later-than", finishDate, "10-17 08:00 > 10-20 17:00"],
  ] as const)("%s", (constraintType, constraintDate, expected) => {
    for (const honorConstraints of [true, false]) {
      const s = computeSchedule(project([task("a", 2, { constraintType, constraintDate })], [], { honorConstraints }));
      expect(span(s, "a")).toBe(expected);
      expect(s.conflicts).toEqual([]);
    }
  });

  it("lets a dated start go ahead of the project start, and nothing else", () => {
    const snet = computeSchedule(project([task("a", 1, { constraintType: "start-no-earlier-than", constraintDate: early })]));
    expect(span(snet, "a")).toBe("10-13 08:00 > 10-13 17:00");
    expect(snet.conflicts).toEqual([]);
    const fnet = computeSchedule(project([task("a", 1, { constraintType: "finish-no-earlier-than", constraintDate: early })]));
    expect(span(fnet, "a")).toBe("10-17 08:00 > 10-17 17:00");
    const manual = computeSchedule(project([task("a", 1, { mode: "manual", manualStart: early })]));
    expect(manual.conflicts).toEqual([{ kind: "before-project-start", taskId: "a" }]);
  });
});
