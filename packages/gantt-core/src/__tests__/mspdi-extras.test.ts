import { describe, expect, it } from "vitest";
import { mspdiExportLosses, readMspdi, writeMspdi } from "../mspdi";
import { parseMoney } from "../mspdi/extras";
import { childElement, childElements, childText, parseXml } from "../mspdi/xml";
import { computeSchedule } from "../schedule";
import type { Project } from "../types";
import { at, project, task } from "./fixtures";
import { readSample } from "./mspdi-oracle";

function roundTrip(plan: Project): Project {
  return readMspdi(writeMspdi(plan, computeSchedule(plan))).project;
}

/** A plan that uses every field a Microsoft Project XML document has a place for beyond the dates. */
function costedPlan(): Project {
  return project(
    [
      task("1", 2, { fixedCost: 12.5, actualCost: 300, custom: { note: "north wing", score: 7.25, review: at("2014-11-03T09:00"), signed: true } }),
      task("2", 1, { custom: { note: "<b> & co" } }),
    ],
    [],
    {
      currencyCode: "KRW",
      customFields: [
        { id: "note", name: "Site note", type: "text" },
        { id: "score", name: "Score", type: "number" },
        { id: "review", name: "Review date", type: "date" },
        { id: "signed", name: "Signed off", type: "flag" },
      ],
      resources: [
        { id: "1", name: "Engineer", type: "work", maxUnits: 1, standardRate: 85.5, overtimeRate: 120, costPerUse: 1.23, rates: [{ from: at("2015-01-01T00:00"), standardRate: 90 }] },
        { id: "2", name: "Cable", type: "material", maxUnits: 1, standardRate: 4 },
      ],
      assignments: [
        { id: "1", taskId: "1", resourceId: "1", units: 1, work: 960, overtimeWork: 120, contour: "back-loaded" },
        { id: "2", taskId: "2", resourceId: "1", units: 1, work: 480, contour: "bell" },
      ],
      baselines: { 0: { "1": { start: at("2014-10-17T08:00"), finish: at("2014-10-20T17:00"), duration: 960, cost: 1640.75 } } },
    },
  );
}

describe("writeMspdi and readMspdi: costs, rates and custom fields", () => {
  it("writes money in hundredths and rates as they are", () => {
    const plan = costedPlan();
    const root = parseXml(writeMspdi(plan, computeSchedule(plan)));
    const first = childElements(childElement(root, "Tasks")!, "Task")[1];
    expect(childText(first, "FixedCost")).toBe("1250");
    expect(childText(first, "ActualCost")).toBe("30000");
    expect(childText(childElement(first, "Baseline")!, "Cost")).toBe("164075");
    const engineer = childElements(childElement(root, "Resources")!, "Resource")[0];
    expect(childText(engineer, "StandardRate")).toBe("85.5");
    expect(childText(engineer, "StandardRateFormat")).toBe("2");
    expect(childText(engineer, "OvertimeRate")).toBe("120");
    expect(childText(engineer, "CostPerUse")).toBe("123");
    const cable = childElements(childElement(root, "Resources")!, "Resource")[1];
    expect(childText(cable, "StandardRateFormat")).toBe("8");
    expect(childText(root, "CurrencyCode")).toBe("KRW");
  });

  it("writes a resource's dated rates as its first rate table, end to end", () => {
    const plan = costedPlan();
    const root = parseXml(writeMspdi(plan, computeSchedule(plan)));
    const rates = childElements(childElement(childElements(childElement(root, "Resources")!, "Resource")[0], "Rates")!, "Rate");
    expect(rates.map((rate) => [childText(rate, "RatesFrom"), childText(rate, "RatesTo"), childText(rate, "StandardRate")])).toEqual([
      ["1984-01-01T00:00:00", "2015-01-01T00:00:00", "85.5"],
      ["2015-01-01T00:00:00", "2049-12-31T23:59:00", "90"],
    ]);
  });

  it("gives each custom field Microsoft Project's field of its type, with the field's name as the alias", () => {
    const plan = costedPlan();
    const root = parseXml(writeMspdi(plan, computeSchedule(plan)));
    const defined = childElements(childElement(root, "ExtendedAttributes")!, "ExtendedAttribute").map((el) => [childText(el, "FieldID"), childText(el, "FieldName"), childText(el, "Alias")]);
    expect(defined).toEqual([
      ["188743731", "Text1", "Site note"],
      ["188743767", "Number1", "Score"],
      ["188743945", "Date1", "Review date"],
      ["188743752", "Flag1", "Signed off"],
    ]);
    const first = childElements(childElement(root, "Tasks")!, "Task")[1];
    expect(childElements(first, "ExtendedAttribute").map((el) => childText(el, "Value"))).toEqual(["north wing", "7.25", "2014-11-03T09:00:00", "1"]);
  });

  it("keeps the order Microsoft Project's schema asks of the new elements", () => {
    const plan = costedPlan();
    const root = parseXml(writeMspdi(plan, computeSchedule(plan)));
    const names = (el: ReturnType<typeof parseXml>): string[] => el.children.map((child) => child.name);
    const ordered = (all: string[], wanted: string[]): string[] => all.filter((name, i) => wanted.includes(name) && all.indexOf(name) === i);
    const taskOrder = ["TotalSlack", "FixedCost", "PercentComplete", "ActualFinish", "ActualCost", "ConstraintType", "LevelingDelay", "Notes", "PredecessorLink", "ExtendedAttribute", "Baseline"];
    const first = childElements(childElement(root, "Tasks")!, "Task")[1];
    expect(ordered(names(first), taskOrder)).toEqual(taskOrder.filter((name) => names(first).includes(name)));
    const resourceOrder = ["MaxUnits", "StandardRate", "StandardRateFormat", "OvertimeRate", "OvertimeRateFormat", "CostPerUse", "CalendarUID", "IsCostResource", "Rates"];
    expect(ordered(names(childElements(childElement(root, "Resources")!, "Resource")[0]), resourceOrder)).toEqual(resourceOrder);
    const assignmentOrder = ["ResourceUID", "OvertimeWork", "Units", "Work", "WorkContour"];
    expect(ordered(names(childElements(childElement(root, "Assignments")!, "Assignment")[0]), assignmentOrder)).toEqual(assignmentOrder);
    const projectOrder = ["CriticalSlackLimit", "CurrencyCode", "CalendarUID", "StatusDate", "ExtendedAttributes", "Calendars", "Tasks"];
    expect(ordered(names(root), projectOrder)).toEqual(projectOrder.filter((name) => names(root).includes(name)));
  });

  it("reads back the plan it wrote", () => {
    const plan = costedPlan();
    const read = roundTrip(plan);
    expect(read.currencyCode).toBe("KRW");
    expect(read.resources).toEqual(plan.resources);
    expect(read.assignments).toEqual(plan.assignments);
    expect(read.baselines).toEqual(plan.baselines);
    expect(read.tasks.map((t) => [t.fixedCost, t.actualCost])).toEqual([[12.5, 300], [undefined, undefined]]);
    // The fields come back under Microsoft Project's names, with their own names and values.
    expect(read.customFields).toEqual([
      { id: "text1", name: "Site note", type: "text" },
      { id: "number1", name: "Score", type: "number" },
      { id: "date1", name: "Review date", type: "date" },
      { id: "flag1", name: "Signed off", type: "flag" },
    ]);
    expect(read.tasks[0].custom).toEqual({ text1: "north wing", number1: 7.25, date1: at("2014-11-03T09:00"), flag1: true });
    expect(read.tasks[1].custom).toEqual({ text1: "<b> & co" });
    expect(mspdiExportLosses(plan)).toEqual([]);
  });

  it("carries a leveling delay as the elapsed time before the start and reads it back", () => {
    // One working day of delay ahead of a Monday start spans the weekend: three elapsed days.
    const plan = project([task("1", 1, { levelingDelay: 480 })], [], { start: at("2014-10-17T08:00") });
    const schedule = computeSchedule(plan);
    expect(schedule.tasks.get("1")?.start).toBe(at("2014-10-20T08:00"));
    const first = childElements(childElement(parseXml(writeMspdi(plan, schedule)), "Tasks")!, "Task")[1];
    expect(childText(first, "LevelingDelay")).toBe(String(3 * 1440 * 10));
    expect(roundTrip(plan).tasks[0].levelingDelay).toBe(480);
  });

  it("reads an unknown way of spreading work as flat and says so", () => {
    const plan = costedPlan();
    const xml = writeMspdi(plan, computeSchedule(plan)).replace("<WorkContour>1</WorkContour>", "<WorkContour>4</WorkContour>");
    const { project: read, warnings } = readMspdi(xml);
    expect(read.assignments[0].contour).toBeUndefined();
    expect(warnings).toEqual([{ code: "work-contour-dropped", id: "1", message: expect.stringContaining("4") }]);
  });
});

describe("mspdiExportLosses", () => {
  it("names what the document has no place for", () => {
    const fields = Array.from({ length: 31 }, (_, i) => ({ id: `t${i + 1}`, name: `Text ${i + 1}`, type: "text" as const }));
    const plan = project(
      [
        task("1", 4, { splits: [{ offset: 480, gap: 480 }] }),
        task("2", 1, { color: "#2563eb" }),
        task("3", 1, { recurrence: { frequency: "weekly", interval: 1, weekdays: [1], from: at("2014-10-20T08:00"), count: 3, duration: 480, durationUnit: "d" } }),
      ],
      [],
      { customFields: fields },
    );
    expect(mspdiExportLosses(plan)).toEqual([
      { code: "splits", ids: ["1"] },
      { code: "color", ids: ["2"] },
      { code: "recurrence", ids: ["3"] },
      { code: "custom-fields", ids: ["t31"] },
    ]);
    const read = roundTrip(plan);
    expect(read.customFields).toHaveLength(30);
    expect(read.tasks[0].splits).toBeUndefined();
  });
});

describe("files saved by Microsoft Project", () => {
  // junit/GenerateTestData.bas typed these values into Microsoft Project before it saved the files.
  it("reads the custom text, number, date and flag values the macro entered", () => {
    const text = readMspdi(readSample("task-text/task-text-project2019-mspdi.xml")).project;
    expect(text.tasks[0].custom).toEqual({ text1: "1" });
    expect(text.tasks[29].custom).toEqual({ text30: "30" });
    const numbers = readMspdi(readSample("task-numbers/task-numbers-project2019-mspdi.xml")).project;
    expect(numbers.tasks.slice(0, 20).map((t) => Object.entries(t.custom ?? {})[0])).toEqual(Array.from({ length: 20 }, (_, i) => [`number${i + 1}`, i + 1]));
    const dates = readMspdi(readSample("task-dates/task-dates-project2019-mspdi.xml")).project;
    expect(dates.tasks[0].custom).toEqual({ date1: at("2014-01-01T09:00") });
    expect(dates.tasks[9].custom).toEqual({ date10: at("2014-01-10T18:00") });
    const flags = readMspdi(readSample("task-flags/task-flags-project2019-mspdi.xml")).project;
    expect(flags.tasks.slice(0, 20).map((t) => Object.keys(t.custom ?? {}).filter((key) => key.startsWith("flag")))).toEqual(Array.from({ length: 20 }, (_, i) => [`flag${i + 1}`]));
    expect(flags.customFields?.filter((field) => field.type === "flag")).toHaveLength(20);
  });

  it("reads the cost per use and the baseline costs the macro entered at their own scale", () => {
    const resources = readMspdi(readSample("resource-misc/resource-misc-project2019-mspdi.xml")).project.resources;
    expect(resources.slice(0, 2).map((r) => [r.name, r.costPerUse])).toEqual([["Resource 1", 1.23], ["Resource 2", 4.56]]);
    // The macro entered 1 as the first task's baseline cost, 2 as the second's first-baseline cost, and so on.
    const raw = childElements(childElement(parseXml(readSample("task-baselines/task-baselines-project2019-mspdi.xml")), "Tasks")!, "Task");
    const stored = raw.slice(1, 4).map((el) => parseMoney(childText(childElement(el, "Baseline")!, "Cost"), "Cost"));
    expect(stored).toEqual([1, 2, 3]);
  });
});
