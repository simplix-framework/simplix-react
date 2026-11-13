import { useRef } from "react";

import { cn } from "../lib/cn";
import { nameColumnWidth, useViewport } from "../lib/use-viewport";

const COLUMN_WIDTH = 56;
const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 32;
/** Rows and columns drawn beyond the visible ones, so a fast scroll does not show a gap. */
const OVERSCAN = 3;

/** One line of a {@link UsageGrid}. */
export interface UsageGridRow {
  key: string;
  name: string;
  /** A line under another: indented and drawn lighter. */
  nested?: boolean;
  /** A line that totals the ones under it. */
  strong?: boolean;
  /** Attributes set on the row element, for the checks to find it by. */
  data?: Record<string, string>;
}

/** What one cell of a {@link UsageGrid} shows. */
export interface UsageGridCell {
  text: string;
  /** `over` marks more work than there is capacity; `idle` a column with no capacity. */
  tone?: "over" | "idle";
  title?: string;
}

/** Props for {@link UsageGrid}. */
export interface UsageGridProps {
  /** Value of `data-gantt-slot` on the scrolling box. */
  slot: string;
  nameHeader: string;
  /** Preferred width of the name column; a narrow box gives it less. */
  nameWidth: number;
  /** Heading of every dated column. */
  headers: readonly string[];
  rows: readonly UsageGridRow[];
  /** The cell at a row and a column, asked for only while it is on screen. */
  cell: (row: number, column: number) => UsageGridCell;
}

/**
 * A table of hours per dated column with the names pinned on the left. Only
 * the rows and columns on screen are in the page, so a long plan costs no
 * more to draw than a short one.
 */
export function UsageGrid({ slot, nameHeader, nameWidth, headers, rows, cell }: UsageGridProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { viewport } = useViewport(ref, { left: 0, top: 0, width: 1200, height: 600 });
  const names = nameColumnWidth(viewport.width, nameWidth);
  const fromColumn = Math.max(0, Math.floor(viewport.left / COLUMN_WIDTH) - OVERSCAN);
  const toColumn = Math.min(headers.length, Math.ceil((viewport.left + viewport.width - names) / COLUMN_WIDTH) + OVERSCAN);
  const fromRow = Math.max(0, Math.floor(viewport.top / ROW_HEIGHT) - OVERSCAN);
  const toRow = Math.min(rows.length, Math.ceil((viewport.top + viewport.height - HEADER_HEIGHT) / ROW_HEIGHT) + OVERSCAN);
  const columns = Array.from({ length: Math.max(0, toColumn - fromColumn) }, (_, i) => fromColumn + i);

  return (
    <div ref={ref} role="table" aria-rowcount={rows.length + 1} aria-colcount={headers.length + 1} className="min-h-0 flex-1 overflow-auto bg-background text-sm" data-gantt-slot={slot}>
      {/* raw layout: a box of the table's full size, in which only the rows and columns on screen are placed */}
      <div className="relative" style={{ width: names + headers.length * COLUMN_WIDTH, height: HEADER_HEIGHT + rows.length * ROW_HEIGHT }}>
        <div role="row" className="sticky top-0 z-20 flex bg-muted text-xs text-muted-foreground" style={{ height: HEADER_HEIGHT }}>
          <div role="columnheader" className="sticky left-0 z-30 flex shrink-0 items-center border-b border-r bg-muted px-2 font-medium" style={{ width: names }}>
            <span className="truncate">{nameHeader}</span>
          </div>
          <div className="relative flex-1 border-b">
            {columns.map((column) => (
              <div
                key={column}
                role="columnheader"
                aria-colindex={column + 2}
                className="absolute top-0 flex h-full items-center justify-center whitespace-nowrap border-r font-medium"
                style={{ left: column * COLUMN_WIDTH, width: COLUMN_WIDTH }}
              >
                {headers[column]}
              </div>
            ))}
          </div>
        </div>
        {rows.slice(fromRow, toRow).map((row, i) => (
          <div
            key={row.key}
            role="row"
            aria-rowindex={fromRow + i + 2}
            className="absolute left-0 flex w-full"
            style={{ top: HEADER_HEIGHT + (fromRow + i) * ROW_HEIGHT, height: ROW_HEIGHT }}
            {...row.data}
          >
            <div
              role="rowheader"
              title={row.name}
              className={cn(
                "sticky left-0 z-10 flex shrink-0 items-center border-b border-r bg-background px-2",
                row.strong && "font-semibold",
                row.nested && "pl-6 text-muted-foreground",
              )}
              style={{ width: names }}
            >
              <span className="truncate">{row.name}</span>
            </div>
            <div className="relative flex-1">
              {columns.map((column) => {
                const shown = cell(fromRow + i, column);
                return (
                  <div
                    key={column}
                    role="cell"
                    aria-colindex={column + 2}
                    title={shown.title}
                    className={cn(
                      "absolute top-0 flex h-full items-center justify-end border-b border-r px-1 tabular-nums",
                      row.strong && "font-medium",
                      row.nested && "text-muted-foreground",
                      shown.tone === "idle" && "bg-muted/60",
                      shown.tone === "over" && "bg-destructive/15 font-medium text-destructive",
                    )}
                    style={{ left: column * COLUMN_WIDTH, width: COLUMN_WIDTH }}
                  >
                    {shown.text}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
