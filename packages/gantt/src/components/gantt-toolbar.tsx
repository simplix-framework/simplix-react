import { ScheduleError, insertSubproject } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";
import { CalendarCheck, Columns3, IndentDecrease, IndentIncrease, Info, Link2, LocateFixed, Plus, Redo2, Trash2, Undo2, Unlink2, X, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { useElementWidth } from "../lib/use-viewport";
import type { GanttView } from "../model/gantt-store";
import { ColumnChooser } from "./column-chooser";
import { useFoldableCommands } from "./toolbar-commands";
import type { ToolbarCommand } from "./toolbar-commands";
import { ToolbarMenu } from "./toolbar-menu";
import { ToolbarStatus } from "./toolbar-status";

const VIEWS: readonly GanttView[] = ["gantt", "network", "calendar", "resources", "usage", "taskUsage", "graph"];
/** A toolbar narrower than this keeps the commands it has room for on the bar and lists the rest in its menu. */
const FOLD_BELOW = 560;
const COMMAND_ICONS: Record<ToolbarCommand["id"], ReactNode> = {
  taskInformation: <Info />,
  outdent: <IndentDecrease />,
  indent: <IndentIncrease />,
  link: <Link2 />,
  unlink: <Unlink2 />,
  zoomOut: <ZoomOut />,
  zoomIn: <ZoomIn />,
  scrollToStart: <LocateFixed />,
  scrollToToday: <CalendarCheck />,
};

/** Props for {@link GanttToolbar}. */
export interface GanttToolbarProps {
  /** Shows the commands that read and write a Microsoft Project XML file. */
  xmlExchange?: boolean;
  /** Extra controls at the end of the bar. */
  trailing?: ReactNode;
}

/** The command bar of a chart: the views on one line, and under it editing, outline, links, undo, zoom and the plan-level tools. */
export function GanttToolbar({ xmlExchange = true, trailing }: GanttToolbarProps) {
  const { t } = useGanttTranslation();
  const store = useGanttStore();
  const ui = useFlatUIComponents();
  const selection = useGantt((state) => state.selection);
  const selectedLinkId = useGantt((state) => state.selectedLinkId);
  const canUndo = useGantt((state) => state.history.past.length > 0);
  const canRedo = useGantt((state) => state.history.future.length > 0);
  const view = useGantt((state) => state.view);
  const showCriticalPath = useGantt((state) => state.showCriticalPath);
  const rejection = useGantt((state) => state.rejection);
  const viewOptions = useGantt((state) => state.viewOptions);
  const readOnly = useGantt((state) => state.readOnly);
  const commands = useFoldableCommands();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const folded = useElementWidth(rootRef, 1200) < FOLD_BELOW;
  const subprojectRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
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
  const state = store.getState();
  const hasRows = selection.length > 0;

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

  const onSubprojectFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    void busy(async () => {
      const text = await file.text();
      const { readMspdi } = await import("@simplix-react/gantt-core/mspdi");
      // Reading and inserting both refuse through the store, so a bad file shows its reason.
      store.getState().apply("insert-subproject", (p) => insertSubproject(p, readMspdi(text).project, store.getState().insertionPoint().at));
    });
  };

  const icon = (label: string, glyph: ReactNode, onClick: () => void, disabled = false): ReactNode => (
    <Button key={label} variant="ghost" size="icon-sm" aria-label={label} title={label} disabled={disabled} onClick={onClick}>
      {glyph}
    </Button>
  );
  const divider = folded ? null : <div className="mx-1 h-5 w-px shrink-0 bg-border" />;
  const command = (id: ToolbarCommand["id"]): ReactNode => {
    const found = commands.find((candidate) => candidate.id === id);
    return found ? icon(t(`toolbar.${id}`), COMMAND_ICONS[id], found.run, found.disabled) : null;
  };
  const status = <ToolbarStatus loading={loading} trailing={trailing} />;

  return (
    <div ref={rootRef} className="@container shrink-0 border-b bg-background" data-gantt-slot="toolbar">
      {/* The views take a line of their own: a narrow chart picks from a list, a wide one from the strip. */}
      <div className="flex items-center overflow-x-auto border-b px-2 py-1.5 [scrollbar-width:thin] [&>*]:shrink-0" data-gantt-slot="toolbar-views">
        <div className="@3xl:hidden">
          <ui.Select value={view} onValueChange={(value) => state.setView(value as GanttView)}>
            <ui.SelectTrigger aria-label={t("toolbar.view")} className="h-8 w-40">
              <ui.SelectValue />
            </ui.SelectTrigger>
            <ui.SelectContent>
              {VIEWS.map((id) => (
                <ui.SelectItem key={id} value={id}>
                  {t(`view.${id}`)}
                </ui.SelectItem>
              ))}
            </ui.SelectContent>
          </ui.Select>
        </div>
        <div className="hidden items-center whitespace-nowrap rounded-md bg-muted p-0.5 @3xl:flex" role="tablist">
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
        {/* A narrow bar has no room for the marks beside its commands, so they stand beside the views. */}
        {folded && status}
      </div>
      {/* The commands stay on one line. A wide bar scrolls what does not fit; a narrow one lists it in the menu. */}
      <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1.5 [scrollbar-width:thin] [&>*]:shrink-0" data-gantt-slot="toolbar-tools">
        {icon(t("toolbar.undo"), <Undo2 />, state.undo, !canUndo || readOnly)}
        {icon(t("toolbar.redo"), <Redo2 />, state.redo, !canRedo || readOnly)}
        {view === "gantt" && (
          <>
            {divider}
            {icon(t("toolbar.addTask"), <Plus />, () => state.addTask(t("task.newName")), readOnly)}
            {icon(t("toolbar.removeTask"), <Trash2 />, state.removeSelected, readOnly || (!hasRows && selectedLinkId === null))}
            {!folded && (
              <>
                {command("taskInformation")}
                {divider}
                {command("outdent")}
                {command("indent")}
                {divider}
                {command("link")}
                {command("unlink")}
              </>
            )}
            {divider}
            <ColumnChooser>
              <Button variant="ghost" size="icon-sm" aria-label={t("column.choose")} title={t("column.choose")}>
                <Columns3 />
              </Button>
            </ColumnChooser>
            {!folded && (
              <>
                {divider}
                {command("zoomOut")}
                {command("zoomIn")}
                {command("scrollToStart")}
                {command("scrollToToday")}
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
          </>
        )}
        <ToolbarMenu
          xmlExchange={xmlExchange}
          folded={folded}
          busy={busy}
          onImportXml={() => fileRef.current?.click()}
          onInsertSubproject={() => subprojectRef.current?.click()}
          onExportXml={() => void exportXml()}
        />
        {view === "gantt" && (
          <ui.Input
            type="search"
            aria-label={t("toolbar.search")}
            placeholder={t("toolbar.search")}
            // On a narrow bar the search box takes what the buttons leave.
            className={cn("ml-1 h-8", folded ? "!shrink min-w-16 flex-1" : "w-40")}
            value={viewOptions.search}
            onChange={(event) => state.setViewOptions({ search: event.target.value })}
            // The chart's shortcuts must not take keys typed into the search box.
            onKeyDown={(event) => event.stopPropagation()}
          />
        )}
        {!folded && status}
        {xmlExchange && (
          <>
            <input ref={fileRef} type="file" accept=".xml,application/xml,text/xml" className="hidden" onChange={(e) => void onFile(e)} />
            <input ref={subprojectRef} type="file" accept=".xml,application/xml,text/xml" className="hidden" data-gantt-slot="subproject-file" onChange={onSubprojectFile} />
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
