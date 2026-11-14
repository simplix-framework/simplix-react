import { readingOrder } from "./reading-order";
import { assignTracks } from "./tracks";
import type { TrackRange } from "./tracks";
import type { Id, Lane, ResolvedJump, ResolvedProcess, ResolvedStep } from "./types";

/**
 * A point of a grid cell a line can end at.
 *
 * - `top` · `bottom` · `left` · `right`: the middle of an edge
 * - `center`: where a node stands
 * - `side-top` · `side-bottom`: on the top or bottom edge, a little to the left of its middle,
 *   where a jump runs beside the line that comes down the middle of the lane
 * - `top-left` · `bottom-left` · `top-right` · `bottom-right`: a corner, where a rework line
 *   runs along the side of the cell
 */
export type SegmentEnd = "top" | "bottom" | "left" | "right" | "center" | "side-top" | "side-bottom" | "top-left" | "bottom-left" | "top-right" | "bottom-right";

/**
 * What a line stands for: the stated order between steps, a parallel run, the way into a step
 * that repeats, the order of the acts inside a step, a jump back, a jump ahead, a step sent back
 * to its own first act, or acts performed together.
 */
export type SegmentStyle = "flow" | "parallel" | "repeat" | "inner" | "back" | "skip" | "rework" | "joint";

/** One piece of a line inside one cell, from one of the cell's points to another. */
export interface Segment {
  from: SegmentEnd;
  to: SegmentEnd;
  style: SegmentStyle;
  /** An arrowhead at `to`, pointing the way the piece runs. */
  arrow?: boolean;
}

/** The lines of one cell. Cells without lines are not listed. */
export interface GridCell {
  row: number;
  column: number;
  segments: Segment[];
}

/** An act as it stands on a row of the grid. */
export interface GridAct {
  actId: Id;
  /** The lanes it has a node in, as indexes into {@link LaneGeometry.lanes}, ascending. */
  boxes: number[];
  /** The lane its line arrives in. */
  enter: number;
  /** Its place among the acts its step shows, from 1. */
  order: number;
}

/** One row of the lane grid, top to bottom. */
export type GridRow =
  | { kind: "start"; lane: number }
  | { kind: "end"; lane: number }
  | { kind: "section"; sectionId: Id }
  | { kind: "acts"; stepId: Id; acts: GridAct[] }
  | { kind: "flow" }
  | { kind: "gate"; stepId: Id }
  | { kind: "rework"; stepId: Id; lane: number; from: number }
  | { kind: "excluded"; stepId: Id }
  | { kind: "folded"; stepId: Id };

/** A step on the grid: the rows its title stands beside, and the jumps that leave and reach it. */
export interface StepSpan {
  stepId: Id;
  firstRow: number;
  lastRow: number;
  /** The jumps listed with the step: every drawn jump that leaves it, a line or not. */
  jumps: Id[];
  /** The jumps whose line arrives at the step. */
  arrivals: Id[];
  /** The step's first act, where its jumps leave and arrive: its row and its lane. */
  node: { row: number; lane: number };
}

/** The rows a parallel run covers. */
export interface GroupSpan {
  key: string;
  firstRow: number;
  lastRow: number;
}

/** The cell of the node a jump's line leaves, where its label is drawn, and whether it leaves over the row or on it. */
export interface JumpTag {
  jumpId: Id;
  row: number;
  column: number;
  gate: boolean;
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
  tags: JumpTag[];
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

/** Acts that stand on one row, joined left to right or right to left. */
interface SubRow {
  acts: GridAct[];
  /** The line from each act but the first to the one before it, as the lanes it leaves and arrives in. */
  links: { from: number; to: number }[];
  /** The lowest lane a node or a line of the row occupies. */
  lowest: number;
}

/** What {@link laneGeometry} takes besides the case. */
export interface LaneGeometryOptions {
  /** The lanes to draw, by id. Absent means every lane of the case. A step none of whose acts stands in one of them is folded. */
  lanes?: readonly Id[];
}

/** The pair of lanes, one from each list, that stand closest; the lower pair where two are as close. */
function nearest(from: readonly number[], to: readonly number[]): [number, number] {
  let best: [number, number] = [from[0], to[0]];
  for (const a of from) for (const b of to) if (Math.abs(a - b) < Math.abs(best[0] - best[1])) best = [a, b];
  return best;
}

/**
 * Splits a step's acts over rows. Acts stay on one row while each stands wholly to one side of
 * the act before it and the line to it crosses no lane the row already uses, so a row always
 * runs one way; an act that would turn back or cross starts the next row.
 */
function subRows(acts: { actId: Id; boxes: number[] }[]): SubRow[] {
  const rows: SubRow[] = [];
  let used = new Set<number>();
  acts.forEach((act, index) => {
    const low = act.boxes[0];
    const high = act.boxes[act.boxes.length - 1];
    const own = Array.from({ length: high - low + 1 }, (_, offset) => low + offset);
    const row = rows[rows.length - 1];
    const before = row?.acts[row.acts.length - 1];
    if (row !== undefined && before !== undefined) {
      const beforeLow = before.boxes[0];
      const beforeHigh = before.boxes[before.boxes.length - 1];
      const link = low > beforeHigh ? { from: beforeHigh, to: low } : high < beforeLow ? { from: beforeLow, to: high } : undefined;
      if (link !== undefined) {
        const crossed = Array.from({ length: Math.abs(link.to - link.from) - 1 }, (_, offset) => Math.min(link.from, link.to) + 1 + offset);
        if (![...crossed, ...own].some((lane) => used.has(lane))) {
          [...crossed, ...own].forEach((lane) => used.add(lane));
          row.acts.push({ actId: act.actId, boxes: act.boxes, enter: link.to, order: index + 1 });
          row.links.push(link);
          row.lowest = Math.min(row.lowest, low);
          return;
        }
      }
    }
    used = new Set(own);
    rows.push({ acts: [{ actId: act.actId, boxes: act.boxes, enter: low, order: index + 1 }], links: [], lowest: low });
  });
  return rows;
}

/**
 * Lays a case out as a lane grid.
 *
 * The acts of a step stand on one row, each a node in the column of its lane, joined in order;
 * an act that would make the row turn back starts another row of the same step. Between rows
 * runs a `flow` row that carries the line from one lane to the next.
 *
 * A jump leaves the first act of its step and arrives at the first act of its target. It runs
 * sideways on that act's own row where nothing stands to the act's left, and otherwise over a
 * `gate` row above it, dropping into the node beside the line that comes down the lane. Its
 * vertical part runs in a track column, and jumps into one step from one side share a track.
 *
 * A step with a rework line gets a `rework` row under its acts: the line leaves its last act,
 * crosses to the lane of its first, and climbs the side of that lane back into the first act.
 * Where that line joins a jump arriving on the row, both carry an arrowhead before they meet.
 */
export function laneGeometry(process: ResolvedProcess, options: LaneGeometryOptions = {}): LaneGeometry {
  const lanes = options.lanes === undefined ? process.lanes : process.lanes.filter((lane) => options.lanes!.includes(lane.id));
  const laneIndex = new Map(lanes.map((lane, index) => [lane.id, index]));
  const steps = new Map<Id, ResolvedStep>();
  for (const section of process.sections) for (const step of section.steps) steps.set(step.step.id, step);

  // The rows each step shows under the lanes drawn.
  const shown = new Map<Id, SubRow[]>();
  for (const [id, { acts, inclusion }] of steps) {
    if (inclusion === "excluded") continue;
    const list: { actId: Id; boxes: number[] }[] = [];
    for (const { act, inclusion: actInclusion } of acts) {
      if (actInclusion === "excluded") continue;
      const boxes = act.lanes.map((lane) => laneIndex.get(lane)).filter((index): index is number => index !== undefined);
      if (boxes.length > 0) list.push({ actId: act.id, boxes: [...boxes].sort((a, b) => a - b) });
    }
    if (list.length > 0) shown.set(id, subRows(list));
  }

  const lineJumps: ResolvedJump[] = process.jumps.filter((jump) => jump.direction !== "external" && jump.drawn && shown.has(jump.jump.from) && shown.has(jump.jump.to!));
  const leaving = new Map<Id, Id[]>();
  const lineLeaving = new Set<Id>();
  const arriving = new Map<Id, Id[]>();
  for (const jump of process.jumps) {
    const line = lineJumps.includes(jump);
    if (line || (jump.direction === "external" && jump.drawn && shown.has(jump.jump.from))) leaving.set(jump.jump.from, [...(leaving.get(jump.jump.from) ?? []), jump.jump.id]);
    if (line) {
      lineLeaving.add(jump.jump.from);
      arriving.set(jump.jump.to!, [...(arriving.get(jump.jump.to!) ?? []), jump.jump.id]);
    }
  }

  /** How a step's first act takes its jumps and its rework line. */
  interface Plan {
    /** The lane of the node the jumps leave and arrive at. */
    lane: number;
    /** Whether arriving jumps come over the gate row; otherwise they run on the node's own row. */
    arriveByGate: boolean;
    leaveByGate: boolean;
    /** The rework line: the lane it leaves from and the side of the first act's lane it climbs. */
    rework?: { from: number; side: "left" | "right" };
  }
  const plans = new Map<Id, Plan>();
  for (const [id, subs] of shown) {
    const lane = subs[0].acts[0].boxes[0];
    const lastSub = subs[subs.length - 1];
    const count = subs.reduce((sum, sub) => sum + sub.acts.length, 0);
    const from = nearest(lastSub.acts[lastSub.acts.length - 1].boxes, [lane])[0];
    const rework: Plan["rework"] = steps.get(id)!.step.rework !== undefined && count > 1 ? { from, side: from > lane ? "left" : "right" } : undefined;
    // Something of the row stands to the node's left: a jump cannot run there.
    const leftBusy = subs[0].lowest !== lane;
    const arrives = arriving.has(id);
    plans.set(id, {
      lane,
      arriveByGate: arrives && leftBusy,
      // One row takes the lines of one direction: a step that is reached keeps its row for the arrivals.
      leaveByGate: lineLeaving.has(id) && (leftBusy || arrives || rework?.side === "left"),
      rework,
    });
  }

  const rows: GridRow[] = [];
  const pending: Pending[] = [];
  const spans = new Map<Id, StepSpan>();
  const groups: GroupSpan[] = [];
  const gateRow = new Map<Id, number>();

  const add = (row: number, place: Place, from: SegmentEnd, to: SegmentEnd, style: SegmentStyle, arrow = false): Segment => {
    const segment: Segment = arrow ? { from, to, style, arrow } : { from, to, style };
    pending.push({ row, place, segment });
    return segment;
  };
  const pass = (row: number, lane: number, style: SegmentStyle): void => {
    add(row, { lane }, "top", "bottom", style);
  };
  /** Only the stated order and the order inside a step point; a parallel run and a repeat are drawn without a head. */
  const pointed = (style: SegmentStyle): boolean => style === "flow" || style === "inner";
  /** A row that carries the line from one lane down into another. */
  const connect = (from: number, to: number, style: SegmentStyle): void => {
    const row = rows.length;
    if (from === to) pass(row, to, style);
    else {
      const right = to > from;
      add(row, { lane: from }, "top", right ? "right" : "left", style);
      for (let lane = Math.min(from, to) + 1; lane < Math.max(from, to); lane += 1) add(row, { lane }, right ? "left" : "right", right ? "right" : "left", style);
      add(row, { lane: to }, right ? "left" : "right", "bottom", style);
    }
    rows.push({ kind: "flow" });
  };

  // The last act drawn, which the next line leaves from, and the rework row under it where it has one.
  let tail: { stepId: Id; row: number; boxes: number[]; reworkRow?: number } | undefined;
  let between: GridRow[] = [];
  let group: { key: string; firstRow: number } | undefined;
  let groupKey: string | undefined;

  /** Draws the line out of the last act down its lane, through the rework row where the step has one. */
  const leave = (from: NonNullable<typeof tail>, lane: number, style: SegmentStyle): void => {
    add(from.row, { lane }, "center", "bottom", style);
    if (from.reworkRow !== undefined) pass(from.reworkRow, lane, style);
  };

  for (const item of readingOrder(process)) {
    if (item.kind === "section") between.push({ kind: "section", sectionId: item.sectionId });
    else if (item.kind === "group-start") groupKey = item.key;
    else if (item.kind === "group-end") {
      if (group !== undefined) groups.push({ key: group.key, firstRow: group.firstRow, lastRow: rows.length - 1 });
      group = undefined;
      groupKey = undefined;
    } else if (item.kind === "step") {
      const subs = shown.get(item.stepId);
      if (subs === undefined) {
        between.push({ kind: item.inclusion === "excluded" ? "excluded" : "folded", stepId: item.stepId });
        continue;
      }
      const plan = plans.get(item.stepId)!;
      const head = subs[0].acts[0];
      // The line into a later member of a parallel run belongs to the run; the line into a step that repeats is the repeat's.
      const style: SegmentStyle = groupKey !== undefined && group !== undefined ? "parallel" : steps.get(item.stepId)!.step.repeat !== undefined ? "repeat" : "flow";
      if (tail === undefined) {
        for (const row of between) rows.push(row);
        head.enter = head.boxes[0];
        add(rows.length, { lane: head.enter }, "center", "bottom", style);
        rows.push({ kind: "start", lane: head.enter });
      } else {
        const [from, to] = nearest(tail.boxes, head.boxes);
        head.enter = to;
        leave(tail, from, style);
        connect(from, to, style);
        for (const row of between) {
          pass(rows.length, to, style);
          rows.push(row);
        }
      }
      between = [];
      if (groupKey !== undefined && group === undefined) group = { key: groupKey, firstRow: rows.length };
      const span: StepSpan = { stepId: item.stepId, firstRow: rows.length, lastRow: rows.length, jumps: leaving.get(item.stepId) ?? [], arrivals: arriving.get(item.stepId) ?? [], node: { row: rows.length, lane: plan.lane } };
      spans.set(item.stepId, span);
      if (plan.arriveByGate || plan.leaveByGate) {
        gateRow.set(item.stepId, rows.length);
        pass(rows.length, head.enter, style);
        rows.push({ kind: "gate", stepId: item.stepId });
      }
      span.node.row = rows.length;
      for (const [index, sub] of subs.entries()) {
        const first = sub.acts[0];
        if (index > 0 && tail !== undefined) {
          const [from, to] = nearest(tail.boxes, first.boxes);
          first.enter = to;
          add(tail.row, { lane: from }, "center", "bottom", "inner");
          connect(from, to, "inner");
        }
        const row = rows.length;
        const into: SegmentStyle = index === 0 ? style : "inner";
        add(row, { lane: first.enter }, "top", "center", into, pointed(into));
        for (const link of sub.links) {
          const right = link.to > link.from;
          add(row, { lane: link.from }, "center", right ? "right" : "left", "inner");
          for (let lane = Math.min(link.from, link.to) + 1; lane < Math.max(link.from, link.to); lane += 1) add(row, { lane }, right ? "left" : "right", right ? "right" : "left", "inner");
          add(row, { lane: link.to }, right ? "left" : "right", "center", "inner", true);
        }
        for (const act of sub.acts) {
          const low = act.boxes[0];
          const high = act.boxes[act.boxes.length - 1];
          for (let lane = low; lane <= high && low !== high; lane += 1) add(row, { lane }, lane === low ? "center" : "left", lane === high ? "center" : "right", "joint");
        }
        rows.push({ kind: "acts", stepId: item.stepId, acts: sub.acts });
        tail = { stepId: item.stepId, row, boxes: sub.acts[sub.acts.length - 1].boxes };
        span.lastRow = row;
      }
      if (plan.rework !== undefined && tail !== undefined) {
        const row = rows.length;
        const { from, side } = plan.rework;
        const left = side === "left";
        // From the last act's lane across to the first act's lane, where the turn-back node stands.
        if (from !== plan.lane) {
          add(row, { lane: from }, "center", left ? "left" : "right", "rework");
          for (let lane = Math.min(from, plan.lane) + 1; lane < Math.max(from, plan.lane); lane += 1) add(row, { lane }, left ? "right" : "left", left ? "left" : "right", "rework");
          add(row, { lane: plan.lane }, left ? "right" : "left", "center", "rework", true);
        }
        // Up the side of the first act's lane and into the first act. A jump arriving on that row
        // shares the last stretch, so the climbing line carries a head of its own before they meet.
        const merges = left && arriving.has(item.stepId) && !plan.arriveByGate;
        add(row, { lane: plan.lane }, "center", left ? "top-left" : "top-right", "rework", merges && row - 1 === span.node.row);
        for (let above = row - 1; above > span.node.row; above -= 1) add(above, { lane: plan.lane }, left ? "bottom-left" : "bottom-right", left ? "top-left" : "top-right", "rework", merges && above - 1 === span.node.row);
        add(span.node.row, { lane: plan.lane }, left ? "bottom-left" : "bottom-right", "center", "rework", true);
        rows.push({ kind: "rework", stepId: item.stepId, lane: plan.lane, from });
        tail.reworkRow = row;
        span.lastRow = row;
      }
    }
  }

  if (tail === undefined) for (const row of between) rows.push(row);
  else {
    const lane = tail.boxes[0];
    leave(tail, lane, "flow");
    for (const row of between) {
      pass(rows.length, lane, "flow");
      rows.push(row);
    }
    add(rows.length, { lane }, "top", "center", "flow");
    rows.push({ kind: "end", lane });
  }

  /** The row a step's jumps turn into their track on: the gate row, or the row of its first act. */
  const turnRow = (id: Id, byGate: boolean): number => (byGate ? gateRow.get(id)! : spans.get(id)!.node.row);

  // Jumps into one step from one side share a track; a track is held from the highest row to the lowest row the jumps touch.
  const ranges: (TrackRange & { to: Id; direction: "back" | "skip"; from: Id[] })[] = [];
  for (const jump of lineJumps) {
    const direction = jump.direction as "back" | "skip";
    const to = jump.jump.to!;
    const touched = [turnRow(jump.jump.from, plans.get(jump.jump.from)!.leaveByGate), turnRow(to, plans.get(to)!.arriveByGate)];
    const range = ranges.find((candidate) => candidate.to === to && candidate.direction === direction);
    if (range === undefined) ranges.push({ to, direction, from: [jump.jump.from], low: Math.min(...touched), high: Math.max(...touched) });
    else {
      if (!range.from.includes(jump.jump.from)) range.from.push(jump.jump.from);
      range.low = Math.min(range.low, ...touched);
      range.high = Math.max(range.high, ...touched);
    }
  }
  const tracks = assignTracks(ranges);
  const trackCount = tracks.length === 0 ? 0 : Math.max(...tracks) + 1;

  ranges.forEach((range, index) => {
    const track = tracks[index];
    const style: SegmentStyle = range.direction;
    /** The sideways run between a track and a lane, drawn the way the line travels; `head` puts an arrowhead on its last piece before the lane. */
    const run = (row: number, lane: number, toward: "track" | "lane", head = false): void => {
      const [from, to]: [SegmentEnd, SegmentEnd] = toward === "lane" ? ["left", "right"] : ["right", "left"];
      for (let inner = 0; inner < track; inner += 1) add(row, { track: inner }, from, to, style, head && lane === 0 && inner === 0);
      for (let crossed = 0; crossed < lane; crossed += 1) add(row, { lane: crossed }, from, to, style, head && crossed === lane - 1);
    };
    const target = plans.get(range.to)!;
    const node = spans.get(range.to)!.node;
    const arrival = turnRow(range.to, target.arriveByGate);
    // Where the arriving line shares its last stretch with a rework line, it carries a head before they meet.
    const merges = !target.arriveByGate && target.rework?.side === "left";
    add(arrival, { track }, range.direction === "back" ? "bottom" : "top", "right", style, merges && node.lane === 0 && track === 0);
    run(arrival, node.lane, "lane", merges);
    if (target.arriveByGate) {
      add(arrival, { lane: node.lane }, "left", "side-bottom", style);
      add(node.row, { lane: node.lane }, "side-top", "center", style, true);
    } else add(node.row, { lane: node.lane }, "left", "center", style, true);
    for (const from of range.from) {
      const source = plans.get(from)!;
      const start = spans.get(from)!.node;
      const exit = turnRow(from, source.leaveByGate);
      if (source.leaveByGate) {
        add(start.row, { lane: start.lane }, "center", "side-top", style);
        add(exit, { lane: start.lane }, "side-bottom", "left", style);
      } else add(start.row, { lane: start.lane }, "center", "left", style);
      run(exit, start.lane, "track");
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
    steps: [...spans.values()],
    groups,
    tags: lineJumps.map((jump) => {
      const node = spans.get(jump.jump.from)!.node;
      return { jumpId: jump.jump.id, row: node.row, column: laneColumn(geometry, node.lane), gate: plans.get(jump.jump.from)!.leaveByGate };
    }),
  };
}
