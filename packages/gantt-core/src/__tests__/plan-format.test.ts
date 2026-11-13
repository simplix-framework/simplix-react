import { describe, expect, it } from "vitest";

import { ScheduleError } from "../errors";
import { PLAN_FORMAT_VERSION, parseProject, serializeProject, toSavedPlan } from "../plan-format";
import { computeSchedule } from "../schedule";
import { link, project, span, task } from "./fixtures";

/** A plan as hosts stored it before the saved form carried a version: the project itself as JSON. */
const UNVERSIONED = `{"name":"test","scheduleFrom":"start","start":23558880,"calendarId":"standard","minutesPerDay":480,"minutesPerWeek":2400,"daysPerMonth":20,"defaultStartTime":480,"defaultFinishTime":1020,"criticalSlackLimit":0,"honorConstraints":true,"calendars":[{"id":"standard","name":"Standard","weekDays":[[],[{"from":480,"to":720},{"from":780,"to":1020}],[{"from":480,"to":720},{"from":780,"to":1020}],[{"from":480,"to":720},{"from":780,"to":1020}],[{"from":480,"to":720},{"from":780,"to":1020}],[{"from":480,"to":720},{"from":780,"to":1020}],[]]}],"tasks":[{"id":"a","name":"a","outlineLevel":1,"mode":"auto","duration":960,"durationUnit":"d","constraintType":"asap","type":"fixed-units","percentComplete":0,"priority":500},{"id":"b","name":"b","outlineLevel":1,"mode":"auto","duration":480,"durationUnit":"d","constraintType":"asap","type":"fixed-units","percentComplete":0,"priority":500}],"links":[{"id":"a>b","predecessorId":"a","successorId":"b","type":"FS","lag":0,"lagMode":"working","lagUnit":"d"}],"resources":[],"assignments":[],"baselines":{}}`;

describe("saved plans", () => {
  const plan = project([task("a", 2), task("b", 1)], [link("a", "b")]);

  it("writes the plan with the name and version of its form, and reads it back", () => {
    const text = serializeProject(plan);
    expect(JSON.parse(text)).toMatchObject({ format: "simplix-gantt", version: PLAN_FORMAT_VERSION });
    expect(parseProject(text)).toEqual(plan);
    expect(parseProject(toSavedPlan(plan))).toEqual(plan);
  });

  it("reads a plan stored before the form carried a version, and schedules it as before", () => {
    const stored = parseProject(UNVERSIONED);
    expect(stored.tasks.map((t) => t.id)).toEqual(["a", "b"]);
    const schedule = computeSchedule(stored);
    expect(span(schedule, "a")).toBe(span(computeSchedule(plan), "a"));
    expect(span(schedule, "b")).toBe(span(computeSchedule(plan), "b"));
  });

  it("refuses a plan saved by a later version, naming both versions", () => {
    const later = JSON.stringify({ ...toSavedPlan(plan), version: PLAN_FORMAT_VERSION + 1 });
    expect(() => parseProject(later)).toThrowError(new ScheduleError("unsupported-plan-version", `The plan was saved as version ${PLAN_FORMAT_VERSION + 1}; this package reads up to version ${PLAN_FORMAT_VERSION}`));
    expect(() => parseProject(later)).toThrowError(expect.objectContaining({ code: "unsupported-plan-version" }));
  });

  it.each([
    ["text that is not JSON", "{not json"],
    ["a list", "[]"],
    ["another kind of document", '{"format":"something-else","version":1,"project":{}}'],
    ["a version that is not a whole number", '{"format":"simplix-gantt","version":"1","project":{}}'],
    ["an envelope without a project", '{"format":"simplix-gantt","version":1}'],
    ["a project without its lists", '{"name":"x","start":0,"calendarId":"c","baselines":{}}'],
    ["a project without a start", '{"calendars":[],"tasks":[],"links":[],"resources":[],"assignments":[],"calendarId":"c","baselines":{}}'],
  ])("refuses %s", (_, stored) => {
    expect(() => parseProject(stored)).toThrowError(expect.objectContaining({ code: "invalid-plan" }));
  });
});
