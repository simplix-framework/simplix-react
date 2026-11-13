import { ScheduleError } from "../errors";
import { parseClockTime, parseLocalDateTime } from "../time";
import type { Assignment, Baseline, BaselineEntry, DurationUnit, Id, Link, Project, Resource, Task } from "../types";
import { decodeDurationFormat, decodeResourceType, parseFlag, parseMspdiDuration, parseNumber } from "./codes";
import { readCalendar } from "./read-calendar";
import { isProjectSummary, readLinks, readTask, readTaskBaselines, uidOf, type TaskReadContext } from "./read-task";
import type { MspdiReadResult, MspdiWarning } from "./warnings";
import { childElement, childElements, childText, parseXml, type XmlElement } from "./xml";

function text(el: XmlElement, name: string): string | undefined {
  const value = childText(el, name);
  return value === undefined || value.trim() === "" ? undefined : value.trim();
}

function num(el: XmlElement, name: string, fallback: number): number {
  const value = text(el, name);
  return value === undefined ? fallback : parseNumber(value, name);
}

function hasTimephasedData(el: XmlElement): boolean {
  return el.children.some((c) => c.name === "TimephasedData" || hasTimephasedData(c));
}

function readResource(el: XmlElement, warnings: MspdiWarning[]): Resource {
  const id = uidOf(el);
  const typeCode = num(el, "Type", 1);
  const isCost = parseFlag(text(el, "IsCostResource") ?? "0", "IsCostResource");
  const type = decodeResourceType(typeCode, isCost);
  if (type === undefined) {
    warnings.push({ code: "unknown-code", id, message: `Resource ${id}: Type ${typeCode} is read as work` });
  }
  const calendarId = text(el, "CalendarUID");
  const initials = text(el, "Initials");
  const group = text(el, "Group");
  return {
    id,
    name: childText(el, "Name") ?? "",
    type: type ?? "work",
    maxUnits: num(el, "MaxUnits", 1),
    ...(calendarId !== undefined && calendarId !== "-1" ? { calendarId } : {}),
    ...(initials !== undefined ? { initials } : {}),
    ...(group !== undefined ? { group } : {}),
  };
}

/** The placeholder resource Microsoft Project keeps at UID 0 with no name. */
function isPlaceholderResource(el: XmlElement): boolean {
  const uid = uidOf(el);
  return uid !== "" && Number(uid) === 0 && text(el, "Name") === undefined;
}

/** ResourceUID Microsoft Project gives an assignment that names no resource. */
const UNASSIGNED_RESOURCE = "-65535";

function readAssignments(
  root: XmlElement,
  taskIds: ReadonlySet<Id>,
  resourceIds: ReadonlySet<Id>,
  warnings: MspdiWarning[],
): Assignment[] {
  const out: Assignment[] = [];
  for (const el of childElements(childElement(root, "Assignments") ?? root, "Assignment")) {
    const id = uidOf(el);
    const taskId = text(el, "TaskUID") ?? "";
    const resourceId = text(el, "ResourceUID") ?? "";
    if (resourceId === UNASSIGNED_RESOURCE) {
      continue;
    }
    if (!taskIds.has(taskId) || !resourceIds.has(resourceId)) {
      warnings.push({
        code: "assignment-skipped",
        id,
        message: `Assignment ${id} of resource ${resourceId} to task ${taskId} names a record that is not in this project`,
      });
      continue;
    }
    const work = text(el, "Work");
    out.push({
      id,
      taskId,
      resourceId,
      units: num(el, "Units", 1),
      work: work === undefined ? 0 : parseMspdiDuration(work),
    });
  }
  return out;
}

/**
 * Reads a Microsoft Project XML (MSPDI) document into a project. Data the
 * model has no field for is dropped; whatever of it would change the computed
 * dates is listed in `warnings`. Raises `ScheduleError("invalid-xml")` for a
 * document that is not MSPDI.
 */
export function readMspdi(xml: string): MspdiReadResult {
  const root = parseXml(xml);
  if (root.name !== "Project") {
    throw new ScheduleError("invalid-xml", `Root element is <${root.name}>, not <Project>`);
  }
  const warnings: MspdiWarning[] = [];

  const projectFormat = decodeDurationFormat(num(root, "DurationFormat", 7));
  const defaultUnit: DurationUnit = projectFormat?.unit ?? "d";
  const ctx: TaskReadContext = { defaultUnit, warnings };

  const calendars = childElements(childElement(root, "Calendars") ?? root, "Calendar").map((c) => readCalendar(c, warnings));

  const taskEls = childElements(childElement(root, "Tasks") ?? root, "Task");
  const summaryEl = taskEls.find(isProjectSummary);
  const tasks: Task[] = [];
  const rowEls: XmlElement[] = [];
  for (const el of taskEls) {
    if (isProjectSummary(el)) {
      continue;
    }
    const task = readTask(el, ctx);
    if (task) {
      tasks.push(task);
      rowEls.push(el);
    }
  }
  const taskIds = new Set(tasks.map((t) => t.id));
  const links: Link[] = rowEls.flatMap((el) => readLinks(el, taskIds, ctx));

  const baselines: Record<number, Record<Id, BaselineEntry>> = {};
  rowEls.forEach((el, i) => {
    const taskId = tasks[i]?.id ?? "";
    for (const [number, entry] of readTaskBaselines(el, ctx)) {
      (baselines[number] ??= {})[taskId] = entry;
    }
  });

  const resources = childElements(childElement(root, "Resources") ?? root, "Resource")
    .filter((el) => !isPlaceholderResource(el))
    .map((el) => readResource(el, warnings));
  const assignments = readAssignments(root, taskIds, new Set(resources.map((r) => r.id)), warnings);

  if (hasTimephasedData(root)) {
    warnings.push({
      code: "timephased-data-dropped",
      id: "",
      message: "Timephased data (work contours and task splits) is not imported",
    });
  }

  const startText = text(root, "StartDate") ?? (summaryEl && text(summaryEl, "Start"));
  if (startText === undefined) {
    throw new ScheduleError("invalid-xml", "Project has no StartDate");
  }
  const scheduleFromStart = parseFlag(text(root, "ScheduleFromStart") ?? "1", "ScheduleFromStart");
  const finishText = text(root, "FinishDate");
  const statusText = text(root, "StatusDate");
  const minutesPerDay = num(root, "MinutesPerDay", 480);
  const name = text(root, "Title") ?? (summaryEl && childText(summaryEl, "Name")) ?? childText(root, "Name") ?? "";

  const project: Project = {
    name,
    scheduleFrom: scheduleFromStart ? "start" : "finish",
    start: parseLocalDateTime(startText),
    ...(!scheduleFromStart && finishText !== undefined ? { finish: parseLocalDateTime(finishText) } : {}),
    ...(statusText !== undefined ? { statusDate: parseLocalDateTime(statusText) } : {}),
    calendarId: text(root, "CalendarUID") ?? calendars[0]?.id ?? "",
    minutesPerDay,
    minutesPerWeek: num(root, "MinutesPerWeek", 2400),
    daysPerMonth: num(root, "DaysPerMonth", 20),
    defaultStartTime: parseClockTime(text(root, "DefaultStartTime") ?? "08:00:00"),
    defaultFinishTime: parseClockTime(text(root, "DefaultFinishTime") ?? "17:00:00"),
    criticalSlackLimit: num(root, "CriticalSlackLimit", 0) * minutesPerDay,
    honorConstraints: parseFlag(text(root, "HonorConstraints") ?? "1", "HonorConstraints"),
    calendars,
    tasks,
    links,
    resources,
    assignments,
    baselines: baselines as Record<number, Baseline>,
  };
  return { project, warnings };
}
