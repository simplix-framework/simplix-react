import type { LinkType } from "@simplix-react/gantt-core";

/** Horizontal extent and vertical centre of a bar. */
export interface BarBox {
  left: number;
  right: number;
  y: number;
}

/** A point of a link's polyline. */
export interface PathPoint {
  x: number;
  y: number;
}

/** A link's route and the direction its arrowhead points: 1 to the right, -1 to the left. */
export interface LinkPath {
  points: PathPoint[];
  arrow: 1 | -1;
}

/**
 * Routes a dependency between two bars with right-angle segments.
 *
 * The line leaves the predecessor at the end the link reads (its finish for
 * FS and FF, its start for SS and SF) and enters the successor at the end the
 * link bounds (its start for FS and SS, its finish for FF and SF). When the
 * two ends face each other with room between them the route is one elbow;
 * otherwise it steps through the gap between the rows.
 *
 * @param stub - Length of the straight piece at each end.
 * @param rowHeight - Height of a row, used to pass between rows.
 */
export function routeLink(type: LinkType, from: BarBox, to: BarBox, stub: number, rowHeight: number): LinkPath {
  const exitRight = type === "FS" || type === "FF";
  const enterLeft = type === "FS" || type === "SS";
  const startX = exitRight ? from.right : from.left;
  const endX = enterLeft ? to.left : to.right;
  const exit = exitRight ? 1 : -1;
  // Direction of travel on the last segment.
  const arrow: 1 | -1 = enterLeft ? 1 : -1;
  const out = startX + exit * stub;
  const before = endX - arrow * stub;
  const start = { x: startX, y: from.y };
  const end = { x: endX, y: to.y };

  if (exit !== arrow) {
    // Both ends on the same side: run outside the further of the two.
    const x = exit === 1 ? Math.max(out, before) : Math.min(out, before);
    return { points: [start, { x, y: from.y }, { x, y: to.y }, end], arrow };
  }
  if ((before - out) * exit >= 0) {
    return { points: [start, { x: out, y: from.y }, { x: out, y: to.y }, end], arrow };
  }
  // The successor's end lies behind the predecessor's: pass through the gap between rows.
  const gapY = from.y + (to.y >= from.y ? 1 : -1) * (rowHeight / 2);
  return {
    points: [start, { x: out, y: from.y }, { x: out, y: gapY }, { x: before, y: gapY }, { x: before, y: to.y }, end],
    arrow,
  };
}

/** Writes a polyline as an SVG path. */
export function pathData(points: readonly PathPoint[]): string {
  return points.map((point, i) => `${i === 0 ? "M" : "L"}${Math.round(point.x)} ${Math.round(point.y)}`).join(" ");
}
