import type { Project } from "../types";

/**
 * Reason an MSPDI import left something out or read it differently from the
 * file.
 *
 * - `work-contour-dropped`: an assignment whose work is spread in a way the model has no equal of, read as flat.
 * - `recurrence-skipped`: a recurring calendar exception of a kind that is not expanded.
 * - `working-time-overnight`: a working time ending past midnight, cut at midnight.
 * - `working-day-without-hours`: a day marked working with no working times, read as non-working.
 * - `baseline-incomplete`: a baseline lacking a start, a finish or a duration.
 * - `timephased-data-dropped`: timephased data (work contours, splits) that is not imported.
 * - `link-skipped`: a predecessor link to a task that is not in the file or in another project.
 * - `assignment-skipped`: an assignment naming a task or resource that is not in the file.
 * - `null-task-skipped`: a blank task row.
 * - `unknown-code`: a code outside the published set, read as the documented default.
 */
export type MspdiWarningCode =
  | "work-contour-dropped"
  | "recurrence-skipped"
  | "working-time-overnight"
  | "working-day-without-hours"
  | "baseline-incomplete"
  | "timephased-data-dropped"
  | "link-skipped"
  | "assignment-skipped"
  | "null-task-skipped"
  | "unknown-code";

/** Something an MSPDI import could not carry into the model. */
export interface MspdiWarning {
  code: MspdiWarningCode;
  /** UID of the calendar, task, resource or assignment the warning is about. */
  id: string;
  message: string;
}

/** A project read from an MSPDI document, with what was left out. */
export interface MspdiReadResult {
  project: Project;
  warnings: MspdiWarning[];
}
