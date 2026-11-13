import { clearBaseline, clearLeveling, levelResources, rescheduleUncompletedWork, setBaseline } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";
import { Download, Ellipsis, FileDown, FolderOpen, Printer, Repeat, Save, Settings2, Upload } from "lucide-react";
import type { ReactNode } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { barColors } from "../lib/bar-color";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { viewRows } from "../lib/view-rows";
import type { GroupKey, SortKey, TaskFilter } from "../lib/view-rows";
import type { BarColoring, BarText, GanttPane } from "../model/gantt-store";
import { useFoldableCommands } from "./toolbar-commands";

const FILTERS: readonly TaskFilter[] = ["all", "critical", "incomplete", "completed", "milestones", "late", "unassigned"];
const SORTS: readonly SortKey[] = ["none", "name", "start", "finish", "duration", "percentComplete", "totalSlack", "priority"];
const GROUPS: readonly GroupKey[] = ["none", "resource", "critical", "status"];
const BAR_TEXTS: readonly BarText[] = ["resources", "name", "percentComplete", "dates", "none"];
const BAR_COLORINGS: readonly BarColoring[] = ["none", "task", "resource"];
const PANES: readonly GanttPane[] = ["both", "table", "timeline"];
const ANY = "__any";
const BASELINE_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/** Props for {@link ToolbarMenu}. */
export interface ToolbarMenuProps {
  /** Shows the commands that read and write a Microsoft Project XML file. */
  xmlExchange: boolean;
  /** Shows the commands that save the plan to a file of its own form and open one. */
  planFiles: boolean;
  onSavePlan: () => void;
  onOpenPlan: () => void;
  /** Lists the commands a narrow bar has no room for. */
  folded: boolean;
  /** Runs a slow command with the loading mark shown. */
  busy: (work: () => Promise<void> | void) => Promise<void>;
  onImportXml: () => void;
  onInsertSubproject: () => void;
  onExportXml: () => void;
}

/** The menu at the end of the command bar: filters, grouping, bar settings and the plan-level tools. */
export function ToolbarMenu({ xmlExchange, planFiles, onSavePlan, onOpenPlan, folded, busy, onImportXml, onInsertSubproject, onExportXml }: ToolbarMenuProps) {
  const { t, language } = useGanttTranslation();
  const store = useGanttStore();
  const ui = useFlatUIComponents();
  const project = useGantt((state) => state.history.present);
  const view = useGantt((state) => state.view);
  const pane = useGantt((state) => state.pane);
  const showCriticalPath = useGantt((state) => state.showCriticalPath);
  const baselineNumber = useGantt((state) => state.baselineNumber);
  const baselineSlot = useGantt((state) => state.baselineSlot);
  const levelingOptions = useGantt((state) => state.levelingOptions);
  const showMarkers = useGantt((state) => state.showMarkers);
  const viewOptions = useGantt((state) => state.viewOptions);
  const barText = useGantt((state) => state.barText);
  const barColoring = useGantt((state) => state.barColoring);
  const showProgressLine = useGantt((state) => state.showProgressLine);
  const readOnly = useGantt((state) => state.readOnly);
  const commands = useFoldableCommands();
  const state = store.getState();

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

  return (
    <ui.DropdownMenu>
      <ui.DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={t("toolbar.more")} title={t("toolbar.more")}>
          <Ellipsis />
        </Button>
      </ui.DropdownMenuTrigger>
      <ui.DropdownMenuContent align="start" className="max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto">
        {folded && view === "gantt" && (
          <>
            {commands.map((command) => (
              <ui.DropdownMenuItem key={command.id} disabled={command.disabled || (readOnly && EDITING.has(command.id))} onSelect={command.run}>
                {t(`toolbar.${command.id}`)}
              </ui.DropdownMenuItem>
            ))}
            <ui.DropdownMenuCheckboxItem checked={showCriticalPath} onCheckedChange={(checked) => state.setShowCriticalPath(checked)}>
              {t("toolbar.criticalPath")}
            </ui.DropdownMenuCheckboxItem>
            <ui.DropdownMenuSeparator />
          </>
        )}
        {view === "gantt" && radioMenu(t("toolbar.panes"), pane, PANES, (id) => t(`pane.${id}`), state.setPane)}
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
                  // The PDF shows the rows and colours of the screen: what is filtered out or folded away is left out.
                  const shown = viewRows(current.history.present, current.schedule, current.collapsed, current.viewOptions);
                  await downloadPdf(current.history.present, current.schedule, language, (key) => t(key), {
                    rows: shown.flatMap((row) => (row.kind === "task" ? [row.task.id] : [])),
                    colorOf: barColors(current.history.present, current.barColoring),
                    showCriticalPath: current.showCriticalPath,
                  });
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
            {planFiles && (
              <>
                <ui.DropdownMenuSeparator />
                <ui.DropdownMenuItem disabled={readOnly} onSelect={onOpenPlan}>
                  <FolderOpen />
                  {t("toolbar.openPlan")}
                </ui.DropdownMenuItem>
                <ui.DropdownMenuItem onSelect={onSavePlan}>
                  <Save />
                  {t("toolbar.savePlan")}
                </ui.DropdownMenuItem>
              </>
            )}
            {xmlExchange && (
              <>
                <ui.DropdownMenuSeparator />
                <ui.DropdownMenuItem disabled={readOnly} onSelect={onInsertSubproject}>
                  {t("toolbar.insertSubproject")}
                </ui.DropdownMenuItem>
                <ui.DropdownMenuItem disabled={readOnly} onSelect={onImportXml}>
                  <Upload />
                  {t("toolbar.importXml")}
                </ui.DropdownMenuItem>
                <ui.DropdownMenuItem onSelect={onExportXml}>
                  <Download />
                  {t("toolbar.exportXml")}
                </ui.DropdownMenuItem>
              </>
            )}
      </ui.DropdownMenuContent>
    </ui.DropdownMenu>
  );
}

/** The folded commands that change the plan, and so are off in a chart that only shows. */
const EDITING: ReadonlySet<string> = new Set(["outdent", "indent", "link", "unlink"]);
