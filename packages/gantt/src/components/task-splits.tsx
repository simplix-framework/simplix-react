import { clearSplits, formatDuration, parseDuration, parseLocalDateTime, splitTask } from "@simplix-react/gantt-core";
import type { Minutes, Task } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { toDateInputValue } from "../lib/format";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { Field } from "./dialog-fields";

/** Props for {@link TaskSplits}. */
export interface TaskSplitsProps {
  task: Task;
  /** The task's scheduled start, which the date of a new pause opens at. */
  start: Minutes;
}

/** The splits of one task: the pauses it has, a form that adds one from a date for a length of working time, and a button that removes them all. */
export function TaskSplits({ task, start }: TaskSplitsProps) {
  const { t } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const { apply } = store.getState();
  return (
    <div className="col-span-2 flex flex-col gap-2 border-t pt-3">
      <p className="text-sm font-medium">{t("split.title")}</p>
      {(task.splits ?? []).map((split) => (
        <p key={split.offset} className="text-sm text-muted-foreground" data-gantt-slot="split-entry">
          {t("split.entry", {
            worked: formatDuration({ minutes: split.offset, unit: "d", elapsed: false, estimated: false }, project),
            gap: formatDuration({ minutes: split.gap, unit: "d", elapsed: false, estimated: false }, project),
          })}
        </p>
      ))}
      <form
        className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const date = String(form.get("at") ?? "");
          const gap = String(form.get("gap") ?? "");
          if (date === "") return;
          apply("split-task", (p, s) => splitTask(p, s, task.id, parseLocalDateTime(date) + p.defaultStartTime, parseDuration(gap, p).minutes));
        }}
      >
        <Field label={t("split.at")}>{(id) => <ui.Input id={id} name="at" type="date" defaultValue={toDateInputValue(start)} />}</Field>
        <Field label={t("split.gap")}>{(id) => <ui.Input id={id} name="gap" defaultValue="1d" />}</Field>
        <Button type="submit" variant="outline">
          {t("split.add")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={!task.splits || task.splits.length === 0}
          onClick={() => apply("clear-splits", (p) => clearSplits(p, task.id))}
        >
          {t("split.clear")}
        </Button>
      </form>
    </div>
  );
}
