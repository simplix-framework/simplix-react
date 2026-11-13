import {
  ScheduleError,
  addLink,
  clearBaseline,
  clearLeveling,
  findOverallocations,
  levelResources,
  readMspdi,
  removeLinks,
  setBaseline,
  writeMspdi,
} from "@simplix-react/gantt-core";
import type { Project } from "@simplix-react/gantt-core";
import { Badge, Button, useFlatUIComponents } from "@simplix-react/ui";
import {
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
import { useMemo, useRef } from "react";
import type { ChangeEvent, ReactNode } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { downloadPdf } from "../lib/pdf-export";
import { ZOOM_LEVELS } from "../lib/time-scale";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import type { GanttView } from "../model/gantt-store";

const VIEWS: readonly GanttView[] = ["gantt", "resources", "usage"];
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
  /** Scrolls the chart to the start of the plan. */
  onScrollToStart?: () => void;
}

/** The command bar of a chart: editing, outline, links, undo, zoom, views and plan-level tools. */
export function GanttToolbar({ xmlExchange = true, trailing, onScrollToStart }: GanttToolbarProps) {
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
  const fileRef = useRef<HTMLInputElement | null>(null);

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
    const text = await file.text();
    try {
      store.getState().load(readMspdi(text).project);
    } catch (error) {
      if (!(error instanceof ScheduleError)) throw error;
      store.setState({ rejection: { code: error.code, message: error.message, ids: error.ids } });
    }
  };

  const exportXml = (): void => {
    const current = store.getState();
    const blob = new Blob([writeMspdi(current.history.present, current.schedule)], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${current.history.present.name || "project"}.xml`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
        {icon(t("toolbar.undo"), <Undo2 />, state.undo, !canUndo)}
        {icon(t("toolbar.redo"), <Redo2 />, state.redo, !canRedo)}
        {view === "gantt" && (
          <>
            {divider}
            {icon(t("toolbar.addTask"), <Plus />, () => state.addTask(t("task.newName")))}
            {icon(t("toolbar.removeTask"), <Trash2 />, state.removeSelected, !hasRows && selectedLinkId === null)}
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
            {onScrollToStart && icon(t("toolbar.scrollToStart"), <LocateFixed />, onScrollToStart)}
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
            <ui.DropdownMenuItem onSelect={state.openProjectDialog}>
              <Settings2 />
              {t("toolbar.projectInformation")}
            </ui.DropdownMenuItem>
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
                void downloadPdf(current.history.present, current.schedule, language, (key) => t(key));
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
            <ui.DropdownMenuItem onSelect={() => state.apply("level-resources", (p) => levelResources(p).project)}>
              {t("toolbar.level")}
            </ui.DropdownMenuItem>
            <ui.DropdownMenuItem onSelect={() => state.apply("clear-leveling", (p) => clearLeveling(p))}>
              {t("toolbar.clearLeveling")}
            </ui.DropdownMenuItem>
            {xmlExchange && (
              <>
                <ui.DropdownMenuSeparator />
                <ui.DropdownMenuItem onSelect={() => fileRef.current?.click()}>
                  <Upload />
                  {t("toolbar.importXml")}
                </ui.DropdownMenuItem>
                <ui.DropdownMenuItem onSelect={exportXml}>
                  <Download />
                  {t("toolbar.exportXml")}
                </ui.DropdownMenuItem>
              </>
            )}
          </ui.DropdownMenuContent>
        </ui.DropdownMenu>
        <div className="ml-auto flex min-w-0 items-center gap-1.5">
          {conflictCount > 0 && <Badge variant="destructive">{t("status.conflicts", { count: conflictCount })}</Badge>}
          {overallocations > 0 && <Badge variant="outline">{t("status.overallocations", { count: overallocations })}</Badge>}
          {trailing}
        </div>
        {xmlExchange && (
          <input ref={fileRef} type="file" accept=".xml,application/xml,text/xml" className="hidden" onChange={(e) => void onFile(e)} />
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
