import { MINUTES_PER_DAY, dayIndexOf, resourceUsage } from "@simplix-react/gantt-core";
import { useMemo } from "react";

import { useGantt } from "../context/gantt-context";
import { formatScaleCell } from "../lib/format";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** Plans longer than this many days are totalled per week instead of per day. */
const DAILY_LIMIT = 120;
const BAR_WIDTH = 18;
const GRAPH_HEIGHT = 88;

/**
 * The resource graph: for every work resource a column per day (per week for
 * a long plan) showing the booked work against the capacity, with the part
 * over capacity in the destructive colour.
 */
export function ResourceGraph() {
  const { t, language } = useGanttTranslation();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);

  const { starts, unit, rows } = useMemo(() => {
    const fromDay = dayIndexOf(schedule.start);
    const toDay = Math.max(fromDay, dayIndexOf(schedule.finish - 1));
    const size = toDay - fromDay + 1 > DAILY_LIMIT ? 7 : 1;
    const usage = resourceUsage(project, schedule, fromDay, toDay);
    const buckets: number[] = [];
    for (let day = fromDay; day <= toDay; day += size) buckets.push(day);
    const total = (values: readonly number[], bucket: number): number => {
      let sum = 0;
      for (let i = bucket * size; i < Math.min(values.length, (bucket + 1) * size); i++) sum += values[i];
      return sum;
    };
    return {
      starts: buckets,
      unit: size === 7 ? ("week" as const) : ("day" as const),
      rows: project.resources
        .filter((resource) => resource.type === "work")
        .map((resource) => {
          const entry = usage.get(resource.id);
          const cells = buckets.map((_, bucket) => ({ work: entry ? total(entry.work, bucket) : 0, capacity: entry ? total(entry.capacity, bucket) : 0 }));
          return { resource, cells, peak: Math.max(1, ...cells.map((cell) => Math.max(cell.work, cell.capacity))) };
        }),
    };
  }, [project, schedule]);

  if (rows.length === 0) {
    return (
      <div className="min-h-0 flex-1 bg-background px-4 py-10 text-center" data-gantt-slot="resource-graph">
        <p className="text-sm font-medium">{t("resource.empty")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("resource.emptyHint")}</p>
      </div>
    );
  }

  const width = starts.length * BAR_WIDTH;
  return (
    <div className="min-h-0 flex-1 overflow-auto bg-background" data-gantt-slot="resource-graph">
      {rows.map(({ resource, cells, peak }) => (
        <div key={resource.id} className="flex border-b" data-gantt-resource={resource.id}>
          <div className="sticky left-0 z-10 w-52 shrink-0 border-r bg-background px-2 py-2 text-sm">{resource.name}</div>
          <svg width={width} height={GRAPH_HEIGHT + 18} role="img" aria-label={`${resource.name}: ${t("field.work")} / ${t("graph.capacity")}`}>
            {cells.map((cell, i) => {
              const x = i * BAR_WIDTH;
              const within = Math.min(cell.work, cell.capacity);
              const over = Math.max(0, cell.work - cell.capacity);
              const h = (minutes: number): number => (minutes / peak) * GRAPH_HEIGHT;
              return (
                <g key={starts[i]}>
                  <rect x={x + 2} y={GRAPH_HEIGHT - h(within)} width={BAR_WIDTH - 4} height={h(within)} className="fill-primary/70" />
                  {over > 0 && (
                    <rect x={x + 2} y={GRAPH_HEIGHT - h(cell.work)} width={BAR_WIDTH - 4} height={h(over)} className="fill-destructive" data-gantt-slot="over" />
                  )}
                  {/* The capacity of the bucket, as a tick across its column. */}
                  <line x1={x} x2={x + BAR_WIDTH} y1={GRAPH_HEIGHT - h(cell.capacity)} y2={GRAPH_HEIGHT - h(cell.capacity)} className="stroke-foreground/60" strokeWidth={1} />
                  {i % (unit === "day" ? 7 : 4) === 0 && (
                    <text x={x + 2} y={GRAPH_HEIGHT + 13} className="fill-muted-foreground text-[9px]">
                      {formatScaleCell(starts[i] * MINUTES_PER_DAY, unit === "day" ? "week" : "month", language, 80)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      ))}
    </div>
  );
}
