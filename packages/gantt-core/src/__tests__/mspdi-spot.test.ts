import { describe, expect, it } from "vitest";
import { readMspdi, writeMspdi } from "../mspdi";
import { childElement, childElements, parseXml, type XmlElement } from "../mspdi/xml";
import { parseLocalDateTime } from "../time";
import { listSamples, readSample } from "./mspdi-oracle";

const t = parseLocalDateTime;

function sample(file: string) {
  return readMspdi(readSample(file));
}

describe("values read from sample files", () => {
  it("reads link types and lags (task-links 2019)", () => {
    const { links } = sample("task-links/task-links-project2019-mspdi.xml").project;
    const byId = new Map(links.map((l) => [l.id, l]));
    expect(byId.get("1-2")).toEqual({ id: "1-2", predecessorId: "1", successorId: "2", type: "FS", lag: 0, lagMode: "working", lagUnit: "d" });
    expect(byId.get("3-4")).toMatchObject({ type: "FS", lag: 480, lagMode: "working", lagUnit: "d" });
    expect(byId.get("7-8")).toMatchObject({ type: "FS", lag: 2400, lagUnit: "w" });
    expect(byId.get("9-10")).toMatchObject({ lag: 4800, lagUnit: "w" });
    expect(byId.get("11-12")).toMatchObject({ type: "SF", lag: 960 });
    expect(byId.get("13-14")).toMatchObject({ type: "SS", lag: 960 });
    expect(byId.get("15-16")).toMatchObject({ type: "FF", lag: 960 });
    expect(links).toHaveLength(8);
  });

  it("reads a manual task with an estimated duration (task-links 2019)", () => {
    const task = sample("task-links/task-links-project2019-mspdi.xml").project.tasks[0];
    expect(task).toMatchObject({
      id: "1",
      name: "Task 1",
      mode: "manual",
      manualStart: t("2018-10-18T08:00:00"),
      manualFinish: t("2018-10-18T17:00:00"),
      duration: 480,
      durationUnit: "d",
      estimated: true,
      outlineLevel: 1,
      priority: 500,
    });
  });

  it("reads start-no-earlier-than constraints (task-links 2010)", () => {
    const tasks = sample("task-links/task-links-project2010-mspdi.xml").project.tasks;
    expect(tasks.find((x) => x.id === "2")).toMatchObject({
      mode: "auto",
      constraintType: "start-no-earlier-than",
      constraintDate: t("2014-10-20T08:00:00"),
    });
    expect(tasks.find((x) => x.id === "2")?.manualStart).toBeUndefined();
  });

  it("reads project settings and the standard calendar (task-links 2019)", () => {
    const p = sample("task-links/task-links-project2019-mspdi.xml").project;
    expect(p).toMatchObject({
      name: "task-links-project2019-mspdi.xml",
      scheduleFrom: "start",
      start: t("2018-10-18T08:00:00"),
      calendarId: "1",
      minutesPerDay: 480,
      minutesPerWeek: 2400,
      daysPerMonth: 20,
      defaultStartTime: 480,
      defaultFinishTime: 1020,
      criticalSlackLimit: 0,
      honorConstraints: false,
    });
    expect(p.finish).toBeUndefined();
    const workday = [{ from: 480, to: 720 }, { from: 780, to: 1020 }];
    expect(p.calendars[0]).toEqual({
      id: "1",
      name: "Standard",
      weekDays: [[], workday, workday, workday, workday, workday, []],
    });
  });

  it("reads derived resource calendars (calendar-calendars 2016)", () => {
    const cals = sample("calendar-calendars/calendar-calendars-project2016-mspdi.xml").project.calendars;
    expect(cals.find((c) => c.name === "Resource One")).toEqual({
      id: "5",
      name: "Resource One",
      baseCalendarId: "1",
      weekDays: [null, null, null, null, null, null, null],
    });
    expect(cals.find((c) => c.id === "3")?.baseCalendarId).toBeUndefined();
  });

  it("reads recurring exceptions with their working times (calendar-recurring-exceptions 2016)", () => {
    const cal = sample("calendar-recurring-exceptions/calendar-recurring-exceptions-project2016-mspdi.xml").project.calendars[0];
    const day = Math.floor(t("2010-01-02") / 1440);
    expect(cal?.exceptions?.find((e) => e.fromDay === day)).toEqual({
      name: "Recurring Working",
      fromDay: day,
      toDay: day,
      ranges: [{ from: 540, to: 780 }, { from: 840, to: 1020 }],
    });
    const daily = cal?.exceptions?.find((e) => e.name === "Daily 1");
    expect(daily).toEqual({ name: "Daily 1", fromDay: Math.floor(t("2000-01-01") / 1440), toDay: Math.floor(t("2000-01-03") / 1440), ranges: [] });
  });

  it("reads resource types and drops the unnamed UID 0 resource (resource-type 2016)", () => {
    const resources = sample("resource-type/resource-type-project2016-mspdi.xml").project.resources;
    expect(resources.map((r) => [r.id, r.type])).toEqual([
      ["1", "cost"], ["2", "cost"], ["3", "cost"], ["4", "cost"], ["5", "cost"],
      ["6", "material"], ["7", "material"], ["8", "material"], ["9", "material"], ["10", "material"],
      ["11", "work"], ["12", "work"], ["13", "work"], ["14", "work"], ["15", "work"],
    ]);
    expect(resources.find((r) => r.id === "11")?.maxUnits).toBe(1);
  });

  it("reads assignments and skips the unassigned placeholder (assignment-assignments 2016)", () => {
    const { assignments } = sample("assignment-assignments/assignment-assignments-project2016-mspdi.xml").project;
    expect(assignments).toEqual([
      { id: "4", taskId: "1", resourceId: "1", units: 1, work: 4800 },
      { id: "5", taskId: "2", resourceId: "2", units: 1, work: 4800 },
      { id: "6", taskId: "3", resourceId: "3", units: 1, work: 4800 },
    ]);
  });

  it("skips single-field baselines with a warning naming the number (task-baselines 2016)", () => {
    const { project, warnings } = sample("task-baselines/task-baselines-project2016-mspdi.xml");
    expect(project.baselines).toEqual({});
    const messages = warnings.filter((w) => w.code === "baseline-incomplete");
    expect(messages.find((w) => w.id === "12")?.message).toContain("baseline 0 has no start, finish");
    expect(messages.find((w) => w.id === "44")?.message).toContain("baseline 10 has no finish, duration");
  });

  it("warns once about timephased data (assignment-assignments)", () => {
    const files = listSamples().filter((f) => f.startsWith("assignment-assignments/"));
    const counts = files.map((f) => sample(f).warnings.filter((w) => w.code === "timephased-data-dropped").length);
    expect(Math.max(...counts)).toBe(1);
  });
});

/** A minimal MSPDI document around the given task and calendar markup. */
function doc(tasks: string, extra = "", calendars = ""): string {
  return `<?xml version="1.0"?><Project xmlns="http://schemas.microsoft.com/project">
<ScheduleFromStart>1</ScheduleFromStart><StartDate>2024-01-01T08:00:00</StartDate><CalendarUID>1</CalendarUID>${extra}
<Calendars><Calendar><UID>1</UID><Name>Standard</Name><IsBaseCalendar>1</IsBaseCalendar><BaseCalendarUID>-1</BaseCalendarUID>${calendars}</Calendar></Calendars>
<Tasks>${tasks}</Tasks></Project>`;
}

function task(uid: string, body: string): string {
  return `<Task><UID>${uid}</UID><Name>T${uid}</Name><OutlineLevel>1</OutlineLevel>${body}</Task>`;
}

describe("fields no sample file holds (inline fixtures)", () => {
  it("reads an elapsed duration as clock minutes", () => {
    const { tasks } = readMspdi(doc(task("1", "<Duration>PT48H0M0S</Duration><DurationFormat>8</DurationFormat>"))).project;
    expect(tasks[0]).toMatchObject({ duration: 2880, durationUnit: "d", elapsed: true });
    expect(tasks[0]?.estimated).toBeUndefined();
  });

  it.each([
    [0, "asap"], [1, "alap"], [2, "must-start-on"], [3, "must-finish-on"],
    [4, "start-no-earlier-than"], [5, "start-no-later-than"], [6, "finish-no-earlier-than"], [7, "finish-no-later-than"],
  ] as const)("reads ConstraintType %i as %s", (code, type) => {
    const body = `<ConstraintType>${code}</ConstraintType><ConstraintDate>2024-02-01T08:00:00</ConstraintDate>`;
    const read = readMspdi(doc(task("1", body))).project.tasks[0];
    expect(read?.constraintType).toBe(type);
    expect(read?.constraintDate).toBe(code < 2 ? undefined : t("2024-02-01T08:00:00"));
  });

  it("reads percent, elapsed and lead lags", () => {
    const link = (pred: string, lag: number, format: number) =>
      `<PredecessorLink><PredecessorUID>${pred}</PredecessorUID><Type>1</Type><LinkLag>${lag}</LinkLag><LagFormat>${format}</LagFormat></PredecessorLink>`;
    const xml = doc(task("1", "") + task("2", link("1", 50, 19)) + task("3", link("1", 25, 52)) + task("4", link("1", 14400, 8)) + task("5", link("1", -4800, 7)));
    const links = readMspdi(xml).project.links;
    expect(links.map((l) => [l.lagMode, l.lag, l.lagUnit])).toEqual([
      ["percent", 50, "d"],
      ["percent", 25, "d"],
      ["elapsed", 1440, "d"],
      ["working", -480, "d"],
    ]);
  });

  it("reads a leveling delay as the working minutes of its elapsed span before the start", () => {
    // 24 elapsed hours before Tuesday 08:00 hold one working day of the standard calendar.
    const body = "<Start>2024-01-02T08:00:00</Start><LevelingDelay>14400</LevelingDelay><LevelingDelayFormat>8</LevelingDelayFormat>";
    const week = `<WeekDays>${[2, 3, 4, 5, 6].map((day) => `<WeekDay><DayType>${day}</DayType><DayWorking>1</DayWorking><WorkingTimes><WorkingTime><FromTime>08:00:00</FromTime><ToTime>12:00:00</ToTime></WorkingTime><WorkingTime><FromTime>13:00:00</FromTime><ToTime>17:00:00</ToTime></WorkingTime></WorkingTimes></WeekDay>`).join("")}</WeekDays>`;
    const { project, warnings } = readMspdi(doc(task("1", body), "", week));
    expect(project.tasks[0]?.levelingDelay).toBe(480);
    expect(warnings).toEqual([]);
  });

  it("reads deadline, actuals, notes, inactive, calendar and milestone flags", () => {
    const body = `<Active>0</Active><Duration>PT8H0M0S</Duration><Milestone>1</Milestone><Deadline>2024-03-01T17:00:00</Deadline>
<ActualStart>2024-01-01T08:00:00</ActualStart><ActualFinish>2024-01-01T17:00:00</ActualFinish><PercentComplete>100</PercentComplete>
<CalendarUID>1</CalendarUID><IgnoreResourceCalendar>1</IgnoreResourceCalendar><EffortDriven>1</EffortDriven><Type>2</Type><Priority>1000</Priority><Notes>a &lt;b&gt;\nc</Notes>`;
    const zero = "<Duration>PT0H0M0S</Duration><Milestone>1</Milestone><CalendarUID>-1</CalendarUID>";
    const [a, b] = readMspdi(doc(task("1", body) + task("2", zero))).project.tasks;
    expect(a).toMatchObject({
      inactive: true, milestone: true, deadline: t("2024-03-01T17:00:00"), actualStart: t("2024-01-01T08:00:00"),
      actualFinish: t("2024-01-01T17:00:00"), percentComplete: 100, calendarId: "1", ignoreResourceCalendar: true,
      effortDriven: true, type: "fixed-work", priority: 1000, notes: "a <b>\nc",
    });
    expect(b?.milestone).toBeUndefined();
    expect(b?.calendarId).toBeUndefined();
  });

  it("maps complete baselines by number", () => {
    const body = `<Baseline><Number>0</Number><Start>2024-01-01T08:00:00</Start><Finish>2024-01-02T17:00:00</Finish><Duration>PT16H0M0S</Duration></Baseline>
<Baseline><Number>3</Number><Start>2024-01-03T08:00:00</Start></Baseline><Baseline><Number>3</Number><Finish>2024-01-03T17:00:00</Finish><Duration>PT8H0M0S</Duration></Baseline>`;
    const { baselines } = readMspdi(doc(task("1", body))).project;
    expect(baselines).toEqual({
      0: { "1": { start: t("2024-01-01T08:00:00"), finish: t("2024-01-02T17:00:00"), duration: 960 } },
      3: { "1": { start: t("2024-01-03T08:00:00"), finish: t("2024-01-03T17:00:00"), duration: 480 } },
    });
  });

  it("reads a working time ending at midnight as 1440 and writes it as 00:00:00", () => {
    const cal = `<WeekDays><WeekDay><DayType>2</DayType><DayWorking>1</DayWorking><WorkingTimes><WorkingTime><FromTime>16:00:00</FromTime><ToTime>00:00:00</ToTime></WorkingTime></WorkingTimes></WeekDay></WeekDays>`;
    const project = readMspdi(doc("", "", cal)).project;
    expect(project.calendars[0]?.weekDays[1]).toEqual([{ from: 960, to: 1440 }]);
    const written = writeMspdi(project, { start: project.start, finish: project.start, tasks: new Map(), links: new Map(), conflicts: [] });
    expect(written).toContain("<ToTime>00:00:00</ToTime>");
  });

  it("reads project settings scheduled from the finish", () => {
    const extra = `<FinishDate>2024-06-28T17:00:00</FinishDate><CriticalSlackLimit>2</CriticalSlackLimit><MinutesPerDay>420</MinutesPerDay><StatusDate>2024-02-01T17:00:00</StatusDate><HonorConstraints>1</HonorConstraints><Title>Plan</Title>`;
    const p = readMspdi(doc("", extra).replace("<ScheduleFromStart>1", "<ScheduleFromStart>0")).project;
    expect(p).toMatchObject({ name: "Plan", scheduleFrom: "finish", finish: t("2024-06-28T17:00:00"), criticalSlackLimit: 840, statusDate: t("2024-02-01T17:00:00"), honorConstraints: true });
  });

  it("skips an unverified recurrence with a warning naming the calendar", () => {
    const cal = `<Exceptions><Exception><EnteredByOccurrences>1</EnteredByOccurrences><TimePeriod><FromDate>2024-01-01T00:00:00</FromDate><ToDate>2024-03-31T23:59:00</ToDate></TimePeriod>
<Occurrences>3</Occurrences><Name>Weekday</Name><Type>5</Type><Period>1</Period><MonthItem>1</MonthItem><MonthPosition>0</MonthPosition><DayWorking>0</DayWorking></Exception></Exceptions>`;
    const { project, warnings } = readMspdi(doc("", "", cal));
    expect(project.calendars[0]?.exceptions).toBeUndefined();
    expect(warnings).toEqual([{ code: "recurrence-skipped", id: "1", message: expect.stringContaining("Calendar 1") }]);
  });

  it("skips a link to a task outside the file", () => {
    const xml = doc(task("2", "<PredecessorLink><PredecessorUID>9</PredecessorUID><Type>1</Type></PredecessorLink>"));
    const { project, warnings } = readMspdi(xml);
    expect(project.links).toEqual([]);
    expect(warnings[0]).toMatchObject({ code: "link-skipped", id: "9-2" });
  });
});

/** Task element order of files Microsoft Project saved, with the schema's place for fields no sample holds. */
const TASK_ORDER = [
  "UID", "ID", "Name", "Active", "Manual", "Type", "IsNull", "WBS", "OutlineNumber", "OutlineLevel", "Priority",
  "Start", "Finish", "Duration", "ManualStart", "ManualFinish", "DurationFormat", "EffortDriven", "Estimated",
  "Milestone", "Summary", "Critical", "EarlyStart", "EarlyFinish", "LateStart", "LateFinish", "FreeSlack", "TotalSlack",
  "PercentComplete", "ActualStart", "ActualFinish", "ConstraintType", "CalendarUID", "ConstraintDate", "Deadline",
  "LevelingDelay", "LevelingDelayFormat", "IgnoreResourceCalendar", "Notes", "PredecessorLink", "Baseline",
];

function namesInOrder(el: XmlElement, order: readonly string[]): void {
  const positions = el.children.map((c) => order.indexOf(c.name));
  expect(positions).not.toContain(-1);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
}

describe("writer", () => {
  it("writes the computed values from the schedule and keeps the schema order", () => {
    const xml = doc(task("1", "<Duration>PT8H0M0S</Duration><Notes>n</Notes><Deadline>2024-03-01T17:00:00</Deadline>"));
    const { project } = readMspdi(xml);
    const written = writeMspdi(project, {
      start: t("2024-01-01T08:00:00"),
      finish: t("2024-01-01T17:00:00"),
      tasks: new Map([["1", {
        id: "1", index: 0, parentId: null, wbs: "1", summary: false, milestone: false,
        start: t("2024-01-01T08:00:00"), finish: t("2024-01-01T17:00:00"), duration: 480,
        segments: [{ start: t("2024-01-01T08:00:00"), finish: t("2024-01-01T17:00:00") }],
        earlyStart: t("2024-01-01T08:00:00"), earlyFinish: t("2024-01-01T17:00:00"),
        lateStart: t("2024-01-02T08:00:00"), lateFinish: t("2024-01-02T17:00:00"),
        totalSlack: 480, freeSlack: 240, critical: false, percentComplete: 0, calendarId: "1",
      }]]),
      links: new Map(),
      conflicts: [],
    });
    const root = parseXml(written);
    const tasks = childElements(childElement(root, "Tasks") ?? root, "Task");
    expect(tasks.map((x) => childElement(x, "UID")?.text)).toEqual(["0", "1"]);
    const row = tasks[1] as XmlElement;
    namesInOrder(row, TASK_ORDER);
    const text = (name: string) => childElement(row, name)?.text;
    expect([text("TotalSlack"), text("FreeSlack"), text("LateStart"), text("WBS"), text("ID")]).toEqual(["4800", "2400", "2024-01-02T08:00:00", "1", "1"]);
    expect(childElement(tasks[0] as XmlElement, "Finish")?.text).toBe("2024-01-01T17:00:00");
  });

  it("writes percent and elapsed lags in the stored scale", () => {
    const link = (pred: string, lag: number, format: number) =>
      `<PredecessorLink><PredecessorUID>${pred}</PredecessorUID><Type>1</Type><LinkLag>${lag}</LinkLag><LagFormat>${format}</LagFormat></PredecessorLink>`;
    const { project } = readMspdi(doc(task("1", "") + task("2", link("1", 50, 19)) + task("3", link("1", 14400, 8))));
    const entry = (id: string, index: number) => ({
      id, index, parentId: null, wbs: String(index + 1), summary: false, milestone: false, start: 0, finish: 0, segments: [{ start: 0, finish: 0 }], duration: 0,
      earlyStart: 0, earlyFinish: 0, lateStart: 0, lateFinish: 0, totalSlack: 0, freeSlack: 0, critical: false, percentComplete: 0, calendarId: "1",
    });
    const written = writeMspdi(project, { start: 0, finish: 0, tasks: new Map(["1", "2", "3"].map((id, i) => [id, entry(id, i)])), links: new Map(), conflicts: [] });
    expect(written).toMatch(/<LinkLag>50<\/LinkLag>\s*<LagFormat>19<\/LagFormat>/);
    expect(written).toMatch(/<LinkLag>14400<\/LinkLag>\s*<LagFormat>8<\/LagFormat>/);
  });

  it("round-trips work weeks and overlapping dated exceptions", () => {
    const day = (from: string, to: string) => `<TimePeriod><FromDate>${from}T00:00:00</FromDate><ToDate>${to}T23:59:00</ToDate></TimePeriod>`;
    const cal = `<WeekDays><WeekDay><DayType>1</DayType><DayWorking>0</DayWorking></WeekDay></WeekDays>
<Exceptions><Exception>${day("2024-05-06", "2024-05-08")}<Name>B</Name><Type>1</Type><DayWorking>0</DayWorking></Exception>
<Exception>${day("2024-05-01", "2024-05-01")}<Name>A</Name><Type>1</Type><DayWorking>1</DayWorking><WorkingTimes><WorkingTime><FromTime>09:00:00</FromTime><ToTime>12:00:00</ToTime></WorkingTime></WorkingTimes></Exception></Exceptions>
<WorkWeeks><WorkWeek>${day("2024-07-01", "2024-08-31")}<Name>Summer</Name><WeekDays><WeekDay><DayType>6</DayType><DayWorking>1</DayWorking><WorkingTimes><WorkingTime><FromTime>08:00:00</FromTime><ToTime>12:00:00</ToTime></WorkingTime></WorkingTimes></WeekDay></WeekDays></WorkWeek></WorkWeeks>`;
    const first = readMspdi(doc("", "", cal)).project;
    expect(first.calendars[0]?.exceptions?.map((e) => e.name)).toEqual(["A", "B"]);
    expect(first.calendars[0]?.workWeeks?.[0]?.weekDays[5]).toEqual([{ from: 480, to: 720 }]);
    const written = writeMspdi(first, { start: first.start, finish: first.start, tasks: new Map(), links: new Map(), conflicts: [] });
    expect(readMspdi(written).project).toEqual(first);
  });

  it("raises when the schedule lacks a task", () => {
    const { project } = readMspdi(doc(task("1", "")));
    expect(() => writeMspdi(project, { start: 0, finish: 0, tasks: new Map(), links: new Map(), conflicts: [] })).toThrow(
      expect.objectContaining({ code: "unknown-reference" }),
    );
  });
});
