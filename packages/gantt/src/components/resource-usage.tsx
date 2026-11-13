import { MINUTES_PER_DAY, dayIndexOf, resourceUsage } from "@simplix-react/gantt-core";
import { useMemo } from "react";

import { useGantt } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { formatScaleCell } from "../lib/format";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** Plans longer than this many days are totalled per week instead of per day. */
const DAILY_LIMIT = 120;

function hours(minutes: number): string {
  return String(Math.round(minutes / 6) / 10);
}

/**
 * The resource usage table: booked hours of every work resource per day, or
 * per week for a long plan. A cell above the resource's capacity is marked.
 */
export function ResourceUsage() {
  const { t, language } = useGanttTranslation();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);

  const { buckets, rows } = useMemo(() => {
    const fromDay = dayIndexOf(schedule.start);
    const toDay = Math.max(fromDay, dayIndexOf(schedule.finish - 1));
    const size = toDay - fromDay + 1 > DAILY_LIMIT ? 7 : 1;
    const usage = resourceUsage(project, schedule, fromDay, toDay);
    const starts: number[] = [];
    for (let day = fromDay; day <= toDay; day += size) starts.push(day);
    const total = (values: readonly number[], bucket: number): number => {
      let sum = 0;
      for (let i = bucket * size; i < Math.min(values.length, (bucket + 1) * size); i++) sum += values[i];
      return sum;
    };
    return {
      buckets: starts.map((day) => ({ day, unit: size === 7 ? ("week" as const) : ("day" as const) })),
      rows: project.resources
        .filter((resource) => resource.type === "work")
        .map((resource) => {
          const entry = usage.get(resource.id);
          return {
            resource,
            cells: starts.map((_, bucket) => ({
              work: entry ? total(entry.work, bucket) : 0,
              capacity: entry ? total(entry.capacity, bucket) : 0,
            })),
          };
        }),
    };
  }, [project, schedule]);

  if (rows.length === 0) {
    return (
      <div className="min-h-0 flex-1 bg-background px-4 py-10 text-center" data-gantt-slot="resource-usage">
        <p className="text-sm font-medium">{t("resource.empty")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("resource.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-background" data-gantt-slot="resource-usage">
      <table className="border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 z-20 bg-muted text-xs text-muted-foreground">
          <tr>
            <th className="sticky left-0 z-30 min-w-52 border-b border-r bg-muted px-2 py-2 text-left font-medium">{t("resource.name")}</th>
            {buckets.map((bucket) => (
              <th key={bucket.day} className="min-w-14 whitespace-nowrap border-b border-r px-2 py-2 text-center font-medium">
                {formatScaleCell(bucket.day * MINUTES_PER_DAY, bucket.unit, language, 56)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ resource, cells }) => (
            <tr key={resource.id} data-gantt-resource={resource.id}>
              <th className="sticky left-0 z-10 border-b border-r bg-background px-2 py-1.5 text-left font-normal">{resource.name}</th>
              {cells.map((cell, i) => {
                const over = cell.work > cell.capacity + 1e-6;
                return (
                  <td
                    key={buckets[i].day}
                    title={over ? t("usage.overallocated") : undefined}
                    className={cn(
                      "border-b border-r px-1 py-1.5 text-right tabular-nums",
                      cell.capacity === 0 && "bg-muted/60",
                      over && "bg-destructive/15 font-medium text-destructive",
                    )}
                  >
                    {cell.work > 0 ? t("usage.hours", { value: hours(cell.work) }) : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
