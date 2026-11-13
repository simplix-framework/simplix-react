import { useFlatUIComponents } from "@simplix-react/ui";
import { useMemo } from "react";
import type { ReactNode } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { BUILT_IN_COLUMNS } from "../lib/grid-columns";
import type { GanttColumnId } from "../lib/grid-columns";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** Props for {@link ColumnChooser}. */
export interface ColumnChooserProps {
  /** The button that opens the list. */
  children: ReactNode;
}

/**
 * The list of columns the task table can show, each with a check mark: every
 * built-in column and one per custom field of the plan. The list stays open
 * while columns are switched, and the last column left cannot be switched off.
 */
export function ColumnChooser({ children }: ColumnChooserProps) {
  const { t } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const store = useGanttStore();
  const columns = useGantt((state) => state.columns);
  const customFields = useGantt((state) => state.history.present.customFields);
  const choices = useMemo<{ id: GanttColumnId; label: string }[]>(
    () => [
      ...BUILT_IN_COLUMNS.map((id) => ({ id, label: t(`column.${id}`) })),
      ...(customFields ?? []).map((field) => ({ id: `custom:${field.id}` as const, label: field.name })),
    ],
    [customFields, t],
  );

  return (
    <ui.DropdownMenu>
      <ui.DropdownMenuTrigger asChild>{children}</ui.DropdownMenuTrigger>
      <ui.DropdownMenuContent align="start" className="max-h-96 overflow-y-auto" data-gantt-slot="column-chooser">
        <ui.DropdownMenuLabel>{t("column.choose")}</ui.DropdownMenuLabel>
        {choices.map((choice) => {
          const shown = columns.includes(choice.id);
          return (
            <ui.DropdownMenuCheckboxItem
              key={choice.id}
              checked={shown}
              // A table with no column would have nothing to bring a column back from.
              disabled={shown && columns.length === 1}
              // The list stays open, so several columns can be switched in one visit.
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={() => store.getState().toggleColumn(choice.id)}
            >
              {choice.label}
            </ui.DropdownMenuCheckboxItem>
          );
        })}
      </ui.DropdownMenuContent>
    </ui.DropdownMenu>
  );
}
