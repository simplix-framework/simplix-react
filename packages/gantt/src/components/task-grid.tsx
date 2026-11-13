import {
  ScheduleError,
  baselineVariance,
  computeCosts,
  computeEarnedValue,
  moveTask,
  parseLocalDateTime,
  setCustomValue,
  setPercentComplete,
  setTaskFinish,
  setTaskStart,
  subtreeEnd,
  updateTask,
} from "@simplix-react/gantt-core";
import type { ConflictKind, Id, Schedule } from "@simplix-react/gantt-core";
import { CalendarClock, ChevronDown, ChevronRight, Columns3, StickyNote, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { durationWords, toCanonicalDuration } from "../lib/duration-text";
import { EARNED_VALUE, cellText, editorValue, isEditableCell } from "../lib/grid-cells";
import type { CellContext } from "../lib/grid-cells";
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
} from "../lib/grid-columns";
import type { BuiltInColumnId, ColumnWidths, GanttColumnId } from "../lib/grid-columns";
import { formatDate } from "../lib/format";
import type { ViewRow } from "../lib/view-rows";
import { useDrag } from "../lib/use-drag";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { CellEditor } from "./cell-editor";
import { ColumnChooser } from "./column-chooser";

export { DEFAULT_COLUMNS, DEFAULT_COLUMN_WIDTHS, INDICATOR_WIDTH, columnWidth, gridContentWidth, isEditableCell };
export type { BuiltInColumnId, ColumnWidths, GanttColumnId };

/** The cell being edited. `initial` replaces the current value when editing began by typing. */
export interface GridEditing {
  id: Id;
  column: GanttColumnId;
  initial?: string;
}


/** Props for {@link TaskGridHeader}. */
export interface TaskGridHeaderProps {
  columns: readonly GanttColumnId[];
  widths: ColumnWidths;
  onResize: (column: GanttColumnId, width: number) => void;
  /** Called with the place among the columns a dragged heading was dropped at. */
  onMove: (column: GanttColumnId, toIndex: number) => void;
  /** Width of the leading row number column; narrower in a narrow table. */
  indicatorWidth?: number;
}

/** A column never gets narrower than this. */
const MIN_COLUMN_WIDTH = 48;

/** The heading row of the task table. The right edge of a heading drags to resize its column. */
export function TaskGridHeader({ columns, widths, onResize, onMove, indicatorWidth = INDICATOR_WIDTH }: TaskGridHeaderProps) {
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
      const left = (row?.getBoundingClientRect().left ?? 0) + indicatorWidth;
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
    <div className="flex h-full items-end text-xs font-medium text-foreground" role="row">
      {/* The corner over the row numbers holds the list of columns, where a reader looks for it. */}
      <div className="flex h-full shrink-0 items-center justify-center border-r" style={{ width: indicatorWidth }}>
        <ColumnChooser>
          <button
            type="button"
            aria-label={t("column.choose")}
            title={t("column.choose")}
            className="flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-background hover:text-foreground"
            data-gantt-slot="column-chooser-button"
          >
            <Columns3 className="size-4" />
          </button>
        </ColumnChooser>
      </div>
      {columns.map((column) => (
        <div
          key={column}
          role="columnheader"
          title={t("column.move")}
          className={cn("relative flex h-full shrink-0 cursor-grab touch-none items-center border-r px-2", NUMERIC.has(column) && "justify-end")}
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
            title={t("column.resize")}
            // A grip line shows where to take hold; it brightens under the pointer.
            className="group/grip absolute -right-1.5 top-0 z-10 flex h-full w-3 cursor-col-resize touch-none items-center justify-center"
            data-gantt-slot="column-resize"
            onPointerDown={(event) => beginResize({ column, origin: columnWidth(column, widths) }, event)}
            onDoubleClick={(event) => {
              event.stopPropagation();
              onResize(column, columnWidth(column, {}));
            }}
          >
            <div className="h-4 w-0.5 rounded-full bg-foreground/25 group-hover/grip:h-full group-hover/grip:bg-primary" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Props for {@link TaskGridRows}. */
export interface TaskGridRowsProps {
  columns: readonly GanttColumnId[];
  widths: ColumnWidths;
  /** The column the keyboard acts on; its cell in a selected row is outlined. */
  activeColumn: GanttColumnId;
  onActiveColumnChange: (column: GanttColumnId) => void;
  rows: readonly ViewRow[];
  /** Whether a row can be dragged to a new place: only while the plan is shown in its own order. */
  movable: boolean;
  /** A table that only shows: no cell opens for editing. */
  readOnly: boolean;
  /** Width of the leading row number column; narrower in a narrow table. */
  indicatorWidth?: number;
  /** Rows to draw, as indexes into `rows` with their vertical offset. */
  window: readonly { index: number; start: number }[];
  rowHeight: number;
  editing: GridEditing | null;
  onEditingChange: (editing: GridEditing | null) => void;
}

/** The body of the task table: one line per visible task, with inline editing. */
export function TaskGridRows({
  columns,
  widths,
  activeColumn,
  onActiveColumnChange,
  movable,
  readOnly,
  indicatorWidth = INDICATOR_WIDTH,
  rows,
  window,
  rowHeight,
  editing,
  onEditingChange,
}: TaskGridRowsProps) {
  const { t, language } = useGanttTranslation();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const selection = useGantt((state) => state.selection);
  const collapsed = useGantt((state) => state.collapsed);
  const viewOptions = useGantt((state) => state.viewOptions);
  const selected = useMemo(() => new Set(selection), [selection]);
  const conflicts = useMemo(() => conflictsByTask(schedule), [schedule]);
  const baselineNumber = useGantt((state) => state.baselineNumber);
  const showsVariance = columns.includes("startVariance") || columns.includes("finishVariance");
  const words = useMemo(() => durationWords((key) => t(key)), [t]);
  const showsCost = columns.includes("work") || columns.includes("cost");
  const costs = useMemo(() => (showsCost ? computeCosts(project, schedule) : null), [showsCost, project, schedule]);
  const showsEarned = columns.some((column) => EARNED_VALUE.has(column));
  const earned = useMemo(
    () => (showsEarned && project.statusDate !== undefined ? computeEarnedValue(project, schedule, baselineNumber ?? 0) : null),
    [showsEarned, project, schedule, baselineNumber],
  );
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
        setDurationText(id, toCanonicalDuration(value, words));
        break;
      case "actualCost":
        apply("set-actual-cost", (p) => updateTask(p, id, { actualCost: value.trim() === "" ? undefined : Number(value) }));
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
      const candidate = rows[slot];
      const target = candidate?.kind === "task" ? candidate : undefined;
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
        if (row.kind === "group") {
          const folded = collapsed.has(`group:${row.key}`);
          const label =
            viewOptions.group === "resource"
              ? (project.resources.find((resource) => resource.id === row.key)?.name ?? t("group.unassigned"))
              : t(`group.${row.key}`);
          return (
            <div
              key={`group:${row.key}`}
              role="row"
              className="absolute left-0 flex w-full items-center gap-1 border-b bg-muted px-2 text-sm font-semibold"
              style={{ top: start, height: rowHeight }}
              data-gantt-group={row.key}
            >
              <button
                type="button"
                className="flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-background"
                aria-label={t(folded ? "task.expand" : "task.collapse")}
                aria-expanded={!folded}
                onClick={() => store.getState().toggleCollapsed(`group:${row.key}`)}
              >
                {folded ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>
              <span className="truncate">{label}</span>
              <span className="text-xs font-normal text-muted-foreground tabular-nums">{row.count}</span>
            </div>
          );
        }
        const at = schedule.tasks.get(row.task.id);
        if (!at) return null;
        const rowConflicts = conflicts.get(row.task.id);
        const context: CellContext = {
          project,
          language,
          words,
          variance: variance?.get(row.task.id),
          cost: costs?.get(row.task.id),
          earned: earned?.get(row.task.id),
        };
        return (
          <div
            key={row.task.id}
            role="row"
            aria-rowindex={row.index + 1}
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
              className={cn(
                "flex shrink-0 touch-none items-center justify-end gap-0.5 border-r px-1.5 text-xs text-muted-foreground tabular-nums",
                movable && "cursor-grab",
              )}
              style={{ width: indicatorWidth }}
              title={movable ? t("task.moveRow") : undefined}
              data-gantt-slot="row-handle"
              onPointerDown={(event) => {
                if (event.button !== 0 || !movable) return;
                store.getState().selectRow(row.task.id);
                beginRowDrag({ id: row.task.id, grid: event.currentTarget.closest('[data-gantt-slot="grid"]') }, event);
              }}
            >
              {rowConflicts && (
                <span title={rowConflicts.map((kind) => t(`conflict.${kind}`)).join("\n")} className="text-destructive">
                  <TriangleAlert className="size-3.5" aria-label={rowConflicts.map((kind) => t(`conflict.${kind}`)).join(", ")} />
                </span>
              )}
              {row.task.notes && (
                <span title={row.task.notes}>
                  <StickyNote className="size-3" aria-label={t("task.hasNotes")} />
                </span>
              )}
              {row.task.constraintDate !== undefined && row.task.constraintType !== "asap" && row.task.constraintType !== "alap" && (
                <span title={`${t(`constraint.${row.task.constraintType}`)}: ${formatDate(row.task.constraintDate, language)}`}>
                  <CalendarClock className="size-3" aria-label={t("task.hasConstraint")} />
                </span>
              )}
              {row.index + 1}
            </div>
            {columns.map((column) => {
              const field = customFieldOf(column, project);
              const editable = !readOnly && isEditableCell(column, row, project);
              const active = column === activeColumn && selected.has(row.task.id);
              const isEditing = editing?.id === row.task.id && editing.column === column;
              return (
                <div
                  key={column}
                  role="gridcell"
                  aria-colindex={columns.indexOf(column) + 2}
                  aria-readonly={!editable}
                  onPointerDown={() => onActiveColumnChange(column)}
                  className={cn(
                    active && !isEditing && "outline outline-2 -outline-offset-2 outline-ring",
                    "flex shrink-0 items-center overflow-hidden border-r px-2",
                    NUMERIC.has(column) && "justify-end tabular-nums",
                    row.summary && column === "name" && "font-semibold",
                    isEditing && "px-0",
                  )}
                  style={{ width: columnWidth(column, widths) }}
                  onDoubleClick={(event) => {
                    if (field?.type === "flag" && !readOnly) {
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
                          : column === "percentComplete" || column === "actualCost" || field?.type === "number"
                            ? "number"
                            : "text"
                      }
                      bounded={column === "percentComplete"}
                      initial={editing.initial ?? editorValue(column, row, at, context)}
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
                        {cellText(column, row, at, context)}
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
