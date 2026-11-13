import {
  ScheduleError,
  baselineVariance,
  computeCosts,
  formatLocalDate,
  setCustomValue,
  moveTask,
  subtreeEnd,
  formatDuration,
  formatPredecessors,
  parseLocalDateTime,
  setPercentComplete,
  setTaskFinish,
  setTaskStart,
  updateTask,
} from "@simplix-react/gantt-core";
import type { BaselineVariance, ConflictKind, Id, Project, Schedule, TaskCost, TaskSchedule } from "@simplix-react/gantt-core";
import { ChevronDown, ChevronRight, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { formatDate, toDateInputValue } from "../lib/format";
import type { VisibleRow } from "../lib/rows";
import { useDrag } from "../lib/use-drag";
import { useGanttTranslation } from "../lib/use-gantt-translation";

import {
  DEFAULT_COLUMNS,
  DEFAULT_COLUMN_WIDTHS,
  INDICATOR_WIDTH,
  MAX_DATE,
  MIN_DATE,
  NUMERIC,
  columnWidth,
  customFieldOf,
  gridContentWidth,
} from "./grid-columns";
import type { BuiltInColumnId, ColumnWidths, GanttColumnId } from "./grid-columns";

export { DEFAULT_COLUMNS, DEFAULT_COLUMN_WIDTHS, INDICATOR_WIDTH, columnWidth, gridContentWidth };
export type { BuiltInColumnId, ColumnWidths, GanttColumnId };

const EDITABLE: ReadonlySet<GanttColumnId> = new Set(["name", "duration", "start", "finish", "predecessors", "percentComplete"]);
/** Columns whose value a summary task takes from the tasks under it. */
const ROLLED_UP: ReadonlySet<GanttColumnId> = new Set(["duration", "start", "finish"]);

/** The cell being edited. `initial` replaces the current value when editing began by typing. */
export interface GridEditing {
  id: Id;
  column: GanttColumnId;
  initial?: string;
}

function resourceText(project: Project, taskId: Id): string {
  return project.assignments
    .filter((assignment) => assignment.taskId === taskId)
    .map((assignment) => {
      const name = project.resources.find((resource) => resource.id === assignment.resourceId)?.name ?? assignment.resourceId;
      return assignment.units === 1 ? name : `${name}[${Math.round(assignment.units * 100)}%]`;
    })
    .join(", ");
}

function cellText(
  column: GanttColumnId,
  row: VisibleRow,
  at: TaskSchedule,
  project: Project,
  language: string,
  variance?: BaselineVariance,
  cost?: TaskCost,
): string {
  const { task } = row;
  const field = customFieldOf(column, project);
  if (column.startsWith("custom:")) {
    const value = field ? task.custom?.[field.id] : undefined;
    if (!field || value === undefined) return "";
    if (field.type === "date") return formatDate(value as number, language);
    if (field.type === "flag") return value === true ? "✔" : "";
    return String(value);
  }
  switch (column as BuiltInColumnId) {
    case "wbs":
      return at.wbs;
    case "name":
      return task.name;
    case "duration":
      return formatDuration(
        row.summary
          ? { minutes: at.duration, unit: "d", elapsed: false, estimated: false }
          : { minutes: task.duration, unit: task.durationUnit, elapsed: task.elapsed === true, estimated: task.estimated === true },
        project,
      );
    case "start":
      return formatDate(at.start, language);
    case "finish":
      return formatDate(at.finish, language);
    case "predecessors":
      return formatPredecessors(
        project.links.filter((link) => link.successorId === task.id),
        (id) => project.tasks.findIndex((other) => other.id === id) + 1,
        project,
      );
    case "percentComplete":
      return `${at.percentComplete}%`;
    case "resources":
      return resourceText(project, task.id);
    case "totalSlack":
      return formatDuration({ minutes: at.totalSlack, unit: "d", elapsed: false, estimated: false }, project);
    case "startVariance":
    case "finishVariance": {
      // A task the baseline does not hold has no variance to show.
      if (!variance) return "";
      const minutes = column === "startVariance" ? variance.start : variance.finish;
      return formatDuration({ minutes, unit: "d", elapsed: false, estimated: false }, project);
    }
    case "work":
      return cost ? formatDuration({ minutes: cost.work, unit: "h", elapsed: false, estimated: false }, project) : "";
    case "cost":
      return cost ? new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(cost.cost) : "";
  }
}

/** The text an editor opens with: the stored value in the form the editor reads back. */
function editorValue(column: GanttColumnId, row: VisibleRow, at: TaskSchedule, project: Project, language: string): string {
  if (column === "start") return toDateInputValue(at.start);
  if (column === "finish") return toDateInputValue(at.finish);
  if (column === "percentComplete") return String(at.percentComplete);
  const field = customFieldOf(column, project);
  const value = field ? row.task.custom?.[field.id] : undefined;
  if (field?.type === "date") return typeof value === "number" ? formatLocalDate(value) : "";
  return cellText(column, row, at, project, language);
}

/** Props for {@link TaskGridHeader}. */
export interface TaskGridHeaderProps {
  columns: readonly GanttColumnId[];
  widths: ColumnWidths;
  onResize: (column: GanttColumnId, width: number) => void;
  /** Called with the place among the columns a dragged heading was dropped at. */
  onMove: (column: GanttColumnId, toIndex: number) => void;
}

/** A column never gets narrower than this. */
const MIN_COLUMN_WIDTH = 48;

/** The heading row of the task table. The right edge of a heading drags to resize its column. */
export function TaskGridHeader({ columns, widths, onResize, onMove }: TaskGridHeaderProps) {
  const { t } = useGanttTranslation();
  const customFields = useGantt((state) => state.history.present.customFields);
  const labelOf = (column: GanttColumnId): string =>
    column.startsWith("custom:")
      ? (customFields?.find((field) => `custom:${field.id}` === column)?.name ?? "")
      : t(`column.${column}`);
  // Dragging a heading sideways drops its column where the pointer is.
  const beginMove = useDrag<{ column: GanttColumnId; row: Element | null }>({
    onMove: () => undefined,
    onEnd({ column, row }, position) {
      const left = (row?.getBoundingClientRect().left ?? 0) + INDICATOR_WIDTH;
      let edge = left;
      let target = columns.length - 1;
      for (let i = 0; i < columns.length; i++) {
        edge += columnWidth(columns[i], widths);
        if (position.clientX < edge) {
          target = i;
          break;
        }
      }
      onMove(column, target);
    },
  });
  const beginResize = useDrag<{ column: GanttColumnId; origin: number }>({
    onMove: ({ column, origin }, position) => onResize(column, Math.max(MIN_COLUMN_WIDTH, origin + position.dx)),
    onEnd: ({ column, origin }, position) => onResize(column, Math.max(MIN_COLUMN_WIDTH, origin + position.dx)),
    onCancel: ({ column, origin }) => onResize(column, origin),
  });
  return (
    <div className="flex h-full items-end text-xs font-medium text-muted-foreground" role="row">
      <div className="h-full shrink-0 border-r" style={{ width: INDICATOR_WIDTH }} />
      {columns.map((column) => (
        <div
          key={column}
          role="columnheader"
          title={t("column.move")}
          className={cn("relative flex h-full shrink-0 cursor-grab items-center border-r px-2", NUMERIC.has(column) && "justify-end")}
          style={{ width: columnWidth(column, widths) }}
          data-gantt-column={column}
          onPointerDown={(event) => beginMove({ column, row: event.currentTarget.parentElement }, event)}
        >
          <span className="truncate">{labelOf(column)}</span>
          {/* raw layout: absolute drag handle on the heading's right edge */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={t("column.resize")}
            className="absolute -right-1 top-0 z-10 h-full w-2 cursor-col-resize hover:bg-primary/30"
            data-gantt-slot="column-resize"
            onPointerDown={(event) => beginResize({ column, origin: columnWidth(column, widths) }, event)}
          />
        </div>
      ))}
    </div>
  );
}

/** Props for {@link TaskGridRows}. */
export interface TaskGridRowsProps {
  columns: readonly GanttColumnId[];
  widths: ColumnWidths;
  rows: readonly VisibleRow[];
  /** Rows to draw, as indexes into `rows` with their vertical offset. */
  window: readonly { index: number; start: number }[];
  rowHeight: number;
  editing: GridEditing | null;
  onEditingChange: (editing: GridEditing | null) => void;
}

/** The body of the task table: one line per visible task, with inline editing. */
export function TaskGridRows({ columns, widths, rows, window, rowHeight, editing, onEditingChange }: TaskGridRowsProps) {
  const { t, language } = useGanttTranslation();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const selection = useGantt((state) => state.selection);
  const selected = useMemo(() => new Set(selection), [selection]);
  const conflicts = useMemo(() => conflictsByTask(schedule), [schedule]);
  const baselineNumber = useGantt((state) => state.baselineNumber);
  const showsVariance = columns.includes("startVariance") || columns.includes("finishVariance");
  const showsCost = columns.includes("work") || columns.includes("cost");
  const costs = useMemo(() => (showsCost ? computeCosts(project) : null), [showsCost, project]);
  const variance = useMemo(
    () => (showsVariance ? baselineVariance(project, schedule, baselineNumber ?? 0) : null),
    [showsVariance, project, schedule, baselineNumber],
  );

  const commit = (id: Id, column: GanttColumnId, value: string): void => {
    onEditingChange(null);
    const { apply, setDurationText, setPredecessorText } = store.getState();
    switch (column) {
      case "name":
        apply("rename", (p) => (p.tasks.find((task) => task.id === id)?.name === value ? p : updateTask(p, id, { name: value })));
        break;
      case "duration":
        setDurationText(id, value);
        break;
      case "predecessors":
        setPredecessorText(id, value);
        break;
      case "start":
        if (value !== "") apply("set-start", (p) => setTaskStart(p, id, plannableDate(value) + p.defaultStartTime));
        break;
      case "finish":
        if (value !== "") {
          apply("set-finish", (p, s) => setTaskFinish(p, s, id, plannableDate(value) + p.defaultFinishTime));
        }
        break;
      case "percentComplete":
        apply("set-progress", (p, s) => setPercentComplete(p, s, id, Number(value.replace("%", ""))));
        break;
      default: {
        const field = customFieldOf(column, store.getState().history.present);
        if (!field) break;
        apply("set-custom-value", (p) => {
          if (value.trim() === "") return setCustomValue(p, id, field.id, undefined);
          if (field.type === "number") return setCustomValue(p, id, field.id, Number(value));
          if (field.type === "date") return setCustomValue(p, id, field.id, plannableDate(value));
          return setCustomValue(p, id, field.id, value);
        });
        break;
      }
    }
  };

  // Slot a dragged row would drop into: the visible row it lands before, or the row count for the end.
  const [dropSlot, setDropSlot] = useState<number | null>(null);
  const slotAt = (grid: Element | null, clientY: number): number => {
    const top = grid?.getBoundingClientRect().top ?? 0;
    return Math.max(0, Math.min(rows.length, Math.round((clientY - top) / rowHeight)));
  };
  const beginRowDrag = useDrag<{ id: Id; grid: Element | null }>({
    onMove: ({ grid }, position) => setDropSlot(slotAt(grid, position.clientY)),
    onCancel: () => setDropSlot(null),
    onEnd({ id, grid }, position) {
      setDropSlot(null);
      const slot = slotAt(grid, position.clientY);
      const target = rows[slot];
      store.getState().apply("move-row", (p) => {
        const from = p.tasks.findIndex((task) => task.id === id);
        const before = target ? target.index : p.tasks.length;
        // Dropping a row onto itself or among the rows under it leaves it where it is.
        if (from === -1 || (before >= from && before <= subtreeEnd(p.tasks, from))) return p;
        return moveTask(p, id, before, target?.task.outlineLevel ?? 1);
      });
    },
  });

  const onRowPointerDown = (id: Id, event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0) return;
    store.getState().selectRow(id, event.shiftKey ? "extend" : event.metaKey || event.ctrlKey ? "toggle" : "replace");
  };

  return (
    <>
      {dropSlot !== null && (
        <div
          className="pointer-events-none absolute left-0 z-10 h-0.5 w-full bg-primary"
          style={{ top: dropSlot * rowHeight - 1 }}
          data-gantt-slot="drop-line"
        />
      )}
      {window.map(({ index, start }) => {
        const row = rows[index];
        const at = schedule.tasks.get(row.task.id);
        if (!at) return null;
        const rowConflicts = conflicts.get(row.task.id);
        return (
          <div
            key={row.task.id}
            role="row"
            aria-selected={selected.has(row.task.id)}
            data-gantt-row={row.task.id}
            className={cn(
              "absolute left-0 flex w-full items-stretch border-b text-sm",
              selected.has(row.task.id) ? "bg-accent text-accent-foreground" : "bg-background",
              row.task.inactive && "text-muted-foreground line-through",
            )}
            style={{ top: start, height: rowHeight }}
            onPointerDown={(event) => onRowPointerDown(row.task.id, event)}
            onDoubleClick={() => store.getState().openTaskDialog(row.task.id)}
          >
            <div
              className="flex shrink-0 cursor-grab items-center justify-end gap-1 border-r px-1.5 text-xs text-muted-foreground tabular-nums"
              style={{ width: INDICATOR_WIDTH }}
              title={t("task.moveRow")}
              data-gantt-slot="row-handle"
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                store.getState().selectRow(row.task.id);
                beginRowDrag({ id: row.task.id, grid: event.currentTarget.closest('[data-gantt-slot="grid"]') }, event);
              }}
            >
              {rowConflicts && (
                <span title={rowConflicts.map((kind) => t(`conflict.${kind}`)).join("\n")} className="text-destructive">
                  <TriangleAlert className="size-3.5" aria-label={rowConflicts.map((kind) => t(`conflict.${kind}`)).join(", ")} />
                </span>
              )}
              {row.index + 1}
            </div>
            {columns.map((column) => {
              const field = customFieldOf(column, project);
              const editable = field ? field.type !== "flag" : EDITABLE.has(column) && !(row.summary && ROLLED_UP.has(column));
              const isEditing = editing?.id === row.task.id && editing.column === column;
              return (
                <div
                  key={column}
                  role="gridcell"
                  className={cn(
                    "flex shrink-0 items-center overflow-hidden border-r px-2",
                    NUMERIC.has(column) && "justify-end tabular-nums",
                    row.summary && column === "name" && "font-semibold",
                    isEditing && "px-0",
                  )}
                  style={{ width: columnWidth(column, widths) }}
                  onDoubleClick={(event) => {
                    if (field?.type === "flag") {
                      // A flag has nothing to type: a double click turns it over.
                      event.stopPropagation();
                      store.getState().apply("set-custom-value", (p) => setCustomValue(p, row.task.id, field.id, row.task.custom?.[field.id] !== true));
                      return;
                    }
                    if (!editable) return;
                    event.stopPropagation();
                    onEditingChange({ id: row.task.id, column });
                  }}
                >
                  {isEditing ? (
                    <CellEditor
                      type={
                        column === "start" || column === "finish" || field?.type === "date"
                          ? "date"
                          : column === "percentComplete" || field?.type === "number"
                            ? "number"
                            : "text"
                      }
                      bounded={column === "percentComplete"}
                      initial={editing.initial ?? editorValue(column, row, at, project, language)}
                      label={field ? field.name : t(`column.${column}`)}
                      onCommit={(value) => commit(row.task.id, column, value)}
                      onCancel={() => onEditingChange(null)}
                    />
                  ) : (
                    <>
                      {column === "name" && (
                        <span className="flex shrink-0 items-center" style={{ paddingLeft: (row.task.outlineLevel - 1) * 16 }}>
                          {row.summary ? (
                            <button
                              type="button"
                              className="mr-1 flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted"
                              aria-label={t(row.collapsed ? "task.expand" : "task.collapse")}
                              aria-expanded={!row.collapsed}
                              onPointerDown={(event) => event.stopPropagation()}
                              onDoubleClick={(event) => event.stopPropagation()}
                              onClick={() => store.getState().toggleCollapsed(row.task.id)}
                            >
                              {row.collapsed ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                            </button>
                          ) : (
                            <span className="mr-1 size-4" />
                          )}
                        </span>
                      )}
                      <span className="truncate" title={column === "name" ? row.task.name : undefined}>
                        {cellText(column, row, at, project, language, variance?.get(row.task.id), costs?.get(row.task.id))}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

/**
 * Reads a date typed into a cell. A date input accepts any year while it is
 * being typed, so a year outside the editor's range is refused here.
 */
function plannableDate(value: string): number {
  const date = parseLocalDateTime(value);
  if (date < parseLocalDateTime(MIN_DATE) || date > parseLocalDateTime(MAX_DATE)) {
    throw new ScheduleError("invalid-date", `Date outside ${MIN_DATE} to ${MAX_DATE}: "${value}"`);
  }
  return date;
}

function conflictsByTask(schedule: Schedule): Map<Id, ConflictKind[]> {
  const result = new Map<Id, ConflictKind[]>();
  for (const conflict of schedule.conflicts) {
    const kinds = result.get(conflict.taskId) ?? [];
    if (!kinds.includes(conflict.kind)) kinds.push(conflict.kind);
    result.set(conflict.taskId, kinds);
  }
  return result;
}

interface CellEditorProps {
  type: "text" | "date" | "number";
  /** Holds a number to 0 to 100. */
  bounded?: boolean;
  initial: string;
  label: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

function CellEditor({ type, bounded = false, initial, label, onCommit, onCancel }: CellEditorProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    // The chart's own shortcuts must not see keys typed into a cell.
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      onCommit(event.currentTarget.value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      // Clearing the handler first keeps the blur that follows from committing.
      event.currentTarget.dataset.cancelled = "true";
      onCancel();
    }
  };
  return (
    <input
      autoFocus
      type={type}
      aria-label={label}
      defaultValue={initial}
      min={bounded ? 0 : type === "date" ? MIN_DATE : undefined}
      max={bounded ? 100 : type === "date" ? MAX_DATE : undefined}
      className="h-full w-full min-w-0 border-2 border-ring bg-background px-1.5 text-sm text-foreground outline-none"
      onFocus={(event) => {
        if (type === "text") event.currentTarget.select();
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (event.currentTarget.dataset.cancelled !== "true") onCommit(event.currentTarget.value);
      }}
    />
  );
}
