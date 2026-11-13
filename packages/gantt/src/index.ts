// Register chart translations with the framework i18n as a side effect.
import "./locales";

// ---- Whole chart ----
export { Gantt, GanttShell } from "./components/gantt";
export type { GanttProps, GanttShellProps } from "./components/gantt";

// ---- Provider, hooks and store ----
export { GanttProvider, useGantt, useGanttStore } from "./context/gantt-context";
export type { GanttProviderProps } from "./context/gantt-context";
export { createGanttStore } from "./model/gantt-store";
export type {
  CreateGanttStoreOptions,
  GanttEdit,
  GanttRejection,
  GanttStore,
  GanttStoreState,
  GanttView,
} from "./model/gantt-store";

// ---- Screens (compose your own shell if needed) ----
export { GanttChart } from "./components/gantt-chart";
export type { GanttChartProps } from "./components/gantt-chart";
export { GanttToolbar } from "./components/gantt-toolbar";
export type { GanttToolbarProps } from "./components/gantt-toolbar";
export { ResourceSheet } from "./components/resource-sheet";
export { ResourceUsage } from "./components/resource-usage";
export { TaskDialog } from "./components/task-dialog";
export { ProjectDialog } from "./components/project-dialog";
export { BUILT_IN_COLUMNS, DEFAULT_COLUMNS, DEFAULT_COLUMN_WIDTHS, columnWidth } from "./lib/grid-columns";
export type { BuiltInColumnId, ColumnWidths, GanttColumnId } from "./lib/grid-columns";
export { durationWords, formatDurationText, toCanonicalDuration } from "./lib/duration-text";
export type { DurationWords } from "./lib/duration-text";

// ---- Timeline geometry ----
export { DEFAULT_ZOOM, ZOOM_LEVELS, createTimeScale, scaleCells } from "./lib/time-scale";
export type { ScaleCell, ScaleUnit, TimeScale, ZoomLevel } from "./lib/time-scale";
export { MARKER_STYLE, dateMarkers, nowOnProjectClock, timelineSpan } from "./lib/markers";
export type { DateMarker, MarkerKind } from "./lib/markers";
export { visibleRows } from "./lib/rows";
export type { VisibleRow } from "./lib/rows";
export { routeLink } from "./lib/link-path";
export type { BarBox, LinkPath, PathPoint } from "./lib/link-path";

// ---- PDF ----
export { buildPdf, downloadPdf, layoutPdf, renderPdf } from "./lib/pdf-export";
export type { PdfImage, PdfLayout } from "./lib/pdf-export";
export { RecurringDialog } from "./components/recurring-dialog";

export { PACKAGE_NAMESPACE } from "./locales";
