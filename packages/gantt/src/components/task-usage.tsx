import { MINUTES_PER_DAY, compileCalendars } from "@simplix-react/gantt-core";
import { useMemo } from "react";

import { useGantt } from "../context/gantt-context";
import { formatScaleCell } from "../lib/format";
import { hoursText, usageBuckets } from "../lib/usage-buckets";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { UsageGrid } from "./usage-grid";
import type { UsageGridRow } from "./usage-grid";

/**
 * The task usage table: every task that has resources, with a line per
 * assignment under it, and the hours each assignment works per day (per week
 * for a long plan) on the project calendar.
 */
export function TaskUsage() {
  const { t, language } = useGanttTranslation();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);

  const { buckets, lines } = useMemo(() => {
    const time = compileCalendars(project.calendars).get(project.calendarId);
    const dated = usageBuckets(schedule);
    const names = new Map(project.resources.map((resource) => [resource.id, resource.name]));
    const list: (UsageGridRow & { cells: number[] })[] = [];
    for (const task of project.tasks) {
      const at = schedule.tasks.get(task.id);
      const assignments = project.assignments.filter((assignment) => assignment.taskId === task.id);
      if (!at || assignments.length === 0 || !time) continue;
      const mine = assignments.map((assignment) => ({
        key: `assignment:${assignment.id}`,
        name: names.get(assignment.resourceId) ?? assignment.resourceId,
        nested: true,
        cells: dated.starts.map((day) => {
          let minutes = 0;
          for (const segment of at.segments) {
            const from = Math.max(day * MINUTES_PER_DAY, segment.start);
            const to = Math.min((day + dated.size) * MINUTES_PER_DAY, segment.finish);
            if (to > from) minutes += time.workBetween(from, to) * assignment.units;
          }
          return minutes;
        }),
      }));
      list.push({
        key: `task:${task.id}`,
        name: task.name,
        strong: true,
        data: { "data-gantt-usage-task": task.id },
        cells: dated.starts.map((_, i) => mine.reduce((sum, line) => sum + line.cells[i], 0)),
      });
      list.push(...mine);
    }
    return { buckets: dated, lines: list };
  }, [project, schedule]);
  const headers = useMemo(
    () => buckets.starts.map((day) => formatScaleCell(day * MINUTES_PER_DAY, buckets.unit, language, 56)),
    [buckets, language],
  );

  if (lines.length === 0) {
    return (
      <div className="min-h-0 flex-1 bg-background px-4 py-10 text-center" data-gantt-slot="task-usage">
        <p className="text-sm font-medium">{t("resource.empty")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("resource.emptyHint")}</p>
      </div>
    );
  }

  return (
    <UsageGrid
      slot="task-usage"
      nameHeader={t("column.name")}
      nameWidth={256}
      headers={headers}
      rows={lines}
      cell={(row, column) => {
        const minutes = lines[row].cells[column];
        return { text: minutes > 0 ? t("usage.hours", { value: hoursText(minutes) }) : "" };
      }}
    />
  );
}
