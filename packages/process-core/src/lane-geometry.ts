import { readingOrder } from "./reading-order";
import { assignTracks } from "./tracks";
import type { TrackRange } from "./tracks";
import type { Id, Lane, ResolvedJump, ResolvedProcess, ResolvedStep } from "./types";

/** A point of a grid cell a line can end at: the middle of one of its edges, or its centre. */
export type SegmentEnd = "top" | "bottom" | "left" | "right" | "center";

/** What a line stands for: the stated order, a parallel run, a jump back, a jump ahead, or acts performed together. */
export type SegmentStyle = "flow" | "parallel" | "back" | "skip" | "joint";

/** One piece of a line inside one cell, from one of the cell's points to another. */
export interface Segment {
  from: SegmentEnd;
  to: SegmentEnd;
  style: SegmentStyle;
  /** An arrowhead at `to`. */
  arrow?: boolean;
}

/** The lines of one cell. Cells without lines are not listed. */
export interface GridCell {
  row: number;
  column: number;
  segments: Segment[];
}

/** One row of the lane grid, top to bottom. */
export type GridRow =
  | { kind: "start"; lane: number }
  | { kind: "end"; lane: number }
  | { kind: "section"; sectionId: Id }
  | { kind: "act"; stepId: Id; actId: Id; primary: number; boxes: number[] }
  | { kind: "flow" }
  | { kind: "exit"; stepId: Id; jumps: Id[] }
  | { kind: "entry"; stepId: Id }
  | { kind: "excluded"; stepId: Id }
  | { kind: "folded"; stepId: Id };

/** The rows a step's title stands beside: its first act row to its last. */
export interface StepSpan {
  stepId: Id;
  firstRow: number;
  lastRow: number;
}

/** The rows a parallel run covers. */
export interface GroupSpan {
  key: string;
  firstRow: number;
  lastRow: number;
}

/**
 * A case laid out on a grid, in grid coordinates only.
 *
 * Column 0 holds the step titles. Columns `1..trackCount` are the tracks jumps travel in, the
 * innermost (track 0) last. The lanes follow, one column each. Heights and widths are left to
 * whatever draws the grid; every line is stated as pieces inside single cells, so nothing has to
 * be measured to draw it.
 */
export interface LaneGeometry {
  lanes: Lane[];
  trackCount: number;
  rows: GridRow[];
  cells: GridCell[];
  steps: StepSpan[];
  groups: GroupSpan[];
}

/** The column a track is drawn in. */
export function trackColumn(geometry: Pick<LaneGeometry, "trackCount">, track: number): number {
  return geometry.trackCount - track;
}

/** The column a lane is drawn in, by its index in {@link LaneGeometry.lanes}. */
export function laneColumn(geometry: Pick<LaneGeometry, "trackCount">, lane: number): number {
  return 1 + geometry.trackCount + lane;
}

type Place = { lane: number } | { track: number };

interface Pending {
  row: number;
  place: Place;
  segment: Segment;
}

interface ShownAct {
  actId: Id;
  primary: number;
  boxes: number[];
}

/** What {@link laneGeometry} takes besides the case. */
export interface LaneGeometryOptions {
  /** The lanes to draw, by id. Absent means every lane of the case. A step none of whose acts stands in one of them is folded. */
  lanes?: readonly Id[];
}

/**
 * Lays a case out as a lane grid.
 *
 * Every act stands on a row of its own in the column of its first drawn lane. Between two acts
 * runs a `flow` row that carries the line from one lane to the next. A step that jumps leaves
 * through an `exit` row below its last act, a step jumped to is entered through an `entry` row
 * above its first; the vertical part of a jump runs in a track column, and jumps into one step
 * from one side share a track.
 */
export function laneGeometry(process: ResolvedProcess, options: LaneGeometryOptions = {}): LaneGeometry {
  const lanes = options.lanes === undefined ? process.lanes : process.lanes.filter((lane) => options.lanes!.includes(lane.id));
  const laneIndex = new Map(lanes.map((lane, index) => [lane.id, index]));
  const steps = new Map<Id, ResolvedStep>();
  for (const section of process.sections) for (const step of section.steps) steps.set(step.step.id, step);

  // The acts each step shows under the lanes drawn.
  const shown = new Map<Id, ShownAct[]>();
  for (const [id, { acts, inclusion }] of steps) {
    if (inclusion === "excluded") continue;
    const list: ShownAct[] = [];
    for (const { act, inclusion: actInclusion } of acts) {
      if (actInclusion === "excluded") continue;
      const boxes = act.lanes.map((lane) => laneIndex.get(lane)).filter((index): index is number => index !== undefined);
      if (boxes.length > 0) list.push({ actId: act.id, primary: boxes[0], boxes });
    }
    if (list.length > 0) shown.set(id, list);
  }

  const lineJumps: ResolvedJump[] = process.jumps.filter((jump) => jump.direction !== "external" && jump.drawn && shown.has(jump.jump.from) && shown.has(jump.jump.to!));
  const leaving = new Map<Id, Id[]>();
  for (const jump of process.jumps) {
    const drawn = jump.direction === "external" ? jump.drawn && shown.has(jump.jump.from) : lineJumps.includes(jump);
    if (drawn) leaving.set(jump.jump.from, [...(leaving.get(jump.jump.from) ?? []), jump.jump.id]);
  }
  const entered = new Set(lineJumps.map((jump) => jump.jump.to!));

  const rows: GridRow[] = [];
  const pending: Pending[] = [];
  const spans: StepSpan[] = [];
  const groups: GroupSpan[] = [];
  const exitRow = new Map<Id, number>();
  const entryRow = new Map<Id, number>();
  const firstLane = new Map<Id, number>();
  const lastLane = new Map<Id, number>();

  const add = (row: number, place: Place, from: SegmentEnd, to: SegmentEnd, style: SegmentStyle, arrow = false): Segment => {
    const segment: Segment = arrow ? { from, to, style, arrow } : { from, to, style };
    pending.push({ row, place, segment });
    return segment;
  };
  const pass = (row: number, lane: number, style: SegmentStyle): void => {
    add(row, { lane }, "top", "bottom", style);
  };

  let previous: { stepId: Id; lane: number } | undefined;
  // The lower half of the last act drawn: it takes the style of whatever line leaves it, known only when the next step arrives.
  let leavingHalf: Segment | undefined;
  let between: GridRow[] = [];
  let group: { key: string; firstRow: number } | undefined;
  let groupKey: string | undefined;

  const closeStep = (style: SegmentStyle): void => {
    if (previous === undefined) return;
    const jumps = leaving.get(previous.stepId);
    if (jumps === undefined) return;
    exitRow.set(previous.stepId, rows.length);
    pass(rows.length, previous.lane, style);
    rows.push({ kind: "exit", stepId: previous.stepId, jumps });
  };

  const connect = (lane: number, style: SegmentStyle): void => {
    const row = rows.length;
    if (previous === undefined) return;
    const from = previous.lane;
    if (from === lane) pass(row, lane, style);
    else {
      const right = lane > from;
      add(row, { lane: from }, "top", right ? "right" : "left", style);
      for (let index = Math.min(from, lane) + 1; index < Math.max(from, lane); index += 1) add(row, { lane: index }, "left", "right", style);
      add(row, { lane }, right ? "left" : "right", "bottom", style);
    }
    rows.push({ kind: "flow" });
  };

  for (const item of readingOrder(process)) {
    if (item.kind === "section") between.push({ kind: "section", sectionId: item.sectionId });
    else if (item.kind === "group-start") groupKey = item.key;
    else if (item.kind === "group-end") {
      if (group !== undefined) groups.push({ key: group.key, firstRow: group.firstRow, lastRow: rows.length - 1 });
      group = undefined;
      groupKey = undefined;
    } else if (item.kind === "step") {
      const acts = shown.get(item.stepId);
      if (acts === undefined) {
        between.push({ kind: item.inclusion === "excluded" ? "excluded" : "folded", stepId: item.stepId });
        continue;
      }
      const lane = acts[0].primary;
      // The line into a member of a parallel run is drawn as part of the run, except into its first member.
      const style: SegmentStyle = groupKey !== undefined && group !== undefined ? "parallel" : "flow";
      if (leavingHalf !== undefined) leavingHalf.style = style;
      closeStep(style);
      if (previous === undefined) {
        for (const row of between) rows.push(row);
        add(rows.length, { lane }, "center", "bottom", style);
        rows.push({ kind: "start", lane });
      } else {
        connect(lane, style);
        for (const row of between) {
          pass(rows.length, lane, style);
          rows.push(row);
        }
      }
      between = [];
      if (groupKey !== undefined && group === undefined) group = { key: groupKey, firstRow: rows.length };
      if (entered.has(item.stepId)) {
        entryRow.set(item.stepId, rows.length);
        pass(rows.length, lane, style);
        rows.push({ kind: "entry", stepId: item.stepId });
      }
      firstLane.set(item.stepId, lane);
      const firstRow = rows.length;
      for (const [position, act] of acts.entries()) {
        if (position > 0) connect(act.primary, "flow");
        const row = rows.length;
        add(row, { lane: act.primary }, "top", "center", position === 0 ? style : "flow", true);
        leavingHalf = add(row, { lane: act.primary }, "center", "bottom", "flow");
        const low = Math.min(...act.boxes);
        const high = Math.max(...act.boxes);
        for (let box = low; box <= high && low !== high; box += 1) {
          add(row, { lane: box }, box === low ? "center" : "left", box === high ? "center" : "right", "joint");
        }
        rows.push({ kind: "act", stepId: item.stepId, actId: act.actId, primary: act.primary, boxes: [...act.boxes].sort((a, b) => a - b) });
        previous = { stepId: item.stepId, lane: act.primary };
      }
      lastLane.set(item.stepId, acts[acts.length - 1].primary);
      spans.push({ stepId: item.stepId, firstRow, lastRow: rows.length - 1 });
    }
  }

  closeStep("flow");
  if (previous === undefined) for (const row of between) rows.push(row);
  else {
    for (const row of between) {
      pass(rows.length, previous.lane, "flow");
      rows.push(row);
    }
    add(rows.length, { lane: previous.lane }, "top", "center", "flow");
    rows.push({ kind: "end", lane: previous.lane });
  }

  // Jumps into one step from one side share a track; a track is held from the highest row to the lowest row the jumps touch.
  const ranges: (TrackRange & { to: Id; direction: "back" | "skip"; from: Id[] })[] = [];
  for (const jump of lineJumps) {
    const direction = jump.direction as "back" | "skip";
    const to = jump.jump.to!;
    const rowsTouched = [exitRow.get(jump.jump.from)!, entryRow.get(to)!];
    const range = ranges.find((candidate) => candidate.to === to && candidate.direction === direction);
    if (range === undefined) ranges.push({ to, direction, from: [jump.jump.from], low: Math.min(...rowsTouched), high: Math.max(...rowsTouched) });
    else {
      if (!range.from.includes(jump.jump.from)) range.from.push(jump.jump.from);
      range.low = Math.min(range.low, ...rowsTouched);
      range.high = Math.max(range.high, ...rowsTouched);
    }
  }
  const tracks = assignTracks(ranges);
  const trackCount = tracks.length === 0 ? 0 : Math.max(...tracks) + 1;

  ranges.forEach((range, index) => {
    const track = tracks[index];
    const style: SegmentStyle = range.direction;
    const run = (row: number, lane: number): void => {
      for (let inner = 0; inner < track; inner += 1) add(row, { track: inner }, "left", "right", style);
      for (let crossed = 0; crossed < lane; crossed += 1) add(row, { lane: crossed }, "left", "right", style);
    };
    const entry = entryRow.get(range.to)!;
    add(entry, { track }, range.direction === "back" ? "bottom" : "top", "right", style);
    run(entry, firstLane.get(range.to)!);
    add(entry, { lane: firstLane.get(range.to)! }, "left", "center", style, true);
    for (const from of range.from) {
      const exit = exitRow.get(from)!;
      add(exit, { lane: lastLane.get(from)! }, "center", "left", style);
      run(exit, lastLane.get(from)!);
      add(exit, { track }, "right", range.direction === "back" ? "top" : "bottom", style);
    }
    for (let row = range.low + 1; row < range.high; row += 1) add(row, { track }, "top", "bottom", style);
  });

  const geometry = { trackCount };
  const cells = new Map<string, GridCell>();
  for (const { row, place, segment } of pending) {
    const column = "lane" in place ? laneColumn(geometry, place.lane) : trackColumn(geometry, place.track);
    const key = `${row}:${column}`;
    const cell = cells.get(key) ?? { row, column, segments: [] };
    const same = cell.segments.find((other) => other.from === segment.from && other.to === segment.to && other.style === segment.style);
    if (same === undefined) cell.segments.push(segment);
    else if (segment.arrow) same.arrow = true;
    cells.set(key, cell);
  }
  return {
    lanes,
    trackCount,
    rows,
    cells: [...cells.values()].sort((a, b) => a.row - b.row || a.column - b.column),
    steps: spans,
    groups,
  };
}
