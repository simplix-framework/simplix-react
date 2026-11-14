import type { Facts, Id, LayoutMetrics, LayoutMode, ProcessDefinition, ProcessRunState } from "@simplix-react/process-core";
import type { ReactNode } from "react";

/** What a reader picked: a step, an act or a jump, with the `ref` an act carries. */
export interface ProcessTarget {
  kind: "step" | "act" | "jump";
  id: Id;
  /** The act's own `ref`, where the target is an act that states one. */
  ref?: string;
}

/** Props of {@link ProcessLanes}. */
export interface ProcessLanesProps {
  /** A definition `validateDefinition` finds nothing wrong with. */
  definition: ProcessDefinition;
  /** The facts of the case shown. Left out, every condition is undecided and its step is marked conditional. */
  facts?: Facts;
  /** The progress of a running case. Left out, the definition is drawn on its own. */
  run?: ProcessRunState;
  /**
   * `auto` chooses from the width of the box the component stands in and the lanes it has to
   * show; `lanes` and `stack` keep one layout whatever the width.
   * @defaultValue "auto"
   */
  layout?: "auto" | "lanes" | "stack";
  /** The layout drawn before the box has been measured, on a server or on the first paint. @defaultValue "lanes" */
  defaultLayout?: LayoutMode;
  /** Widths the choice of a layout is made from, where they differ from the defaults. */
  metrics?: Partial<LayoutMetrics>;
  /** The lanes to draw, by id. Left out, the component keeps the choice itself and starts with every lane. */
  visibleLanes?: readonly Id[];
  /** Called with the lanes to draw when the reader changes them. */
  onVisibleLanesChange?: (lanes: Id[]) => void;
  /** The lanes the reader holds, by id: drawn with a tint of their own and named as the reader's. */
  highlightLanes?: readonly Id[];
  /** Draws the row of lane toggles above the procedure. @defaultValue false */
  laneFilter?: boolean;
  /** What is picked now. */
  selected?: ProcessTarget | null;
  /** Called when the reader picks a step, an act or a jump. */
  onSelect?: (target: ProcessTarget) => void;
  /** What to draw for the picked target: under the lane grid, or inside the step's card in one column. */
  renderDetail?: (target: ProcessTarget) => ReactNode;
  /** Scrolls the step in progress into view when the procedure is first drawn. @defaultValue true */
  scrollToActive?: boolean;
  className?: string;
}
