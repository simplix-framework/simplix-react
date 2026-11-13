import { addRecurringTask, parseDuration, parseLocalDateTime } from "@simplix-react/gantt-core";
import type { Recurrence } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";
import { useState } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { toDateInputValue } from "../lib/format";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { Field, Toggle, weekdayName } from "./dialog-fields";

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;
const FREQUENCIES = ["daily", "weekly", "monthly"] as const;

/**
 * The recurring task dialog: a name, a duration and when it repeats. Creating
 * it adds a summary task with one task per occurrence, as one undo step.
 */
export function RecurringDialog() {
  const { t, language } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const store = useGanttStore();
  const open = useGantt((state) => state.recurringDialogOpen);
  const project = useGantt((state) => state.history.present);
  const [frequency, setFrequency] = useState<Recurrence["frequency"]>("weekly");
  const [weekdays, setWeekdays] = useState<readonly number[]>([1]);
  if (!open) return null;

  const { apply, closeRecurringDialog, insertionPoint } = store.getState();
  const create = (form: FormData): void => {
    const text = (name: string): string => String(form.get(name) ?? "").trim();
    const accepted = apply("add-recurring-task", (p) => {
      const { at, level } = insertionPoint();
      const until = text("until");
      const count = text("count");
      const duration = parseDuration(text("duration"), p);
      return addRecurringTask(p, {
        name: text("name") || t("recurring.newName"),
        duration: duration.minutes,
        durationUnit: duration.unit,
        beforeIndex: at,
        outlineLevel: level,
        recurrence: {
          frequency,
          interval: Number(text("interval") || "1"),
          weekdays,
          monthDay: Number(text("monthDay") || "1"),
          from: parseLocalDateTime(text("from")),
          until: until === "" ? undefined : parseLocalDateTime(until),
          count: count === "" ? undefined : Number(count),
        },
      });
    });
    if (accepted) closeRecurringDialog();
  };

  return (
    <ui.Dialog open onOpenChange={(next) => !next && closeRecurringDialog()}>
      <ui.DialogContent className="max-w-lg">
        <ui.DialogHeader>
          <ui.DialogTitle>{t("toolbar.addRecurring")}</ui.DialogTitle>
          <ui.DialogDescription>{project.name}</ui.DialogDescription>
        </ui.DialogHeader>
        <form
          className="grid grid-cols-2 gap-x-4 gap-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            create(new FormData(event.currentTarget));
          }}
        >
          <Field label={t("field.name")} wide>
            {(id) => <ui.Input id={id} name="name" defaultValue={t("recurring.newName")} />}
          </Field>
          <Field label={t("column.duration")}>{(id) => <ui.Input id={id} name="duration" defaultValue="1h" />}</Field>
          <Field label={t("recurring.frequency")}>
            {() => (
              <ui.Select value={frequency} onValueChange={(value) => setFrequency(value as Recurrence["frequency"])}>
                <ui.SelectTrigger aria-label={t("recurring.frequency")} className="w-full">
                  <ui.SelectValue />
                </ui.SelectTrigger>
                <ui.SelectContent>
                  {FREQUENCIES.map((value) => (
                    <ui.SelectItem key={value} value={value}>
                      {t(`frequency.${value}`)}
                    </ui.SelectItem>
                  ))}
                </ui.SelectContent>
              </ui.Select>
            )}
          </Field>
          <Field label={t("recurring.interval")}>{(id) => <ui.Input id={id} name="interval" type="number" min={1} defaultValue={1} />}</Field>
          {frequency === "monthly" && (
            <Field label={t("recurring.monthDay")}>{(id) => <ui.Input id={id} name="monthDay" type="number" min={1} max={31} defaultValue={1} />}</Field>
          )}
          {frequency === "weekly" && (
            <div className="col-span-2 flex flex-col gap-1.5">
              <ui.Label>{t("recurring.weekdays")}</ui.Label>
              <div className="flex flex-wrap gap-3">
                {WEEKDAYS.map((weekday) => (
                  <Toggle
                    key={weekday}
                    aligned={false}
                    label={weekdayName(weekday, language, "short")}
                    checked={weekdays.includes(weekday)}
                    onChange={(checked) => setWeekdays(checked ? [...weekdays, weekday] : weekdays.filter((other) => other !== weekday))}
                  />
                ))}
              </div>
            </div>
          )}
          <Field label={t("recurring.from")}>
            {(id) => <ui.Input id={id} name="from" type="date" required defaultValue={toDateInputValue(project.start)} />}
          </Field>
          <Field label={t("recurring.until")}>{(id) => <ui.Input id={id} name="until" type="date" />}</Field>
          <Field label={t("recurring.count")}>{(id) => <ui.Input id={id} name="count" type="number" min={1} max={500} defaultValue={4} />}</Field>
          <ui.DialogFooter className="col-span-2">
            <Button type="button" variant="outline" onClick={closeRecurringDialog}>
              {t("dialog.close")}
            </Button>
            <Button type="submit">{t("recurring.create")}</Button>
          </ui.DialogFooter>
        </form>
      </ui.DialogContent>
    </ui.Dialog>
  );
}
