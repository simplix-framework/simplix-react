import type { Id, Project, Schedule } from "@simplix-react/gantt-core";
import { useMemo } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { roundedPathData, routeLink } from "../lib/link-path";
import type { BarBox, PathPoint } from "../lib/link-path";

/** Length of the straight piece a link runs before it turns. */
const STUB = 10;
const ARROW = 5;

/** Props for {@link TimelineLinks}. */
export interface TimelineLinksProps {
  project: Project;
  schedule: Schedule;
  /** Where each visible task's bar sits. A task without an entry is folded away. */
  boxOf: (taskId: Id) => BarBox | null;
  /** Vertical pixel range on screen; a link wholly outside it is not drawn. */
  fromY: number;
  toY: number;
  rowHeight: number;
  width: number;
  height: number;
  /** A link being drawn by hand: from a bar's end to the pointer. */
  draft: { from: PathPoint; to: PathPoint } | null;
}

function arrowHead(tip: PathPoint, direction: 1 | -1): string {
  const back = tip.x - direction * ARROW;
  return `${tip.x},${tip.y} ${back},${tip.y - ARROW * 0.7} ${back},${tip.y + ARROW * 0.7}`;
}

/** The dependency lines between bars. */
export function TimelineLinks({ project, schedule, boxOf, fromY, toY, rowHeight, width, height, draft }: TimelineLinksProps) {
  const store = useGanttStore();
  const selectedLinkId = useGantt((state) => state.selectedLinkId);
  const showCriticalPath = useGantt((state) => state.showCriticalPath);

  const paths = useMemo(() => {
    const result = [];
    for (const link of project.links) {
      const from = boxOf(link.predecessorId);
      const to = boxOf(link.successorId);
      if (!from || !to) continue;
      if (Math.max(from.y, to.y) < fromY || Math.min(from.y, to.y) > toY) continue;
      const route = routeLink(link.type, from, to, STUB, rowHeight);
      const state = schedule.links.get(link.id);
      const critical =
        showCriticalPath &&
        state?.driving === true &&
        schedule.tasks.get(link.predecessorId)?.critical === true &&
        schedule.tasks.get(link.successorId)?.critical === true;
      result.push({ id: link.id, route, violated: state?.violated === true, critical });
    }
    return result;
  }, [project.links, schedule, boxOf, fromY, toY, rowHeight, showCriticalPath]);

  return (
    <svg className="pointer-events-none absolute left-0 top-0" width={width} height={height} aria-hidden="true">
      {paths.map(({ id, route, violated, critical }) => {
        const selected = id === selectedLinkId;
        const tone = selected ? "text-primary" : violated || critical ? "text-destructive" : "text-muted-foreground";
        return (
          <g key={id} className={tone} data-gantt-link={id}>
            {/* A wide transparent stroke makes the thin line easy to hit. */}
            <path
              d={roundedPathData(route.points)}
              fill="none"
              stroke="transparent"
              strokeWidth={10}
              className="pointer-events-auto cursor-pointer"
              onPointerDown={(event) => {
                event.stopPropagation();
                store.getState().selectLink(id);
              }}
            />
            <path
              d={roundedPathData(route.points)}
              fill="none"
              stroke="currentColor"
              strokeWidth={selected ? 2 : 1.25}
              strokeDasharray={violated ? "4 3" : undefined}
              className={cn(!selected && !violated && !critical && "opacity-70")}
            />
            <polygon points={arrowHead(route.points[route.points.length - 1], route.arrow)} fill="currentColor" />
          </g>
        );
      })}
      {draft && (
        <line
          x1={draft.from.x}
          y1={draft.from.y}
          x2={draft.to.x}
          y2={draft.to.y}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          className="text-primary"
        />
      )}
    </svg>
  );
}
