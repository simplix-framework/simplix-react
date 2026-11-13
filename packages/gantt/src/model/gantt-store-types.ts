import type {
  History,
  Id,
  LevelingOptions,
  Project,
  MergeConflict,
  ProjectChange,
  Schedule,
  ScheduleErrorCode,
  TaskClipboard,
} from "@simplix-react/gantt-core";

import type { ColumnWidths, GanttColumnId } from "../lib/grid-columns";
import type { ViewOptions } from "../lib/view-rows";

/** Why the last edit was refused. */
export interface GanttRejection {
  code: ScheduleErrorCode;
  message: string;
  ids: readonly string[];
}

/** Records a merge kept this side's version of, with the other side's plan to take theirs from. */
export interface PendingMerge {
  conflicts: readonly MergeConflict[];
  theirs: Project;
}

/** Which of the table and the timeline the Gantt view shows. */
export type GanttPane = "both" | "table" | "timeline";
/** The screen a chart shows: the Gantt chart, the resource sheet or the resource usage table. */
export type GanttView = "gantt" | "resources" | "usage" | "taskUsage" | "graph" | "calendar" | "network";

/** The words a bar carries beside it. */
export type BarText = "resources" | "name" | "percentComplete" | "dates" | "none";
/** What decides a bar's colour: the chart's own colour, the task's own, or one per resource. */
export type BarColoring = "none" | "task" | "resource";

/**
 * How a chart is laid out and what it shows, apart from the plan itself: the
 * part an application stores per reader and hands back when the chart opens.
 */
export interface GanttLayout {
  view: GanttView;
  columns: readonly GanttColumnId[];
  columnWidths: ColumnWidths;
  /** Width of the task table, or `null` to fit its columns. */
  gridWidth: number | null;
  zoom: number;
  collapsed: readonly Id[];
  showCriticalPath: boolean;
  showLinks: boolean;
  showMarkers: boolean;
  showProgressLine: boolean;
  baselineNumber: number | null;
  barText: BarText;
  barColoring: BarColoring;
  viewOptions: ViewOptions;
  /** Whether the Gantt view shows the table, the timeline or both. */
  pane: GanttPane;
}

/** A change of the plan: receives the current project and its schedule, returns the next project. */
export type GanttEdit = (project: Project, schedule: Schedule) => Project;

/** Reactive state of one chart, with the edits that change it. */
export interface GanttStoreState {
  history: History<Project>;
  /** Computed dates of `history.present`. */
  schedule: Schedule;
  /** Selected task ids, in the order they were selected. */
  selection: readonly Id[];
  /** Summary tasks whose rows are folded away. */
  collapsed: ReadonlySet<Id>;
  /** Index into the zoom steps. */
  zoom: number;
  showCriticalPath: boolean;
  showLinks: boolean;
  /** Whether today, the status date and the ends of the plan are marked on the timeline. */
  showMarkers: boolean;
  /** Whether the Gantt view shows the table, the timeline or both. */
  pane: GanttPane;
  /** Baseline drawn under the bars, or `null` for none. */
  baselineNumber: number | null;
  /** Baseline the save, show and clear commands work on, 0 to 10. */
  baselineSlot: number;
  /** The last refused edit; cleared by the next accepted one. */
  rejection: GanttRejection | null;
  /** The conflicts of the last merge that the reader has not settled yet, or `null`. */
  pendingMerge: PendingMerge | null;
  clipboard: TaskClipboard | null;
  /** The copied tasks as tab-separated text, as it was handed to the system clipboard. */
  clipboardText: string | null;
  /** The selected dependency line, or `null`. Selecting rows clears it. */
  selectedLinkId: Id | null;
  /** The task whose information dialog is open, or `null`. */
  dialogTaskId: Id | null;
  projectDialogOpen: boolean;
  recurringDialogOpen: boolean;
  /** True while the chart is laid out for paper: every row drawn, scaled to the page width. */
  printing: boolean;
  view: GanttView;
  /** Columns of the task table, in the order they are shown. */
  columns: readonly GanttColumnId[];
  /** Widths of the columns that have been resized. */
  columnWidths: ColumnWidths;
  /** Width of the task table, or `null` to fit its columns. */
  gridWidth: number | null;
  /** How the rows are narrowed, ordered and gathered. */
  viewOptions: ViewOptions;
  barText: BarText;
  barColoring: BarColoring;
  /** Whether a line joins the progress of every task at the status date. */
  showProgressLine: boolean;
  /** A chart that only shows its plan: every edit is refused. */
  readOnly: boolean;
  /** What resource leveling may do. */
  levelingOptions: LevelingOptions;
  /** The latest request to bring something into view; `seq` tells two requests for the same target apart. */
  scrollRequest: { target: "start" | "today" | Id; seq: number } | null;

  /**
   * Applies an edit as one undo step. A `ScheduleError` from the edit or
   * from scheduling its result refuses the edit and records the reason.
   *
   * @returns Whether the edit was accepted.
   */
  apply(label: string, edit: GanttEdit): boolean;
  /** Replaces the plan and forgets the undo history. */
  load(project: Project): void;
  undo(): void;
  redo(): void;
  dismissRejection(): void;

  select(ids: readonly Id[]): void;
  /** Selects one row; with `extend` every row from the last selected one to it, with `toggle` adds or removes it. */
  selectRow(id: Id, mode?: "replace" | "extend" | "toggle"): void;
  toggleCollapsed(id: Id): void;
  setCollapsed(ids: readonly Id[]): void;
  setZoom(zoom: number): void;
  setShowCriticalPath(show: boolean): void;
  setShowLinks(show: boolean): void;
  setShowMarkers(show: boolean): void;
  setPane(pane: GanttPane): void;
  setBaselineNumber(number: number | null): void;
  selectLink(id: Id | null): void;
  openTaskDialog(id: Id): void;
  closeTaskDialog(): void;
  openProjectDialog(): void;
  closeProjectDialog(): void;
  openRecurringDialog(): void;
  closeRecurringDialog(): void;
  /** Row to insert new rows at, and the outline level to give them: just under the last selected row, or the end. */
  insertionPoint(): { at: number; level: number };
  setPrinting(printing: boolean): void;
  setView(view: GanttView): void;
  setColumns(columns: readonly GanttColumnId[]): void;
  setColumnWidth(column: GanttColumnId, width: number): void;
  setGridWidth(width: number): void;
  setViewOptions(options: Partial<ViewOptions>): void;
  setBarText(text: BarText): void;
  setBarColoring(coloring: BarColoring): void;
  setShowProgressLine(show: boolean): void;
  /** The chart's layout as it is now, to be stored. */
  getLayout(): GanttLayout;
  /** Puts a stored layout back. Fields a stored layout does not have keep their values. */
  applyLayout(layout: Partial<GanttLayout>): void;
  /**
   * Brings a plan changed elsewhere into this one. `base` is the version
   * both started from. Records only the other side changed are taken;
   * a record both changed keeps this side's version.
   *
   * The conflicts stay in `pendingMerge` until the reader settles them.
   *
   * @returns The records both sides changed.
   */
  merge(base: Project, theirs: Project): readonly MergeConflict[];
  /**
   * Settles the conflicts of the last merge: the listed records take the
   * other side's version, the rest keep this side's. The change can be undone.
   */
  settleMerge(takeTheirs: readonly MergeConflict[]): void;
  /** Shows a column at the end of the table, or hides it. */
  toggleColumn(column: GanttColumnId): void;
  /** Moves a column to a place among the columns. */
  moveColumn(column: GanttColumnId, toIndex: number): void;
  setLevelingOptions(options: LevelingOptions): void;
  /** Selects a task and scrolls its row and its bar into view. */
  reveal(id: Id): void;
  /** Scrolls the timeline to the start of the plan. */
  scrollToStart(): void;
  /** Scrolls the timeline to today, when today lies on it. */
  scrollToToday(): void;
  /**
   * Replaces the plan with one changed elsewhere, such as an edit another
   * user saved. The undo history is kept; undoing past this point brings back
   * the plan as it was here, without the outside change. `onChange` is not
   * called, since the change did not come from this chart.
   */
  sync(project: Project): void;

  /** Inserts a new task under the last selected row, or at the end, and selects it. */
  addTask(name?: string): Id | null;
  /** Removes the selected dependency line, or else the selected tasks. */
  removeSelected(): void;
  indentSelected(): void;
  outdentSelected(): void;
  /**
   * Copies the selected tasks and returns them as tab-separated text (name,
   * duration, start, finish, percent complete) for the system clipboard, or
   * `null` when nothing is selected.
   */
  copySelected(): string | null;
  /**
   * Pastes text from the system clipboard. Text this chart copied pastes the
   * copied tasks with their links and assignments. Any other text makes one
   * task per line, reading the first tab-separated cell as the name and the
   * second, when it is a duration, as the duration.
   */
  pasteText(text: string): void;
  /** Picks the baseline the commands work on; a baseline that is shown follows it. */
  setBaselineSlot(slot: number): void;
  /** Pastes the copied tasks under the last selected row, or at the end. */
  paste(): void;
  /** Sets a task's duration from text such as `3d`, `2w` or `4h`. */
  setDurationText(id: Id, text: string): boolean;
  /** Replaces a task's predecessors from text such as `3, 4SS+2d`, naming rows by number. */
  setPredecessorText(id: Id, text: string): boolean;
}

/** Options for `createGanttStore`. */
export interface CreateGanttStoreOptions {
  zoom?: number;
  showCriticalPath?: boolean;
  showLinks?: boolean;
  showMarkers?: boolean;
  baselineNumber?: number | null;
  view?: GanttView;
  columns?: readonly GanttColumnId[];
  levelingOptions?: LevelingOptions;
  readOnly?: boolean;
  /** A stored layout to open with. It overrides the single options it names. */
  layout?: Partial<GanttLayout>;
  /** Called when the layout changes, with the whole layout to store. */
  onLayoutChange?: (layout: GanttLayout) => void;
  /**
   * Called after every accepted change of the plan, undo and redo included,
   * with the records that differ from the plan before it.
   */
  onChange?: (project: Project, schedule: Schedule, changes: readonly ProjectChange[]) => void;
}
