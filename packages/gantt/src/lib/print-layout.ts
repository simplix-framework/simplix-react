import { MINUTES_PER_DAY } from "@simplix-react/gantt-core";

import { ZOOM_LEVELS } from "./time-scale";
import type { ZoomLevel } from "./time-scale";

/** Width, in CSS pixels, a landscape A4 page leaves between its margins. */
export const PRINT_WIDTH = 1040;

/** A plan may be shrunk to this share of its size before a coarser scale is used instead. */
const MIN_PRINT_SCALE = 0.6;

/** The closest zoom step at which a plan of `minutes` still fits the page width without shrinking too far. */
export function printLevel(minutes: number, gridWidth: number): ZoomLevel {
  const days = minutes / MINUTES_PER_DAY + 3;
  const room = PRINT_WIDTH / MIN_PRINT_SCALE - gridWidth;
  for (let i = ZOOM_LEVELS.length - 1; i > 0; i--) {
    if (days * ZOOM_LEVELS[i].pxPerDay <= room) return ZOOM_LEVELS[i];
  }
  return ZOOM_LEVELS[0];
}
