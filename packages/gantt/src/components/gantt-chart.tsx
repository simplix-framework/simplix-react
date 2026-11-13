import { MINUTES_PER_DAY } from "@simplix-react/gantt-core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { visibleRows } from "../lib/rows";
import { ZOOM_LEVELS, createTimeScale } from "../lib/time-scale";
import type { ZoomLevel } from "../lib/time-scale";
import { useDrag } from "../lib/use-drag";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { DEFAULT_COLUMNS, TaskGridHeader, TaskGridRows, gridContentWidth } from "./task-grid";
import type { ColumnWidths, GanttColumnId, GridEditing } from "./task-grid";
import { TimelineBody } from "./timeline-body";
import { TimelineHeader } from "./timeline-header";

const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 48;
const MIN_GRID_WIDTH = 120;
/** Rows drawn beyond the visible ones, so a fast scroll does not show a gap. */
const OVERSCAN = 8;
/** Width, in CSS pixels, a landscape A4 page leaves between its margins. */
const PRINT_WIDTH = 1040;

/** A plan may be shrunk to this share of its size before a coarser scale is used instead. */
const MIN_PRINT_SCALE = 0.6;

/** The closest zoom step at which a plan of `minutes` still fits the page width without shrinking too far. */
function printLevel(minutes: number, gridWidth: number): ZoomLevel {
  const days = minutes / MINUTES_PER_DAY + 3;
  const room = PRINT_WIDTH / MIN_PRINT_SCALE - gridWidth;
  for (let i = ZOOM_LEVELS.length - 1; i > 0; i--) {
    if (days * ZOOM_LEVELS[i].pxPerDay <= room) return ZOOM_LEVELS[i];
  }
  return ZOOM_LEVELS[0];
}

/** Props for {@link GanttChart}. */
export interface GanttChartProps {
  /** Columns of the task table, in order. */
  columns?: readonly GanttColumnId[];
  /** Width the task table opens at. It can be dragged wider or narrower. */
  defaultGridWidth?: number;
  /** First day of a week column: 0 is Sunday. */
  weekStartsOn?: number;
}

/**
 * The task table and the timeline, side by side in one scrolling area. The
 * table stays in place while the timeline scrolls sideways, and only the rows
 * and header cells on screen are drawn.
 */
export function GanttChart({ columns: initialColumns = DEFAULT_COLUMNS, defaultGridWidth, weekStartsOn = 0 }: GanttChartProps) {
  const { t } = useGanttTranslation();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const collapsed = useGantt((state) => state.collapsed);
  const zoom = useGantt((state) => state.zoom);
  const printing = useGantt((state) => state.printing);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = useState(() => defaultGridWidth ?? Math.min(gridContentWidth(initialColumns), 560));
  const [viewport, setViewport] = useState({ left: 0, top: 0, width: 1200, height: 600 });
  const [editing, setEditing] = useState<GridEditing | null>(null);
  const [widths, setWidths] = useState<ColumnWidths>({});
  // The order the reader has dragged the columns into; the prop gives the order the chart opens with.
  const [columns, setColumns] = useState<readonly GanttColumnId[]>(initialColumns);
  const moveColumn = (column: GanttColumnId, toIndex: number): void => {
    setColumns((current) => {
      const from = current.indexOf(column);
      if (from === -1 || from === toIndex) return current;
      const next = current.filter((other) => other !== column);
      next.splice(toIndex, 0, column);
      return next;
    });
  };

  const rows = useMemo(() => visibleRows(project.tasks, collapsed), [project.tasks, collapsed]);
  const level = printing ? printLevel(schedule.finish - Math.min(schedule.start, project.start), gridWidth) : ZOOM_LEVELS[zoom];
  // Enough days on both sides that the timeline fills the screen however short the plan is.
  // On paper the plan itself is all that is drawn.
  const paddingDays = printing ? 1 : Math.max(7, Math.ceil(viewport.width / level.pxPerDay / 2));
  const scale = useMemo(
    () => createTimeScale(Math.min(schedule.start, project.start), schedule.finish, level.pxPerDay, paddingDays),
    [schedule.start, schedule.finish, project.start, level.pxPerDay, paddingDays],
  );

  const bodyHeight = rows.length * ROW_HEIGHT;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    // The rows begin under the sticky header, which also covers the top of the scroll area.
    scrollMargin: HEADER_HEIGHT,
    scrollPaddingStart: HEADER_HEIGHT,
  });
  const rowWindow = printing
    ? rows.map((_, index) => ({ index, start: index * ROW_HEIGHT }))
    : virtualizer.getVirtualItems().map((item) => ({ index: item.index, start: item.start - HEADER_HEIGHT }));

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    let frame = 0;
    const read = (): void => {
      frame = 0;
      setViewport((previous) => {
        const next = { left: element.scrollLeft, top: element.scrollTop, width: element.clientWidth, height: element.clientHeight };
        return next.left === previous.left && next.top === previous.top && next.width === previous.width && next.height === previous.height
          ? previous
          : next;
      });
    };
    const request = (): void => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };
    read();
    element.addEventListener("scroll", request, { passive: true });
    const observer = new ResizeObserver(request);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", request);
      observer.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  // Open on the start of the plan, a little to the right of the table.
  const opened = useRef(false);
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || opened.current) return;
    opened.current = true;
    element.scrollLeft = Math.max(0, scale.x(schedule.start) - 24);
  }, [scale, schedule.start]);

  const beginSplit = useDrag<number>({
    onMove: (origin, position) => setGridWidth(Math.max(MIN_GRID_WIDTH, origin + position.dx)),
    onEnd: (origin, position) => setGridWidth(Math.max(MIN_GRID_WIDTH, origin + position.dx)),
    onCancel: (origin) => setGridWidth(origin),
  });

  const moveSelection = (delta: number, extend: boolean): void => {
    const { selection, selectRow } = store.getState();
    const last = selection[selection.length - 1];
    const current = last === undefined ? -1 : rows.findIndex((row) => row.task.id === last);
    const next = Math.max(0, Math.min(rows.length - 1, current === -1 ? 0 : current + delta));
    if (!rows[next]) return;
    selectRow(rows[next].task.id, extend ? "extend" : "replace");
    virtualizer.scrollToIndex(next, { align: "auto" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (editing) return;
    const state = store.getState();
    const mod = event.metaKey || event.ctrlKey;
    const last = state.selection[state.selection.length - 1];
    let handled = true;
    if (event.key === "ArrowDown") moveSelection(1, event.shiftKey);
    else if (event.key === "ArrowUp") moveSelection(-1, event.shiftKey);
    else if (event.altKey && event.shiftKey && event.key === "ArrowRight") state.indentSelected();
    else if (event.altKey && event.shiftKey && event.key === "ArrowLeft") state.outdentSelected();
    else if (mod && event.key.toLowerCase() === "z" && event.shiftKey) state.redo();
    else if (mod && event.key.toLowerCase() === "z") state.undo();
    else if (mod && event.key.toLowerCase() === "y") state.redo();
    else if (event.key === "Insert") state.addTask(t("task.newName"));
    else if (event.key === "Delete" || (event.key === "Backspace" && mod)) state.removeSelected();
    else if ((event.key === "F2" || event.key === "Enter") && last !== undefined) setEditing({ id: last, column: "name" });
    else if (event.key === "Escape") state.select([]);
    else if (last !== undefined && event.key.length === 1 && !mod && !event.altKey && columns.includes("name")) {
      // Typing on a selected row starts renaming it with the typed character.
      setEditing({ id: last, column: "name", initial: event.key });
    } else handled = false;
    if (handled) event.preventDefault();
  };

  const timelineFromX = printing ? 0 : Math.max(0, viewport.left - gridWidth);
  const timelineToX = printing ? scale.width : viewport.left + viewport.width;
  const fromY = printing ? 0 : Math.max(0, viewport.top - OVERSCAN * ROW_HEIGHT);
  const toY = printing ? bodyHeight : viewport.top + viewport.height + OVERSCAN * ROW_HEIGHT;
  // Sticky panes belong to scrolling; on paper everything sits where it is laid out.
  const sticky = printing ? "" : "sticky ";

  return (
    <div
      ref={scrollRef}
      tabIndex={0}
      role="grid"
      aria-rowcount={rows.length}
      className={
        printing
          ? "relative bg-background outline-none"
          : "relative min-h-0 flex-1 overflow-auto overscroll-contain bg-background outline-none"
      }
      data-gantt-slot="scroll"
      onKeyDown={onKeyDown}
      onCopy={(event) => {
        if (editing) return;
        const text = store.getState().copySelected();
        if (text === null) return;
        event.clipboardData.setData("text/plain", text);
        event.preventDefault();
      }}
      onPaste={(event) => {
        if (editing) return;
        store.getState().pasteText(event.clipboardData.getData("text/plain"));
        event.preventDefault();
      }}
    >
      <div
        className="relative"
        style={{
          width: gridWidth + scale.width,
          height: HEADER_HEIGHT + bodyHeight,
          // Shrinks a plan wider than the page to the page; a narrower one prints at full size.
          zoom: printing ? Math.min(1, PRINT_WIDTH / (gridWidth + scale.width)) : undefined,
        }}
      >
        <div className={`${sticky}top-0 z-30 flex border-b bg-muted`} style={{ height: HEADER_HEIGHT }}>
          <div className={`${sticky}left-0 z-40 shrink-0 overflow-hidden border-r bg-muted`} style={{ width: gridWidth }}>
            <TaskGridHeader
              columns={columns}
              widths={widths}
              onResize={(column, width) => setWidths((current) => (current[column] === width ? current : { ...current, [column]: width }))}
              onMove={moveColumn}
            />
          </div>
          <TimelineHeader scale={scale} level={level} fromX={timelineFromX} toX={timelineToX} weekStartsOn={weekStartsOn} />
        </div>
        <div className="flex" style={{ height: bodyHeight }}>
          <div
            className={`${sticky}left-0 z-20 shrink-0 border-r bg-background`}
            style={{ width: gridWidth, height: bodyHeight }}
            data-gantt-slot="grid"
          >
            <div className="relative h-full overflow-hidden">
              <TaskGridRows
                columns={columns}
                widths={widths}
                rows={rows}
                window={rowWindow}
                rowHeight={ROW_HEIGHT}
                editing={editing}
                onEditingChange={(next) => {
                  setEditing(next);
                  // Hand the keyboard back to the chart once a cell editor closes.
                  if (next === null) scrollRef.current?.focus({ preventScroll: true });
                }}
              />
            </div>
            {/* raw layout: absolute drag handle on the table's right edge */}
            <div
              role="separator"
              aria-orientation="vertical"
              className="absolute -right-1 top-0 z-10 h-full w-2 cursor-col-resize hover:bg-primary/30"
              onPointerDown={(event) => beginSplit(gridWidth, event)}
            />
          </div>
          <TimelineBody
            scale={scale}
            level={level}
            rows={rows}
            window={rowWindow}
            rowHeight={ROW_HEIGHT}
            fromX={timelineFromX}
            toX={timelineToX}
            fromY={fromY}
            toY={toY}
            weekStartsOn={weekStartsOn}
          />
        </div>
      </div>
    </div>
  );
}
