import type { CustomField, Project } from "@simplix-react/gantt-core";

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
  | "cost";

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
]);

/** Range of the dates a cell editor takes. */
export const MIN_DATE = "1900-01-01";
export const MAX_DATE = "2199-12-31";

/** Width of the leading column that carries the row number and the conflict mark. */
export const INDICATOR_WIDTH = 44;

/** Width the task table needs to show every one of the given columns. */
export function gridContentWidth(columns: readonly GanttColumnId[]): number {
  return columns.reduce((sum, column) => sum + columnWidth(column, {}), INDICATOR_WIDTH);
}
