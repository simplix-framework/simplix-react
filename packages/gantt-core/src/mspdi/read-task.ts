import { parseLocalDateTime } from "../time";
import type { BaselineEntry, DurationUnit, Id, Link, Task } from "../types";
import {
  decodeConstraintType,
  decodeDurationFormat,
  decodeLinkType,
  decodeTaskType,
  parseFlag,
  parseMspdiDuration,
  parseNumber,
} from "./codes";
import type { MspdiWarning } from "./warnings";
import { childElements, childText, type XmlElement } from "./xml";

/** Settings of the project that task fields fall back to. */
export interface TaskReadContext {
  defaultUnit: DurationUnit;
  warnings: MspdiWarning[];
}

function text(el: XmlElement, name: string): string | undefined {
  const value = childText(el, name);
  return value === undefined || value.trim() === "" ? undefined : value.trim();
}

function num(el: XmlElement, name: string): number | undefined {
  const value = text(el, name);
  return value === undefined ? undefined : parseNumber(value, name);
}

function flag(el: XmlElement, name: string): boolean | undefined {
  const value = text(el, name);
  return value === undefined ? undefined : parseFlag(value, name);
}

function date(el: XmlElement, name: string): number | undefined {
  const value = text(el, name);
  return value === undefined ? undefined : parseLocalDateTime(value);
}

/** UID of a record as its id: the UID text without surrounding whitespace. */
export function uidOf(el: XmlElement): Id {
  return (childText(el, "UID") ?? "").trim();
}

/** True for the project summary task, UID 0. */
export function isProjectSummary(el: XmlElement): boolean {
  const uid = uidOf(el);
  return uid !== "" && Number(uid) === 0;
}

/**
 * Reads one MSPDI Task as a row of the plan. Returns undefined for a blank
 * row (IsNull 1), with a warning.
 */
export function readTask(el: XmlElement, ctx: TaskReadContext): Task | undefined {
  const id = uidOf(el);
  if (flag(el, "IsNull") === true) {
    ctx.warnings.push({ code: "null-task-skipped", id, message: `Task ${id} is a blank row and is skipped` });
    return undefined;
  }
  const formatCode = num(el, "DurationFormat");
  let format = formatCode === undefined ? undefined : decodeDurationFormat(formatCode);
  if (formatCode !== undefined && (format === undefined || format.percent)) {
    ctx.warnings.push({
      code: "unknown-code",
      id,
      message: `Task ${id}: DurationFormat ${formatCode} is not a duration unit; the project default unit is used`,
    });
    format = undefined;
  }
  const duration = text(el, "Duration");
  const minutes = duration === undefined ? 0 : parseMspdiDuration(duration);
  const manual = flag(el, "Manual") === true;
  const constraintCode = num(el, "ConstraintType") ?? 0;
  const constraintType = decodeConstraintType(constraintCode);
  if (constraintType === undefined) {
    ctx.warnings.push({ code: "unknown-code", id, message: `Task ${id}: ConstraintType ${constraintCode} is read as ASAP` });
  }
  const typeCode = num(el, "Type") ?? 0;
  const type = decodeTaskType(typeCode);
  if (type === undefined) {
    ctx.warnings.push({ code: "unknown-code", id, message: `Task ${id}: Type ${typeCode} is read as fixed units` });
  }
  const levelingDelay = num(el, "LevelingDelay") ?? 0;
  if (levelingDelay !== 0) {
    ctx.warnings.push({
      code: "leveling-delay-dropped",
      id,
      message: `Task ${id}: LevelingDelay ${levelingDelay} (format ${text(el, "LevelingDelayFormat") ?? "none"}) is imported as 0`,
    });
  }
  const constraintDate = constraintType === "asap" || constraintType === "alap" ? undefined : date(el, "ConstraintDate");
  const calendarUid = text(el, "CalendarUID");
  const notes = childText(el, "Notes");
  const optional: Partial<Task> = {
    ...(format?.elapsed ? { elapsed: true } : {}),
    ...(format?.estimated ? { estimated: true } : {}),
    ...(flag(el, "Milestone") === true && minutes !== 0 ? { milestone: true } : {}),
    ...(constraintDate !== undefined ? { constraintDate } : {}),
    ...(date(el, "Deadline") !== undefined ? { deadline: date(el, "Deadline") } : {}),
    ...(calendarUid !== undefined && calendarUid !== "-1" ? { calendarId: calendarUid } : {}),
    ...(flag(el, "IgnoreResourceCalendar") === true ? { ignoreResourceCalendar: true } : {}),
    ...(flag(el, "EffortDriven") === true ? { effortDriven: true } : {}),
    ...(date(el, "ActualStart") !== undefined ? { actualStart: date(el, "ActualStart") } : {}),
    ...(date(el, "ActualFinish") !== undefined ? { actualFinish: date(el, "ActualFinish") } : {}),
    ...(flag(el, "Active") === false ? { inactive: true } : {}),
    ...(notes !== undefined && notes !== "" ? { notes } : {}),
  };
  if (manual) {
    const start = date(el, "ManualStart") ?? date(el, "Start");
    const finish = date(el, "ManualFinish") ?? date(el, "Finish");
    if (start !== undefined) {
      optional.manualStart = start;
    }
    if (finish !== undefined) {
      optional.manualFinish = finish;
    }
  }
  return {
    id,
    name: childText(el, "Name") ?? "",
    outlineLevel: num(el, "OutlineLevel") ?? 1,
    mode: manual ? "manual" : "auto",
    duration: minutes,
    durationUnit: format?.unit ?? ctx.defaultUnit,
    constraintType: constraintType ?? "asap",
    type: type ?? "fixed-units",
    percentComplete: num(el, "PercentComplete") ?? 0,
    priority: num(el, "Priority") ?? 500,
    ...optional,
  };
}

/**
 * Reads the PredecessorLinks of one task. A link to a task outside `taskIds`
 * or to another project is skipped with a warning.
 */
export function readLinks(el: XmlElement, taskIds: ReadonlySet<Id>, ctx: TaskReadContext): Link[] {
  const successorId = uidOf(el);
  const links: Link[] = [];
  for (const pl of childElements(el, "PredecessorLink")) {
    const predecessorId = text(pl, "PredecessorUID") ?? "";
    const linkId = `${predecessorId}-${successorId}`;
    if (flag(pl, "CrossProject") === true || !taskIds.has(predecessorId)) {
      ctx.warnings.push({
        code: "link-skipped",
        id: linkId,
        message: `Link from task ${predecessorId} to task ${successorId} names a task that is not in this project`,
      });
      continue;
    }
    const typeCode = num(pl, "Type") ?? 1;
    const type = decodeLinkType(typeCode);
    if (type === undefined) {
      ctx.warnings.push({ code: "unknown-code", id: linkId, message: `Link ${linkId}: Type ${typeCode} is read as FS` });
    }
    const lagValue = num(pl, "LinkLag") ?? 0;
    const lagCode = num(pl, "LagFormat");
    const format = lagCode === undefined ? undefined : decodeDurationFormat(lagCode);
    if (lagCode !== undefined && format === undefined) {
      ctx.warnings.push({ code: "unknown-code", id: linkId, message: `Link ${linkId}: LagFormat ${lagCode} is read as working time` });
    }
    const percent = format?.percent === true;
    links.push({
      id: linkId,
      predecessorId,
      successorId,
      type: type ?? "FS",
      lag: percent ? lagValue : lagValue / 10,
      lagMode: percent ? "percent" : format?.elapsed ? "elapsed" : "working",
      lagUnit: format?.unit ?? ctx.defaultUnit,
    });
  }
  return links;
}

/**
 * Reads the Baseline elements of one task into entries by baseline number.
 * A file may spread one baseline over several elements with the same
 * Number; their fields are merged. A baseline with some but not all of start,
 * finish and duration is skipped with a warning.
 */
export function readTaskBaselines(el: XmlElement, ctx: TaskReadContext): Map<number, BaselineEntry> {
  const id = uidOf(el);
  const fields = new Map<number, { start?: number; finish?: number; duration?: number }>();
  for (const b of childElements(el, "Baseline")) {
    const number = num(b, "Number");
    if (number === undefined) {
      continue;
    }
    const entry = fields.get(number) ?? {};
    const start = date(b, "Start");
    const finish = date(b, "Finish");
    const duration = text(b, "Duration");
    if (start !== undefined) {
      entry.start = start;
    }
    if (finish !== undefined) {
      entry.finish = finish;
    }
    if (duration !== undefined) {
      entry.duration = parseMspdiDuration(duration);
    }
    fields.set(number, entry);
  }
  const out = new Map<number, BaselineEntry>();
  for (const [number, f] of fields) {
    if (f.start !== undefined && f.finish !== undefined && f.duration !== undefined) {
      out.set(number, { start: f.start, finish: f.finish, duration: f.duration });
    } else if (f.start !== undefined || f.finish !== undefined || f.duration !== undefined) {
      const missing = (["start", "finish", "duration"] as const).filter((k) => f[k] === undefined).join(", ");
      ctx.warnings.push({
        code: "baseline-incomplete",
        id,
        message: `Task ${id}: baseline ${number} has no ${missing} and is skipped`,
      });
    }
  }
  return out;
}
