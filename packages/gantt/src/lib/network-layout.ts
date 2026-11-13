import type { Id, Project, Schedule, Task, TaskSchedule } from "@simplix-react/gantt-core";

import { roundedPathData } from "./link-path";
import type { PathPoint } from "./link-path";

export const BOX_WIDTH = 184;
export const BOX_HEIGHT = 60;
const GAP_X = 56;
const GAP_Y = 24;
const PADDING = 24;

/** A task's box on the network diagram. */
export interface NetworkNode {
  task: Task;
  at: TaskSchedule | undefined;
  x: number;
  y: number;
}

/** Radius of the curve a line of the diagram takes a corner with. */
const NETWORK_CORNER = 8;

/** A dependency's line on the network diagram. */
export interface NetworkEdge {
  id: Id;
  critical: boolean;
  /** The corners of the line, from the predecessor's right edge to the successor's left edge. */
  points: PathPoint[];
  /** The line as an SVG path, its corners curved. */
  d: string;
}

/** Where the boxes and lines of a network diagram go. */
export interface NetworkLayout {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  width: number;
  height: number;
}

/**
 * Lays a plan out as a network: every task without tasks under it is a box in
 * the column one past its latest predecessor. Within a column the boxes are
 * ordered by where their predecessors sit, which keeps a chain on one line. A
 * line to the next column bends in the gap between the two; a line that skips
 * columns runs in the gap above its successor's row, so it passes between the
 * boxes on its way and not through them.
 */
export function layoutNetwork(project: Project, schedule: Schedule): NetworkLayout {
  const leaves = project.tasks.filter((task) => schedule.tasks.get(task.id)?.summary === false);
  const known = new Set(leaves.map((task) => task.id));
  const incoming = new Map<Id, Id[]>();
  for (const link of project.links) {
    if (!known.has(link.predecessorId) || !known.has(link.successorId)) continue;
    const list = incoming.get(link.successorId) ?? [];
    list.push(link.predecessorId);
    incoming.set(link.successorId, list);
  }
  // A task's column is one past the deepest of its predecessors; the scheduler has already refused any loop.
  const column = new Map<Id, number>();
  const depth = (id: Id): number => {
    const settled = column.get(id);
    if (settled !== undefined) return settled;
    const value = Math.max(-1, ...(incoming.get(id) ?? []).map(depth)) + 1;
    column.set(id, value);
    return value;
  };
  const byColumn = new Map<number, Task[]>();
  for (const task of leaves) {
    const c = depth(task.id);
    const list = byColumn.get(c) ?? [];
    list.push(task);
    byColumn.set(c, list);
  }
  const columns = Math.max(1, ...[...column.values()].map((c) => c + 1));
  const row = new Map<Id, number>();
  let rows = 1;
  for (let c = 0; c < columns; c++) {
    const tasks = byColumn.get(c) ?? [];
    // The mean row of a box's predecessors; a box without any keeps its place in the plan's order.
    const wish = new Map<Id, number>(
      tasks.map((task, order) => {
        const from = (incoming.get(task.id) ?? []).map((id) => row.get(id) ?? 0);
        return [task.id, from.length > 0 ? from.reduce((sum, value) => sum + value, 0) / from.length : order];
      }),
    );
    const ordered = [...tasks].sort((a, b) => (wish.get(a.id) ?? 0) - (wish.get(b.id) ?? 0));
    let next = 0;
    for (const task of ordered) {
      // As near its predecessors as the boxes already placed in the column allow.
      const at = Math.max(next, Math.round(wish.get(task.id) ?? 0));
      row.set(task.id, at);
      next = at + 1;
    }
    rows = Math.max(rows, next);
  }
  const place = (id: Id): { x: number; y: number } => ({
    x: PADDING + (column.get(id) ?? 0) * (BOX_WIDTH + GAP_X),
    y: PADDING + (row.get(id) ?? 0) * (BOX_HEIGHT + GAP_Y),
  });
  const edges = project.links.flatMap((link): NetworkEdge[] => {
    if (!known.has(link.predecessorId) || !known.has(link.successorId)) return [];
    const from = place(link.predecessorId);
    const to = place(link.successorId);
    const critical = schedule.tasks.get(link.predecessorId)?.critical === true && schedule.tasks.get(link.successorId)?.critical === true;
    const x1 = from.x + BOX_WIDTH;
    const y1 = from.y + BOX_HEIGHT / 2;
    const y2 = to.y + BOX_HEIGHT / 2;
    const leave = x1 + GAP_X / 2;
    const enter = to.x - GAP_X / 2;
    const lane = to.y - GAP_Y / 2;
    const points: PathPoint[] =
      (column.get(link.successorId) ?? 0) - (column.get(link.predecessorId) ?? 0) <= 1
        ? [{ x: x1, y: y1 }, { x: leave, y: y1 }, { x: leave, y: y2 }, { x: to.x, y: y2 }]
        : [{ x: x1, y: y1 }, { x: leave, y: y1 }, { x: leave, y: lane }, { x: enter, y: lane }, { x: enter, y: y2 }, { x: to.x, y: y2 }];
    return [{ id: link.id, critical, points, d: roundedPathData(points, NETWORK_CORNER) }];
  });
  return {
    nodes: leaves.map((task) => ({ task, at: schedule.tasks.get(task.id), ...place(task.id) })),
    edges,
    width: PADDING * 2 + columns * BOX_WIDTH + (columns - 1) * GAP_X,
    height: PADDING * 2 + rows * BOX_HEIGHT + (rows - 1) * GAP_Y,
  };
}
