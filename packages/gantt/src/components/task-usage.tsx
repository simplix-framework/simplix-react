import { MINUTES_PER_DAY, compileCalendars, dayIndexOf } from "@simplix-react/gantt-core";
import { Fragment, useMemo } from "react";

import { useGantt } from "../context/gantt-context";
import { formatScaleCell } from "../lib/format";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** Plans longer than this many days are totalled per week instead of per day. */
const DAILY_LIMIT = 120;

function hours(minutes: number): string {
  return String(Math.round(minutes / 6) / 10);
}

/**
 * The task usage table: every task that has resources, with a line per
 * assignment under it, and the hours each assignment works per day (per week
 * for a long plan) on the project calendar.
 */
export function TaskUsage() {
  const { t, language } = useGanttTranslation();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);

  const { starts, unit, tasks } = useMemo(() => {
    const time = compileCalendars(project.calendars).get(project.calendarId);
    const fromDay = dayIndexOf(schedule.start);
    const toDay = Math.max(fromDay, dayIndexOf(schedule.finish - 1));
    const size = toDay - fromDay + 1 > DAILY_LIMIT ? 7 : 1;
    const buckets: number[] = [];
    for (let day = fromDay; day <= toDay; day += size) buckets.push(day);
    const names = new Map(project.resources.map((resource) => [resource.id, resource.name]));
    const list = project.tasks.flatMap((task) => {
      const at = schedule.tasks.get(task.id);
      const assignments = project.assignments.filter((assignment) => assignment.taskId === task.id);
      if (!at || assignments.length === 0 || !time) return [];
      const lines = assignments.map((assignment) => ({
        id: assignment.id,
        name: names.get(assignment.resourceId) ?? assignment.resourceId,
        cells: buckets.map((day) => {
          let minutes = 0;
          for (const segment of at.segments) {
            const from = Math.max(day * MINUTES_PER_DAY, segment.start);
            const to = Math.min((day + size) * MINUTES_PER_DAY, segment.finish);
            if (to > from) minutes += time.workBetween(from, to) * assignment.units;
          }
          return minutes;
        }),
      }));
      return [{ id: task.id, name: task.name, lines, totals: buckets.map((_, i) => lines.reduce((sum, line) => sum + line.cells[i], 0)) }];
    });
    return { starts: buckets, unit: size === 7 ? ("week" as const) : ("day" as const), tasks: list };
  }, [project, schedule]);

  if (tasks.length === 0) {
    return (
      <div className="min-h-0 flex-1 bg-background px-4 py-10 text-center" data-gantt-slot="task-usage">
        <p className="text-sm font-medium">{t("resource.empty")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("resource.emptyHint")}</p>
      </div>
    );
  }

  const cell = (minutes: number): string => (minutes > 0 ? t("usage.hours", { value: hours(minutes) }) : "");
  return (
    <div className="min-h-0 flex-1 overflow-auto bg-background" data-gantt-slot="task-usage">
      <table className="border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 z-20 bg-muted text-xs text-muted-foreground">
          <tr>
            <th className="sticky left-0 z-30 min-w-64 border-b border-r bg-muted px-2 py-2 text-left font-medium">{t("column.name")}</th>
            {starts.map((day) => (
              <th key={day} className="min-w-14 whitespace-nowrap border-b border-r px-2 py-2 text-center font-medium">
                {formatScaleCell(day * MINUTES_PER_DAY, unit, language, 56)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <Fragment key={task.id}>
              <tr data-gantt-usage-task={task.id}>
                <th className="sticky left-0 z-10 border-b border-r bg-background px-2 py-1.5 text-left font-semibold">{task.name}</th>
                {task.totals.map((minutes, i) => (
                  <td key={starts[i]} className="border-b border-r px-1 py-1.5 text-right font-medium tabular-nums">
                    {cell(minutes)}
                  </td>
                ))}
              </tr>
              {task.lines.map((line) => (
                <tr key={line.id}>
                  <th className="sticky left-0 z-10 border-b border-r bg-background py-1.5 pl-6 pr-2 text-left font-normal text-muted-foreground">{line.name}</th>
                  {line.cells.map((minutes, i) => (
                    <td key={starts[i]} className="border-b border-r px-1 py-1.5 text-right tabular-nums text-muted-foreground">
                      {cell(minutes)}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
