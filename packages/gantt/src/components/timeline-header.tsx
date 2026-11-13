import { useMemo } from "react";

import { formatScaleCell } from "../lib/format";
import { scaleCells } from "../lib/time-scale";
import type { ScaleUnit, TimeScale, ZoomLevel } from "../lib/time-scale";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** Props for {@link TimelineHeader}. */
export interface TimelineHeaderProps {
  scale: TimeScale;
  level: ZoomLevel;
  /** Horizontal pixel range on screen; only its cells are drawn. */
  fromX: number;
  toX: number;
  /** First day of a week column: 0 is Sunday. */
  weekStartsOn: number;
}

/** The two-tier date header above the bars. */
export function TimelineHeader({ scale, level, fromX, toX, weekStartsOn }: TimelineHeaderProps) {
  return (
    <div className="relative h-full text-xs text-muted-foreground" style={{ width: scale.width }}>
      <HeaderTier scale={scale} unit={level.top} fromX={fromX} toX={toX} weekStartsOn={weekStartsOn} top />
      <HeaderTier scale={scale} unit={level.bottom} fromX={fromX} toX={toX} weekStartsOn={weekStartsOn} />
    </div>
  );
}

interface HeaderTierProps extends Omit<TimelineHeaderProps, "level"> {
  unit: ScaleUnit;
  top?: boolean;
}

function HeaderTier({ scale, unit, fromX, toX, weekStartsOn, top = false }: HeaderTierProps) {
  const { language } = useGanttTranslation();
  const cells = useMemo(() => scaleCells(scale, unit, fromX, toX, weekStartsOn), [scale, unit, fromX, toX, weekStartsOn]);
  return (
    <div className={top ? "absolute inset-x-0 top-0 h-1/2 border-b" : "absolute inset-x-0 bottom-0 h-1/2"}>
      {cells.map((cell) => (
        <div
          key={cell.from}
          className={
            top
              ? "absolute top-0 flex h-full items-center border-l px-2 font-medium text-foreground"
              : "absolute top-0 flex h-full items-center justify-center border-l"
          }
          style={{ left: cell.x, width: cell.width }}
        >
          {/* A top-tier label stays readable while its cell scrolls under the left edge. */}
          <span className={top ? "sticky left-2 truncate" : "truncate"}>{formatScaleCell(cell.from, unit, language, cell.width)}</span>
        </div>
      ))}
    </div>
  );
}
