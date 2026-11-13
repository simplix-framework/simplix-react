import {
  ScheduleError,
  addLink,
  commit,
  computeSchedule,
  copyTasks,
  createHistory,
  createTask,
  formatDuration,
  formatLocalDate,
  indentTasks,
  insertTask,
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
import type { History, Id, Link, Project, Schedule, ScheduleErrorCode, TaskClipboard } from "@simplix-react/gantt-core";
import { createStore } from "zustand/vanilla";

import { DEFAULT_ZOOM, ZOOM_LEVELS } from "../lib/time-scale";

/** Why the last edit was refused. */
export interface GanttRejection {
  code: ScheduleErrorCode;
  message: string;
  ids: readonly string[];
}

/** The screen a chart shows: the Gantt chart, the resource sheet or the resource usage table. */
export type GanttView = "gantt" | "resources" | "usage";

/** A change of the plan: receives the current project and its schedule, returns the next project. */
export type GanttEdit = (project: Project, schedule: Schedule) => Project;

/** Reactive state of one chart, with the edits that change it. */
export interface GanttStoreState {
  history: History<Project>;
  /** Computed dates of `history.present`. */
  schedule: Schedule;
  /** Selected task ids, in the order they were selected. */
  selection: readonly Id[];
  /** Summary tasks whose rows are folded away. */
  collapsed: ReadonlySet<Id>;
  /** Index into the zoom steps. */
  zoom: number;
  showCriticalPath: boolean;
  showLinks: boolean;
  /** Baseline drawn under the bars, or `null` for none. */
  baselineNumber: number | null;
  /** Baseline the save, show and clear commands work on, 0 to 10. */
  baselineSlot: number;
  /** The last refused edit; cleared by the next accepted one. */
  rejection: GanttRejection | null;
  clipboard: TaskClipboard | null;
  /** The copied tasks as tab-separated text, as it was handed to the system clipboard. */
  clipboardText: string | null;
  /** The selected dependency line, or `null`. Selecting rows clears it. */
  selectedLinkId: Id | null;
  /** The task whose information dialog is open, or `null`. */
  dialogTaskId: Id | null;
  projectDialogOpen: boolean;
  recurringDialogOpen: boolean;
  /** True while the chart is laid out for paper: every row drawn, scaled to the page width. */
  printing: boolean;
  view: GanttView;

  /**
   * Applies an edit as one undo step. A `ScheduleError` from the edit or
   * from scheduling its result refuses the edit and records the reason.
   *
   * @returns Whether the edit was accepted.
   */
  apply(label: string, edit: GanttEdit): boolean;
  /** Replaces the plan and forgets the undo history. */
  load(project: Project): void;
  undo(): void;
  redo(): void;
  dismissRejection(): void;

  select(ids: readonly Id[]): void;
  /** Selects one row; with `extend` every row from the last selected one to it, with `toggle` adds or removes it. */
  selectRow(id: Id, mode?: "replace" | "extend" | "toggle"): void;
  toggleCollapsed(id: Id): void;
  setCollapsed(ids: readonly Id[]): void;
  setZoom(zoom: number): void;
  setShowCriticalPath(show: boolean): void;
  setShowLinks(show: boolean): void;
  setBaselineNumber(number: number | null): void;
  selectLink(id: Id | null): void;
  openTaskDialog(id: Id): void;
  closeTaskDialog(): void;
  openProjectDialog(): void;
  closeProjectDialog(): void;
  openRecurringDialog(): void;
  closeRecurringDialog(): void;
  /** Row to insert new rows at, and the outline level to give them: just under the last selected row, or the end. */
  insertionPoint(): { at: number; level: number };
  setPrinting(printing: boolean): void;
  setView(view: GanttView): void;

  /** Inserts a new task under the last selected row, or at the end, and selects it. */
  addTask(name?: string): Id | null;
  /** Removes the selected dependency line, or else the selected tasks. */
  removeSelected(): void;
  indentSelected(): void;
  outdentSelected(): void;
  /**
   * Copies the selected tasks and returns them as tab-separated text (name,
   * duration, start, finish, percent complete) for the system clipboard, or
   * `null` when nothing is selected.
   */
  copySelected(): string | null;
  /**
   * Pastes text from the system clipboard. Text this chart copied pastes the
   * copied tasks with their links and assignments. Any other text makes one
   * task per line, reading the first tab-separated cell as the name and the
   * second, when it is a duration, as the duration.
   */
  pasteText(text: string): void;
  /** Picks the baseline the commands work on; a baseline that is shown follows it. */
  setBaselineSlot(slot: number): void;
  /** Pastes the copied tasks under the last selected row, or at the end. */
  paste(): void;
  /** Sets a task's duration from text such as `3d`, `2w` or `4h`. */
  setDurationText(id: Id, text: string): boolean;
  /** Replaces a task's predecessors from text such as `3, 4SS+2d`, naming rows by number. */
  setPredecessorText(id: Id, text: string): boolean;
}

/** A chart's store. */
export type GanttStore = ReturnType<typeof createGanttStore>;

/** Options for {@link createGanttStore}. */
export interface CreateGanttStoreOptions {
  zoom?: number;
  showCriticalPath?: boolean;
  showLinks?: boolean;
  baselineNumber?: number | null;
  view?: GanttView;
  /** Called after every accepted change of the plan, undo and redo included. */
  onChange?: (project: Project, schedule: Schedule) => void;
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
  return createStore<GanttStoreState>((set, get) => {
    const replace = (history: History<Project>, schedule: Schedule): void => {
      const known = new Set(history.present.tasks.map((task) => task.id));
      set((state) => ({
        history,
        schedule,
        rejection: null,
        selection: state.selection.filter((id) => known.has(id)),
        selectedLinkId: history.present.links.some((link) => link.id === state.selectedLinkId) ? state.selectedLinkId : null,
        dialogTaskId: state.dialogTaskId !== null && known.has(state.dialogTaskId) ? state.dialogTaskId : null,
      }));
      options.onChange?.(history.present, schedule);
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
      collapsed: new Set<Id>(),
      zoom: clampZoom(options.zoom ?? DEFAULT_ZOOM),
      showCriticalPath: options.showCriticalPath ?? false,
      showLinks: options.showLinks ?? true,
      baselineNumber: options.baselineNumber ?? null,
      baselineSlot: options.baselineNumber ?? 0,
      rejection: null,
      clipboard: null,
      clipboardText: null,
      selectedLinkId: null,
      dialogTaskId: null,
      projectDialogOpen: false,
      recurringDialogOpen: false,
      printing: false,
      view: options.view ?? "gantt",

      apply(label, edit) {
        const { history, schedule } = get();
        try {
          const next = edit(history.present, schedule);
          if (next === history.present) return true;
          replace(commit(history, next, label), computeSchedule(next));
          return true;
        } catch (error) {
          return reject(error);
        }
      },
      load(project) {
        try {
          const schedule = computeSchedule(project);
          set({ selection: [], collapsed: new Set<Id>() });
          replace(createHistory(project), schedule);
        } catch (error) {
          reject(error);
        }
      },
      undo() {
        const history = undo(get().history);
        if (history !== get().history) replace(history, computeSchedule(history.present));
      },
      redo() {
        const history = redo(get().history);
        if (history !== get().history) replace(history, computeSchedule(history.present));
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
}
