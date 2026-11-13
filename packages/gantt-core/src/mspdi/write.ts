import { ScheduleError } from "../errors";
import { formatClockTime, formatLocalDateTime, type Minutes } from "../time";
import type { BaselineEntry, Id, Link, Project, Schedule, Task, TaskSchedule } from "../types";
import {
  encodeConstraintType,
  encodeDurationFormat,
  encodeLinkType,
  encodeResourceType,
  encodeTaskType,
  formatFlag,
  formatMspdiDuration,
  formatNumber,
  MSPDI_NAMESPACE,
  PERCENT_LAG_FORMAT,
} from "./codes";
import { compileCalendars, type WorkingTime } from "../calendar";
import { assignFieldSlots, encodeWorkContour, formatMoney, writeFieldDefinitions, writeFieldValues, writeRateTable, writeResourceRates, type FieldSlot } from "./extras";
import { writeCalendar } from "./write-calendar";
import { XmlWriter } from "./xml";

/** Elapsed days, the LevelingDelayFormat Microsoft Project writes by default. */
const LEVELING_DELAY_FORMAT = "8";
/** Project DurationFormat written to every file: days. Each task states its own format. */
const PROJECT_DURATION_FORMAT = "7";

function date(t: Minutes | undefined): string | undefined {
  return t === undefined ? undefined : formatLocalDateTime(t);
}

/** Slack as Microsoft Project stores it, tenths of a minute. */
function tenths(minutes: number): string {
  return formatNumber(Math.round(minutes * 10));
}

function writeLink(w: XmlWriter, link: Link): void {
  const percent = link.lagMode === "percent";
  w.start("PredecessorLink")
    .leaf("PredecessorUID", link.predecessorId)
    .leaf("Type", String(encodeLinkType(link.type)))
    .leaf("CrossProject", "0")
    .leaf("LinkLag", percent ? formatNumber(Math.round(link.lag)) : tenths(link.lag))
    .leaf(
      "LagFormat",
      String(percent ? PERCENT_LAG_FORMAT : encodeDurationFormat(link.lagUnit, link.lagMode === "elapsed")),
    )
    .end();
}

function writeBaselines(w: XmlWriter, entries: readonly [number, BaselineEntry][]): void {
  for (const [number, entry] of entries) {
    w.start("Baseline")
      .leaf("Number", String(number))
      .leaf("Start", date(entry.start))
      .leaf("Finish", date(entry.finish))
      .leaf("Duration", formatMspdiDuration(entry.duration))
      .leaf("Cost", entry.cost === undefined ? undefined : formatMoney(entry.cost))
      .end();
  }
}

function writeTask(
  w: XmlWriter,
  task: Task,
  s: TaskSchedule,
  links: readonly Link[],
  baselines: readonly [number, BaselineEntry][],
  slots: readonly FieldSlot[],
  time: WorkingTime | undefined,
): void {
  const manual = task.mode === "manual";
  const hasConstraintDate = task.constraintType !== "asap" && task.constraintType !== "alap";
  w.start("Task")
    .leaf("UID", task.id)
    .leaf("ID", String(s.index + 1))
    .leaf("Name", task.name)
    .leaf("Active", formatFlag(!task.inactive))
    .leaf("Manual", formatFlag(manual))
    .leaf("Type", String(encodeTaskType(task.type)))
    .leaf("IsNull", "0")
    .leaf("WBS", s.wbs)
    .leaf("OutlineNumber", s.wbs)
    .leaf("OutlineLevel", String(task.outlineLevel))
    .leaf("Priority", formatNumber(task.priority))
    .leaf("Start", date(s.start))
    .leaf("Finish", date(s.finish))
    .leaf("Duration", formatMspdiDuration(task.duration))
    .leaf("ManualStart", manual ? date(task.manualStart) : undefined)
    .leaf("ManualFinish", manual ? date(task.manualFinish) : undefined)
    .leaf("DurationFormat", String(encodeDurationFormat(task.durationUnit, task.elapsed, task.estimated)))
    .leaf("EffortDriven", formatFlag(task.effortDriven))
    .leaf("Estimated", formatFlag(task.estimated))
    .leaf("Milestone", formatFlag(s.milestone))
    .leaf("Summary", formatFlag(s.summary))
    .leaf("Critical", formatFlag(s.critical))
    .leaf("EarlyStart", date(s.earlyStart))
    .leaf("EarlyFinish", date(s.earlyFinish))
    .leaf("LateStart", date(s.lateStart))
    .leaf("LateFinish", date(s.lateFinish))
    .leaf("FreeSlack", tenths(s.freeSlack))
    .leaf("TotalSlack", tenths(s.totalSlack))
    .leaf("FixedCost", task.fixedCost === undefined ? undefined : formatMoney(task.fixedCost))
    .leaf("PercentComplete", formatNumber(task.percentComplete))
    .leaf("ActualStart", date(task.actualStart))
    .leaf("ActualFinish", date(task.actualFinish))
    .leaf("ActualCost", task.actualCost === undefined ? undefined : formatMoney(task.actualCost))
    .leaf("ConstraintType", String(encodeConstraintType(task.constraintType)))
    .leaf("CalendarUID", task.calendarId ?? "-1")
    .leaf("ConstraintDate", hasConstraintDate ? date(task.constraintDate) : undefined)
    .leaf("Deadline", date(task.deadline))
    .leaf("LevelingDelay", tenths(elapsedLevelingDelay(task, s, time)))
    .leaf("LevelingDelayFormat", LEVELING_DELAY_FORMAT)
    .leaf("IgnoreResourceCalendar", formatFlag(task.ignoreResourceCalendar))
    .leaf("Notes", task.notes);
  for (const link of links) {
    writeLink(w, link);
  }
  writeFieldValues(w, slots, task.custom);
  writeBaselines(w, baselines);
  w.end();
}

/**
 * A task's leveling delay as Microsoft Project stores it: the elapsed minutes
 * from where the task would start without the delay to where it starts.
 */
function elapsedLevelingDelay(task: Task, s: TaskSchedule, time: WorkingTime | undefined): number {
  if (!task.levelingDelay || !time) return 0;
  return Math.max(0, s.start - time.subtract(s.start, task.levelingDelay));
}

function writeProjectSummary(w: XmlWriter, project: Project, schedule: Schedule): void {
  w.start("Task")
    .leaf("UID", "0")
    .leaf("ID", "0")
    .leaf("Name", project.name)
    .leaf("Active", "1")
    .leaf("Manual", "0")
    .leaf("Type", "1")
    .leaf("IsNull", "0")
    .leaf("WBS", "0")
    .leaf("OutlineNumber", "0")
    .leaf("OutlineLevel", "0")
    .leaf("Priority", "500")
    .leaf("Start", date(schedule.start))
    .leaf("Finish", date(schedule.finish))
    .leaf("Summary", "1")
    .leaf("ConstraintType", "0")
    .leaf("CalendarUID", "-1")
    .end();
}

/**
 * Writes a project and its computed schedule as a Microsoft Project XML
 * (MSPDI) document. Elements follow the order of the MSPDI schema. The
 * computed dates, slack, flags and outline numbers come from `schedule`;
 * everything else comes from `project`. `mspdiExportLosses` lists what of a
 * plan the document has no place for. Raises
 * `ScheduleError("unknown-reference")` when `schedule` lacks a task.
 */
export function writeMspdi(project: Project, schedule: Schedule): string {
  const w = new XmlWriter();
  w.start("Project", { xmlns: MSPDI_NAMESPACE })
    .leaf("Name", project.name)
    .leaf("Title", project.name)
    .leaf("ScheduleFromStart", formatFlag(project.scheduleFrom === "start"))
    .leaf("StartDate", date(project.start))
    .leaf("FinishDate", date(project.scheduleFrom === "finish" ? (project.finish ?? schedule.finish) : schedule.finish))
    .leaf("CriticalSlackLimit", formatNumber(project.criticalSlackLimit / project.minutesPerDay))
    .leaf("CurrencyCode", project.currencyCode)
    .leaf("CalendarUID", project.calendarId)
    .leaf("DefaultStartTime", formatClockTime(project.defaultStartTime))
    .leaf("DefaultFinishTime", formatClockTime(project.defaultFinishTime))
    .leaf("MinutesPerDay", formatNumber(project.minutesPerDay))
    .leaf("MinutesPerWeek", formatNumber(project.minutesPerWeek))
    .leaf("DaysPerMonth", formatNumber(project.daysPerMonth))
    .leaf("DurationFormat", PROJECT_DURATION_FORMAT)
    .leaf("HonorConstraints", formatFlag(project.honorConstraints))
    .leaf("StatusDate", date(project.statusDate));

  const { slots } = assignFieldSlots(project.customFields ?? []);
  writeFieldDefinitions(w, slots);
  // Working time is needed only to write a leveling delay, so the calendars are compiled when a task has one.
  const calendars = project.tasks.some((task) => task.levelingDelay) ? compileCalendars(project.calendars) : undefined;

  w.start("Calendars");
  for (const calendar of project.calendars) {
    writeCalendar(w, calendar);
  }
  w.end();

  const linksBySuccessor = new Map<Id, Link[]>();
  for (const link of project.links) {
    const list = linksBySuccessor.get(link.successorId) ?? [];
    list.push(link);
    linksBySuccessor.set(link.successorId, list);
  }
  const baselineNumbers = Object.keys(project.baselines)
    .map(Number)
    .sort((a, b) => a - b);

  w.start("Tasks");
  writeProjectSummary(w, project, schedule);
  for (const task of project.tasks) {
    const s = schedule.tasks.get(task.id);
    if (!s) {
      throw new ScheduleError("unknown-reference", `Schedule has no entry for task ${task.id}`, [task.id]);
    }
    const entries: [number, BaselineEntry][] = [];
    for (const number of baselineNumbers) {
      const entry = project.baselines[number]?.[task.id];
      if (entry) {
        entries.push([number, entry]);
      }
    }
    writeTask(w, task, s, linksBySuccessor.get(task.id) ?? [], entries, slots, calendars?.get(task.calendarId ?? project.calendarId));
  }
  w.end();

  w.start("Resources");
  project.resources.forEach((r, i) => {
    const code = encodeResourceType(r.type);
    w.start("Resource")
      .leaf("UID", r.id)
      .leaf("ID", String(i + 1))
      .leaf("Name", r.name)
      .leaf("Type", String(code.type))
      .leaf("IsNull", "0")
      .leaf("Initials", r.initials)
      .leaf("Group", r.group)
      .leaf("MaxUnits", formatNumber(r.maxUnits));
    writeResourceRates(w, r);
    w.leaf("CalendarUID", r.calendarId ?? "-1").leaf("IsCostResource", formatFlag(code.isCostResource));
    writeRateTable(w, r);
    w.end();
  });
  w.end();

  w.start("Assignments");
  for (const a of project.assignments) {
    w.start("Assignment")
      .leaf("UID", a.id)
      .leaf("TaskUID", a.taskId)
      .leaf("ResourceUID", a.resourceId)
      .leaf("OvertimeWork", a.overtimeWork ? formatMspdiDuration(a.overtimeWork) : undefined)
      .leaf("Units", formatNumber(a.units))
      .leaf("Work", formatMspdiDuration(a.work))
      .leaf("WorkContour", a.contour === undefined ? undefined : String(encodeWorkContour(a.contour)))
      .end();
  }
  w.end();

  w.end();
  return w.toString();
}
