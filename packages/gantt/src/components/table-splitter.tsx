import type { KeyboardEvent } from "react";

import { useDrag } from "../lib/use-drag";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** Props for {@link TableSplitter}. */
export interface TableSplitterProps {
  /** Current width of the task table. */
  width: number;
  min: number;
  max: number;
  /** Distance of the grip from the top of the splitter. */
  gripY: number;
  onResize: (width: number) => void;
}

/** Pixels one arrow key press moves the edge; with Shift, four times as far. */
const KEY_STEP = 16;

/**
 * The edge between the task table and the timeline. It drags to resize the
 * table, and with the keyboard on it the arrow keys do the same.
 */
export function TableSplitter({ width, min, max, gripY, onResize }: TableSplitterProps) {
  const { t } = useGanttTranslation();
  const clamp = (next: number): number => Math.max(min, Math.min(max, next));
  const begin = useDrag<number>({
    onMove: (origin, position) => onResize(Math.max(min, origin + position.dx)),
    onEnd: (origin, position) => onResize(Math.max(min, origin + position.dx)),
    onCancel: (origin) => onResize(origin),
  });
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
    if (event.key === "ArrowLeft") onResize(clamp(width - step));
    else if (event.key === "ArrowRight") onResize(clamp(width + step));
    else if (event.key === "Home") onResize(min);
    else if (event.key === "End") onResize(max);
    else return;
    // The chart reads the same keys to move along a row.
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    // raw layout: absolute drag handle on the table's right edge
    <div
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={t("toolbar.resizeTable")}
      aria-valuenow={Math.round(width)}
      aria-valuemin={min}
      aria-valuemax={Math.round(max)}
      title={t("toolbar.resizeTable")}
      className="group/split absolute -right-1.5 top-0 z-30 flex h-full w-3 cursor-col-resize touch-none justify-center outline-none"
      data-gantt-slot="splitter"
      onPointerDown={(event) => begin(width, event)}
      onKeyDown={onKeyDown}
    >
      {/* A grip at the middle of the rows in view marks the edge that can be dragged. */}
      <div
        className="absolute h-8 w-1 -translate-y-1/2 rounded-full bg-foreground/25 group-hover/split:bg-primary group-focus-visible/split:bg-primary group-focus-visible/split:ring-2 group-focus-visible/split:ring-ring"
        style={{ top: gripY }}
        data-gantt-slot="splitter-grip"
      />
    </div>
  );
}
