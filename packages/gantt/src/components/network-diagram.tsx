import type { Id } from "@simplix-react/gantt-core";
import { useMemo } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { formatDate } from "../lib/format";
import { useGanttTranslation } from "../lib/use-gantt-translation";

const BOX_WIDTH = 184;
const BOX_HEIGHT = 60;
const GAP_X = 56;
const GAP_Y = 20;
const PADDING = 24;

/**
 * The network diagram: every task without tasks under it as a box, placed in
 * a column one past its latest predecessor, with a line for every dependency.
 * Critical tasks and the links between them are drawn in the destructive
 * colour. Choosing a box opens the task's information dialog.
 */
export function NetworkDiagram() {
  const { language } = useGanttTranslation();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const selection = useGantt((state) => state.selection);

  const { nodes, edges, width, height } = useMemo(() => {
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
    const taken = new Map<number, number>();
    const placed = new Map<Id, { x: number; y: number }>();
    for (const task of leaves) {
      const c = depth(task.id);
      const row = taken.get(c) ?? 0;
      taken.set(c, row + 1);
      placed.set(task.id, { x: PADDING + c * (BOX_WIDTH + GAP_X), y: PADDING + row * (BOX_HEIGHT + GAP_Y) });
    }
    const lines = project.links.flatMap((link) => {
      const from = placed.get(link.predecessorId);
      const to = placed.get(link.successorId);
      if (!from || !to) return [];
      const critical = schedule.tasks.get(link.predecessorId)?.critical === true && schedule.tasks.get(link.successorId)?.critical === true;
      const x1 = from.x + BOX_WIDTH;
      const y1 = from.y + BOX_HEIGHT / 2;
      const y2 = to.y + BOX_HEIGHT / 2;
      const mid = x1 + GAP_X / 2;
      return [{ id: link.id, critical, d: `M${x1} ${y1} L${mid} ${y1} L${mid} ${y2} L${to.x} ${y2}` }];
    });
    const columns = Math.max(1, ...[...column.values()].map((c) => c + 1));
    const rows = Math.max(1, ...taken.values());
    return {
      nodes: leaves.map((task) => ({ task, at: schedule.tasks.get(task.id), ...(placed.get(task.id) as { x: number; y: number }) })),
      edges: lines,
      width: PADDING * 2 + columns * BOX_WIDTH + (columns - 1) * GAP_X,
      height: PADDING * 2 + rows * BOX_HEIGHT + (rows - 1) * GAP_Y,
    };
  }, [project, schedule]);

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-background" data-gantt-slot="network-diagram">
      {/* raw layout: a canvas sized to the diagram, with the boxes placed on it by coordinates */}
      <div className="relative" style={{ width, height }}>
        <svg className="pointer-events-none absolute left-0 top-0" width={width} height={height} aria-hidden="true">
          {edges.map((edge) => (
            <path key={edge.id} d={edge.d} fill="none" strokeWidth={1.25} className={edge.critical ? "stroke-destructive" : "stroke-muted-foreground"} data-gantt-edge={edge.id} />
          ))}
        </svg>
        {nodes.map(({ task, at, x, y }) => (
          <button
            key={task.id}
            type="button"
            className={cn(
              "absolute flex flex-col justify-center rounded-md border bg-background px-2 text-left text-xs shadow-sm",
              at?.critical ? "border-destructive" : "border-border",
              selection.includes(task.id) && "ring-2 ring-ring",
            )}
            style={{ left: x, top: y, width: BOX_WIDTH, height: BOX_HEIGHT }}
            data-gantt-node={task.id}
            onClick={() => store.getState().selectRow(task.id)}
            onDoubleClick={() => store.getState().openTaskDialog(task.id)}
          >
            <span className="truncate text-sm font-medium">{task.name}</span>
            {at && (
              <span className="truncate text-muted-foreground">
                {formatDate(at.start, language)} - {formatDate(at.finish, language)} · {at.percentComplete}%
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
