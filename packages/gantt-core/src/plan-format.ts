import { ScheduleError } from "./errors";
import type { Project } from "./types";

/** Name a saved plan carries, so a reader can tell it from other JSON. */
export const PLAN_FORMAT = "simplix-gantt";
/** Version of the saved form this package writes. */
export const PLAN_FORMAT_VERSION = 1;

/** A plan as it is saved: the project with the name and version of its form. */
export interface SavedPlan {
  format: typeof PLAN_FORMAT;
  version: number;
  project: Project;
}

/** Collections every project has, whatever version saved it. */
const REQUIRED_LISTS = ["calendars", "tasks", "links", "resources", "assignments"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertProject(value: unknown): Project {
  if (!isRecord(value)) throw new ScheduleError("invalid-plan", "A saved plan holds no project");
  for (const key of REQUIRED_LISTS) {
    if (!Array.isArray(value[key])) throw new ScheduleError("invalid-plan", `A saved plan's project has no list of ${key}`);
  }
  if (typeof value.start !== "number" || typeof value.calendarId !== "string" || !isRecord(value.baselines)) {
    throw new ScheduleError("invalid-plan", "A saved plan's project lacks its start, its calendar or its baselines");
  }
  return value as unknown as Project;
}

/** Wraps a project in the form it is saved in. */
export function toSavedPlan(project: Project): SavedPlan {
  return { format: PLAN_FORMAT, version: PLAN_FORMAT_VERSION, project };
}

/** A project as the text to store: JSON that names its form and version. */
export function serializeProject(project: Project): string {
  return JSON.stringify(toSavedPlan(project));
}

/**
 * Reads a stored plan: the text `serializeProject` wrote, the value parsed
 * from it, or a bare project stored before plans carried a version.
 *
 * @throws ScheduleError `invalid-plan` for text that is not JSON or a value
 * that is not a plan, and `unsupported-plan-version` for a plan saved by a
 * later version of this package than this one reads.
 */
export function parseProject(stored: string | unknown): Project {
  let value: unknown = stored;
  if (typeof stored === "string") {
    try {
      value = JSON.parse(stored);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      throw new ScheduleError("invalid-plan", `A saved plan is not JSON: ${error.message}`);
    }
  }
  if (!isRecord(value)) throw new ScheduleError("invalid-plan", "A saved plan is not an object");
  // A plan stored before the form carried a version is the project itself.
  if (value.format === undefined && value.version === undefined) return assertProject(value);
  if (value.format !== PLAN_FORMAT || typeof value.version !== "number" || !Number.isInteger(value.version) || value.version < 1) {
    throw new ScheduleError("invalid-plan", `Not a saved plan: format "${String(value.format)}", version ${String(value.version)}`);
  }
  if (value.version > PLAN_FORMAT_VERSION) {
    throw new ScheduleError("unsupported-plan-version", `The plan was saved as version ${value.version}; this package reads up to version ${PLAN_FORMAT_VERSION}`);
  }
  return assertProject(value.project);
}
