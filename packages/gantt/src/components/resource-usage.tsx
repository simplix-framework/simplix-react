import { MINUTES_PER_DAY, resourceUsage } from "@simplix-react/gantt-core";
import { useMemo } from "react";

import { useGantt } from "../context/gantt-context";
import { formatScaleCell } from "../lib/format";
import { hoursText, usageBuckets } from "../lib/usage-buckets";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { UsageGrid } from "./usage-grid";

/**
 * The resource usage table: booked hours of every work resource per day, or
 * per week for a long plan. A cell above the resource's capacity is marked.
 */
export function ResourceUsage() {
  const { t, language } = useGanttTranslation();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);

  const { buckets, rows } = useMemo(() => {
    const dated = usageBuckets(schedule);
    const usage = resourceUsage(project, schedule, dated.fromDay, dated.toDay);
    return {
      buckets: dated,
      rows: project.resources
        .filter((resource) => resource.type === "work")
        .map((resource) => {
          const entry = usage.get(resource.id);
          return {
            resource,
            cells: dated.starts.map((_, bucket) => ({
              work: entry ? dated.total(entry.work, bucket) : 0,
              capacity: entry ? dated.total(entry.capacity, bucket) : 0,
            })),
          };
        }),
    };
  }, [project, schedule]);
  const headers = useMemo(
    () => buckets.starts.map((day) => formatScaleCell(day * MINUTES_PER_DAY, buckets.unit, language, 56)),
    [buckets, language],
  );

  if (rows.length === 0) {
    return (
      <div className="min-h-0 flex-1 bg-background px-4 py-10 text-center" data-gantt-slot="resource-usage">
        <p className="text-sm font-medium">{t("resource.empty")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("resource.emptyHint")}</p>
      </div>
    );
  }

  return (
    <UsageGrid
      slot="resource-usage"
      nameHeader={t("resource.name")}
      nameWidth={208}
      headers={headers}
      rows={rows.map(({ resource }) => ({ key: resource.id, name: resource.name, data: { "data-gantt-resource": resource.id } }))}
      cell={(row, column) => {
        const { work, capacity } = rows[row].cells[column];
        const over = work > capacity + 1e-6;
        return {
          text: work > 0 ? t("usage.hours", { value: hoursText(work) }) : "",
          tone: over ? "over" : capacity === 0 ? "idle" : undefined,
          title: over ? t("usage.overallocated") : undefined,
        };
      }}
    />
  );
}
