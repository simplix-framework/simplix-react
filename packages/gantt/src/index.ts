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
  BarColoring,
  BarText,
  CreateGanttStoreOptions,
  GanttEdit,
  GanttLayout,
  GanttPane,
  GanttRejection,
  GanttStore,
  GanttStoreState,
  GanttView,
  PendingMerge,
} from "./model/gantt-store";

// ---- Screens (compose your own shell if needed) ----
export { GanttChart } from "./components/gantt-chart";
export type { GanttChartProps } from "./components/gantt-chart";
export { GanttToolbar } from "./components/gantt-toolbar";
export type { GanttToolbarProps } from "./components/gantt-toolbar";
export { ResourceSheet } from "./components/resource-sheet";
export { ResourceGraph } from "./components/resource-graph";
export { TaskUsage } from "./components/task-usage";
export { CalendarView } from "./components/calendar-view";
export { NetworkDiagram } from "./components/network-diagram";
export { DEFAULT_VIEW, isPlainView, viewRows } from "./lib/view-rows";
export type { GroupHeaderRow, GroupKey, SortKey, TaskFilter, ViewOptions, ViewRow } from "./lib/view-rows";
export { ResourceUsage } from "./components/resource-usage";
export { TaskDialog } from "./components/task-dialog";
export { ColumnChooser } from "./components/column-chooser";
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
export { buildPdf, downloadPdf, layoutPdf, pdfRows, renderPdf } from "./lib/pdf-export";
export type { PdfView } from "./lib/pdf-export";
export { barColors } from "./lib/bar-color";
export type { PdfImage, PdfLayout } from "./lib/pdf-export";
export { RecurringDialog } from "./components/recurring-dialog";

export { PACKAGE_NAMESPACE } from "./locales";
