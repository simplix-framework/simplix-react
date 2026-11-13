import {
  MINUTES_PER_DAY,
  addLink,
  compileCalendars,
  dayIndexOf,
  setPercentComplete,
  setTaskFinish,
  setTaskStart,
  setTaskStartKeepingFinish,
} from "@simplix-react/gantt-core";
import type { Id, LinkType, TaskSchedule } from "@simplix-react/gantt-core";
import { useCallback, useMemo, useRef, useState } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import type { BarBox, PathPoint } from "../lib/link-path";
import { MARKER_STYLE, startOfDay } from "../lib/markers";
import type { ViewRow } from "../lib/view-rows";
import type { DateMarker } from "../lib/markers";
import { scaleCells } from "../lib/time-scale";
import type { TimeScale, ZoomLevel } from "../lib/time-scale";
import { useDrag } from "../lib/use-drag";
import { TaskBar } from "./task-bar";
import type { BarGesture } from "./task-bar";
import { TimelineLinks } from "./timeline-links";

/** Half the width of a milestone diamond, which a link attaches around. */
const MILESTONE_HALF = 7;
/** A day at least this wide shows its non-working hours, not only its non-working days. */
const HOURLY_PX_PER_DAY = 240;
/** Below this day width single non-working days are too thin to shade. */
const SHADING_MIN_PX_PER_DAY = 5;

/** Colours bars take when they are coloured by resource, one per resource in turn. */
const RESOURCE_COLORS = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#65a30d", "#dc2626"] as const;

/** Props for {@link TimelineBody}. */
export interface TimelineBodyProps {
  scale: TimeScale;
  level: ZoomLevel;
  rows: readonly ViewRow[];
  /** Rows to draw, as indexes into `rows` with their vertical offset. */
  window: readonly { index: number; start: number }[];
  rowHeight: number;
  /** Pixel range on screen, in the timeline's own coordinates. */
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
  weekStartsOn: number;
  /** Dates drawn as lines through the chart. */
  markers: readonly DateMarker[];
}

/** What a drag in progress has changed so far. */
interface DragPreview {
  gesture: BarGesture;
  /** Horizontal travel in pixels, for a move or a resize. */
  dx: number;
  /** Progress under the pointer, for a progress drag. */
  percent: number;
  /** Pointer position in timeline coordinates, for a link being drawn. */
  pointer: PathPoint;
}

/** The area under the date header: shading, grid lines, bars and dependency lines. */
export function TimelineBody({ scale, level, rows, window, rowHeight, fromX, toX, fromY, toY, weekStartsOn, markers }: TimelineBodyProps) {
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const selection = useGantt((state) => state.selection);
  const baselineNumber = useGantt((state) => state.baselineNumber);
  const showCriticalPath = useGantt((state) => state.showCriticalPath);
  const showLinks = useGantt((state) => state.showLinks);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [preview, setPreview] = useState<DragPreview | null>(null);

  const selected = useMemo(() => new Set(selection), [selection]);
  const projectTime = useMemo(
    () => compileCalendars(project.calendars).get(project.calendarId),
    [project.calendars, project.calendarId],
  );
  // A task grouped under several headings has several rows; links attach to the first.
  const rowOf = useMemo(() => {
    const map = new Map<Id, number>();
    rows.forEach((row, i) => {
      if (row.kind === "task" && !map.has(row.task.id)) map.set(row.task.id, i);
    });
    return map;
  }, [rows]);
  const readOnly = useGantt((state) => state.readOnly);
  const barText = useGantt((state) => state.barText);
  const barColoring = useGantt((state) => state.barColoring);
  const showProgressLine = useGantt((state) => state.showProgressLine);
  const resourceColor = useMemo(() => {
    const colors = new Map<Id, string>();
    project.resources.forEach((resource, i) => colors.set(resource.id, RESOURCE_COLORS[i % RESOURCE_COLORS.length]));
    return colors;
  }, [project.resources]);
  const height = rows.length * rowHeight;
  const hourly = level.pxPerDay >= HOURLY_PX_PER_DAY;
  const pxPerMinute = scale.pxPerDay / MINUTES_PER_DAY;

  const boxOf = useCallback(
    (taskId: Id): BarBox | null => {
      const i = rowOf.get(taskId);
      const at = schedule.tasks.get(taskId);
      if (i === undefined || !at) return null;
      const left = scale.x(at.start);
      const right = scale.x(at.finish);
      const y = i * rowHeight + rowHeight / 2;
      return at.milestone && right - left < 2 * MILESTONE_HALF
        ? { left: left - MILESTONE_HALF, right: left + MILESTONE_HALF, y }
        : { left, right, y };
    },
    [rowOf, schedule, scale, rowHeight],
  );

  const pointerIn = (clientX: number, clientY: number): PathPoint => {
    const rect = containerRef.current?.getBoundingClientRect();
    return rect ? { x: clientX - rect.left, y: clientY - rect.top } : { x: 0, y: 0 };
  };

  /** Rounds an instant to where a start or a finish may land at this zoom. */
  const snap = (t: number, edge: "start" | "finish"): number => {
    if (hourly) return Math.round(t / 15) * 15;
    const timeOfDay = edge === "start" ? project.defaultStartTime : project.defaultFinishTime;
    return Math.round((t - timeOfDay) / MINUTES_PER_DAY) * MINUTES_PER_DAY + timeOfDay;
  };

  const beginDrag = useDrag<BarGesture>({
    onMove(gesture, position) {
      const at = schedule.tasks.get(gesture.id);
      const pointer = pointerIn(position.clientX, position.clientY);
      let percent = 0;
      if (gesture.kind === "progress" && at) {
        const left = scale.x(at.start);
        const span = Math.max(1, scale.x(at.finish) - left);
        percent = Math.max(0, Math.min(100, Math.round(((pointer.x - left) / span) * 100)));
      }
      setPreview({ gesture, dx: position.dx, percent, pointer });
    },
    onCancel: () => setPreview(null),
    onEnd(gesture, position) {
      setPreview(null);
      const at = schedule.tasks.get(gesture.id);
      if (!at) return;
      const { apply } = store.getState();
      const travel = position.dx / pxPerMinute;
      switch (gesture.kind) {
        case "move": {
          const start = snap(at.start + travel, "start");
          if (start !== at.start) apply("move-task", (p) => setTaskStart(p, gesture.id, start));
          break;
        }
        case "resize-end": {
          const finish = snap(at.finish + travel, "finish");
          if (finish > at.start && finish !== at.finish) apply("resize-task", (p, s) => setTaskFinish(p, s, gesture.id, finish));
          break;
        }
        case "resize-start": {
          const start = snap(at.start + travel, "start");
          if (start < at.finish && start !== at.start) {
            apply("resize-task", (p, s) => setTaskStartKeepingFinish(p, s, gesture.id, start));
          }
          break;
        }
        case "progress": {
          const pointer = pointerIn(position.clientX, position.clientY);
          const left = scale.x(at.start);
          const span = Math.max(1, scale.x(at.finish) - left);
          const percent = Math.max(0, Math.min(100, Math.round(((pointer.x - left) / span) * 100)));
          if (percent !== at.percentComplete) apply("set-progress", (p, s) => setPercentComplete(p, s, gesture.id, percent));
          break;
        }
        case "link": {
          const target = document.elementFromPoint(position.clientX, position.clientY)?.closest<HTMLElement>("[data-gantt-bar]");
          const targetId = target?.dataset.ganttBar;
          if (!target || targetId === undefined || targetId === gesture.id) break;
          const rect = target.getBoundingClientRect();
          const toStart = position.clientX < rect.left + rect.width / 2;
          const type = `${gesture.end === "finish" ? "F" : "S"}${toStart ? "S" : "F"}` as LinkType;
          apply("link-tasks", (p) => addLink(p, { predecessorId: gesture.id, successorId: targetId, type }));
          break;
        }
      }
    },
  });

  const shading = useMemo(() => {
    if (!projectTime || level.pxPerDay < SHADING_MIN_PX_PER_DAY) return [];
    const spans: { x: number; width: number; key: string }[] = [];
    const firstDay = dayIndexOf(scale.at(Math.max(0, fromX)));
    const lastDay = dayIndexOf(scale.at(Math.min(scale.width, toX)));
    for (let day = firstDay; day <= lastDay; day++) {
      const base = day * MINUTES_PER_DAY;
      const ranges = projectTime.rangesOfDay(day);
      if (ranges.length === 0) {
        spans.push({ x: scale.x(base), width: scale.pxPerDay, key: `${day}` });
        continue;
      }
      if (!hourly) continue;
      let cursor = 0;
      for (const range of [...ranges, { from: MINUTES_PER_DAY, to: MINUTES_PER_DAY }]) {
        if (range.from > cursor) {
          spans.push({ x: scale.x(base + cursor), width: (range.from - cursor) * pxPerMinute, key: `${day}:${cursor}` });
        }
        cursor = range.to;
      }
    }
    return spans;
  }, [projectTime, level.pxPerDay, scale, fromX, toX, hourly, pxPerMinute]);

  const gridLines = useMemo(
    () => scaleCells(scale, level.bottom, fromX, toX, weekStartsOn),
    [scale, level.bottom, fromX, toX, weekStartsOn],
  );

  const baseline = baselineNumber === null ? undefined : project.baselines[baselineNumber];
  const draft =
    preview?.gesture.kind === "link"
      ? (() => {
          const box = boxOf(preview.gesture.id);
          return box
            ? { from: { x: preview.gesture.end === "finish" ? box.right : box.left, y: box.y }, to: preview.pointer }
            : null;
        })()
      : null;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ width: scale.width, height }}
      data-gantt-slot="timeline"
      onPointerDown={() => store.getState().select([])}
    >
      {shading.map((span) => (
        <div key={span.key} className="absolute top-0 h-full bg-muted/60" style={{ left: span.x, width: span.width }} />
      ))}
      {gridLines.map((cell) => (
        <div key={cell.from} className="absolute top-0 h-full border-l border-border/60" style={{ left: cell.x }} />
      ))}
      {window.map(({ index, start }) => {
        const row = rows[index];
        return (
          <div
            key={row.kind === "task" ? `${index}:${row.task.id}` : `group:${row.key}`}
            className={cn(
              "absolute left-0 w-full border-b border-border/60",
              row.kind === "group" ? "bg-muted" : selected.has(row.task.id) && "bg-accent/50",
            )}
            style={{ top: start, height: rowHeight }}
          />
        );
      })}
      {showProgressLine && project.statusDate !== undefined && (
        <ProgressLine rows={rows} window={window} rowHeight={rowHeight} scale={scale} statusDate={project.statusDate} height={height} />
      )}
      {markers.map((marker) => {
        if (marker.at < scale.start || marker.at > scale.end) return null;
        return (
          <div key={marker.kind} data-gantt-marker={marker.kind}>
            {/* Today also tints its whole day, wide enough to see at a glance. */}
            {marker.kind === "today" && scale.pxPerDay >= 5 && (
              <div className="absolute top-0 h-full bg-sky-500/10" style={{ left: scale.x(startOfDay(marker.at)), width: scale.pxPerDay }} />
            )}
            <div className={cn("absolute top-0 h-full", MARKER_STYLE[marker.kind].line)} style={{ left: scale.x(marker.at) }} />
          </div>
        );
      })}
      {showLinks && (
        <TimelineLinks
          project={project}
          schedule={schedule}
          boxOf={boxOf}
          fromY={fromY}
          toY={toY}
          rowHeight={rowHeight}
          width={scale.width}
          height={height}
          draft={draft}
        />
      )}
      {window.map(({ index, start }) => {
        const row = rows[index];
        if (row.kind === "group") return null;
        const at = schedule.tasks.get(row.task.id);
        if (!at) return null;
        const live = preview?.gesture.id === row.task.id ? preview : null;
        const firstResource = project.assignments.find((assignment) => assignment.taskId === row.task.id)?.resourceId;
        const color =
          barColoring === "task" ? row.task.color : barColoring === "resource" && firstResource !== undefined ? resourceColor.get(firstResource) : undefined;
        return (
          <TaskBar
            key={`${index}:${row.task.id}`}
            readOnly={readOnly}
            text={barText}
            color={color}
            row={row}
            at={previewed(at, live, pxPerMinute)}
            percent={live?.gesture.kind === "progress" ? live.percent : at.percentComplete}
            top={start}
            rowHeight={rowHeight}
            scale={scale}
            project={project}
            baseline={baseline?.[row.task.id]}
            critical={showCriticalPath && at.critical}
            selected={selected.has(row.task.id)}
            dragging={live !== null}
            onGesture={beginDrag}
          />
        );
      })}
    </div>
  );
}

/** The dates a bar is drawn at while it is being dragged. */
function previewed(at: TaskSchedule, live: DragPreview | null, pxPerMinute: number): TaskSchedule {
  if (!live) return at;
  const travel = live.dx / pxPerMinute;
  switch (live.gesture.kind) {
    case "move":
      return { ...at, start: at.start + travel, finish: at.finish + travel };
    case "resize-start":
      return { ...at, start: Math.min(at.start + travel, at.finish) };
    case "resize-end":
      return { ...at, finish: Math.max(at.finish + travel, at.start) };
    default:
      return at;
  }
}

interface ProgressLineProps {
  rows: readonly ViewRow[];
  window: readonly { index: number; start: number }[];
  rowHeight: number;
  scale: TimeScale;
  statusDate: number;
  height: number;
}

/**
 * The progress line: it runs down the status date and, at every task that is
 * under way or should be, bends to the point the task's progress has reached.
 * A bend to the left is work behind the date; a bend to the right is work ahead.
 */
function ProgressLine({ rows, window, rowHeight, scale, statusDate, height }: ProgressLineProps) {
  const schedule = useGantt((state) => state.schedule);
  const base = scale.x(statusDate);
  const points: string[] = [`${base},0`];
  for (const { index, start } of window) {
    const row = rows[index];
    if (row.kind !== "task" || row.summary) continue;
    const at = schedule.tasks.get(row.task.id);
    if (!at || at.finish === at.start) continue;
    // Nothing to report for work that is done, or that neither has begun nor was due to.
    if (at.percentComplete >= 100 || (at.percentComplete === 0 && at.start >= statusDate)) continue;
    const reached = scale.x(at.start) + ((scale.x(at.finish) - scale.x(at.start)) * at.percentComplete) / 100;
    points.push(`${base},${start}`, `${reached},${start + rowHeight / 2}`, `${base},${start + rowHeight}`);
  }
  points.push(`${base},${height}`);
  return (
    <svg className="pointer-events-none absolute left-0 top-0 text-amber-500" width={scale.width} height={height} aria-hidden="true" data-gantt-slot="progress-line">
      <polyline points={points.join(" ")} fill="none" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}
