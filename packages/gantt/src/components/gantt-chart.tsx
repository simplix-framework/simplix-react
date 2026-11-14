import { MINUTES_PER_DAY } from "@simplix-react/gantt-core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { dateMarkers, nowOnProjectClock, startOfDay, timelineSpan } from "../lib/markers";
import { isPlainView, viewRows } from "../lib/view-rows";
import { PRINT_WIDTH, printLevel } from "../lib/print-layout";
import { ZOOM_LEVELS, createTimeScale } from "../lib/time-scale";
import { useTableScroll } from "../lib/use-table-scroll";
import { useViewport } from "../lib/use-viewport";
import { RowMenu } from "./row-menu";
import { TableSplitter } from "./table-splitter";
import { TaskGridHeader, TaskGridRows, columnWidth, gridContentWidth, rowNumberWidth } from "./task-grid";
import type { GanttColumnId, GridEditing } from "./task-grid";
import { TimelineBody } from "./timeline-body";
import { SCROLL_LEFT, TimelineHeader } from "./timeline-header";
import { useChartKeys } from "./use-chart-keys";

const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 48;
const MIN_GRID_WIDTH = 120;
/** The timeline keeps at least this much of the chart's width, however wide the table is asked to be. */
const MIN_TIMELINE_WIDTH = 160;
/** Share of the chart's width the table opens at most, before the reader has dragged it. */
const OPENING_GRID_SHARE = 0.45;
/** Room left between the table and the start of the plan, enough for the start's name tag. */
const OPENING_GAP = 48;
/** Rows drawn beyond the visible ones, so a fast scroll does not show a gap. */
const OVERSCAN = 8;
/** Height of the scroll bar under a table whose columns are wider than it. */
const TABLE_SCROLLER_HEIGHT = 12;
/** The table scrolls sideways by wheel and finger with no bar of its own, and keeps the scroll from what is behind it. */
const TABLE_SCROLLS = "overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
/** The scrolling columns keep at least this much of the table beside a pinned first column. */
const MIN_SCROLLING_WIDTH = 96;

/** Props for {@link GanttChart}. */
export interface GanttChartProps {
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
export function GanttChart({ defaultGridWidth, weekStartsOn = 0 }: GanttChartProps) {
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const collapsed = useGantt((state) => state.collapsed);
  const zoom = useGantt((state) => state.zoom);
  const printing = useGantt((state) => state.printing);
  // On paper both the table and the timeline are printed, whichever is on screen.
  const pane = useGantt((state) => (state.printing ? "both" : state.pane));
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const columns = useGantt((state) => state.columns);
  const scrollRequest = useGantt((state) => state.scrollRequest);
  const showMarkers = useGantt((state) => state.showMarkers);
  // The day turns over at midnight while the chart stays open.
  const [today, setToday] = useState(() => startOfDay(nowOnProjectClock()));
  useEffect(() => {
    const untilMidnight = (today + MINUTES_PER_DAY - nowOnProjectClock()) * 60_000 + 1000;
    const timer = setTimeout(() => setToday(startOfDay(nowOnProjectClock())), Math.max(1000, untilMidnight));
    return () => clearTimeout(timer);
  }, [today]);
  const markers = useMemo(
    () => (showMarkers ? dateMarkers(project, schedule, nowOnProjectClock()) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showMarkers, project.start, project.statusDate, schedule.start, schedule.finish, today],
  );
  // The sideways scroll position is also written on the box as it changes, for what has to follow it
  // within the frame: a value kept in state is drawn one frame late.
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const write = (): void => element.style.setProperty(SCROLL_LEFT, printing ? "0" : String(element.scrollLeft));
    write();
    element.addEventListener("scroll", write, { passive: true });
    return () => element.removeEventListener("scroll", write);
  }, [printing]);
  // Where a column heading being dragged would drop, as a distance from the table's left edge.
  const [columnDrop, setColumnDrop] = useState<number | null>(null);
  const storedGridWidth = useGantt((state) => state.gridWidth);
  const viewOptions = useGantt((state) => state.viewOptions);
  const readOnly = useGantt((state) => state.readOnly);
  const widths = useGantt((state) => state.columnWidths);
  // Opens as wide as its columns need, up to a share of the screen; a dragged width is the reader's and is kept.
  const [openingGridWidth] = useState(() => defaultGridWidth ?? Math.min(gridContentWidth(store.getState().columns, rowNumberWidth(store.getState().history.present, store.getState().schedule)), 560));
  const { viewport, measured } = useViewport(scrollRef, { left: 0, top: 0, width: 1200, height: 600 });
  // The table never takes the whole chart: on a narrow screen it gives way so the timeline stays in reach.
  const widest = Math.max(MIN_GRID_WIDTH, viewport.width - MIN_TIMELINE_WIDTH);
  const splitGridWidth = Math.min(widest, storedGridWidth ?? Math.min(openingGridWidth, Math.max(MIN_GRID_WIDTH, Math.round(viewport.width * OPENING_GRID_SHARE))));
  // Shown alone, the table takes the whole chart and the timeline none of it.
  const screenGridWidth = pane === "table" ? viewport.width : pane === "timeline" ? 0 : splitGridWidth;
  // On paper the table is as wide as its columns, so every column shown on screen is printed.
  const gridWidth = printing ? columns.reduce((sum, column) => sum + columnWidth(column, widths), rowNumberWidth(project, schedule)) : screenGridWidth;
  // The row number column is as wide as the longest number and the marks beside it need, and no wider.
  const indicatorWidth = useMemo(() => rowNumberWidth(project, schedule), [project, schedule]);
  // A table too narrow for its first column draws that column as wide as the room there is,
  // so a long name ends in an ellipsis instead of running under the timeline.
  const firstColumn = columns[0];
  const shownWidths = useMemo(() => {
    if (firstColumn === undefined) return widths;
    const room = gridWidth - indicatorWidth;
    return columnWidth(firstColumn, widths) > room ? { ...widths, [firstColumn]: Math.max(48, room) } : widths;
  }, [widths, firstColumn, gridWidth, indicatorWidth]);
  // Columns wider together than the table scroll sideways inside it, by the bar under the table.
  const tableWidth = columns.reduce((sum, column) => sum + columnWidth(column, shownWidths), indicatorWidth);
  const scrollsSideways = tableWidth > gridWidth && !printing;
  // The first column stays beside the row numbers while the rest scroll, as long as the rest keep some room.
  const firstWidth = firstColumn === undefined ? 0 : columnWidth(firstColumn, shownWidths);
  const pinFirstColumn = scrollsSideways && gridWidth - indicatorWidth - firstWidth >= MIN_SCROLLING_WIDTH;
  const pinnedWidth = indicatorWidth + (pinFirstColumn ? firstWidth : 0);
  const tableScroll = useTableScroll(tableWidth, gridWidth, pinnedWidth);
  // The table's scroll bar takes a strip below the last row instead of lying over it.
  const tableScrollerHeight = scrollsSideways ? TABLE_SCROLLER_HEIGHT : 0;
  // The column keyboard editing and sideways arrow keys act on.
  const [activeColumn, setActiveColumn] = useState<GanttColumnId>("name");
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [editing, setEditing] = useState<GridEditing | null>(null);
  // An edit under way ends when the table that holds its editor leaves the screen.
  useEffect(() => {
    if (pane === "timeline") setEditing(null);
  }, [pane]);
  // The active cell and a column that has just been added are scrolled into the table's view.
  const revealColumn = (column: GanttColumnId): void => {
    const at = columns.indexOf(column);
    if (at === -1 || (pinFirstColumn && at === 0)) return;
    const left = columns.slice(0, at).reduce((sum, other) => sum + columnWidth(other, shownWidths), indicatorWidth);
    tableScroll.reveal(left, left + columnWidth(column, shownWidths));
  };
  useEffect(() => {
    revealColumn(activeColumn);
    // Only a move of the active cell scrolls: a resize must not pull the table back to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeColumn]);
  const knownColumns = useRef(columns);
  useEffect(() => {
    const added = columns.find((column) => !knownColumns.current.includes(column));
    knownColumns.current = columns;
    if (added !== undefined) revealColumn(added);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const rows = useMemo(() => viewRows(project, schedule, collapsed, viewOptions), [project, schedule, collapsed, viewOptions]);
  const level = printing ? printLevel(schedule.finish - Math.min(schedule.start, project.start), gridWidth) : ZOOM_LEVELS[zoom];
  // Enough days on both sides that the timeline fills the screen however short the plan is.
  // On paper the plan itself is all that is drawn.
  const paddingDays = printing ? 1 : Math.max(7, Math.ceil(viewport.width / level.pxPerDay / 2));
  const scale = useMemo(
    () => {
      // Today widens the timeline when it lies near the plan, so its marker has somewhere to stand.
      const span = showMarkers && !printing ? timelineSpan(project, schedule, today) : { from: Math.min(schedule.start, project.start), to: schedule.finish };
      return createTimeScale(span.from, span.to, level.pxPerDay, paddingDays);
    },
    // The whole project is not a dependency: only its start and the schedule's ends move the scale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schedule.start, schedule.finish, project.start, level.pxPerDay, paddingDays, showMarkers, printing, today],
  );

  const bodyHeight = rows.length * ROW_HEIGHT;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    // A size to draw the first rows with before the scroll area has been measured.
    initialRect: { width: 1200, height: 600 },
    // The rows begin under the sticky header, which also covers the top of the scroll area.
    scrollMargin: HEADER_HEIGHT,
    scrollPaddingStart: HEADER_HEIGHT,
  });
  const rowWindow = printing
    ? rows.map((_, index) => ({ index, start: index * ROW_HEIGHT }))
    : virtualizer.getVirtualItems().map((item) => ({ index: item.index, start: item.start - HEADER_HEIGHT }));

  // Open on the start of the plan, a little to the right of the table.
  const opened = useRef(false);
  useEffect(() => {
    const element = scrollRef.current;
    // Wait for the real size: the table's width and the timeline's padding both follow it.
    if (!element || opened.current || !measured) return;
    opened.current = true;
    element.scrollLeft = Math.max(0, scale.x(schedule.start) - OPENING_GAP);
  }, [scale, schedule.start, measured]);

  // Bring what the store asked for into view.
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !scrollRequest) return;
    if (scrollRequest.target === "start") {
      element.scrollLeft = Math.max(0, scale.x(schedule.start) - OPENING_GAP);
      return;
    }
    if (scrollRequest.target === "today") {
      // Today is put a third of the way into the timeline, with the days before it in view.
      if (today >= scale.start && today <= scale.end) {
        element.scrollLeft = Math.max(0, scale.x(today) - (element.clientWidth - gridWidth) / 3);
      }
      return;
    }
    const index = rows.findIndex((row) => row.kind === "task" && row.task.id === scrollRequest.target);
    const at = schedule.tasks.get(scrollRequest.target);
    if (index === -1 || !at) return;
    virtualizer.scrollToIndex(index, { align: "center" });
    element.scrollLeft = Math.max(0, scale.x(at.start) - 24);
    // Only a new request scrolls: later renders must not pull the view back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRequest]);

  // Ctrl or Cmd with the wheel zooms the timeline. The listener is not passive, so it can keep the page from zooming.
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    let travelled = 0;
    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      travelled += event.deltaY;
      if (Math.abs(travelled) < 60) return;
      const state = store.getState();
      state.setZoom(state.zoom + (travelled < 0 ? 1 : -1));
      travelled = 0;
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [store]);

  const onKeyDown = useChartKeys({
    rows,
    columns,
    activeColumn,
    onActiveColumnChange: setActiveColumn,
    editing,
    onEditingChange: setEditing,
    scrollToRow: (index) => virtualizer.scrollToIndex(index, { align: "auto" }),
    tableShown: pane !== "timeline",
  });

  const timelineFromX = printing ? 0 : Math.max(0, viewport.left - gridWidth);
  const timelineToX = printing ? scale.width : viewport.left + viewport.width;
  const fromY = printing ? 0 : Math.max(0, viewport.top - OVERSCAN * ROW_HEIGHT);
  const toY = printing ? bodyHeight : viewport.top + viewport.height + OVERSCAN * ROW_HEIGHT;
  // Sticky panes belong to scrolling; on paper everything sits where it is laid out.
  const sticky = printing ? "" : "sticky ";
  // Middle of the part of the table body on screen, measured from the top of the body.
  const tableBodyEnd = Math.min(bodyHeight + tableScrollerHeight, viewport.top + viewport.height - HEADER_HEIGHT);
  const splitGripY = (viewport.top + Math.max(viewport.top, tableBodyEnd)) / 2;

  return (
    <div
      ref={scrollRef}
      tabIndex={0}
      role="grid"
      aria-rowcount={rows.length + 1}
      aria-colcount={columns.length + 1}
      className={
        printing
          ? "relative bg-background outline-none"
          : "relative min-h-0 flex-1 overflow-auto overscroll-contain bg-background outline-none"
      }
      data-gantt-slot="scroll"
      onKeyDown={onKeyDown}
      onContextMenu={(event) => {
        const target = (event.target as Element).closest<HTMLElement>("[data-gantt-row], [data-gantt-bar]");
        const id = target?.dataset.ganttRow ?? target?.dataset.ganttBar;
        if (id === undefined) return;
        event.preventDefault();
        const state = store.getState();
        if (!state.selection.includes(id)) state.selectRow(id);
        setMenu({ x: event.clientX, y: event.clientY });
      }}
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
          width: pane === "table" ? gridWidth : gridWidth + scale.width,
          height: HEADER_HEIGHT + bodyHeight + tableScrollerHeight,
          // Shrinks a plan wider than the page to the page; a narrower one prints at full size.
          zoom: printing ? Math.min(1, PRINT_WIDTH / (gridWidth + scale.width)) : undefined,
        }}
      >
        <div className={`${sticky}top-0 z-30 flex border-b bg-muted`} style={{ height: HEADER_HEIGHT }}>
          {pane !== "timeline" && <div
            ref={tableScroll.header}
            className={`${sticky}left-0 z-40 shrink-0 border-r bg-muted ${printing ? "overflow-hidden" : TABLE_SCROLLS}`}
            style={{ width: gridWidth }}
            onScroll={tableScroll.onScroll}
            data-gantt-slot="table-header"
          >
            {/* raw layout: the heading row at its full width, scrolled sideways inside the table */}
            <div className="h-full" style={{ width: Math.max(tableWidth, gridWidth) }}>
              <TaskGridHeader
                columns={columns}
                widths={shownWidths}
                onResize={store.getState().setColumnWidth}
                onMove={store.getState().moveColumn}
                indicatorWidth={indicatorWidth}
                pinFirstColumn={pinFirstColumn}
                onDropPreview={setColumnDrop}
              />
            </div>
          </div>}
          {pane !== "table" && <TimelineHeader scale={scale} level={level} fromX={timelineFromX} toX={timelineToX} weekStartsOn={weekStartsOn} markers={markers} pinnedLeft={printing ? 0 : gridWidth} clipLeft={printing ? 0 : viewport.left} />}
        </div>
        <div className="flex" style={{ height: bodyHeight + tableScrollerHeight }}>
          {pane !== "timeline" && <div
            className={`${sticky}left-0 z-20 shrink-0 border-r bg-background`}
            style={{ width: gridWidth, height: bodyHeight + tableScrollerHeight }}
            data-gantt-slot="grid"
          >
            <div ref={tableScroll.body} className={`relative ${printing ? "overflow-hidden" : TABLE_SCROLLS}`} style={{ height: bodyHeight }} onScroll={tableScroll.onScroll} data-gantt-slot="table-body">
              {/* raw layout: the rows at their full width, scrolled sideways inside the table */}
              <div className="relative h-full" style={{ width: Math.max(tableWidth, gridWidth) }}>
              {columnDrop !== null && (
                // raw layout: the heading row's drop line carried down through the rows
                <div className="pointer-events-none absolute top-0 z-[1] h-full w-0.5 -translate-x-1/2 bg-primary" style={{ left: columnDrop }} data-gantt-slot="column-drop-line" />
              )}
              <TaskGridRows
                columns={columns}
                widths={shownWidths}
                indicatorWidth={indicatorWidth}
                pinFirstColumn={pinFirstColumn}
                movable={!readOnly && isPlainView(viewOptions)}
                readOnly={readOnly}
                activeColumn={activeColumn}
                onActiveColumnChange={setActiveColumn}
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
            </div>
            {tableScrollerHeight > 0 && (
              // raw layout: a scroll bar of the table's own, kept at the foot of the visible rows
              <div
                ref={tableScroll.bar}
                className="sticky bottom-0 z-10 overflow-x-auto overflow-y-hidden border-t bg-background"
                style={{ width: gridWidth, height: TABLE_SCROLLER_HEIGHT }}
                data-gantt-slot="table-scroller"
                onScroll={tableScroll.onScroll}
              >
                <div style={{ width: tableWidth, height: 1 }} />
              </div>
            )}
            {!printing && pane === "both" && (
              <TableSplitter width={gridWidth} min={MIN_GRID_WIDTH} max={widest} gripY={splitGripY} onResize={store.getState().setGridWidth} />
            )}
          </div>}
          {pane !== "table" && <TimelineBody
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
            markers={markers}
          />}
        </div>
      </div>
      {menu && <RowMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} />}
    </div>
  );
}
