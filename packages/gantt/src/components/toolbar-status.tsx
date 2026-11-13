import { findOverallocations } from "@simplix-react/gantt-core";
import { Badge, useFlatUIComponents } from "@simplix-react/ui";
import { useMemo } from "react";
import type { ReactNode } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** Props for {@link ToolbarStatus}. */
export interface ToolbarStatusProps {
  /** A slow command is running. */
  loading: boolean;
  /** Extra controls after the marks. */
  trailing?: ReactNode;
}

/** The marks at the end of the toolbar: a running command, scheduling conflicts and overallocated resources. */
export function ToolbarStatus({ loading, trailing }: ToolbarStatusProps) {
  const { t } = useGanttTranslation();
  const store = useGanttStore();
  const ui = useFlatUIComponents();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const overallocations = useMemo(() => findOverallocations(project, schedule).length, [project, schedule]);
  const conflictCount = useMemo(() => new Set(schedule.conflicts.map((c) => c.taskId)).size, [schedule.conflicts]);
  const state = store.getState();
  return (
    <div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2" data-gantt-slot="toolbar-status">
          {loading && <Badge variant="outline">{t("status.loading")}</Badge>}
          {conflictCount > 0 && (
            <ui.Popover>
              <ui.PopoverTrigger asChild>
                <button type="button" className="rounded-md" aria-label={t("status.conflictList")}>
                  <Badge variant="destructive">{t("status.conflicts", { count: conflictCount })}</Badge>
                </button>
              </ui.PopoverTrigger>
              <ui.PopoverContent align="end" className="max-h-80 w-96 overflow-y-auto p-1" data-gantt-slot="conflict-list">
                {schedule.conflicts.map((conflict, i) => {
                  const at = schedule.tasks.get(conflict.taskId);
                  const task = project.tasks.find((candidate) => candidate.id === conflict.taskId);
                  return (
                    <button
                      key={`${conflict.kind}:${conflict.taskId}:${conflict.linkId ?? i}`}
                      type="button"
                      className="flex w-full flex-col items-start rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                      onClick={() => state.reveal(conflict.taskId)}
                    >
                      <span className="font-medium">{`${(at?.index ?? 0) + 1}. ${task?.name ?? conflict.taskId}`}</span>
                      <span className="text-xs text-muted-foreground">{t(`conflict.${conflict.kind}`)}</span>
                    </button>
                  );
                })}
              </ui.PopoverContent>
            </ui.Popover>
          )}
          {overallocations > 0 && <Badge variant="outline">{t("status.overallocations", { count: overallocations })}</Badge>}
          {trailing}
    </div>
  );
}
