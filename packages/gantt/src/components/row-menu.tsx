import { useFlatUIComponents } from "@simplix-react/ui";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** Props for {@link RowMenu}. */
export interface RowMenuProps {
  /** Where the pointer was, in viewport pixels. */
  x: number;
  y: number;
  onClose: () => void;
}

/** The menu a right click on a row or a bar opens: the commands that act on the selected tasks. */
export function RowMenu({ x, y, onClose }: RowMenuProps) {
  const { t } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const store = useGanttStore();
  const selection = useGantt((state) => state.selection);
  const state = store.getState();
  const last = selection[selection.length - 1];

  return (
    <ui.DropdownMenu open onOpenChange={(open) => !open && onClose()}>
      {/* raw layout: an invisible anchor at the pointer for the menu to open from */}
      <ui.DropdownMenuTrigger asChild>
        <span className="pointer-events-none fixed size-0" style={{ left: x, top: y }} aria-hidden="true" />
      </ui.DropdownMenuTrigger>
      <ui.DropdownMenuContent align="start" data-gantt-slot="row-menu">
        <ui.DropdownMenuItem disabled={last === undefined} onSelect={() => last !== undefined && state.openTaskDialog(last)}>
          {t("toolbar.taskInformation")}
        </ui.DropdownMenuItem>
        <ui.DropdownMenuSeparator />
        <ui.DropdownMenuItem onSelect={() => state.addTask(t("task.newName"))}>{t("toolbar.addTask")}</ui.DropdownMenuItem>
        <ui.DropdownMenuItem onSelect={state.removeSelected}>{t("toolbar.removeTask")}</ui.DropdownMenuItem>
        <ui.DropdownMenuSeparator />
        <ui.DropdownMenuItem onSelect={state.outdentSelected}>{t("toolbar.outdent")}</ui.DropdownMenuItem>
        <ui.DropdownMenuItem onSelect={state.indentSelected}>{t("toolbar.indent")}</ui.DropdownMenuItem>
      </ui.DropdownMenuContent>
    </ui.DropdownMenu>
  );
}
