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
  // The day whose tasks a narrow calendar lists under the month.
  const [chosenDay, setChosenDay] = useState<number | null>(null);

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
  const dayLabel = (day: number): string =>
    new Intl.DateTimeFormat(language, { month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(day * MINUTES_PER_DAY * 60000));
  const chosenTasks = weeks.flat().find((cell) => cell.day === chosenDay)?.tasks ?? [];
  const title = new Intl.DateTimeFormat(language, { year: "numeric", month: "long", timeZone: "UTC" }).format(new Date(fromCivil(month.year, month.month, 1) * 60000));

  return (
    <div className="@container flex min-h-0 flex-1 flex-col bg-background" data-gantt-slot="calendar-view">
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
          <div key={i} className="truncate border-r px-1 py-1 text-center font-medium @2xl:px-2 @2xl:text-left">
            {weekdayName((weekStartsOn + i) % 7, language, "short")}
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-rows-6 overflow-auto">
        {weeks.map((week) => (
          <div key={week[0].day} className="grid min-h-14 grid-cols-7 border-b @2xl:min-h-24">
            {week.map(({ day, inMonth, tasks }) => (
              <div key={day} className={cn("flex min-w-0 flex-col gap-0.5 border-r p-1", !inMonth && "bg-muted/50 text-muted-foreground")} data-gantt-day={day}>
                <span className={cn("self-start rounded-full px-1.5 text-xs tabular-nums", day === today && "bg-sky-500 font-semibold text-white")}>
                  {toCivil(day * MINUTES_PER_DAY).day}
                </span>
                {/* A box too narrow for names shows a mark per task; choosing the day lists them below. */}
                {tasks.length > 0 && (
                  <button
                    type="button"
                    aria-label={`${dayLabel(day)}: ${t("calendarView.taskCount", { count: tasks.length })}`}
                    aria-pressed={chosenDay === day}
                    className={cn("flex flex-col gap-0.5 rounded-sm p-0.5 @2xl:hidden", chosenDay === day && "ring-2 ring-ring")}
                    data-gantt-slot="calendar-day-marks"
                    onClick={() => setChosenDay(day)}
                  >
                    {tasks.slice(0, PER_DAY).map((task) => (
                      <span key={task.id} className={cn("h-1.5 w-full rounded-full", task.critical ? "bg-destructive/60" : "bg-primary/40")} />
                    ))}
                    <span className="text-[10px] leading-3 text-muted-foreground tabular-nums">{tasks.length}</span>
                  </button>
                )}
                {tasks.slice(0, PER_DAY).map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    title={task.name}
                    className={cn(
                      "hidden truncate rounded-sm px-1 text-left text-xs @2xl:block",
                      task.critical ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-foreground",
                    )}
                    onClick={() => store.getState().openTaskDialog(task.id)}
                  >
                    {task.name}
                  </button>
                ))}
                {tasks.length > PER_DAY && <span className="hidden px-1 text-xs text-muted-foreground @2xl:block">{t("calendarView.more", { count: tasks.length - PER_DAY })}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* The chosen day's tasks, by name, where the boxes above have no room for names. */}
      <div className="max-h-44 shrink-0 overflow-y-auto border-t p-2 text-sm @2xl:hidden" data-gantt-slot="calendar-day-list">
        {chosenDay === null ? (
          <p className="text-muted-foreground">{t("calendarView.pickDay")}</p>
        ) : (
          <>
            <p className="mb-1 font-medium">{t("calendarView.dayTasks", { date: dayLabel(chosenDay) })}</p>
            {chosenTasks.length === 0 && <p className="text-muted-foreground">{t("calendarView.noTasks")}</p>}
            {chosenTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                className={cn("block w-full truncate rounded-sm px-1.5 py-1 text-left hover:bg-accent", task.critical && "text-destructive")}
                onClick={() => store.getState().openTaskDialog(task.id)}
              >
                {task.name}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
