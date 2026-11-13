import { MINUTES_PER_DAY, compileCalendars, setCustomValue, setTaskDuration, setTaskStart, updateTask } from "@simplix-react/gantt-core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { dateMarkers, nowOnProjectClock, startOfDay, timelineSpan } from "../lib/markers";
import type { VisibleRow } from "../lib/rows";
import { isPlainView, viewRows } from "../lib/view-rows";
import { ZOOM_LEVELS, createTimeScale } from "../lib/time-scale";
import type { ZoomLevel } from "../lib/time-scale";
import { useDrag } from "../lib/use-drag";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { RowMenu } from "./row-menu";
import { INDICATOR_WIDTH, TaskGridHeader, TaskGridRows, columnWidth, gridContentWidth, isEditableCell } from "./task-grid";
import type { GanttColumnId, GridEditing } from "./task-grid";
import { TimelineBody } from "./timeline-body";
import { TimelineHeader } from "./timeline-header";

const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 48;
const MIN_GRID_WIDTH = 120;
/** The timeline keeps at least this much of the chart's width, however wide the table is asked to be. */
const MIN_TIMELINE_WIDTH = 160;
/** Share of the chart's width the table opens at most, before the reader has dragged it. */
const OPENING_GRID_SHARE = 0.45;
/** Room left between the table and the start of the plan, enough for the start's name tag. */
const OPENING_GAP = 48;
/** A table narrower than this draws its row number column compact. */
const NARROW_GRID_WIDTH = 260;
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
  const { t } = useGanttTranslation();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const collapsed = useGantt((state) => state.collapsed);
  const zoom = useGantt((state) => state.zoom);
  const printing = useGantt((state) => state.printing);
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
  const storedGridWidth = useGantt((state) => state.gridWidth);
  const viewOptions = useGantt((state) => state.viewOptions);
  const readOnly = useGantt((state) => state.readOnly);
  const widths = useGantt((state) => state.columnWidths);
  // Opens as wide as its columns need, up to a share of the screen; a dragged width is the reader's and is kept.
  const [openingGridWidth] = useState(() => defaultGridWidth ?? Math.min(gridContentWidth(store.getState().columns), 560));
  const [viewport, setViewport] = useState({ left: 0, top: 0, width: 1200, height: 600 });
  // The table never takes the whole chart: on a narrow screen it gives way so the timeline stays in reach.
  const widest = Math.max(MIN_GRID_WIDTH, viewport.width - MIN_TIMELINE_WIDTH);
  const gridWidth = Math.min(widest, storedGridWidth ?? Math.min(openingGridWidth, Math.max(MIN_GRID_WIDTH, Math.round(viewport.width * OPENING_GRID_SHARE))));
  const setGridWidth = store.getState().setGridWidth;
  // A narrow table gives the row number column only what the number needs, and the name the rest.
  const indicatorWidth = gridWidth < NARROW_GRID_WIDTH ? 36 : INDICATOR_WIDTH;
  // A table too narrow for its first column draws that column as wide as the room there is,
  // so a long name ends in an ellipsis instead of running under the timeline.
  const firstColumn = columns[0];
  const shownWidths = useMemo(() => {
    if (firstColumn === undefined) return widths;
    const room = gridWidth - indicatorWidth;
    return columnWidth(firstColumn, widths) > room ? { ...widths, [firstColumn]: Math.max(48, room) } : widths;
  }, [widths, firstColumn, gridWidth, indicatorWidth]);
  // The column keyboard editing and sideways arrow keys act on.
  const [activeColumn, setActiveColumn] = useState<GanttColumnId>("name");
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [editing, setEditing] = useState<GridEditing | null>(null);
  const projectTime = useMemo(() => compileCalendars(project.calendars).get(project.calendarId), [project.calendars, project.calendarId]);

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
    setMeasured(true);
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
  const [measured, setMeasured] = useState(false);
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

  const beginSplit = useDrag<number>({
    onMove: (origin, position) => setGridWidth(Math.max(MIN_GRID_WIDTH, origin + position.dx)),
    onEnd: (origin, position) => setGridWidth(Math.max(MIN_GRID_WIDTH, origin + position.dx)),
    onCancel: (origin) => setGridWidth(origin),
  });

  const moveSelection = (delta: number, extend: boolean): void => {
    const { selection, selectRow } = store.getState();
    const last = selection[selection.length - 1];
    const current = last === undefined ? -1 : rows.findIndex((row) => row.kind === "task" && row.task.id === last);
    // Step over the headings of groups: only tasks are selected.
    let next = current === -1 ? 0 : current + delta;
    while (rows[next] && rows[next].kind !== "task") next += delta > 0 ? 1 : -1;
    const target = rows[next];
    if (!target || target.kind !== "task") return;
    selectRow(target.task.id, extend ? "extend" : "replace");
    virtualizer.scrollToIndex(next, { align: "auto" });
  };

  const moveColumnFocus = (delta: number): void => {
    const at = Math.max(0, columns.indexOf(activeColumn));
    setActiveColumn(columns[Math.max(0, Math.min(columns.length - 1, at + delta))] ?? "name");
  };

  /** Moves the selected tasks one working day earlier or later. */
  const nudge = (days: number): void => {
    const state = store.getState();
    if (!projectTime || state.selection.length === 0) return;
    state.apply("move-task", (p, s) => {
      let next = p;
      for (const id of state.selection) {
        const at = s.tasks.get(id);
        if (!at || at.summary) continue;
        next = setTaskStart(next, id, projectTime.snapForward(projectTime.add(at.start, days * p.minutesPerDay)));
      }
      return next;
    });
  };

  /** Copies the active cell of the first selected row, in row order, into the other selected rows. */
  const fillDown = (): void => {
    const state = store.getState();
    const chosen = rows.filter((row): row is VisibleRow => row.kind === "task" && state.selection.includes(row.task.id));
    if (chosen.length < 2) return;
    const [source, ...targets] = chosen;
    state.apply("fill-down", (p) => {
      let next = p;
      for (const target of targets) {
        if (!isEditableCell(activeColumn, target, p)) continue;
        if (activeColumn === "duration") {
          next = setTaskDuration(next, target.task.id, source.task.duration, { unit: source.task.durationUnit, elapsed: source.task.elapsed, estimated: source.task.estimated });
        } else if (activeColumn === "name") {
          next = updateTask(next, target.task.id, { name: source.task.name });
        } else if (activeColumn === "actualCost") {
          next = updateTask(next, target.task.id, { actualCost: source.task.actualCost });
        } else if (activeColumn.startsWith("custom:")) {
          const fieldId = activeColumn.slice("custom:".length);
          next = setCustomValue(next, target.task.id, fieldId, source.task.custom?.[fieldId]);
        }
      }
      return next;
    });
  };

  const editActive = (id: string, initial?: string): boolean => {
    const row = rows.find((candidate) => candidate.kind === "task" && candidate.task.id === id);
    const column = columns.includes(activeColumn) ? activeColumn : "name";
    if (readOnly || !row || row.kind !== "task" || !isEditableCell(column, row, project)) return false;
    setEditing({ id, column, initial });
    return true;
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
    else if (event.altKey && event.key === "ArrowRight") nudge(1);
    else if (event.altKey && event.key === "ArrowLeft") nudge(-1);
    else if (event.key === "ArrowRight" || (event.key === "Tab" && !event.shiftKey && last !== undefined)) moveColumnFocus(1);
    else if (event.key === "ArrowLeft" || (event.key === "Tab" && event.shiftKey && last !== undefined)) moveColumnFocus(-1);
    else if (mod && event.key.toLowerCase() === "z" && event.shiftKey) state.redo();
    else if (mod && event.key.toLowerCase() === "z") state.undo();
    else if (mod && event.key.toLowerCase() === "y") state.redo();
    else if (mod && event.key.toLowerCase() === "d") fillDown();
    else if (event.key === "Insert") state.addTask(t("task.newName"));
    else if (event.key === "Delete" || (event.key === "Backspace" && mod)) state.removeSelected();
    else if ((event.key === "F2" || event.key === "Enter") && last !== undefined) handled = editActive(last);
    else if (event.key === "Escape") state.select([]);
    else if (last !== undefined && event.key.length === 1 && !mod && !event.altKey) {
      // Typing on a selected row starts editing its active cell with the typed character.
      handled = editActive(last, event.key);
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
              widths={shownWidths}
              onResize={store.getState().setColumnWidth}
              onMove={store.getState().moveColumn}
              indicatorWidth={indicatorWidth}
            />
          </div>
          <TimelineHeader scale={scale} level={level} fromX={timelineFromX} toX={timelineToX} weekStartsOn={weekStartsOn} markers={markers} pinnedLeft={printing ? 0 : gridWidth} />
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
                widths={shownWidths}
                indicatorWidth={indicatorWidth}
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
            {/* raw layout: absolute drag handle on the table's right edge */}
            <div
              role="separator"
              aria-orientation="vertical"
              className="absolute -right-1 top-0 z-10 h-full w-2 cursor-col-resize touch-none hover:bg-primary/30"
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
            markers={markers}
          />
        </div>
      </div>
      {menu && <RowMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} />}
    </div>
  );
}
