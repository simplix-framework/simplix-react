import { MINUTES_PER_DAY, dayIndexOf, fromCivil, toCivil, weekdayOfDay } from "@simplix-react/gantt-core";
import type { Minutes } from "@simplix-react/gantt-core";

/** A tier of the timeline header. */
export type ScaleUnit = "hour" | "day" | "week" | "month" | "quarter" | "year";

/** One zoom step: how wide a day is drawn and what the two header rows count. */
export interface ZoomLevel {
  pxPerDay: number;
  top: ScaleUnit;
  bottom: ScaleUnit;
}

/** Zoom steps from the widest view to the closest. */
export const ZOOM_LEVELS: readonly ZoomLevel[] = [
  { pxPerDay: 0.75, top: "year", bottom: "quarter" },
  { pxPerDay: 2, top: "year", bottom: "month" },
  { pxPerDay: 5, top: "quarter", bottom: "month" },
  { pxPerDay: 12, top: "month", bottom: "week" },
  { pxPerDay: 28, top: "month", bottom: "day" },
  { pxPerDay: 56, top: "week", bottom: "day" },
  { pxPerDay: 480, top: "day", bottom: "hour" },
];

/** Index of the zoom step a chart opens at: one day is a readable column. */
export const DEFAULT_ZOOM = 4;

/** Maps instants to horizontal pixels over a fixed range of whole days. */
export interface TimeScale {
  /** First instant drawn; midnight. */
  start: Minutes;
  /** Instant at the right edge; midnight. */
  end: Minutes;
  pxPerDay: number;
  width: number;
  x(t: Minutes): number;
  /** The instant at a pixel, rounded to `snap` minutes. */
  at(x: number, snap?: number): Minutes;
}

/**
 * Builds a scale covering `from` to `to`, widened to whole days and by
 * `paddingDays` on both sides.
 */
export function createTimeScale(from: Minutes, to: Minutes, pxPerDay: number, paddingDays = 7): TimeScale {
  const start = (dayIndexOf(from) - paddingDays) * MINUTES_PER_DAY;
  const end = (dayIndexOf(Math.max(to, from)) + 1 + paddingDays) * MINUTES_PER_DAY;
  const pxPerMinute = pxPerDay / MINUTES_PER_DAY;
  return {
    start,
    end,
    pxPerDay,
    width: (end - start) * pxPerMinute,
    x: (t) => (t - start) * pxPerMinute,
    at: (x, snap = 1) => start + Math.round(x / pxPerMinute / snap) * snap,
  };
}

/** A header cell: the span one unit covers, clipped to the scale. */
export interface ScaleCell {
  from: Minutes;
  to: Minutes;
  x: number;
  width: number;
}

function unitStart(t: Minutes, unit: ScaleUnit, weekStartsOn: number): Minutes {
  const c = toCivil(t);
  switch (unit) {
    case "hour":
      return fromCivil(c.year, c.month, c.day, c.hour);
    case "day":
      return fromCivil(c.year, c.month, c.day);
    case "week": {
      const day = dayIndexOf(t);
      return (day - ((weekdayOfDay(day) - weekStartsOn + 7) % 7)) * MINUTES_PER_DAY;
    }
    case "month":
      return fromCivil(c.year, c.month, 1);
    case "quarter":
      return fromCivil(c.year, c.month - ((c.month - 1) % 3), 1);
    case "year":
      return fromCivil(c.year, 1, 1);
  }
}

function nextUnit(t: Minutes, unit: ScaleUnit): Minutes {
  const c = toCivil(t);
  switch (unit) {
    case "hour":
      return t + 60;
    case "day":
      return t + MINUTES_PER_DAY;
    case "week":
      return t + 7 * MINUTES_PER_DAY;
    case "month":
      return c.month === 12 ? fromCivil(c.year + 1, 1, 1) : fromCivil(c.year, c.month + 1, 1);
    case "quarter":
      return c.month >= 10 ? fromCivil(c.year + 1, 1, 1) : fromCivil(c.year, c.month + 3, 1);
    case "year":
      return fromCivil(c.year + 1, 1, 1);
  }
}

/**
 * The header cells of one unit between two pixels of the scale. Only the
 * cells that intersect the pixel range are returned, so a long plan costs no
 * more than what is on screen.
 */
export function scaleCells(scale: TimeScale, unit: ScaleUnit, fromX: number, toX: number, weekStartsOn = 0): ScaleCell[] {
  const first = Math.max(scale.start, scale.at(Math.max(0, fromX)));
  const last = Math.min(scale.end, scale.at(Math.min(scale.width, toX)));
  const cells: ScaleCell[] = [];
  for (let from = unitStart(first, unit, weekStartsOn); from < last; from = nextUnit(from, unit)) {
    const to = nextUnit(from, unit);
    const clippedFrom = Math.max(from, scale.start);
    const clippedTo = Math.min(to, scale.end);
    if (clippedTo <= clippedFrom) continue;
    cells.push({ from, to, x: scale.x(clippedFrom), width: scale.x(clippedTo) - scale.x(clippedFrom) });
  }
  return cells;
}
