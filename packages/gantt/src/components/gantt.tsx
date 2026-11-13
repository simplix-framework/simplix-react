import { Button } from "@simplix-react/ui";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { GanttProvider, useGantt, useGanttStore } from "../context/gantt-context";
import type { GanttProviderProps } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { GanttChart } from "./gantt-chart";
import type { GanttChartProps } from "./gantt-chart";
import { GanttToolbar } from "./gantt-toolbar";
import { CalendarView } from "./calendar-view";
import { MergeDialog } from "./merge-dialog";
import { NetworkDiagram } from "./network-diagram";
import { ProjectDialog } from "./project-dialog";
import { ResourceGraph } from "./resource-graph";
import { TaskUsage } from "./task-usage";
import { RecurringDialog } from "./recurring-dialog";
import type { GanttToolbarProps } from "./gantt-toolbar";
import { ResourceSheet } from "./resource-sheet";
import { ResourceUsage } from "./resource-usage";
import { TaskDialog } from "./task-dialog";

/** Props for {@link GanttShell}. */
export interface GanttShellProps extends GanttChartProps, Pick<GanttToolbarProps, "xmlExchange" | "planFiles" | "trailing"> {
  className?: string;
  /** Replaces the built-in message of a plan without tasks. */
  emptyState?: ReactNode;
}

/**
 * The standard chart chrome inside a {@link GanttProvider}: the toolbar above
 * the screen the toolbar's view switch selects, and the task information
 * dialog. Mount it in a box with a height; it fills the box and scrolls
 * inside it.
 */
export function GanttShell({ className, emptyState, xmlExchange, planFiles, trailing, ...chart }: GanttShellProps) {
  const { t } = useGanttTranslation();
  const view = useGantt((state) => state.view);
  const empty = useGantt((state) => state.history.present.tasks.length === 0);
  const printing = useGantt((state) => state.printing);
  const readOnly = useGantt((state) => state.readOnly);
  const store = useGanttStore();

  useEffect(() => {
    if (!printing) return;
    const root = document.documentElement;
    const done = (): void => store.getState().setPrinting(false);
    // The attribute lets the stylesheet hide the rest of the page while the chart prints.
    root.setAttribute("data-gantt-print", "");
    window.addEventListener("afterprint", done);
    // A timer, not an animation frame: a tab that is not on screen runs no frames.
    // The delay lets the print layout render before the browser lays out the pages.
    const timer = setTimeout(() => window.print(), 80);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", done);
      root.removeAttribute("data-gantt-print");
    };
  }, [printing, store]);

  return (
    <div
      className={cn(
        printing ? "bg-background" : "flex h-full min-h-0 flex-col overflow-hidden rounded-md border bg-background",
        className,
      )}
      data-gantt-root=""
      data-gantt-printing={printing ? "" : undefined}
    >
      {printing && <style>{"@page { size: landscape; margin: 10mm; }"}</style>}
      <GanttToolbar xmlExchange={xmlExchange} planFiles={planFiles} trailing={trailing} />
      {view === "gantt" &&
        (empty
          ? (emptyState ?? (
              <div className="min-h-0 flex-1 px-4 py-10 text-center">
                <p className="text-sm font-medium">{t("empty.title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("empty.hint")}</p>
                {!readOnly && (
                  <Button className="mt-4" size="sm" onClick={() => store.getState().addTask(t("task.newName"))} data-gantt-slot="empty-add-task">
                    <Plus />
                    {t("toolbar.addTask")}
                  </Button>
                )}
              </div>
            ))
          : <GanttChart {...chart} />)}
      {view === "resources" && <ResourceSheet />}
      {view === "usage" && <ResourceUsage />}
      {view === "taskUsage" && <TaskUsage />}
      {view === "graph" && <ResourceGraph />}
      {view === "calendar" && <CalendarView weekStartsOn={chart.weekStartsOn} />}
      {view === "network" && <NetworkDiagram />}
      <TaskDialog />
      <ProjectDialog />
      <RecurringDialog />
      <MergeDialog />
    </div>
  );
}

/** Props for {@link Gantt}. */
export interface GanttProps extends Omit<GanttProviderProps, "children">, GanttShellProps {}

/**
 * A complete project Gantt chart: task table with inline editing, timeline
 * with drag scheduling and dependency links, critical path, baselines,
 * resource sheet and usage, undo and redo, and Microsoft Project XML exchange.
 *
 * The chart owns its plan from `defaultProject` on and reports every change
 * through `onChange`. Compose {@link GanttProvider} with {@link GanttShell} or
 * the single screens when this shape does not fit.
 */
export function Gantt({
  defaultProject,
  zoom,
  showCriticalPath,
  showLinks,
  showMarkers,
  baselineNumber,
  view,
  columns,
  levelingOptions,
  readOnly,
  layout,
  onLayoutChange,
  onChange,
  ...shell
}: GanttProps) {
  return (
    <GanttProvider
      defaultProject={defaultProject}
      zoom={zoom}
      showCriticalPath={showCriticalPath}
      showLinks={showLinks}
      showMarkers={showMarkers}
      baselineNumber={baselineNumber}
      view={view}
      columns={columns}
      levelingOptions={levelingOptions}
      readOnly={readOnly}
      layout={layout}
      onLayoutChange={onLayoutChange}
      onChange={onChange}
    >
      <GanttShell {...shell} />
    </GanttProvider>
  );
}
