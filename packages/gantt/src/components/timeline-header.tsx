import { useMemo } from "react";

import { cn } from "../lib/cn";
import { formatDateTime, formatScaleCell } from "../lib/format";
import { MARKER_STYLE } from "../lib/markers";
import type { DateMarker } from "../lib/markers";
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
  /** Dates named with a tag on the header's lower edge. */
  markers?: readonly DateMarker[];
  /** Width of what is pinned over the left of the scroll area; a label that stays in view stays clear of it. */
  pinnedLeft?: number;
  /** Timeline position under the right edge of what is pinned; a tag is cut off to the left of it. */
  clipLeft?: number;
}

/** Two tags closer than this would overlap, so the later one is set a row lower. */
const TAG_CLEARANCE = 84;
const TAG_HEIGHT = 16;
/** Room below the header that stepped-down tags may take. */
const TAG_AREA = 200;

/** The two-tier date header above the bars, with a name tag for every marked date. */
export function TimelineHeader({ scale, level, fromX, toX, weekStartsOn, markers = [], pinnedLeft = 0, clipLeft = 0 }: TimelineHeaderProps) {
  const { t, language } = useGanttTranslation();
  // Tags that would collide step down one row each, in the order of their dates.
  const tags = useMemo(() => {
    const placed: { marker: DateMarker; x: number; row: number }[] = [];
    for (const marker of [...markers].sort((a, b) => a.at - b.at)) {
      if (marker.at < scale.start || marker.at > scale.end) continue;
      const x = scale.x(marker.at);
      const taken = new Set(placed.filter((other) => Math.abs(other.x - x) < TAG_CLEARANCE).map((other) => other.row));
      let row = 0;
      while (taken.has(row)) row += 1;
      placed.push({ marker, x, row });
    }
    return placed;
  }, [markers, scale]);
  return (
    <div className="relative h-full text-xs text-foreground" style={{ width: scale.width }}>
      <HeaderTier scale={scale} unit={level.top} fromX={fromX} toX={toX} weekStartsOn={weekStartsOn} pinnedLeft={pinnedLeft} clipLeft={clipLeft} top />
      <HeaderTier scale={scale} unit={level.bottom} fromX={fromX} toX={toX} weekStartsOn={weekStartsOn} />
      {/* raw layout: the tags hang below the header, so they are cut where the pinned table begins */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ clipPath: `inset(0 0 -${TAG_AREA}px ${clipLeft}px)` }}
        data-gantt-slot="marker-tags"
      >
      {tags.map(({ marker, x, row }) => (
        <div
          key={marker.kind}
          title={formatDateTime(marker.at, language)}
          className={cn(
            "pointer-events-auto absolute -translate-x-1/2 whitespace-nowrap rounded-full px-1.5 text-[10px] font-medium leading-4 shadow-sm",
            MARKER_STYLE[marker.kind].tag,
          )}
          // Half over the header's lower edge, so the tag sits on top of its line.
          style={{ left: x, top: `calc(100% - ${TAG_HEIGHT / 2}px + ${row * (TAG_HEIGHT + 2)}px)` }}
          data-gantt-marker-tag={marker.kind}
        >
          {t(`marker.${marker.kind}`)}
        </div>
      ))}
      </div>
    </div>
  );
}

interface HeaderTierProps extends Omit<TimelineHeaderProps, "level"> {
  unit: ScaleUnit;
  top?: boolean;
}

/** A top-tier cell showing less than this much of itself beside the table leaves its label out. */
const MIN_LABEL_ROOM = 36;

function HeaderTier({ scale, unit, fromX, toX, weekStartsOn, pinnedLeft = 0, clipLeft = 0, top = false }: HeaderTierProps) {
  const { language } = useGanttTranslation();
  const cells = useMemo(() => scaleCells(scale, unit, fromX, toX, weekStartsOn), [scale, unit, fromX, toX, weekStartsOn]);
  return (
    <div className={top ? "absolute inset-x-0 top-0 h-1/2 border-b" : "absolute inset-x-0 bottom-0 h-1/2"}>
      {cells.map((cell) => {
        // What is left of a cell that has scrolled part of the way under the table.
        const room = cell.x + cell.width - Math.max(cell.x, clipLeft);
        return (
        <div
          key={cell.from}
          className={
            top
              ? "absolute top-0 flex h-full items-center border-l px-2 font-medium text-foreground"
              : "absolute top-0 flex h-full items-center justify-center border-l"
          }
          style={{ left: cell.x, width: cell.width }}
          data-gantt-slot="scale-cell"
        >
          {/* A top-tier label stays readable while its cell scrolls under the left edge. */}
          {(!top || room >= MIN_LABEL_ROOM) && (
            <span className={top ? "sticky truncate" : "truncate"} style={top ? { left: pinnedLeft + 8 } : undefined}>
              {formatScaleCell(cell.from, unit, language, top ? room : cell.width)}
            </span>
          )}
        </div>
        );
      })}
    </div>
  );
}
