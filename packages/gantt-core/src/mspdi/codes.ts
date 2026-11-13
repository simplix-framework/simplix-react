import { ScheduleError } from "../errors";
import type { ConstraintType, DurationUnit, LinkType, ResourceType, TaskType } from "../types";

/** Namespace of a Microsoft Project XML document. */
export const MSPDI_NAMESPACE = "http://schemas.microsoft.com/project";

/** Meaning of an MSPDI DurationFormat or LagFormat code. */
export interface DurationFormat {
  /** Undefined for the null format (21, 53) and the percent formats. */
  unit?: DurationUnit;
  elapsed: boolean;
  estimated: boolean;
  percent: boolean;
}

const UNIT_CODES: Readonly<Record<DurationUnit, number>> = { m: 3, h: 5, d: 7, w: 9, mo: 11 };
const ESTIMATED_OFFSET = 32;

/**
 * Decodes a DurationFormat or LagFormat code. Returns undefined for a code
 * outside the published set.
 */
export function decodeDurationFormat(code: number): DurationFormat | undefined {
  const estimated = code >= 35 && code <= 53;
  const base = estimated ? code - ESTIMATED_OFFSET : code;
  for (const [unit, unitCode] of Object.entries(UNIT_CODES) as [DurationUnit, number][]) {
    if (base === unitCode || base === unitCode + 1) {
      return { unit, elapsed: base === unitCode + 1, estimated, percent: false };
    }
  }
  if (base === 19 || base === 20) {
    return { elapsed: base === 20, estimated, percent: true };
  }
  if (base === 21) {
    return { elapsed: false, estimated, percent: false };
  }
  return undefined;
}

/** Encodes a unit with its elapsed and estimated variants as a DurationFormat code. */
export function encodeDurationFormat(unit: DurationUnit, elapsed = false, estimated = false): number {
  return UNIT_CODES[unit] + (elapsed ? 1 : 0) + (estimated ? ESTIMATED_OFFSET : 0);
}

/** DurationFormat code of a percent lag. */
export const PERCENT_LAG_FORMAT = 19;

const LINK_TYPES: readonly LinkType[] = ["FF", "FS", "SF", "SS"];

/** Link type of a PredecessorLink Type code, or undefined for an unknown code. */
export function decodeLinkType(code: number): LinkType | undefined {
  return LINK_TYPES[code];
}

/** PredecessorLink Type code of a link type. */
export function encodeLinkType(type: LinkType): number {
  return LINK_TYPES.indexOf(type);
}

const CONSTRAINT_TYPES: readonly ConstraintType[] = [
  "asap",
  "alap",
  "must-start-on",
  "must-finish-on",
  "start-no-earlier-than",
  "start-no-later-than",
  "finish-no-earlier-than",
  "finish-no-later-than",
];

/** Constraint of a ConstraintType code, or undefined for an unknown code. */
export function decodeConstraintType(code: number): ConstraintType | undefined {
  return CONSTRAINT_TYPES[code];
}

/** ConstraintType code of a constraint. */
export function encodeConstraintType(type: ConstraintType): number {
  return CONSTRAINT_TYPES.indexOf(type);
}

const TASK_TYPES: readonly TaskType[] = ["fixed-units", "fixed-duration", "fixed-work"];

/** Task type of a Task Type code, or undefined for an unknown code. */
export function decodeTaskType(code: number): TaskType | undefined {
  return TASK_TYPES[code];
}

/** Task Type code of a task type. */
export function encodeTaskType(type: TaskType): number {
  return TASK_TYPES.indexOf(type);
}

/**
 * Resource type of a Resource Type code and IsCostResource flag. A cost
 * resource is saved as Type 0 with IsCostResource 1; Type 2 is also read as cost.
 */
export function decodeResourceType(code: number, isCostResource: boolean): ResourceType | undefined {
  if (isCostResource || code === 2) {
    return "cost";
  }
  if (code === 0) {
    return "material";
  }
  return code === 1 ? "work" : undefined;
}

/** Resource Type code and IsCostResource flag of a resource type. */
export function encodeResourceType(type: ResourceType): { type: number; isCostResource: boolean } {
  return type === "work" ? { type: 1, isCostResource: false } : { type: 0, isCostResource: type === "cost" };
}

const PT_DURATION =
  /^(-)?P(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

/**
 * Reads an xsd:duration such as `PT8H30M0S` as minutes. Days count 24 hours;
 * a year or month part raises `ScheduleError("invalid-duration")` because it
 * has no fixed length.
 */
export function parseMspdiDuration(text: string): number {
  const trimmed = text.trim();
  const m = PT_DURATION.exec(trimmed);
  if (!m || trimmed === "P" || trimmed.endsWith("T")) {
    throw new ScheduleError("invalid-duration", `Not an xsd:duration: "${text}"`);
  }
  const part = (i: number): number => (m[i] === undefined ? 0 : Number(m[i]));
  if (part(2) !== 0 || part(3) !== 0) {
    throw new ScheduleError("invalid-duration", `Years and months have no fixed length: "${text}"`);
  }
  const minutes = part(4) * 1440 + part(5) * 60 + part(6) + part(7) / 60;
  const rounded = Math.round(minutes * 1e6) / 1e6;
  return m[1] === "-" && rounded !== 0 ? -rounded : rounded;
}

/**
 * Writes minutes in the hour form Microsoft Project reads, `PT8H0M0S`.
 * Fractions of a minute are written as whole seconds.
 */
export function formatMspdiDuration(minutes: number): string {
  if (!Number.isFinite(minutes)) {
    throw new ScheduleError("invalid-duration", `Duration is not a finite number: ${minutes}`);
  }
  const totalSeconds = Math.round(Math.abs(minutes) * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const sign = minutes < 0 && totalSeconds > 0 ? "-" : "";
  return `${sign}PT${hours}H${mins}M${secs}S`;
}

/** Reads an MSPDI integer field. Raises `ScheduleError("invalid-xml")` for text that is not a number. */
export function parseNumber(text: string, field: string): number {
  const value = Number(text.trim());
  if (text.trim() === "" || !Number.isFinite(value)) {
    throw new ScheduleError("invalid-xml", `${field} is not a number: "${text}"`);
  }
  return value;
}

/** Reads an MSPDI boolean field, written as `1`/`0` or `true`/`false`. */
export function parseFlag(text: string, field: string): boolean {
  const t = text.trim();
  if (t === "1" || t === "true") {
    return true;
  }
  if (t === "0" || t === "false") {
    return false;
  }
  throw new ScheduleError("invalid-xml", `${field} is not a boolean: "${text}"`);
}

/** Writes a boolean as MSPDI `1` or `0`. */
export function formatFlag(value: boolean | undefined): string {
  return value === true ? "1" : "0";
}

/** Writes a number without exponent notation or trailing noise. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new ScheduleError("invalid-operation", `Number is not finite: ${value}`);
  }
  return String(Math.round(value * 1e6) / 1e6);
}
