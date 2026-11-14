import type { CustomField, Project, Schedule } from "@simplix-react/gantt-core";

/** A built-in column of the task table. */
export type BuiltInColumnId =
  | "wbs"
  | "name"
  | "duration"
  | "start"
  | "finish"
  | "predecessors"
  | "percentComplete"
  | "resources"
  | "totalSlack"
  | "startVariance"
  | "finishVariance"
  | "work"
  | "cost"
  | "plannedValue"
  | "earnedValue"
  | "actualCost"
  | "scheduleVariance"
  | "costVariance";

/** Every built-in column, in the order a column chooser lists them. */
export const BUILT_IN_COLUMNS: readonly BuiltInColumnId[] = [
  "wbs",
  "name",
  "duration",
  "start",
  "finish",
  "predecessors",
  "percentComplete",
  "resources",
  "totalSlack",
  "startVariance",
  "finishVariance",
  "work",
  "cost",
  "plannedValue",
  "earnedValue",
  "actualCost",
  "scheduleVariance",
  "costVariance",
];

/** A column of the task table: a built-in one, or `custom:` followed by the id of a custom field of the plan. */
export type GanttColumnId = BuiltInColumnId | `custom:${string}`;

/** Columns a chart shows when none are named. */
export const DEFAULT_COLUMNS: readonly GanttColumnId[] = [
  "name",
  "duration",
  "start",
  "finish",
  "predecessors",
  "percentComplete",
  "resources",
];

/** Widths of the columns that have been given one, by column. */
export type ColumnWidths = Readonly<Partial<Record<GanttColumnId, number>>>;

/** Width each built-in column opens at. */
export const DEFAULT_COLUMN_WIDTHS: Readonly<Record<BuiltInColumnId, number>> = {
  wbs: 64,
  name: 240,
  duration: 80,
  start: 112,
  finish: 112,
  predecessors: 104,
  percentComplete: 76,
  resources: 150,
  totalSlack: 104,
  startVariance: 96,
  finishVariance: 96,
  work: 88,
  cost: 104,
  plannedValue: 124,
  earnedValue: 124,
  actualCost: 124,
  scheduleVariance: 132,
  costVariance: 124,
};

const CUSTOM_COLUMN_WIDTH = 120;

/** Width a column is drawn at: the one it was resized to, or the one it opens at. */
export function columnWidth(column: GanttColumnId, widths: ColumnWidths): number {
  return widths[column] ?? (column.startsWith("custom:") ? CUSTOM_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTHS[column as BuiltInColumnId]);
}

/** The custom field a `custom:` column shows, when the plan has it. */
export function customFieldOf(column: GanttColumnId, project: Project): CustomField | undefined {
  if (!column.startsWith("custom:")) return undefined;
  const id = column.slice("custom:".length);
  return project.customFields?.find((field) => field.id === id);
}

/** Columns that hold a figure and are read down the column, so they align to the end. */
export const NUMERIC: ReadonlySet<GanttColumnId> = new Set([
  "duration",
  "percentComplete",
  "totalSlack",
  "startVariance",
  "finishVariance",
  "work",
  "cost",
  "plannedValue",
  "earnedValue",
  "actualCost",
  "scheduleVariance",
  "costVariance",
]);

/** Range of the dates a cell editor takes. */
export const MIN_DATE = "1900-01-01";
export const MAX_DATE = "2199-12-31";

/** Width of the leading column that carries the row number and the marks of a row, when nothing is known of the plan. */
export const INDICATOR_WIDTH = 64;

/** The row number column is never narrower than the button in its heading needs. */
const MIN_ROW_NUMBER_WIDTH = 36;
/** Room one digit of a row number takes, and one mark beside the number with its gap. */
const DIGIT_WIDTH = 8;
const MARK_WIDTH = 16;
const ROW_NUMBER_PADDING = 12;

/**
 * Width of the row number column for a plan: the longest row number, the most
 * marks any one row carries (a conflict, a note, a dated constraint), and the
 * padding around them.
 */
export function rowNumberWidth(project: Project, schedule: Schedule): number {
  const inConflict = new Set(schedule.conflicts.map((conflict) => conflict.taskId));
  const marks = project.tasks.reduce((most, task) => {
    const dated = task.constraintDate !== undefined && task.constraintType !== "asap" && task.constraintType !== "alap";
    return Math.max(most, (inConflict.has(task.id) ? 1 : 0) + (task.notes ? 1 : 0) + (dated ? 1 : 0));
  }, 0);
  const digits = String(Math.max(1, project.tasks.length)).length;
  return Math.max(MIN_ROW_NUMBER_WIDTH, ROW_NUMBER_PADDING + digits * DIGIT_WIDTH + marks * MARK_WIDTH);
}

/** Width the task table needs to show every one of the given columns beside a row number column of the given width. */
export function gridContentWidth(columns: readonly GanttColumnId[], indicatorWidth: number = INDICATOR_WIDTH): number {
  return columns.reduce((sum, column) => sum + columnWidth(column, {}), indicatorWidth);
}
