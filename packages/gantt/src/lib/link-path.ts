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

/** Radius of the curve a dependency line takes each of its corners with, in pixels. */
export const CORNER_RADIUS = 5;

/** A corner of a polyline cut back to a curve: where the line leaves its straight run, the corner itself, and where it is straight again. */
interface Corner {
  enter: PathPoint;
  at: PathPoint;
  leave: PathPoint;
}

/**
 * The corners of a polyline, each cut back by up to `radius` along both of
 * its runs. A run shorter than two radii is shared between its two corners,
 * and a point the line passes straight through is not a corner.
 */
function corners(points: readonly PathPoint[], radius: number): (Corner | null)[] {
  return points.map((at, i) => {
    const before = points[i - 1];
    const after = points[i + 1];
    if (!before || !after) return null;
    const inLength = Math.hypot(at.x - before.x, at.y - before.y);
    const outLength = Math.hypot(after.x - at.x, after.y - at.y);
    const cut = Math.min(radius, inLength / 2, outLength / 2);
    const turns = (at.x - before.x) * (after.y - at.y) - (at.y - before.y) * (after.x - at.x) !== 0;
    if (!turns || cut < 0.5) return null;
    return {
      enter: { x: at.x - ((at.x - before.x) / inLength) * cut, y: at.y - ((at.y - before.y) / inLength) * cut },
      at,
      leave: { x: at.x + ((after.x - at.x) / outLength) * cut, y: at.y + ((after.y - at.y) / outLength) * cut },
    };
  });
}

const rounded = (value: number): number => Math.round(value * 10) / 10;

/** Writes a polyline as an SVG path whose corners are curves. */
export function roundedPathData(points: readonly PathPoint[], radius: number = CORNER_RADIUS): string {
  const turns = corners(points, radius);
  return points
    .map((point, i) => {
      const corner = turns[i];
      if (!corner) return `${i === 0 ? "M" : "L"}${rounded(point.x)} ${rounded(point.y)}`;
      return `L${rounded(corner.enter.x)} ${rounded(corner.enter.y)} Q${rounded(corner.at.x)} ${rounded(corner.at.y)} ${rounded(corner.leave.x)} ${rounded(corner.leave.y)}`;
    })
    .join(" ");
}

/** The part of a canvas context a path is traced on. */
export interface PathTracer {
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
}

/** Traces a polyline on a canvas with the same curved corners as {@link roundedPathData}. */
export function traceRoundedPath(tracer: PathTracer, points: readonly PathPoint[], radius: number = CORNER_RADIUS): void {
  const turns = corners(points, radius);
  points.forEach((point, i) => {
    const corner = turns[i];
    if (i === 0) tracer.moveTo(point.x, point.y);
    else if (!corner) tracer.lineTo(point.x, point.y);
    else {
      tracer.lineTo(corner.enter.x, corner.enter.y);
      tracer.quadraticCurveTo(corner.at.x, corner.at.y, corner.leave.x, corner.leave.y);
    }
  });
}
