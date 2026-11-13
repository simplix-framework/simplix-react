import { MINUTES_PER_DAY, dayIndexOf, fromCivil, toCivil, weekdayOfDay } from "@simplix-react/gantt-core";
import { Button } from "@simplix-react/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { nowOnProjectClock } from "../lib/markers";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { weekdayName } from "./dialog-fields";

/** Tasks named in one day's box before the rest are counted. */
const PER_DAY = 3;

/** Props for {@link CalendarView}. */
export interface CalendarViewProps {
  /** First day of a week column: 0 is Sunday. */
  weekStartsOn?: number;
}

/**
 * The calendar view: one month as a grid of days, each naming the tasks that
 * work on it. Choosing a task opens its information dialog.
 */
export function CalendarView({ weekStartsOn = 0 }: CalendarViewProps) {
  const { t, language } = useGanttTranslation();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const [month, setMonth] = useState(() => {
    const c = toCivil(schedule.start);
    return { year: c.year, month: c.month };
  });
  const today = dayIndexOf(nowOnProjectClock());

  const weeks = useMemo(() => {
    const first = dayIndexOf(fromCivil(month.year, month.month, 1));
    const start = first - ((weekdayOfDay(first) - weekStartsOn + 7) % 7);
    const tasks = project.tasks.flatMap((task) => {
      const at = schedule.tasks.get(task.id);
      return at && !at.summary ? [{ id: task.id, name: task.name, critical: at.critical, from: dayIndexOf(at.start), to: dayIndexOf(Math.max(at.start, at.finish - 1)) }] : [];
    });
    return Array.from({ length: 6 }, (_, week) =>
      Array.from({ length: 7 }, (_, weekday) => {
        const day = start + week * 7 + weekday;
        return { day, inMonth: toCivil(day * MINUTES_PER_DAY).month === month.month, tasks: tasks.filter((task) => task.from <= day && task.to >= day) };
      }),
    );
  }, [month, project.tasks, schedule, weekStartsOn]);

  const step = (delta: number): void => {
    const index = month.year * 12 + (month.month - 1) + delta;
    setMonth({ year: Math.floor(index / 12), month: (index % 12) + 1 });
  };
  const title = new Intl.DateTimeFormat(language, { year: "numeric", month: "long", timeZone: "UTC" }).format(new Date(fromCivil(month.year, month.month, 1) * 60000));

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background" data-gantt-slot="calendar-view">
      <div className="flex shrink-0 items-center gap-2 border-b px-2 py-1.5">
        <Button variant="ghost" size="icon-sm" aria-label={t("calendarView.previous")} onClick={() => step(-1)}>
          <ChevronLeft />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={t("calendarView.next")} onClick={() => step(1)}>
          <ChevronRight />
        </Button>
        <span className="text-sm font-semibold" data-gantt-slot="calendar-title">
          {title}
        </span>
      </div>
      <div className="grid shrink-0 grid-cols-7 border-b bg-muted text-xs text-muted-foreground">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="border-r px-2 py-1 font-medium">
            {weekdayName((weekStartsOn + i) % 7, language, "short")}
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-rows-6 overflow-auto">
        {weeks.map((week) => (
          <div key={week[0].day} className="grid min-h-24 grid-cols-7 border-b">
            {week.map(({ day, inMonth, tasks }) => (
              <div key={day} className={cn("flex min-w-0 flex-col gap-0.5 border-r p-1", !inMonth && "bg-muted/50 text-muted-foreground")} data-gantt-day={day}>
                <span className={cn("self-start rounded-full px-1.5 text-xs tabular-nums", day === today && "bg-sky-500 font-semibold text-white")}>
                  {toCivil(day * MINUTES_PER_DAY).day}
                </span>
                {tasks.slice(0, PER_DAY).map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    title={task.name}
                    className={cn(
                      "truncate rounded-sm px-1 text-left text-xs",
                      task.critical ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-foreground",
                    )}
                    onClick={() => store.getState().openTaskDialog(task.id)}
                  >
                    {task.name}
                  </button>
                ))}
                {tasks.length > PER_DAY && <span className="px-1 text-xs text-muted-foreground">{t("calendarView.more", { count: tasks.length - PER_DAY })}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
