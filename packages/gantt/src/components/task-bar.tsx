import type { BaselineEntry, Id, Project, TaskSchedule } from "@simplix-react/gantt-core";
import type { PointerEvent as ReactPointerEvent } from "react";

import { useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { formatDateTime } from "../lib/format";
import type { VisibleRow } from "../lib/rows";
import type { TimeScale } from "../lib/time-scale";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** What a press on a bar starts. */
export type BarGesture =
  | { kind: "move" | "resize-start" | "resize-end" | "progress"; id: Id }
  | { kind: "link"; id: Id; end: "start" | "finish" };

/** Props for {@link TaskBar}. */
export interface TaskBarProps {
  row: VisibleRow;
  /** Dates the bar is drawn at; during a drag these are the previewed ones. */
  at: TaskSchedule;
  percent: number;
  top: number;
  rowHeight: number;
  scale: TimeScale;
  project: Project;
  baseline: BaselineEntry | undefined;
  critical: boolean;
  selected: boolean;
  dragging: boolean;
  onGesture: (gesture: BarGesture, event: ReactPointerEvent<Element>) => void;
}

const MILESTONE_SIZE = 12;

/** One task on the timeline: a bar, a summary bracket or a milestone diamond, with its drag handles. */
export function TaskBar({ row, at, percent, top, rowHeight, scale, project, baseline, critical, selected, dragging, onGesture }: TaskBarProps) {
  const { t, language } = useGanttTranslation();
  const store = useGanttStore();
  const { task } = row;
  const left = scale.x(at.start);
  const width = Math.max(scale.x(at.finish) - left, at.milestone ? 0 : 3);
  const barHeight = Math.max(10, rowHeight - 14);
  const barTop = top + (rowHeight - barHeight) / 2;
  const editable = !row.summary;
  const title = `${task.name}\n${formatDateTime(at.start, language)} - ${formatDateTime(at.finish, language)}`;
  const label = project.assignments
    .filter((assignment) => assignment.taskId === task.id)
    .map((assignment) => project.resources.find((resource) => resource.id === assignment.resourceId)?.name ?? "")
    .filter((name) => name !== "")
    .join(", ");

  const press = (event: ReactPointerEvent<Element>): void => {
    if (event.button !== 0) return;
    store.getState().selectRow(task.id, event.shiftKey ? "extend" : event.metaKey || event.ctrlKey ? "toggle" : "replace");
    if (editable) onGesture({ kind: "move", id: task.id }, event);
    else event.stopPropagation();
  };
  const open = (): void => store.getState().openTaskDialog(task.id);

  const baselineBar = baseline && (
    <div
      className="absolute rounded-sm bg-muted-foreground/40"
      style={{
        left: scale.x(baseline.start),
        width: Math.max(2, scale.x(baseline.finish) - scale.x(baseline.start)),
        top: top + rowHeight - 6,
        height: 4,
      }}
      data-gantt-slot="baseline"
    />
  );
  const deadline = task.deadline !== undefined && (
    <div
      className="absolute border-x-4 border-t-[6px] border-x-transparent border-t-emerald-600"
      style={{ left: scale.x(task.deadline) - 4, top: barTop - 2 }}
      title={`${t("field.deadline")}: ${formatDateTime(task.deadline, language)}`}
    />
  );

  if (row.summary) {
    return (
      <>
        {baselineBar}
        <div
          data-gantt-bar={task.id}
          title={title}
          className={cn("absolute bg-foreground/75", selected && "bg-foreground", task.inactive && "opacity-40")}
          style={{
            left,
            width: Math.max(width, 8),
            top: top + rowHeight / 2 - 5,
            height: 10,
            // Downward ticks at both ends make the bracket shape of a summary bar.
            clipPath: "polygon(0 0, 100% 0, 100% 100%, calc(100% - 5px) 50%, 5px 50%, 0 100%)",
          }}
          onPointerDown={press}
          onDoubleClick={open}
        />
      </>
    );
  }

  if (at.milestone) {
    return (
      <>
        {baselineBar}
        {deadline}
        <div
          data-gantt-bar={task.id}
          title={title}
          className={cn(
            "group absolute cursor-grab touch-none",
            dragging && "cursor-grabbing",
            task.inactive && "opacity-40",
          )}
          style={{ left: left - MILESTONE_SIZE / 2, width: MILESTONE_SIZE, top: top + (rowHeight - MILESTONE_SIZE) / 2, height: MILESTONE_SIZE }}
          onPointerDown={press}
          onDoubleClick={open}
        >
          <div
            className={cn(
              "size-full rotate-45 rounded-[2px]",
              critical ? "bg-destructive" : "bg-foreground",
              selected && "ring-2 ring-ring ring-offset-1 ring-offset-background",
            )}
          />
          <LinkDot side="start" onPointerDown={(event) => onGesture({ kind: "link", id: task.id, end: "start" }, event)} />
          <LinkDot side="finish" onPointerDown={(event) => onGesture({ kind: "link", id: task.id, end: "finish" }, event)} />
        </div>
        <BarLabel text={label} left={left + MILESTONE_SIZE} top={top} rowHeight={rowHeight} />
      </>
    );
  }

  const done = Math.max(0, Math.min(100, percent));
  const split = at.segments.length > 1;
  return (
    <>
      {baselineBar}
      {deadline}
      <div
        data-gantt-bar={task.id}
        title={title}
        className={cn(
          "group absolute cursor-grab touch-none rounded-[3px] border",
          critical ? "border-destructive" : "border-primary",
          // A split task shows its pauses as the dashed, empty part of the bar.
          split ? "border-dashed bg-transparent" : critical ? "bg-destructive/25" : "bg-primary/25",
          task.mode === "manual" && "border-dashed",
          selected && "ring-2 ring-ring ring-offset-1 ring-offset-background",
          dragging && "cursor-grabbing opacity-80",
          task.inactive && "opacity-40",
        )}
        style={{ left, width, top: barTop, height: barHeight }}
        onPointerDown={press}
        onDoubleClick={open}
      >
        {split ? (
          at.segments.map((segment) => (
            <div
              key={segment.start}
              className={cn("absolute inset-y-0 rounded-[2px]", critical ? "bg-destructive/60" : "bg-primary/60")}
              style={{ left: scale.x(segment.start) - left, width: Math.max(2, scale.x(segment.finish) - scale.x(segment.start)) }}
              data-gantt-slot="segment"
            />
          ))
        ) : (
          <div
            className={cn("h-full rounded-l-[2px]", critical ? "bg-destructive" : "bg-primary", done === 100 && "rounded-r-[2px]")}
            style={{ width: `${done}%` }}
            data-gantt-slot="progress"
          />
        )}
        {/* raw layout: absolute drag handles on the bar's edges and progress mark */}
        <div
          className="absolute inset-y-0 left-0 w-1.5 cursor-ew-resize"
          onPointerDown={(event) => onGesture({ kind: "resize-start", id: task.id }, event)}
        />
        <div
          className="absolute inset-y-0 right-0 w-1.5 cursor-ew-resize"
          onPointerDown={(event) => onGesture({ kind: "resize-end", id: task.id }, event)}
        />
        <div
          className="absolute -bottom-1.5 hidden size-2.5 -translate-x-1/2 cursor-ew-resize rounded-full border border-background bg-foreground group-hover:block"
          style={{ left: `${done}%` }}
          aria-label={t("column.percentComplete")}
          onPointerDown={(event) => onGesture({ kind: "progress", id: task.id }, event)}
        />
        <LinkDot side="start" onPointerDown={(event) => onGesture({ kind: "link", id: task.id, end: "start" }, event)} />
        <LinkDot side="finish" onPointerDown={(event) => onGesture({ kind: "link", id: task.id, end: "finish" }, event)} />
      </div>
      <BarLabel text={label} left={left + width + 14} top={top} rowHeight={rowHeight} />
    </>
  );
}

function LinkDot({ side, onPointerDown }: { side: "start" | "finish"; onPointerDown: (event: ReactPointerEvent<Element>) => void }) {
  return (
    <div
      className={cn(
        "absolute top-1/2 hidden size-2.5 -translate-y-1/2 cursor-crosshair rounded-full border border-primary bg-background group-hover:block",
        side === "start" ? "-left-3.5" : "-right-3.5",
      )}
      data-gantt-slot={`link-${side}`}
      onPointerDown={onPointerDown}
    />
  );
}

function BarLabel({ text, left, top, rowHeight }: { text: string; left: number; top: number; rowHeight: number }) {
  if (text === "") return null;
  return (
    <div
      className="pointer-events-none absolute flex items-center whitespace-nowrap text-xs text-muted-foreground"
      style={{ left, top, height: rowHeight }}
    >
      {text}
    </div>
  );
}
