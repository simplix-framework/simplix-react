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
 *   where a line from a gate row runs beside the line that comes down the middle of the lane
 * - `rside-top` · `rside-bottom`: the same a little to the right of the middle
 */
export type SegmentEnd = "top" | "bottom" | "left" | "right" | "center" | "side-top" | "side-bottom" | "rside-top" | "rside-bottom";

/** Which side of the lanes a line runs on: lines that go up run on the left, lines that go down on the right. */
export type TrackSide = "left" | "right";

/**
 * What a line stands for: the stated order between steps, the way into a step that repeats, the order of the acts inside a step, a jump back, a jump ahead, a step sent back
 * to its own first act, or acts performed together.
 */
export type SegmentStyle = "flow" | "repeat" | "inner" | "back" | "skip" | "rework" | "joint";

/** One piece of a line inside one cell, from one of the cell's points to another. */
export interface Segment {
  from: SegmentEnd;
  to: SegmentEnd;
  style: SegmentStyle;
  /** An arrowhead at `to`, pointing the way the piece runs. */
  arrow?: boolean;
  /** A second arrowhead just past the bend, on a piece that turns into a line already running: it shows the way the two go on. */
  tail?: boolean;
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
  /**
   * The step's first act, where its jumps leave and arrive: its row, the lane lines on the left
   * join it in, and the lane lines on the right join it in. The two differ only where the first
   * act is performed by several lanes together.
   */
  node: { row: number; lane: number; rightLane: number };
}

/** The rows a parallel run covers. */
export interface GroupSpan {
  key: string;
  firstRow: number;
  lastRow: number;
}

/** The cell of the node a jump's line leaves, where its label is drawn: the side it leaves by, and whether it leaves over the row or on it. */
export interface JumpTag {
  jumpId: Id;
  row: number;
  column: number;
  side: TrackSide;
  gate: boolean;
}

/**
 * A case laid out on a grid, in grid coordinates only.
 *
 * Column 0 holds the step titles. Then come the tracks lines that go up travel in, the lanes one
 * column each, and the tracks lines that go down travel in; of each set of tracks the innermost
 * (track 0) stands next to the lanes. Heights and widths are left to whatever draws the grid;
 * every line is stated as pieces inside single cells, so nothing has to be measured to draw it.
 */
export interface LaneGeometry {
  lanes: Lane[];
  /** Tracks left of the lanes. */
  leftTracks: number;
  /** Tracks right of the lanes. */
  rightTracks: number;
  /** Both together. */
  trackCount: number;
  rows: GridRow[];
  cells: GridCell[];
  steps: StepSpan[];
  groups: GroupSpan[];
  tags: JumpTag[];
}

type Columns = Pick<LaneGeometry, "leftTracks"> & { lanes: readonly unknown[] };

/** The column a track is drawn in. */
export function trackColumn(geometry: Columns, track: number, side: TrackSide = "left"): number {
  return side === "left" ? geometry.leftTracks - track : 1 + geometry.leftTracks + geometry.lanes.length + track;
}

/** The column a lane is drawn in, by its index in {@link LaneGeometry.lanes}. */
export function laneColumn(geometry: Pick<LaneGeometry, "leftTracks">, lane: number): number {
  return 1 + geometry.leftTracks + lane;
}

type Place = { lane: number } | { track: number; side: TrackSide };

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
  /** The lowest and the highest lane a node or a line of the row occupies. */
  lowest: number;
  highest: number;
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
          row.highest = Math.max(row.highest, high);
          return;
        }
      }
    }
    used = new Set(own);
    rows.push({ acts: [{ actId: act.actId, boxes: act.boxes, enter: low, order: index + 1 }], links: [], lowest: low, highest: high });
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
 * A jump leaves the first act of its step and arrives at the first act of its target. A line
 * that goes up, a jump back or a rework line, runs on the left of the lanes and joins its nodes
 * from the left; a jump ahead goes down on the right and joins its nodes from the right. On
 * either side a line runs on the act's own row where nothing stands on that side of the act, and
 * otherwise over a `gate` row above it, dropping into the node beside the lane's own line.
 *
 * A step with a rework line gets a `rework` row under its acts: the line leaves its last act,
 * crosses to a turn-back node, and comes back into the first act the way a jump back does.
 *
 * Every line that arrives at one step on one side travels in one track column, so their vertical
 * parts stand on one line.
 *
 * A parallel run forks and joins. The line from the step before it reaches a row above the run
 * and drops from there into the first act of each of its steps; the lines out of their last acts
 * meet on a row below the run, and one line goes on from there. A branch drops straight down its
 * lane where no node of another step of the run stands in the way, and otherwise goes round by a
 * track on the right.
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
  const sideOf = (jump: ResolvedJump): TrackSide => (jump.direction === "back" ? "left" : "right");
  const leaving = new Map<Id, Id[]>();
  const arriving = new Map<Id, Id[]>();
  /** The steps a line leaves and the steps a line reaches, on each side. */
  const leaves: Record<TrackSide, Set<Id>> = { left: new Set(), right: new Set() };
  const reaches: Record<TrackSide, Set<Id>> = { left: new Set(), right: new Set() };
  for (const jump of process.jumps) {
    const line = lineJumps.includes(jump);
    if (line || (jump.direction === "external" && jump.drawn && shown.has(jump.jump.from))) leaving.set(jump.jump.from, [...(leaving.get(jump.jump.from) ?? []), jump.jump.id]);
    if (line) {
      leaves[sideOf(jump)].add(jump.jump.from);
      reaches[sideOf(jump)].add(jump.jump.to!);
      arriving.set(jump.jump.to!, [...(arriving.get(jump.jump.to!) ?? []), jump.jump.id]);
    }
  }

  /** How a step's first act takes the lines of one side. */
  interface SidePlan {
    /** The lane of the node those lines join. */
    lane: number;
    /** Whether arriving lines come over the gate row; otherwise they run on the node's own row. */
    arriveByGate: boolean;
    leaveByGate: boolean;
  }
  interface Plan {
    left: SidePlan;
    right: SidePlan;
    /** The rework line: the lane it leaves from, and the lane its turn-back node stands in. */
    rework?: { from: number; turn: number };
  }
  const plans = new Map<Id, Plan>();
  for (const [id, subs] of shown) {
    const head = subs[0].acts[0];
    const lane = head.boxes[0];
    const rightLane = head.boxes[head.boxes.length - 1];
    const lastSub = subs[subs.length - 1];
    const count = subs.reduce((sum, sub) => sum + sub.acts.length, 0);
    const from = nearest(lastSub.acts[lastSub.acts.length - 1].boxes, [lane])[0];
    // The turn-back node stands under the first act where the line passes that lane on its way left.
    const rework: Plan["rework"] = steps.get(id)!.step.rework !== undefined && count > 1 ? { from, turn: Math.min(from, lane) } : undefined;
    // Something of the row stands on that side of the node: a line cannot run there.
    const busy = { left: subs[0].lowest !== lane, right: subs[0].highest !== rightLane };
    const side = (which: TrackSide, node: number): SidePlan => {
      const arrives = reaches[which].has(id) || (which === "left" && rework !== undefined);
      // One row takes the lines of one direction: a step that is reached keeps its row for the arrivals.
      return { lane: node, arriveByGate: arrives && busy[which], leaveByGate: leaves[which].has(id) && (busy[which] || arrives) };
    };
    plans.set(id, { left: side("left", lane), right: side("right", rightLane), rework });
  }
  const gated = (plan: Plan): boolean => plan.left.arriveByGate || plan.left.leaveByGate || plan.right.arriveByGate || plan.right.leaveByGate;

  const rows: GridRow[] = [];
  const pending: Pending[] = [];
  const spans = new Map<Id, StepSpan>();
  const groups: GroupSpan[] = [];
  const gateRow = new Map<Id, number>();

  const add = (row: number, place: Place, from: SegmentEnd, to: SegmentEnd, style: SegmentStyle, arrow = false, tail = false): Segment => {
    const segment: Segment = arrow ? { from, to, style, arrow } : { from, to, style };
    if (tail) segment.tail = true;
    pending.push({ row, place, segment });
    return segment;
  };
  const pass = (row: number, lane: number, style: SegmentStyle): void => {
    add(row, { lane }, "top", "bottom", style);
  };
  /** Every line of the stated order points at the act it leads into. */
  const pointed = (style: SegmentStyle): boolean => style === "flow" || style === "inner" || style === "repeat";
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

  /** The last act of a step, which the next line leaves from, and the rework row under it where it has one. */
  interface Tail {
    stepId: Id;
    row: number;
    boxes: number[];
    reworkRow?: number;
  }
  /** One step of a parallel run as drawn: the lane its line leaves by, and the row its way round starts on where it has one. */
  interface Branch {
    tail: Tail;
    lane: number;
    lastRow: number;
    exitRow?: number;
  }
  /** A parallel run: its steps, the lanes they are entered in, the row it forks on, and the branches drawn so far. */
  interface Run {
    key: string;
    members: Id[];
    heads: number[];
    forkRow: number;
    branches: Branch[];
  }
  /** A line that goes round by a track on the right: the rows it spans, and how it is drawn once its track is known. */
  interface Detour extends TrackRange {
    draw: (track: number) => void;
  }
  const detours: Detour[] = [];

  // The steps of each parallel run that the lanes drawn show. A run of one step is no run.
  const runMembers = new Map<string, Id[]>();
  for (const [id, step] of steps) {
    if (step.step.parallel !== undefined && shown.has(id)) runMembers.set(step.step.parallel, [...(runMembers.get(step.step.parallel) ?? []), id]);
  }
  /** The lanes a step has a node in: a line cannot drop through them. */
  const nodeLanes = (id: Id): Set<number> => new Set(shown.get(id)!.flatMap((sub) => sub.acts.flatMap((act) => act.boxes)));

  let tail: Tail | undefined;
  // The run being drawn, and the run drawn and waiting for the step its branches join into.
  let run: Run | undefined;
  let joining: Run | undefined;
  let between: GridRow[] = [];
  let group: { key: string; firstRow: number } | undefined;

  /** Draws the line out of an act down its lane, through the rework row where the step has one. */
  const leave = (from: Tail, lane: number, style: SegmentStyle): void => {
    add(from.row, { lane }, "center", "bottom", style);
    if (from.reworkRow !== undefined) pass(from.reworkRow, lane, style);
  };

  /**
   * A row on which lines meet and part: every lane of `ups` comes in from above, every lane of
   * `downs` goes on below, and one line joins them all. `fromRight` brings in the branches that
   * come round by a track on the right, `toRight` sends out the ones that go round.
   *
   * In each cell every way in is joined to every way out by a piece of its own, so that a line
   * turns into another by a rounded corner and never meets it at a right angle. Lines that meet
   * are told apart by an arrowhead on the one that turns in.
   */
  const bus = (row: number, ups: readonly number[], downs: readonly number[], fromRight: boolean, toRight: boolean, style: SegmentStyle): void => {
    // A line that comes round by the right enters past the last lane, and one that goes round leaves there.
    const beyond = lanes.length;
    const sources = fromRight ? [...ups, beyond] : ups;
    const sinks = toRight ? [...downs, beyond] : downs;
    // Each line from a way in to a way out, as the pieces it draws in the cells it passes.
    const pieces = new Map<number, Set<string>>();
    for (const source of sources) {
      for (const sink of sinks) {
        if (source === sink && source === beyond) continue;
        for (let lane = Math.min(source, sink); lane <= Math.max(source, sink); lane += 1) {
          if (lane === beyond) continue;
          const from: SegmentEnd = lane === source ? "top" : source < lane ? "left" : "right";
          const to: SegmentEnd = lane === sink ? "bottom" : sink < lane ? "left" : "right";
          pieces.set(lane, (pieces.get(lane) ?? new Set()).add(`${from}>${to}`));
        }
      }
    }
    for (const [lane, set] of [...pieces].sort((a, b) => a[0] - b[0])) {
      const list = [...set].map((piece) => piece.split(">") as [SegmentEnd, SegmentEnd]);
      for (const [from, to] of list) {
        // Lines that leave a cell by one way run on as one: the one that turns in shows the way, the one that passes needs no mark.
        const turns = (from === "top") !== (to === "bottom");
        const meets = list.some(([otherFrom, otherTo]) => otherTo === to && otherFrom !== from);
        add(row, { lane }, from, to, style, false, turns && meets);
      }
    }
  };

  /** The run a detour crosses on its way between the lanes and its track: the inner tracks of the right. */
  const acrossTracks = (row: number, track: number, from: SegmentEnd, to: SegmentEnd, style: SegmentStyle): void => {
    for (let inner = 0; inner < track; inner += 1) add(row, { track: inner, side: "right" }, from, to, style);
  };

  /**
   * Brings the line down to the lanes of `downs` from wherever it stands: the start, the last
   * act drawn, or a run waiting to join. Rows held back (headings, steps left out) are placed on
   * the way. Returns the row lines meet and part on, where one was needed.
   */
  const descend = (downs: readonly number[], style: SegmentStyle, detourDown: boolean): number | undefined => {
    if (joining !== undefined) {
      const waiting = joining;
      joining = undefined;
      for (const row of between) rows.push(row);
      const row = rows.length;
      const straight = waiting.branches.filter((branch) => branch.exitRow === undefined);
      bus(row, straight.map((branch) => branch.lane), downs, straight.length < waiting.branches.length, detourDown, style);
      rows.push({ kind: "flow" });
      for (const branch of waiting.branches) {
        leave(branch.tail, branch.lane, style);
        if (branch.exitRow === undefined) {
          for (let below = branch.lastRow + 1; below < row; below += 1) pass(below, branch.lane, style);
          continue;
        }
        // Round by the right: out of the row under its step, down a track, and into the joining row from the right.
        const exit = branch.exitRow;
        add(exit, { lane: branch.lane }, "top", "right", style);
        for (let lane = branch.lane + 1; lane < lanes.length; lane += 1) add(exit, { lane }, "left", "right", style);
        detours.push({
          low: exit,
          high: row,
          draw: (track) => {
            acrossTracks(exit, track, "left", "right", style);
            add(exit, { track, side: "right" }, "left", "bottom", style);
            for (let middle = exit + 1; middle < row; middle += 1) add(middle, { track, side: "right" }, "top", "bottom", style);
            add(row, { track, side: "right" }, "top", "left", style);
            acrossTracks(row, track, "right", "left", style);
          },
        });
      }
      return row;
    }
    if (tail === undefined) {
      for (const row of between) rows.push(row);
      add(rows.length, { lane: downs[0] }, "center", "bottom", style);
      rows.push({ kind: "start", lane: downs[0] });
      if (downs.length === 1 && !detourDown) return undefined;
      bus(rows.length, [downs[0]], downs, false, detourDown, style);
      rows.push({ kind: "flow" });
      return rows.length - 1;
    }
    const from = nearest(tail.boxes, downs)[0];
    leave(tail, from, style);
    if (downs.length === 1 && !detourDown) {
      connect(from, downs[0], style);
      for (const row of between) {
        pass(rows.length, downs[0], style);
        rows.push(row);
      }
      return undefined;
    }
    for (const row of between) {
      pass(rows.length, from, style);
      rows.push(row);
    }
    bus(rows.length, [from], downs, false, detourDown, style);
    rows.push({ kind: "flow" });
    return rows.length - 1;
  };

  for (const item of readingOrder(process)) {
    if (item.kind === "section") between.push({ kind: "section", sectionId: item.sectionId });
    else if (item.kind === "group-end") {
      if (group !== undefined) groups.push({ key: group.key, firstRow: group.firstRow, lastRow: rows.length - 1 });
      group = undefined;
      if (run !== undefined) joining = run;
      run = undefined;
    } else if (item.kind === "step") {
      const subs = shown.get(item.stepId);
      if (subs === undefined) {
        between.push({ kind: item.inclusion === "excluded" ? "excluded" : "folded", stepId: item.stepId });
        continue;
      }
      const plan = plans.get(item.stepId)!;
      const step = steps.get(item.stepId)!.step;
      const head = subs[0].acts[0];
      const members = step.parallel === undefined ? undefined : runMembers.get(step.parallel);
      const inRun = members !== undefined && members.length > 1;
      // The line into a step that repeats is drawn as the repeat's; into a step of a parallel run it is plain.
      const style: SegmentStyle = !inRun && step.repeat !== undefined ? "repeat" : "flow";
      if (!inRun) {
        head.enter = tail === undefined || joining !== undefined ? head.boxes[0] : nearest(tail.boxes, head.boxes)[1];
        descend([head.enter], style, false);
      } else {
        const index = members.indexOf(item.stepId);
        head.enter = head.boxes[0];
        if (run === undefined) {
          const heads = members.map((id) => shown.get(id)![0].acts[0].boxes[0]);
          // A branch drops straight where no node of an earlier step of the run stands in its lane.
          const straight = heads.filter((lane, at) => !members.slice(0, at).some((id) => nodeLanes(id).has(lane)));
          const forkRow = descend(straight, style, straight.length < heads.length)!;
          run = { key: step.parallel!, members, heads, forkRow, branches: [] };
        } else {
          for (const row of between) rows.push(row);
          const blocked = members.slice(0, index).some((id) => nodeLanes(id).has(head.enter));
          if (!blocked) for (let above = run.forkRow + 1; above < rows.length; above += 1) pass(above, head.enter, style);
          else {
            // Round by the right: from the forking row down a track, and in over a row of its own above the step.
            const fork = run.forkRow;
            const row = rows.length;
            add(row, { lane: head.enter }, "right", "bottom", style);
            for (let lane = head.enter + 1; lane < lanes.length; lane += 1) add(row, { lane }, "right", "left", style);
            rows.push({ kind: "flow" });
            detours.push({
              low: fork,
              high: row,
              draw: (track) => {
                acrossTracks(fork, track, "left", "right", style);
                add(fork, { track, side: "right" }, "left", "bottom", style);
                for (let middle = fork + 1; middle < row; middle += 1) add(middle, { track, side: "right" }, "top", "bottom", style);
                add(row, { track, side: "right" }, "top", "left", style);
                acrossTracks(row, track, "right", "left", style);
              },
            });
          }
        }
      }
      between = [];
      if (inRun && group === undefined) group = { key: step.parallel!, firstRow: rows.length };
      const span: StepSpan = { stepId: item.stepId, firstRow: rows.length, lastRow: rows.length, jumps: leaving.get(item.stepId) ?? [], arrivals: arriving.get(item.stepId) ?? [], node: { row: rows.length, lane: plan.left.lane, rightLane: plan.right.lane } };
      spans.set(item.stepId, span);
      if (gated(plan)) {
        gateRow.set(item.stepId, rows.length);
        pass(rows.length, head.enter, style);
        rows.push({ kind: "gate", stepId: item.stepId });
      }
      span.node.row = rows.length;
      let last: Tail | undefined;
      for (const [index, sub] of subs.entries()) {
        const first = sub.acts[0];
        if (index > 0 && last !== undefined) {
          const [from, to] = nearest(last.boxes, first.boxes);
          first.enter = to;
          add(last.row, { lane: from }, "center", "bottom", "inner");
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
        last = { stepId: item.stepId, row, boxes: sub.acts[sub.acts.length - 1].boxes };
        span.lastRow = row;
      }
      if (plan.rework !== undefined && last !== undefined) {
        const row = rows.length;
        const { from, turn } = plan.rework;
        // From the last act's lane to the turn-back node; the way on from there is drawn with the tracks.
        if (from !== turn) {
          add(row, { lane: from }, "center", "left", "rework");
          for (let lane = turn + 1; lane < from; lane += 1) add(row, { lane }, "right", "left", "rework");
          add(row, { lane: turn }, "right", "center", "rework", true);
        }
        rows.push({ kind: "rework", stepId: item.stepId, lane: turn, from });
        last.reworkRow = row;
        span.lastRow = row;
      }
      if (run === undefined) tail = last;
      else if (last !== undefined) {
        // A step of a run: its line waits for the others. It drops straight where no node of a later step stands in its lane.
        const lane = last.boxes[0];
        const blocked = run.members.slice(run.members.indexOf(item.stepId) + 1).some((id) => nodeLanes(id).has(lane));
        const branch: Branch = { tail: last, lane, lastRow: rows.length - 1 };
        if (blocked) {
          branch.exitRow = rows.length;
          rows.push({ kind: "flow" });
        }
        run.branches.push(branch);
        tail = undefined;
      }
    }
  }

  if (joining !== undefined) {
    const lane = joining.branches[joining.branches.length - 1].lane;
    descend([lane], "flow", false);
    add(rows.length, { lane }, "top", "center", "flow");
    rows.push({ kind: "end", lane });
  } else if (tail === undefined) for (const row of between) rows.push(row);
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

  /** One line that arrives at a step: where it leaves from, and what it is drawn as. */
  interface Arrival {
    style: "back" | "skip" | "rework";
    /** The row and the lane it runs to its track from, and the row of the node it leaves. */
    row: number;
    lane: number;
    nodeRow: number;
    /** Whether it leaves its node on the node's own row, or by the side over a gate row. */
    start: "center" | "side";
  }
  /** The row a step's lines of one side turn into their track on: the gate row, or the row of its first act. */
  const turnRow = (id: Id, byGate: boolean): number => (byGate ? gateRow.get(id)! : spans.get(id)!.node.row);

  // Every line into one step on one side shares one track, held from the highest row to the lowest row those lines touch.
  type Target = TrackRange & { to: Id; lines: Arrival[] };
  const targets: Record<TrackSide, Target[]> = { left: [], right: [] };
  const arrive = (side: TrackSide, to: Id, line: Arrival): void => {
    const arrival = turnRow(to, plans.get(to)![side].arriveByGate);
    let target = targets[side].find((candidate) => candidate.to === to);
    if (target === undefined) {
      target = { to, lines: [], low: arrival, high: arrival };
      targets[side].push(target);
    }
    if (!target.lines.some((other) => other.row === line.row && other.style === line.style)) target.lines.push(line);
    target.low = Math.min(target.low, line.row);
    target.high = Math.max(target.high, line.row);
  };
  for (const jump of lineJumps) {
    const side = sideOf(jump);
    const source = plans.get(jump.jump.from)![side];
    arrive(side, jump.jump.to!, { style: jump.direction as "back" | "skip", row: turnRow(jump.jump.from, source.leaveByGate), lane: source.lane, nodeRow: spans.get(jump.jump.from)!.node.row, start: source.leaveByGate ? "side" : "center" });
  }
  rows.forEach((row, index) => {
    if (row.kind === "rework") arrive("left", row.stepId, { style: "rework", row: index, lane: row.lane, nodeRow: index, start: "center" });
  });
  // The branches of a parallel run that go round share the right with the jumps ahead.
  const rightAll = assignTracks([...targets.right, ...detours]);
  const trackOf: Record<TrackSide, number[]> = { left: assignTracks(targets.left), right: rightAll.slice(0, targets.right.length) };
  const leftTracks = trackOf.left.length === 0 ? 0 : Math.max(...trackOf.left) + 1;
  const rightTracks = rightAll.length === 0 ? 0 : Math.max(...rightAll) + 1;
  detours.forEach((detour, index) => detour.draw(rightAll[targets.right.length + index]));

  for (const side of ["left", "right"] as const) {
    // The edge of a cell that faces the tracks of this side, the edge that faces away, and the points beside the lane's middle.
    const out: SegmentEnd = side;
    const back: SegmentEnd = side === "left" ? "right" : "left";
    const sideTop: SegmentEnd = side === "left" ? "side-top" : "rside-top";
    const sideBottom: SegmentEnd = side === "left" ? "side-bottom" : "rside-bottom";
    targets[side].forEach((target, index) => {
      const track = trackOf[side][index];
      const plan = plans.get(target.to)![side];
      const nodeRow = spans.get(target.to)!.node.row;
      const arrival = turnRow(target.to, plan.arriveByGate);
      /** The sideways run between a track and a lane, drawn the way the line travels. */
      const run = (row: number, lane: number, toward: "track" | "lane", style: SegmentStyle): void => {
        const [from, to]: [SegmentEnd, SegmentEnd] = toward === "lane" ? [out, back] : [back, out];
        for (let inner = 0; inner < track; inner += 1) add(row, { track: inner, side }, from, to, style);
        if (side === "left") for (let crossed = 0; crossed < lane; crossed += 1) add(row, { lane: crossed }, from, to, style);
        else for (let crossed = lane + 1; crossed < lanes.length; crossed += 1) add(row, { lane: crossed }, from, to, style);
      };
      for (const line of target.lines) {
        const up = line.row > arrival;
        // Out of its node and along its row to the track.
        if (line.start === "side") {
          add(line.nodeRow, { lane: line.lane }, "center", sideTop, line.style);
          add(line.row, { lane: line.lane }, sideBottom, out, line.style);
        } else add(line.row, { lane: line.lane }, "center", out, line.style);
        run(line.row, line.lane, "track", line.style);
        // Where a line turns into a track that already carries a line from further off, the two run on as
        // one: the one turning in shows the way just past its bend.
        const further = target.lines.some((other) => other !== line && (up ? other.row > line.row : other.row < line.row));
        add(line.row, { track, side }, back, up ? "top" : "bottom", line.style, false, further);
        for (let row = Math.min(line.row, arrival) + 1; row < Math.max(line.row, arrival); row += 1) {
          add(row, { track, side }, up ? "bottom" : "top", up ? "top" : "bottom", line.style);
        }
        // Off the track and along the arrival row into the node.
        add(arrival, { track, side }, up ? "bottom" : "top", back, line.style);
        run(arrival, plan.lane, "lane", line.style);
        if (plan.arriveByGate) {
          // The head stands on the way down, where the line is straight; the turn into the node is too short to carry one.
          add(arrival, { lane: plan.lane }, out, sideBottom, line.style, true);
          add(nodeRow, { lane: plan.lane }, sideTop, "center", line.style);
        } else add(nodeRow, { lane: plan.lane }, out, "center", line.style, true);
      }
    });
  }

  const geometry = { leftTracks, lanes };
  const cells = new Map<string, GridCell>();
  for (const { row, place, segment } of pending) {
    const column = "lane" in place ? laneColumn(geometry, place.lane) : trackColumn(geometry, place.track, place.side);
    const key = `${row}:${column}`;
    const cell = cells.get(key) ?? { row, column, segments: [] };
    const same = cell.segments.find((other) => other.from === segment.from && other.to === segment.to && other.style === segment.style);
    if (same === undefined) cell.segments.push(segment);
    else {
      if (segment.arrow) same.arrow = true;
      if (segment.tail) same.tail = true;
    }
    cells.set(key, cell);
  }
  return {
    lanes,
    leftTracks,
    rightTracks,
    trackCount: leftTracks + rightTracks,
    rows,
    cells: [...cells.values()].sort((a, b) => a.row - b.row || a.column - b.column),
    steps: [...spans.values()],
    groups,
    tags: lineJumps.map((jump) => {
      const side = sideOf(jump);
      const source = plans.get(jump.jump.from)![side];
      return { jumpId: jump.jump.id, row: spans.get(jump.jump.from)!.node.row, column: laneColumn(geometry, source.lane), side, gate: source.leaveByGate };
    }),
  };
}
