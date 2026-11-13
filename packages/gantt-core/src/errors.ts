/** Machine-readable reason a project could not be read or scheduled. */
export type ScheduleErrorCode =
  | "invalid-date"
  | "invalid-duration"
  | "invalid-outline"
  | "invalid-calendar"
  | "no-working-time"
  | "unknown-reference"
  | "duplicate-id"
  | "cycle"
  | "invalid-xml"
  | "invalid-plan"
  | "unsupported-plan-version"
  | "invalid-operation";

/**
 * Raised when a project is structurally unusable: a dependency cycle, a
 * calendar without working time, a reference to a missing record.
 *
 * Violated links, constraints and deadlines are not errors; the scheduler
 * reports them as conflicts on the computed schedule.
 */
export class ScheduleError extends Error {
  readonly code: ScheduleErrorCode;
  /** Ids of the records involved, when the reason names any. */
  readonly ids: readonly string[];

  constructor(code: ScheduleErrorCode, message: string, ids: readonly string[] = []) {
    super(message);
    this.name = "ScheduleError";
    this.code = code;
    this.ids = ids;
  }
}
