import type { MergeConflict, Project } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";
import { useState } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { useGanttTranslation } from "../lib/use-gantt-translation";

const LISTS = { task: "tasks", link: "links", resource: "resources", assignment: "assignments", calendar: "calendars", customField: "customFields" } as const;

type Named = { id: string; name?: string; predecessorId?: string; successorId?: string; taskId?: string; resourceId?: string };

function recordOf(project: Project, conflict: MergeConflict): Named | undefined {
  return ((project[LISTS[conflict.entity]] ?? []) as readonly Named[]).find((record) => record.id === conflict.id);
}

/** What to call a record in the list: its name, or the names of the two records it joins. */
function labelOf(record: Named | undefined, mine: Project, theirs: Project): string {
  if (!record) return "";
  if (record.name !== undefined) return record.name;
  const taskName = (id: string | undefined): string => [...mine.tasks, ...theirs.tasks].find((task) => task.id === id)?.name ?? id ?? "";
  if (record.predecessorId !== undefined) return `${taskName(record.predecessorId)} → ${taskName(record.successorId)}`;
  const resourceName = [...mine.resources, ...theirs.resources].find((resource) => resource.id === record.resourceId)?.name ?? record.resourceId ?? "";
  return `${taskName(record.taskId)} · ${resourceName}`;
}

/**
 * Lists the records a merge found changed on both sides. This side's version
 * was kept; the reader picks the records that should take the other side's
 * version instead. Mounted by {@link GanttShell}; it shows while the store
 * holds conflicts of a merge.
 */
export function MergeDialog() {
  const pending = useGantt((state) => state.pendingMerge);
  if (!pending) return null;
  return <MergeChoices key={pending.conflicts.map((conflict) => `${conflict.entity}:${conflict.id}`).join("|")} />;
}

function MergeChoices() {
  const { t } = useGanttTranslation();
  const store = useGanttStore();
  const ui = useFlatUIComponents();
  const pending = useGantt((state) => state.pendingMerge);
  const mine = useGantt((state) => state.history.present);
  const [taken, setTaken] = useState<ReadonlySet<string>>(new Set());
  if (!pending) return null;
  const keyOf = (conflict: MergeConflict): string => `${conflict.entity}:${conflict.id}`;
  const rows = pending.conflicts.map((conflict) => {
    const here = recordOf(mine, conflict);
    const there = recordOf(pending.theirs, conflict);
    return {
      conflict,
      key: keyOf(conflict),
      label: labelOf(here ?? there, mine, pending.theirs),
      // A link of theirs that would close a loop is not in this plan and cannot be taken.
      state: here === undefined ? ("left-out" as const) : there === undefined ? ("removed-there" as const) : ("changed-both" as const),
    };
  });
  const choosable = rows.filter((row) => row.state !== "left-out");
  const settle = (keys: ReadonlySet<string>): void => store.getState().settleMerge(choosable.filter((row) => keys.has(row.key)).map((row) => row.conflict));
  const toggle = (key: string, theirs: boolean): void => {
    const next = new Set(taken);
    if (theirs) next.add(key);
    else next.delete(key);
    setTaken(next);
  };
  return (
    <ui.Dialog open onOpenChange={(next) => !next && settle(new Set())}>
      <ui.DialogContent className="max-w-xl" data-gantt-slot="merge-dialog">
        <ui.DialogHeader>
          <ui.DialogTitle>{t("merge.title")}</ui.DialogTitle>
          <ui.DialogDescription>{t("merge.hint")}</ui.DialogDescription>
        </ui.DialogHeader>
        <ul className="max-h-80 divide-y overflow-y-auto rounded-md border text-sm">
          {rows.map((row) => (
            <li key={row.key} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2" data-gantt-conflict={row.key}>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{`${t(`merge.entity.${row.conflict.entity}`)}: ${row.label}`}</p>
                <p className="text-xs text-muted-foreground">{t(`merge.state.${row.state}`)}</p>
              </div>
              {row.state !== "left-out" && (
                <div className="flex shrink-0 rounded-md bg-muted p-0.5" role="radiogroup" aria-label={row.label}>
                  {([false, true] as const).map((theirs) => (
                    <button
                      key={String(theirs)}
                      type="button"
                      role="radio"
                      aria-checked={taken.has(row.key) === theirs}
                      className={cn(
                        "rounded-sm px-2 py-1 text-xs font-medium",
                        taken.has(row.key) === theirs ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => toggle(row.key, theirs)}
                    >
                      {t(theirs ? "merge.theirs" : "merge.mine")}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <ui.DialogFooter>
          {choosable.length > 0 && (
            <Button variant="outline" onClick={() => settle(new Set(choosable.map((row) => row.key)))}>
              {t("merge.allTheirs")}
            </Button>
          )}
          <Button onClick={() => settle(taken)}>{t("merge.apply")}</Button>
        </ui.DialogFooter>
      </ui.DialogContent>
    </ui.Dialog>
  );
}
