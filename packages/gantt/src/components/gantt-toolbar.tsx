import {
  ScheduleError,
  addLink,
  clearBaseline,
  clearLeveling,
  findOverallocations,
  levelResources,
  insertSubproject,
  rescheduleUncompletedWork,
  removeLinks,
  setBaseline,
} from "@simplix-react/gantt-core";
import type { Project } from "@simplix-react/gantt-core";
import { Badge, Button, useFlatUIComponents } from "@simplix-react/ui";
import {
  CalendarCheck,
  Download,
  Ellipsis,
  FileDown,
  Repeat,
  IndentDecrease,
  IndentIncrease,
  Info,
  Link2,
  LocateFixed,
  Plus,
  Printer,
  Redo2,
  Settings2,
  Trash2,
  Undo2,
  Unlink2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { BUILT_IN_COLUMNS } from "../lib/grid-columns";
import type { GanttColumnId } from "../lib/grid-columns";
import { ZOOM_LEVELS } from "../lib/time-scale";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import type { GroupKey, SortKey, TaskFilter } from "../lib/view-rows";
import type { BarColoring, BarText, GanttView } from "../model/gantt-store";

const VIEWS: readonly GanttView[] = ["gantt", "network", "calendar", "resources", "usage", "taskUsage", "graph"];
const FILTERS: readonly TaskFilter[] = ["all", "critical", "incomplete", "completed", "milestones", "late", "unassigned"];
const SORTS: readonly SortKey[] = ["none", "name", "start", "finish", "duration", "percentComplete", "totalSlack", "priority"];
const GROUPS: readonly GroupKey[] = ["none", "resource", "critical", "status"];
const BAR_TEXTS: readonly BarText[] = ["resources", "name", "percentComplete", "dates", "none"];
const BAR_COLORINGS: readonly BarColoring[] = ["none", "task", "resource"];
const ANY = "__any";
const BASELINE_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/** Links the given tasks into a finish-to-start chain in row order, skipping pairs already linked. */
function chain(project: Project, ids: readonly string[]): Project {
  const ordered = project.tasks.filter((task) => ids.includes(task.id)).map((task) => task.id);
  let next = project;
  for (let i = 0; i + 1 < ordered.length; i++) {
    const linked = next.links.some(
      (link) =>
        (link.predecessorId === ordered[i] && link.successorId === ordered[i + 1]) ||
        (link.predecessorId === ordered[i + 1] && link.successorId === ordered[i]),
    );
    if (!linked) next = addLink(next, { predecessorId: ordered[i], successorId: ordered[i + 1] });
  }
  return next;
}

/** Props for {@link GanttToolbar}. */
export interface GanttToolbarProps {
  /** Shows the commands that read and write a Microsoft Project XML file. */
  xmlExchange?: boolean;
  /** Extra controls at the end of the bar. */
  trailing?: ReactNode;
}

/** The command bar of a chart: editing, outline, links, undo, zoom, views and plan-level tools. */
export function GanttToolbar({ xmlExchange = true, trailing }: GanttToolbarProps) {
  const { t, language } = useGanttTranslation();
  const store = useGanttStore();
  const ui = useFlatUIComponents();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const selection = useGantt((state) => state.selection);
  const selectedLinkId = useGantt((state) => state.selectedLinkId);
  const canUndo = useGantt((state) => state.history.past.length > 0);
  const canRedo = useGantt((state) => state.history.future.length > 0);
  const zoom = useGantt((state) => state.zoom);
  const view = useGantt((state) => state.view);
  const showCriticalPath = useGantt((state) => state.showCriticalPath);
  const baselineNumber = useGantt((state) => state.baselineNumber);
  const baselineSlot = useGantt((state) => state.baselineSlot);
  const rejection = useGantt((state) => state.rejection);
  const columns = useGantt((state) => state.columns);
  const levelingOptions = useGantt((state) => state.levelingOptions);
  const showMarkers = useGantt((state) => state.showMarkers);
  const viewOptions = useGantt((state) => state.viewOptions);
  const barText = useGantt((state) => state.barText);
  const barColoring = useGantt((state) => state.barColoring);
  const showProgressLine = useGantt((state) => state.showProgressLine);
  const readOnly = useGantt((state) => state.readOnly);
  const subprojectRef = useRef<HTMLInputElement | null>(null);

  /** A submenu that picks one of several values. */
  const radioMenu = <T extends string>(label: string, value: T, values: readonly T[], labelOf: (value: T) => string, onPick: (value: T) => void): ReactNode => (
    <ui.DropdownMenuSub>
      <ui.DropdownMenuSubTrigger>{`${label}: ${labelOf(value)}`}</ui.DropdownMenuSubTrigger>
      <ui.DropdownMenuSubContent className="max-h-80 overflow-y-auto">
        <ui.DropdownMenuRadioGroup value={value} onValueChange={(next) => onPick(next as T)}>
          {values.map((option) => (
            <ui.DropdownMenuRadioItem key={option} value={option}>
              {labelOf(option)}
            </ui.DropdownMenuRadioItem>
          ))}
        </ui.DropdownMenuRadioGroup>
      </ui.DropdownMenuSubContent>
    </ui.DropdownMenuSub>
  );
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const columnChoices = useMemo<{ id: GanttColumnId; label: string }[]>(
    () => [
      ...BUILT_IN_COLUMNS.map((id) => ({ id, label: t(`column.${id}`) })),
      ...(project.customFields ?? []).map((field) => ({ id: `custom:${field.id}` as const, label: field.name })),
    ],
    [project.customFields, t],
  );

  /** Shows the loading mark while a slow command runs, after letting the mark paint first. */
  const busy = async (work: () => Promise<void> | void): Promise<void> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      await work();
    } finally {
      setLoading(false);
    }
  };

  const overallocations = useMemo(() => findOverallocations(project, schedule).length, [project, schedule]);
  const conflictCount = useMemo(() => new Set(schedule.conflicts.map((c) => c.taskId)).size, [schedule.conflicts]);
  const state = store.getState();
  const hasRows = selection.length > 0;
  const last = selection[selection.length - 1];
  const selectedSet = new Set(selection);
  const linksAmongSelection = project.links.filter((link) => selectedSet.has(link.predecessorId) && selectedSet.has(link.successorId));

  const onFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await busy(async () => {
      const text = await file.text();
      // The exchange code loads when it is first asked for.
      const { readMspdi } = await import("@simplix-react/gantt-core/mspdi");
      try {
        store.getState().load(readMspdi(text).project);
      } catch (error) {
        if (!(error instanceof ScheduleError)) throw error;
        store.setState({ rejection: { code: error.code, message: error.message, ids: error.ids } });
      }
    });
  };

  const exportXml = (): Promise<void> =>
    busy(async () => {
      const current = store.getState();
      const { writeMspdi } = await import("@simplix-react/gantt-core/mspdi");
      const blob = new Blob([writeMspdi(current.history.present, current.schedule)], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${current.history.present.name || "project"}.xml`;
      anchor.click();
      URL.revokeObjectURL(url);
    });

  const icon = (label: string, glyph: ReactNode, onClick: () => void, disabled = false, pressed?: boolean): ReactNode => (
    <Button
      variant={pressed ? "secondary" : "ghost"}
      size="icon-sm"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {glyph}
    </Button>
  );
  const divider = <div className="mx-1 h-5 w-px shrink-0 bg-border" />;

  return (
    <div className="shrink-0 border-b bg-background" data-gantt-slot="toolbar">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <div className="mr-1 flex items-center rounded-md bg-muted p-0.5" role="tablist">
          {VIEWS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              className={cn(
                "rounded-sm px-2.5 py-1 text-xs font-medium",
                view === id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => state.setView(id)}
            >
              {t(`view.${id}`)}
            </button>
          ))}
        </div>
        {divider}
        {icon(t("toolbar.undo"), <Undo2 />, state.undo, !canUndo || readOnly)}
        {icon(t("toolbar.redo"), <Redo2 />, state.redo, !canRedo || readOnly)}
        {view === "gantt" && (
          <>
            {divider}
            {icon(t("toolbar.addTask"), <Plus />, () => state.addTask(t("task.newName")), readOnly)}
            {icon(t("toolbar.removeTask"), <Trash2 />, state.removeSelected, readOnly || (!hasRows && selectedLinkId === null))}
            {icon(t("toolbar.taskInformation"), <Info />, () => last !== undefined && state.openTaskDialog(last), !hasRows)}
            {divider}
            {icon(t("toolbar.outdent"), <IndentDecrease />, state.outdentSelected, !hasRows)}
            {icon(t("toolbar.indent"), <IndentIncrease />, state.indentSelected, !hasRows)}
            {divider}
            {icon(t("toolbar.link"), <Link2 />, () => state.apply("link-tasks", (p) => chain(p, selection)), selection.length < 2)}
            {icon(
              t("toolbar.unlink"),
              <Unlink2 />,
              () => state.apply("unlink-tasks", (p) => removeLinks(p, linksAmongSelection.map((link) => link.id))),
              linksAmongSelection.length === 0,
            )}
            {divider}
            {icon(t("toolbar.zoomOut"), <ZoomOut />, () => state.setZoom(zoom - 1), zoom === 0)}
            {icon(t("toolbar.zoomIn"), <ZoomIn />, () => state.setZoom(zoom + 1), zoom === ZOOM_LEVELS.length - 1)}
            {icon(t("toolbar.scrollToStart"), <LocateFixed />, state.scrollToStart)}
            {icon(t("toolbar.scrollToToday"), <CalendarCheck />, state.scrollToToday)}
            {divider}
            <Button
              variant={showCriticalPath ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={showCriticalPath}
              onClick={() => state.setShowCriticalPath(!showCriticalPath)}
            >
              {t("toolbar.criticalPath")}
            </Button>
          </>
        )}
        <ui.DropdownMenu>
          <ui.DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={t("toolbar.more")} title={t("toolbar.more")}>
              <Ellipsis />
            </Button>
          </ui.DropdownMenuTrigger>
          <ui.DropdownMenuContent align="start">
            {radioMenu(t("toolbar.filter"), viewOptions.filter, FILTERS, (id) => t(`filter.${id}`), (filter) => state.setViewOptions({ filter }))}
            {radioMenu(
              t("toolbar.filterResource"),
              viewOptions.resourceId ?? ANY,
              [ANY, ...project.resources.map((resource) => resource.id)],
              (id) => (id === ANY ? t("filter.anyResource") : (project.resources.find((resource) => resource.id === id)?.name ?? id)),
              (id) => state.setViewOptions({ resourceId: id === ANY ? null : id }),
            )}
            {radioMenu(t("toolbar.sort"), viewOptions.sort, SORTS, (id) => t(`sort.${id}`), (sort) => state.setViewOptions({ sort }))}
            <ui.DropdownMenuCheckboxItem
              checked={viewOptions.sortDescending}
              disabled={viewOptions.sort === "none"}
              onCheckedChange={(checked) => state.setViewOptions({ sortDescending: checked })}
            >
              {t("toolbar.sortDescending")}
            </ui.DropdownMenuCheckboxItem>
            {radioMenu(t("toolbar.group"), viewOptions.group, GROUPS, (id) => t(`groupBy.${id}`), (group) => state.setViewOptions({ group }))}
            <ui.DropdownMenuSeparator />
            {radioMenu(t("toolbar.barText"), barText, BAR_TEXTS, (id) => t(`barText.${id}`), state.setBarText)}
            {radioMenu(t("toolbar.barColoring"), barColoring, BAR_COLORINGS, (id) => t(`barColoring.${id}`), state.setBarColoring)}
            <ui.DropdownMenuCheckboxItem
              checked={showProgressLine}
              disabled={project.statusDate === undefined}
              onCheckedChange={(checked) => state.setShowProgressLine(checked)}
            >
              {t("toolbar.progressLine")}
            </ui.DropdownMenuCheckboxItem>
            <ui.DropdownMenuSeparator />
            <ui.DropdownMenuItem onSelect={state.openProjectDialog}>
              <Settings2 />
              {t("toolbar.projectInformation")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuSub>
              <ui.DropdownMenuSubTrigger>{t("toolbar.columns")}</ui.DropdownMenuSubTrigger>
              <ui.DropdownMenuSubContent className="max-h-80 overflow-y-auto">
                {columnChoices.map((choice) => (
                  <ui.DropdownMenuCheckboxItem
                    key={choice.id}
                    checked={columns.includes(choice.id)}
                    // The menu stays open, so several columns can be switched in one visit.
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={() => state.toggleColumn(choice.id)}
                  >
                    {choice.label}
                  </ui.DropdownMenuCheckboxItem>
                ))}
              </ui.DropdownMenuSubContent>
            </ui.DropdownMenuSub>
            <ui.DropdownMenuCheckboxItem checked={showMarkers} onCheckedChange={(checked) => state.setShowMarkers(checked)}>
              {t("toolbar.markers")}
            </ui.DropdownMenuCheckboxItem>
            <ui.DropdownMenuItem disabled={view !== "gantt"} onSelect={state.openRecurringDialog}>
              <Repeat />
              {t("toolbar.addRecurring")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuItem disabled={view !== "gantt"} onSelect={() => state.setPrinting(true)}>
              <Printer />
              {t("toolbar.print")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuItem
              onSelect={() => {
                const current = store.getState();
                // The PDF code loads when it is first asked for, so charts that never export do not carry it.
                void busy(async () => {
                  const { downloadPdf } = await import("../lib/pdf-export");
                  await downloadPdf(current.history.present, current.schedule, language, (key) => t(key));
                });
              }}
            >
              <FileDown />
              {t("toolbar.exportPdf")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuSeparator />
            <ui.DropdownMenuSub>
              <ui.DropdownMenuSubTrigger>{`${t("toolbar.selectBaseline")}: ${baselineSlot}`}</ui.DropdownMenuSubTrigger>
              <ui.DropdownMenuSubContent>
                <ui.DropdownMenuRadioGroup value={String(baselineSlot)} onValueChange={(value) => state.setBaselineSlot(Number(value))}>
                  {BASELINE_SLOTS.map((slot) => (
                    <ui.DropdownMenuRadioItem key={slot} value={String(slot)}>
                      {t("toolbar.baselineNumber", { number: slot })}
                    </ui.DropdownMenuRadioItem>
                  ))}
                </ui.DropdownMenuRadioGroup>
              </ui.DropdownMenuSubContent>
            </ui.DropdownMenuSub>
            <ui.DropdownMenuItem onSelect={() => state.apply("save-baseline", (p, s) => setBaseline(p, s, baselineSlot))}>
              {t("toolbar.saveBaseline")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuCheckboxItem
              checked={baselineNumber !== null}
              disabled={project.baselines[baselineSlot] === undefined}
              onCheckedChange={(checked) => state.setBaselineNumber(checked ? baselineSlot : null)}
            >
              {t("toolbar.showBaseline")}
            </ui.DropdownMenuCheckboxItem>
            <ui.DropdownMenuItem
              disabled={project.baselines[baselineSlot] === undefined}
              onSelect={() => state.apply("clear-baseline", (p) => clearBaseline(p, baselineSlot))}
            >
              {t("toolbar.clearBaseline")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuSeparator />
            <ui.DropdownMenuItem
              disabled={project.statusDate === undefined}
              onSelect={() => state.apply("reschedule", (p, s) => rescheduleUncompletedWork(p, s))}
            >
              {t("toolbar.reschedule")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuSeparator />
            <ui.DropdownMenuCheckboxItem
              checked={levelingOptions.withinSlack === true}
              onCheckedChange={(checked) => state.setLevelingOptions({ ...levelingOptions, withinSlack: checked })}
            >
              {t("toolbar.levelWithinSlack")}
            </ui.DropdownMenuCheckboxItem>
            <ui.DropdownMenuCheckboxItem
              checked={levelingOptions.split === true}
              onCheckedChange={(checked) => state.setLevelingOptions({ ...levelingOptions, split: checked })}
            >
              {t("toolbar.levelBySplitting")}
            </ui.DropdownMenuCheckboxItem>
            <ui.DropdownMenuItem onSelect={() => state.apply("level-resources", (p) => levelResources(p, levelingOptions).project)}>
              {t("toolbar.level")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuItem onSelect={() => state.apply("clear-leveling", (p) => clearLeveling(p))}>
              {t("toolbar.clearLeveling")}
            </ui.DropdownMenuItem>
            {xmlExchange && (
              <>
                <ui.DropdownMenuSeparator />
                <ui.DropdownMenuItem disabled={readOnly} onSelect={() => subprojectRef.current?.click()}>
                  {t("toolbar.insertSubproject")}
                </ui.DropdownMenuItem>
                <ui.DropdownMenuItem disabled={readOnly} onSelect={() => fileRef.current?.click()}>
                  <Upload />
                  {t("toolbar.importXml")}
                </ui.DropdownMenuItem>
                <ui.DropdownMenuItem onSelect={() => void exportXml()}>
                  <Download />
                  {t("toolbar.exportXml")}
                </ui.DropdownMenuItem>
              </>
            )}
          </ui.DropdownMenuContent>
        </ui.DropdownMenu>
        {view === "gantt" && (
          <ui.Input
            type="search"
            aria-label={t("toolbar.search")}
            placeholder={t("toolbar.search")}
            className="ml-1 h-8 w-40"
            value={viewOptions.search}
            onChange={(event) => state.setViewOptions({ search: event.target.value })}
            // The chart's shortcuts must not take keys typed into the search box.
            onKeyDown={(event) => event.stopPropagation()}
          />
        )}
        <div className="ml-auto flex min-w-0 items-center gap-1.5">
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
        {xmlExchange && (
          <>
            <input ref={fileRef} type="file" accept=".xml,application/xml,text/xml" className="hidden" onChange={(e) => void onFile(e)} />
            <input
              ref={subprojectRef}
              type="file"
              accept=".xml,application/xml,text/xml"
              className="hidden"
              data-gantt-slot="subproject-file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                void busy(async () => {
                  const text = await file.text();
                  const { readMspdi } = await import("@simplix-react/gantt-core/mspdi");
                  // Reading and inserting both refuse through the store, so a bad file shows its reason.
                  store.getState().apply("insert-subproject", (p) => insertSubproject(p, readMspdi(text).project, store.getState().insertionPoint().at));
                });
              }}
            />
          </>
        )}
      </div>
      {rejection && (
        <div role="alert" className="flex items-center gap-2 border-t bg-destructive/10 px-3 py-1.5 text-sm text-destructive">
          <span className="min-w-0 flex-1 truncate">{t(`rejection.${rejection.code}`)}</span>
          <Button variant="ghost" size="icon-xs" aria-label={t("rejection.dismiss")} onClick={state.dismissRejection}>
            <X />
          </Button>
        </div>
      )}
    </div>
  );
}
