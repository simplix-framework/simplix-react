import { ScheduleError, copyTasks, createTask, formatDuration, formatLocalDate, insertTask, nextId, parseDuration, pasteTasks, subtreeEnd, taskIndex } from "@simplix-react/gantt-core";
import type { Project } from "@simplix-react/gantt-core";

import type { GanttStoreState } from "./gantt-store-types";

/** Row to insert at, and the level to insert with: just under the last selected row. */
export function insertionPoint(project: Project, selection: readonly string[]): { at: number; level: number } {
  const last = selection[selection.length - 1];
  if (last === undefined) return { at: project.tasks.length, level: 1 };
  const index = taskIndex(project, last);
  return { at: subtreeEnd(project.tasks, index), level: project.tasks[index].outlineLevel };
}

/** The store's copy and paste: rows to and from the chart's own clipboard, and rows of text from a spreadsheet. */
export function clipboardActions(
  set: (partial: Partial<GanttStoreState>) => void,
  get: () => GanttStoreState,
): Pick<GanttStoreState, "copySelected" | "pasteText" | "paste"> {
  return {
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
        const { at, level } = insertionPoint(project, get().selection);
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
    paste() {
      const { clipboard } = get();
      if (!clipboard) return;
      get().apply("paste", (project) => {
        const { at, level } = insertionPoint(project, get().selection);
        // Ids are drawn from counters that start past every id in use, so pasted records never collide.
        const next = {
          task: Number(nextId(project.tasks)),
          link: Number(nextId(project.links)),
          assignment: Number(nextId(project.assignments)),
        };
        return pasteTasks(project, clipboard, at, (kind) => String(next[kind]++), level);
      });
    },
  };
}
