import { laneColumn } from "../lane-geometry";
import type { GridCell, LaneGeometry, Segment, SegmentEnd } from "../lane-geometry";
import { readingOrder } from "../reading-order";
import type { Id, ResolvedProcess } from "../types";

const OPPOSITE: Record<Exclude<SegmentEnd, "center">, Exclude<SegmentEnd, "center">> = { top: "bottom", bottom: "top", left: "right", right: "left" };
const STEP: Record<Exclude<SegmentEnd, "center">, [number, number]> = { top: [-1, 0], bottom: [1, 0], left: [0, -1], right: [0, 1] };

const straight = (segment: Segment): boolean =>
  (segment.from === "top" && segment.to === "bottom") || (segment.from === "bottom" && segment.to === "top") || (segment.from === "left" && segment.to === "right") || (segment.from === "right" && segment.to === "left");

const ends = (segment: Segment): SegmentEnd[] => [segment.from, segment.to];

/** The cell that holds a box or a marker: an act's lanes, or the lane of a start or end row. */
function anchored(geometry: LaneGeometry, row: number, column: number): boolean {
  const entry = geometry.rows[row];
  if (entry.kind === "act") return entry.boxes.some((lane) => laneColumn(geometry, lane) === column);
  if (entry.kind === "start" || entry.kind === "end") return laneColumn(geometry, entry.lane) === column;
  return false;
}

/**
 * Every way a lane geometry breaks what it promises, as sentences. An empty list is a pass.
 *
 * - a line that ends on a cell's edge is continued, in the same style, by the neighbouring cell
 * - no line leaves the grid, and none enters the column of titles
 * - a line that ends at a cell's centre ends on a box, on a marker, or on a line passing through
 * - a row that holds no act carries nothing but lines passing straight down
 */
export function geometryProblems(geometry: LaneGeometry): string[] {
  const problems: string[] = [];
  const cells = new Map(geometry.cells.map((cell) => [`${cell.row}:${cell.column}`, cell]));
  const columns = 1 + geometry.trackCount + geometry.lanes.length;
  for (const cell of geometry.cells) {
    const where = `row ${cell.row} column ${cell.column}`;
    if (cell.column < 1 || cell.column >= columns || cell.row < 0 || cell.row >= geometry.rows.length) problems.push(`${where}: a line outside the grid`);
    for (const segment of cell.segments) {
      if (segment.from === segment.to) problems.push(`${where}: a line from ${segment.from} to itself`);
      for (const end of ends(segment)) {
        if (end === "center") {
          const held = anchored(geometry, cell.row, cell.column) || cell.segments.some((other) => other !== segment && (straight(other) || ends(other).includes("center")));
          if (!held) problems.push(`${where}: a ${segment.style} line ends in mid-cell on nothing`);
          continue;
        }
        const [rowStep, columnStep] = STEP[end];
        const neighbour = cells.get(`${cell.row + rowStep}:${cell.column + columnStep}`);
        const met = neighbour?.segments.some((other) => other.style === segment.style && ends(other).includes(OPPOSITE[end])) ?? false;
        if (!met) problems.push(`${where}: a ${segment.style} line reaches the ${end} edge and nothing continues it`);
      }
    }
    const kind = geometry.rows[cell.row]?.kind;
    if ((kind === "section" || kind === "excluded" || kind === "folded") && cell.segments.some((segment) => !(segment.from === "top" && segment.to === "bottom"))) {
      problems.push(`${where}: a ${kind} row holds a line that does more than pass`);
    }
  }
  return problems;
}

type Point = string;

/**
 * The points a line can be followed to from a cell's centre, through segments of the styles given.
 *
 * Two lines that merely cross in a cell are not joined: a line passing straight through a cell
 * is joined to its centre only where another line of the cell ends there.
 */
export function reachable(geometry: LaneGeometry, from: { row: number; column: number }, styles: readonly Segment["style"][]): Set<Point> {
  const cells = new Map(geometry.cells.map((cell) => [`${cell.row}:${cell.column}`, cell]));
  const point = (row: number, column: number, end: SegmentEnd): Point => `${row}:${column}:${end}`;
  const links = new Map<Point, Point[]>();
  const link = (a: Point, b: Point): void => {
    links.set(a, [...(links.get(a) ?? []), b]);
    links.set(b, [...(links.get(b) ?? []), a]);
  };
  const join = (cell: GridCell): void => {
    const used = cell.segments.filter((segment) => styles.includes(segment.style));
    const centred = cell.segments.some((segment) => ends(segment).includes("center"));
    for (const segment of used) {
      link(point(cell.row, cell.column, segment.from), point(cell.row, cell.column, segment.to));
      if (centred && straight(segment)) link(point(cell.row, cell.column, segment.from), point(cell.row, cell.column, "center"));
      for (const end of ends(segment)) {
        if (end === "center") continue;
        const [rowStep, columnStep] = STEP[end];
        link(point(cell.row, cell.column, end), point(cell.row + rowStep, cell.column + columnStep, OPPOSITE[end]));
      }
    }
  };
  for (const cell of cells.values()) join(cell);
  const seen = new Set<Point>([point(from.row, from.column, "center")]);
  const queue = [...seen];
  while (queue.length > 0) {
    for (const next of links.get(queue.pop()!) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen;
}

/** The centre of a cell, as {@link reachable} names it. */
export const centre = (row: number, column: number): Point => `${row}:${column}:center`;

/**
 * Every way a lane geometry disagrees with the case it was laid out from, as sentences.
 *
 * - each act the lanes drawn can show stands once, in the reading order, in the columns of its lanes
 * - the stated order can be followed from the start marker through every act to the end marker
 * - each jump with both ends shown can be followed, along lines of its own style, from the row
 *   under the step it leaves to the first act of the step it arrives at
 */
export function agreementProblems(process: ResolvedProcess, geometry: LaneGeometry): string[] {
  const problems: string[] = [];
  const laneIndex = new Map(geometry.lanes.map((lane, index) => [lane.id, index]));
  const acts = new Map<Id, Id[]>();
  for (const section of process.sections) for (const step of section.steps) for (const { act } of step.acts) acts.set(act.id, act.lanes);

  const expected: { stepId: Id; actId: Id; boxes: number[] }[] = [];
  for (const item of readingOrder(process)) {
    if (item.kind !== "act") continue;
    const boxes = acts.get(item.actId)!.map((lane) => laneIndex.get(lane)).filter((index): index is number => index !== undefined);
    if (boxes.length > 0) expected.push({ stepId: item.stepId, actId: item.actId, boxes: [...boxes].sort((a, b) => a - b) });
  }
  const drawn = geometry.rows.flatMap((row, index) => (row.kind === "act" ? [{ ...row, index }] : []));
  if (drawn.map((row) => row.actId).join() !== expected.map((entry) => entry.actId).join()) problems.push(`acts drawn ${drawn.map((row) => row.actId).join()} differ from acts read ${expected.map((entry) => entry.actId).join()}`);
  else {
    drawn.forEach((row, index) => {
      if (row.boxes.join() !== expected[index].boxes.join()) problems.push(`act ${row.actId} stands in lanes ${row.boxes.join()} and names ${expected[index].boxes.join()}`);
      if (row.stepId !== expected[index].stepId) problems.push(`act ${row.actId} is drawn under step ${row.stepId}`);
    });
  }

  const start = geometry.rows.findIndex((row) => row.kind === "start");
  const end = geometry.rows.findIndex((row) => row.kind === "end");
  if ((start < 0) !== (drawn.length === 0) || (end < 0) !== (drawn.length === 0)) problems.push("the start and end markers do not match whether any act is drawn");
  if (start >= 0 && end >= 0) {
    const startRow = geometry.rows[start] as { lane: number };
    const endRow = geometry.rows[end] as { lane: number };
    const flow = reachable(geometry, { row: start, column: laneColumn(geometry, startRow.lane) }, ["flow", "parallel"]);
    for (const row of drawn) {
      if (!flow.has(centre(row.index, laneColumn(geometry, row.primary)))) problems.push(`the stated order does not reach act ${row.actId}`);
    }
    if (!flow.has(centre(end, laneColumn(geometry, endRow.lane)))) problems.push("the stated order does not reach the end marker");
  }

  const shownSteps = new Set(drawn.map((row) => row.stepId));
  const firstAct = new Map<Id, { index: number; primary: number }>();
  const lastAct = new Map<Id, { index: number; primary: number }>();
  for (const row of drawn) {
    if (!firstAct.has(row.stepId)) firstAct.set(row.stepId, row);
    lastAct.set(row.stepId, row);
  }
  for (const { jump, drawn: inCase, direction } of process.jumps) {
    if (!inCase || !shownSteps.has(jump.from)) continue;
    const exit = geometry.rows.findIndex((row) => row.kind === "exit" && row.stepId === jump.from);
    const listed = exit >= 0 && (geometry.rows[exit] as { jumps: Id[] }).jumps.includes(jump.id);
    if (direction === "external") {
      if (!listed) problems.push(`external jump ${jump.id} is not listed under step ${jump.from}`);
      continue;
    }
    if (!shownSteps.has(jump.to!)) {
      if (listed) problems.push(`jump ${jump.id} is listed although step ${jump.to} is not drawn`);
      continue;
    }
    if (!listed) {
      problems.push(`jump ${jump.id} is not listed under step ${jump.from}`);
      continue;
    }
    const reached = reachable(geometry, { row: exit, column: laneColumn(geometry, lastAct.get(jump.from)!.primary) }, [direction]);
    const entry = geometry.rows.findIndex((row) => row.kind === "entry" && row.stepId === jump.to);
    if (entry < 0 || !reached.has(centre(entry, laneColumn(geometry, firstAct.get(jump.to!)!.primary)))) problems.push(`jump ${jump.id} cannot be followed from step ${jump.from} to step ${jump.to}`);
  }
  return problems;
}
