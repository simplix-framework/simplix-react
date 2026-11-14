/** How a procedure is laid out: every lane side by side, the lane grid scrolled sideways, or one column. */
export type LayoutMode = "lanes" | "lanes-scroll" | "stack";

/** The widths the choice of a layout is made from, in CSS pixels. */
export interface LayoutMetrics {
  /** Width of the column of step titles. */
  titleWidth: number;
  /** Width of one track column. */
  trackWidth: number;
  /** The narrowest a lane column may be drawn. */
  laneMinWidth: number;
  /** Below this width of the container the procedure is drawn as one column. */
  stackBelow: number;
  /** How much wider than a threshold the container has to be before a narrower layout is left again. */
  slack: number;
}

/** The widths used where the caller states none. */
export const DEFAULT_LAYOUT_METRICS: LayoutMetrics = {
  titleWidth: 176,
  trackWidth: 16,
  laneMinWidth: 120,
  stackBelow: 560,
  slack: 24,
};

/** The width the lane grid needs to show every lane at its narrowest. */
export function requiredWidth(laneCount: number, trackCount: number, metrics: LayoutMetrics = DEFAULT_LAYOUT_METRICS): number {
  return metrics.titleWidth + trackCount * metrics.trackWidth + laneCount * metrics.laneMinWidth;
}

/** What {@link chooseLayout} decides from. */
export interface LayoutInput {
  /** Inline size of the box the procedure is drawn in. */
  width: number;
  laneCount: number;
  trackCount: number;
  /** The layout in use now, when there is one. */
  previous?: LayoutMode;
}

/**
 * Chooses a layout from the width of the container and what the grid has to hold.
 *
 * A width that sits on a threshold would otherwise flip the layout on every pixel of resizing, so
 * a layout once narrowed is kept until the container is wider than the threshold by `slack`.
 */
export function chooseLayout(input: LayoutInput, metrics: LayoutMetrics = DEFAULT_LAYOUT_METRICS): LayoutMode {
  const { width, previous } = input;
  const stackBelow = previous === "stack" ? metrics.stackBelow + metrics.slack : metrics.stackBelow;
  if (width < stackBelow) return "stack";
  const fits = requiredWidth(input.laneCount, input.trackCount, metrics);
  return width >= (previous === "lanes" || previous === undefined ? fits : fits + metrics.slack) ? "lanes" : "lanes-scroll";
}
