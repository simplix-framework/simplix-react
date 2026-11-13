import { Columns3 } from "lucide-react";
import { useEffect, useRef } from "react";

import { useGantt } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { INDICATOR_WIDTH, NUMERIC, columnWidth } from "../lib/grid-columns";
import type { ColumnWidths, GanttColumnId } from "../lib/grid-columns";
import { TOUCH_HOLD, useDrag } from "../lib/use-drag";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { ColumnChooser } from "./column-chooser";

/** Props for {@link TaskGridHeader}. */
export interface TaskGridHeaderProps {
  columns: readonly GanttColumnId[];
  widths: ColumnWidths;
  onResize: (column: GanttColumnId, width: number) => void;
  /** Called with the place among the columns a dragged heading was dropped at. */
  onMove: (column: GanttColumnId, toIndex: number) => void;
  /** Width of the leading row number column; narrower in a narrow table. */
  indicatorWidth?: number;
  /** Whether the first column stays in place beside the row numbers while the others scroll sideways. */
  pinFirstColumn?: boolean;
}

/** A column never gets narrower than this. */
const MIN_COLUMN_WIDTH = 48;
/** A dragged heading held this close to an edge of the table scrolls the columns, this far for each frame it stays there. */
const EDGE_ZONE = 28;
const EDGE_STEP = 8;
/** Pixels one arrow key press on a column's grip changes its width; with Shift, four times as far. */
const KEY_STEP = 8;

/** The heading row of the task table. The right edge of a heading drags to resize its column, and takes the arrow keys. */
export function TaskGridHeader({ columns, widths, onResize, onMove, indicatorWidth = INDICATOR_WIDTH, pinFirstColumn = false }: TaskGridHeaderProps) {
  const { t } = useGanttTranslation();
  const customFields = useGantt((state) => state.history.present.customFields);
  const labelOf = (column: GanttColumnId): string =>
    column.startsWith("custom:")
      ? (customFields?.find((field) => `custom:${field.id}` === column)?.name ?? "")
      : t(`column.${column}`);
  // The columns keep scrolling while a dragged heading rests near an edge, without the pointer having to move.
  const scrolling = useRef(0);
  const edgeScroll = (box: HTMLElement | null, direction: -1 | 0 | 1): void => {
    cancelAnimationFrame(scrolling.current);
    if (!box || direction === 0) return;
    const step = (): void => {
      box.scrollLeft += direction * EDGE_STEP;
      scrolling.current = requestAnimationFrame(step);
    };
    scrolling.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(scrolling.current), []);
  // Dragging a heading sideways drops its column where the pointer is.
  const beginMove = useDrag<{ column: GanttColumnId; row: Element | null }>({
    onMove({ row }, position) {
      // Near an edge of the table the columns scroll under the pointer, so a heading can be dropped on one out of view.
      const box = row?.closest<HTMLElement>('[data-gantt-slot="table-header"]');
      if (!box) return;
      const edge = box.getBoundingClientRect();
      // The left edge is where the columns come out from under what is pinned, not the edge of the table.
      const pinned = indicatorWidth + (pinFirstColumn ? columnWidth(columns[0], widths) : 0);
      const direction = position.clientX > edge.right - EDGE_ZONE ? 1 : position.clientX < edge.left + pinned + EDGE_ZONE ? -1 : 0;
      edgeScroll(box, direction);
    },
    onCancel: () => edgeScroll(null, 0),
    onEnd({ column, row }, position) {
      edgeScroll(null, 0);
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
  }, { touchHold: TOUCH_HOLD });
  const beginResize = useDrag<{ column: GanttColumnId; origin: number }>({
    onMove: ({ column, origin }, position) => onResize(column, Math.max(MIN_COLUMN_WIDTH, origin + position.dx)),
    onEnd: ({ column, origin }, position) => onResize(column, Math.max(MIN_COLUMN_WIDTH, origin + position.dx)),
    onCancel: ({ column, origin }) => onResize(column, origin),
  });
  return (
    <div className="flex h-full items-end text-xs font-medium text-foreground" role="row" aria-rowindex={1}>
      {/* The corner over the row numbers holds the list of columns, where a reader looks for it. */}
      <div className="sticky left-0 z-30 flex h-full shrink-0 items-center justify-center border-r bg-muted" style={{ width: indicatorWidth }}>
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
      {columns.map((column, position) => {
        const pinned = pinFirstColumn && position === 0;
        const width = columnWidth(column, widths);
        return (
        <div
          key={column}
          role="columnheader"
          title={t("column.move")}
          className={cn(
            "flex h-full shrink-0 cursor-grab items-center border-r px-2",
            pinned ? "sticky z-20 bg-muted" : "relative",
            NUMERIC.has(column) && "justify-end",
          )}
          style={{ width, left: pinned ? indicatorWidth : undefined }}
          data-gantt-column={column}
          data-gantt-pinned={pinned || undefined}
          onPointerDown={(event) => beginMove({ column, row: event.currentTarget.parentElement }, event)}
        >
          <span className="truncate">{labelOf(column)}</span>
          {/* raw layout: absolute drag handle on the heading's right edge */}
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={`${t("column.resize")}: ${labelOf(column)}`}
            aria-valuenow={width}
            aria-valuemin={MIN_COLUMN_WIDTH}
            title={t("column.resize")}
            // A grip line shows where to take hold; it brightens under the pointer.
            className="group/grip absolute -right-1.5 top-0 z-10 flex h-full w-3 cursor-col-resize touch-none items-center justify-center outline-none"
            data-gantt-slot="column-resize"
            onPointerDown={(event) => beginResize({ column, origin: width }, event)}
            onKeyDown={(event) => {
              const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
              if (event.key === "ArrowLeft") onResize(column, Math.max(MIN_COLUMN_WIDTH, width - step));
              else if (event.key === "ArrowRight") onResize(column, width + step);
              else if (event.key === "Home") onResize(column, columnWidth(column, {}));
              else return;
              // The chart reads the same keys to move along a row.
              event.preventDefault();
              event.stopPropagation();
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              onResize(column, columnWidth(column, {}));
            }}
          >
            <div className="h-4 w-0.5 rounded-full bg-foreground/25 group-hover/grip:h-full group-hover/grip:bg-primary group-focus-visible/grip:h-full group-focus-visible/grip:bg-primary" />
          </div>
        </div>
        );
      })}
    </div>
  );
}
