import {
  ScheduleError,
  addLink,
  commit,
  computeSchedule,
  copyTasks,
  createHistory,
  createTask,
  diffProjects,
  formatDuration,
  formatLocalDate,
  indentTasks,
  insertTask,
  mergeProjects,
  nextId,
  outdentTasks,
  parseDuration,
  parsePredecessors,
  pasteTasks,
  redo,
  removeLinks,
  removeTasks,
  setTaskDuration,
  subtreeEnd,
  taskIndex,
  undo,
} from "@simplix-react/gantt-core";
import type { History, Id, Link, Project, Schedule } from "@simplix-react/gantt-core";
import { createStore } from "zustand/vanilla";

import { DEFAULT_COLUMNS } from "../lib/grid-columns";
import { DEFAULT_ZOOM, ZOOM_LEVELS } from "../lib/time-scale";
import { DEFAULT_VIEW } from "../lib/view-rows";
import type { CreateGanttStoreOptions, GanttLayout, GanttStoreState } from "./gantt-store-types";

export type {
  BarColoring,
  BarText,
  CreateGanttStoreOptions,
  GanttEdit,
  GanttLayout,
  GanttRejection,
  GanttStoreState,
  GanttView,
} from "./gantt-store-types";

/** A chart's store. */
export type GanttStore = ReturnType<typeof createGanttStore>;

/** The stored part of a chart's state. */
function layoutOf(state: GanttStoreState): GanttLayout {
  return {
    view: state.view,
    columns: state.columns,
    columnWidths: state.columnWidths,
    gridWidth: state.gridWidth,
    zoom: state.zoom,
    collapsed: [...state.collapsed],
    showCriticalPath: state.showCriticalPath,
    showLinks: state.showLinks,
    showMarkers: state.showMarkers,
    showProgressLine: state.showProgressLine,
    baselineNumber: state.baselineNumber,
    barText: state.barText,
    barColoring: state.barColoring,
    viewOptions: state.viewOptions,
  };
}

function clampZoom(zoom: number): number {
  return Math.max(0, Math.min(ZOOM_LEVELS.length - 1, Math.round(zoom)));
}

/**
 * Creates the store of one chart.
 *
 * @throws ScheduleError when the initial project cannot be scheduled.
 */
export function createGanttStore(initial: Project, options: CreateGanttStoreOptions = {}) {
  const layout = options.layout ?? {};
  const store = createStore<GanttStoreState>((set, get) => {
    const replace = (history: History<Project>, schedule: Schedule, before: Project): void => {
      const known = new Set(history.present.tasks.map((task) => task.id));
      set((state) => ({
        history,
        schedule,
        rejection: null,
        selection: state.selection.filter((id) => known.has(id)),
        selectedLinkId: history.present.links.some((link) => link.id === state.selectedLinkId) ? state.selectedLinkId : null,
        dialogTaskId: state.dialogTaskId !== null && known.has(state.dialogTaskId) ? state.dialogTaskId : null,
      }));
      if (options.onChange) options.onChange(history.present, schedule, diffProjects(before, history.present));
    };

    const reject = (error: unknown): false => {
      if (!(error instanceof ScheduleError)) throw error;
      set({ rejection: { code: error.code, message: error.message, ids: error.ids } });
      return false;
    };

    /** Row to insert at, and the level to insert with: just under the last selected row. */
    const insertionPoint = (project: Project): { at: number; level: number } => {
      const { selection } = get();
      const last = selection[selection.length - 1];
      if (last === undefined) return { at: project.tasks.length, level: 1 };
      const index = taskIndex(project, last);
      return { at: subtreeEnd(project.tasks, index), level: project.tasks[index].outlineLevel };
    };

    return {
      history: createHistory(initial),
      schedule: computeSchedule(initial),
      selection: [],
      collapsed: new Set<Id>(layout.collapsed ?? []),
      zoom: clampZoom(layout.zoom ?? options.zoom ?? DEFAULT_ZOOM),
      showCriticalPath: layout.showCriticalPath ?? options.showCriticalPath ?? false,
      showLinks: layout.showLinks ?? options.showLinks ?? true,
      showMarkers: layout.showMarkers ?? options.showMarkers ?? true,
      baselineNumber: layout.baselineNumber ?? options.baselineNumber ?? null,
      baselineSlot: layout.baselineNumber ?? options.baselineNumber ?? 0,
      rejection: null,
      clipboard: null,
      clipboardText: null,
      selectedLinkId: null,
      dialogTaskId: null,
      projectDialogOpen: false,
      recurringDialogOpen: false,
      printing: false,
      view: layout.view ?? options.view ?? "gantt",
      columns: layout.columns ?? options.columns ?? DEFAULT_COLUMNS,
      columnWidths: layout.columnWidths ?? {},
      gridWidth: layout.gridWidth ?? null,
      viewOptions: { ...DEFAULT_VIEW, ...layout.viewOptions },
      barText: layout.barText ?? "resources",
      barColoring: layout.barColoring ?? "none",
      showProgressLine: layout.showProgressLine ?? false,
      readOnly: options.readOnly ?? false,
      levelingOptions: options.levelingOptions ?? {},
      scrollRequest: null,

      apply(label, edit) {
        const { history, schedule, readOnly } = get();
        if (readOnly) return false;
        try {
          const next = edit(history.present, schedule);
          if (next === history.present) return true;
          replace(commit(history, next, label), computeSchedule(next), history.present);
          return true;
        } catch (error) {
          return reject(error);
        }
      },
      load(project) {
        try {
          const schedule = computeSchedule(project);
          set({ selection: [], collapsed: new Set<Id>() });
          replace(createHistory(project), schedule, get().history.present);
        } catch (error) {
          reject(error);
        }
      },
      undo() {
        const history = undo(get().history);
        if (history !== get().history) replace(history, computeSchedule(history.present), get().history.present);
      },
      redo() {
        const history = redo(get().history);
        if (history !== get().history) replace(history, computeSchedule(history.present), get().history.present);
      },
      dismissRejection: () => set({ rejection: null }),

      select: (ids) => set({ selection: [...new Set(ids)], selectedLinkId: null }),
      selectRow(id, mode = "replace") {
        const { selection, history } = get();
        if (mode === "toggle") {
          set({
            selection: selection.includes(id) ? selection.filter((other) => other !== id) : [...selection, id],
            selectedLinkId: null,
          });
          return;
        }
        const anchor = selection[selection.length - 1];
        if (mode === "extend" && anchor !== undefined) {
          const tasks = history.present.tasks;
          const from = tasks.findIndex((task) => task.id === anchor);
          const to = tasks.findIndex((task) => task.id === id);
          if (from !== -1 && to !== -1) {
            const range = tasks.slice(Math.min(from, to), Math.max(from, to) + 1).map((task) => task.id);
            // Keep the clicked row last so a further extension starts from it.
            set({ selection: [...range.filter((other) => other !== id), id], selectedLinkId: null });
            return;
          }
        }
        set({ selection: [id], selectedLinkId: null });
      },
      toggleCollapsed(id) {
        const collapsed = new Set(get().collapsed);
        if (!collapsed.delete(id)) collapsed.add(id);
        set({ collapsed });
      },
      setCollapsed: (ids) => set({ collapsed: new Set(ids) }),
      setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
      setShowCriticalPath: (showCriticalPath) => set({ showCriticalPath }),
      setShowLinks: (showLinks) => set({ showLinks }),
      setShowMarkers: (showMarkers) => set({ showMarkers }),
      setBaselineNumber: (baselineNumber) => set({ baselineNumber }),
      selectLink: (selectedLinkId) => set(selectedLinkId === null ? { selectedLinkId } : { selectedLinkId, selection: [] }),
      openTaskDialog: (dialogTaskId) => set({ dialogTaskId }),
      closeTaskDialog: () => set({ dialogTaskId: null }),
      openProjectDialog: () => set({ projectDialogOpen: true }),
      closeProjectDialog: () => set({ projectDialogOpen: false }),
      openRecurringDialog: () => set({ recurringDialogOpen: true }),
      closeRecurringDialog: () => set({ recurringDialogOpen: false }),
      insertionPoint: () => insertionPoint(get().history.present),
      setPrinting: (printing) => set({ printing }),
      setView: (view) => set({ view }),
      setColumns: (columns) => set({ columns: [...new Set(columns)] }),
      setColumnWidth: (column, width) => set((state) => ({ columnWidths: { ...state.columnWidths, [column]: Math.round(width) } })),
      setGridWidth: (gridWidth) => set({ gridWidth: Math.round(gridWidth) }),
      setViewOptions: (changed) => set((state) => ({ viewOptions: { ...state.viewOptions, ...changed } })),
      setBarText: (barText) => set({ barText }),
      setBarColoring: (barColoring) => set({ barColoring }),
      setShowProgressLine: (showProgressLine) => set({ showProgressLine }),
      getLayout: () => layoutOf(get()),
      applyLayout(stored) {
        set((state) => ({
          ...stored,
          collapsed: stored.collapsed ? new Set(stored.collapsed) : state.collapsed,
          zoom: stored.zoom === undefined ? state.zoom : clampZoom(stored.zoom),
          viewOptions: { ...state.viewOptions, ...stored.viewOptions },
        }));
      },
      merge(base, theirs) {
        try {
          const merged = mergeProjects(base, get().history.present, theirs);
          get().sync(merged.project);
          return merged.conflicts;
        } catch (error) {
          reject(error);
          return [];
        }
      },
      toggleColumn(column) {
        const { columns } = get();
        set({ columns: columns.includes(column) ? columns.filter((other) => other !== column) : [...columns, column] });
      },
      moveColumn(column, toIndex) {
        const { columns } = get();
        const from = columns.indexOf(column);
        if (from === -1 || from === toIndex) return;
        const next = columns.filter((other) => other !== column);
        next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, column);
        set({ columns: next });
      },
      setLevelingOptions: (levelingOptions) => set({ levelingOptions }),
      reveal(id) {
        // A row folded away under a collapsed summary task has to be unfolded to be shown.
        const tasks = get().history.present.tasks;
        const index = tasks.findIndex((task) => task.id === id);
        if (index === -1) return;
        const collapsed = new Set(get().collapsed);
        let level = tasks[index].outlineLevel;
        for (let i = index - 1; i >= 0 && level > 1; i--) {
          if (tasks[i].outlineLevel < level) {
            collapsed.delete(tasks[i].id);
            level = tasks[i].outlineLevel;
          }
        }
        set((state) => ({
          collapsed,
          view: "gantt",
          selection: [id],
          selectedLinkId: null,
          scrollRequest: { target: id, seq: (state.scrollRequest?.seq ?? 0) + 1 },
        }));
      },
      scrollToStart: () => set((state) => ({ scrollRequest: { target: "start", seq: (state.scrollRequest?.seq ?? 0) + 1 } })),
      scrollToToday: () => set((state) => ({ scrollRequest: { target: "today", seq: (state.scrollRequest?.seq ?? 0) + 1 } })),
      sync(project) {
        try {
          const schedule = computeSchedule(project);
          const known = new Set(project.tasks.map((task) => task.id));
          set((state) => ({
            history: { ...state.history, present: project },
            schedule,
            rejection: null,
            selection: state.selection.filter((id) => known.has(id)),
            selectedLinkId: project.links.some((link) => link.id === state.selectedLinkId) ? state.selectedLinkId : null,
            dialogTaskId: state.dialogTaskId !== null && known.has(state.dialogTaskId) ? state.dialogTaskId : null,
          }));
        } catch (error) {
          reject(error);
        }
      },

      addTask(name = "") {
        let created: Id | null = null;
        const accepted = get().apply("add-task", (project) => {
          const { at, level } = insertionPoint(project);
          const task = createTask(project, { name, outlineLevel: level });
          created = task.id;
          return insertTask(project, task, at);
        });
        if (!accepted || created === null) return null;
        set({ selection: [created] });
        return created;
      },
      removeSelected() {
        const { selection, selectedLinkId } = get();
        if (selectedLinkId !== null) {
          get().apply("remove-link", (project) => removeLinks(project, [selectedLinkId]));
          return;
        }
        if (selection.length === 0) return;
        get().apply("remove-tasks", (project) => removeTasks(project, selection));
      },
      indentSelected() {
        const { selection } = get();
        if (selection.length > 0) get().apply("indent", (project) => indentTasks(project, selection));
      },
      outdentSelected() {
        const { selection } = get();
        if (selection.length > 0) get().apply("outdent", (project) => outdentTasks(project, selection));
      },
      copySelected() {
        const { selection, history, schedule } = get();
        if (selection.length === 0) return null;
        const project = history.present;
        const clipboard = copyTasks(project, selection);
        const clipboardText = clipboard.tasks
          .map((task) => {
            const at = schedule.tasks.get(task.id);
            const duration = formatDuration(
              { minutes: task.duration, unit: task.durationUnit, elapsed: task.elapsed === true, estimated: task.estimated === true },
              project,
            );
            return [task.name, duration, at ? formatLocalDate(at.start) : "", at ? formatLocalDate(at.finish) : "", at?.percentComplete ?? 0].join("\t");
          })
          .join("\n");
        set({ clipboard, clipboardText });
        return clipboardText;
      },
      pasteText(text) {
        const { clipboard, clipboardText } = get();
        const normalized = text.replace(/\r\n?/g, "\n").replace(/\n+$/, "");
        if (clipboard && normalized === clipboardText) {
          get().paste();
          return;
        }
        const lines = normalized.split("\n").filter((line) => line.trim() !== "");
        if (lines.length === 0) return;
        get().apply("paste", (project) => {
          const { at, level } = insertionPoint(project);
          let next = project;
          lines.forEach((line, i) => {
            const [name = "", durationText = ""] = line.split("\t");
            let task = createTask(next, { name: name.trim(), outlineLevel: level });
            try {
              const value = parseDuration(durationText.trim(), project);
              task = { ...task, duration: value.minutes, durationUnit: value.unit, elapsed: value.elapsed, estimated: value.estimated };
            } catch (error) {
              // A second cell that is not a duration leaves the new task at the default duration.
              if (!(error instanceof ScheduleError)) throw error;
            }
            next = insertTask(next, task, at + i);
          });
          return next;
        });
      },
      setBaselineSlot(slot) {
        const baselineSlot = Math.max(0, Math.min(10, Math.round(slot)));
        set((state) => ({ baselineSlot, baselineNumber: state.baselineNumber === null ? null : baselineSlot }));
      },
      paste() {
        const { clipboard } = get();
        if (!clipboard) return;
        get().apply("paste", (project) => {
          const { at, level } = insertionPoint(project);
          // Ids are drawn from counters that start past every id in use, so pasted records never collide.
          const next = {
            task: Number(nextId(project.tasks)),
            link: Number(nextId(project.links)),
            assignment: Number(nextId(project.assignments)),
          };
          return pasteTasks(project, clipboard, at, (kind) => String(next[kind]++), level);
        });
      },
      setDurationText(id, text) {
        return get().apply("set-duration", (project) => {
          const value = parseDuration(text, project, project.tasks[taskIndex(project, id)].durationUnit);
          return setTaskDuration(project, id, value.minutes, {
            unit: value.unit,
            elapsed: value.elapsed,
            estimated: value.estimated,
          });
        });
      },
      setPredecessorText(id, text) {
        return get().apply("set-predecessors", (project) => {
          const refs = parsePredecessors(text, project);
          const kept = project.links.filter((link) => link.successorId !== id);
          let next = removeLinks(project, project.links.filter((link) => link.successorId === id).map((link) => link.id));
          for (const ref of refs) {
            const predecessor = project.tasks[ref.row - 1];
            if (!predecessor) {
              throw new ScheduleError("unknown-reference", `No task in row ${ref.row}`, [String(ref.row)]);
            }
            const link: Omit<Link, "id"> = {
              predecessorId: predecessor.id,
              successorId: id,
              type: ref.type,
              lag: ref.lag,
              lagMode: ref.lagMode,
              lagUnit: ref.lagUnit,
            };
            next = addLink(next, link);
          }
          // Nothing to record when the text names the links the task already had.
          const same =
            next.links.length === project.links.length &&
            next.links.slice(kept.length).every((link, i) => {
              const before = project.links.filter((other) => other.successorId === id)[i];
              return (
                before !== undefined &&
                before.predecessorId === link.predecessorId &&
                before.type === link.type &&
                before.lag === link.lag &&
                before.lagMode === link.lagMode
              );
            });
          return same ? project : next;
        });
      },
    };
  });
  if (options.onLayoutChange) {
    const notify = options.onLayoutChange;
    let previous = JSON.stringify(layoutOf(store.getState()));
    // Compared as text, so a state change that leaves the layout alone tells nobody.
    store.subscribe((state) => {
      const next = JSON.stringify(layoutOf(state));
      if (next === previous) return;
      previous = next;
      notify(layoutOf(state));
    });
  }
  return store;
}
