import { compileCalendars, setCustomValue, setTaskDuration, setTaskStart, updateTask } from "@simplix-react/gantt-core";
import { useMemo } from "react";
import type { KeyboardEvent } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { isEditableCell } from "../lib/grid-cells";
import type { GanttColumnId } from "../lib/grid-columns";
import type { VisibleRow } from "../lib/rows";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import type { ViewRow } from "../lib/view-rows";
import type { GridEditing } from "./task-grid";

/** What {@link useChartKeys} needs from the chart. */
export interface ChartKeysOptions {
  rows: readonly ViewRow[];
  columns: readonly GanttColumnId[];
  activeColumn: GanttColumnId;
  onActiveColumnChange: (column: GanttColumnId) => void;
  editing: GridEditing | null;
  onEditingChange: (editing: GridEditing | null) => void;
  /** Brings the row at an index of `rows` into view. */
  scrollToRow: (index: number) => void;
}

/** The chart's keyboard commands: moving the selection and the active cell, editing, nudging, filling down, undo. */
export function useChartKeys({ rows, columns, activeColumn, onActiveColumnChange, editing, onEditingChange, scrollToRow }: ChartKeysOptions) {
  const { t } = useGanttTranslation();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const readOnly = useGantt((state) => state.readOnly);
  const projectTime = useMemo(() => compileCalendars(project.calendars).get(project.calendarId), [project.calendars, project.calendarId]);

  const moveSelection = (delta: number, extend: boolean): void => {
    const { selection, selectRow } = store.getState();
    const last = selection[selection.length - 1];
    const current = last === undefined ? -1 : rows.findIndex((row) => row.kind === "task" && row.task.id === last);
    // Step over the headings of groups: only tasks are selected.
    let next = current === -1 ? 0 : current + delta;
    while (rows[next] && rows[next].kind !== "task") next += delta > 0 ? 1 : -1;
    const target = rows[next];
    if (!target || target.kind !== "task") return;
    selectRow(target.task.id, extend ? "extend" : "replace");
    scrollToRow(next);
  };

  const moveColumnFocus = (delta: number): void => {
    const at = Math.max(0, columns.indexOf(activeColumn));
    onActiveColumnChange(columns[Math.max(0, Math.min(columns.length - 1, at + delta))] ?? "name");
  };

  /** Moves the selected tasks one working day earlier or later. */
  const nudge = (days: number): void => {
    const state = store.getState();
    if (!projectTime || state.selection.length === 0) return;
    state.apply("move-task", (p, s) => {
      let next = p;
      for (const id of state.selection) {
        const at = s.tasks.get(id);
        if (!at || at.summary) continue;
        next = setTaskStart(next, id, projectTime.snapForward(projectTime.add(at.start, days * p.minutesPerDay)));
      }
      return next;
    });
  };

  /** Copies the active cell of the first selected row, in row order, into the other selected rows. */
  const fillDown = (): void => {
    const state = store.getState();
    const chosen = rows.filter((row): row is VisibleRow => row.kind === "task" && state.selection.includes(row.task.id));
    if (chosen.length < 2) return;
    const [source, ...targets] = chosen;
    state.apply("fill-down", (p) => {
      let next = p;
      for (const target of targets) {
        if (!isEditableCell(activeColumn, target, p)) continue;
        if (activeColumn === "duration") {
          next = setTaskDuration(next, target.task.id, source.task.duration, { unit: source.task.durationUnit, elapsed: source.task.elapsed, estimated: source.task.estimated });
        } else if (activeColumn === "name") {
          next = updateTask(next, target.task.id, { name: source.task.name });
        } else if (activeColumn === "actualCost") {
          next = updateTask(next, target.task.id, { actualCost: source.task.actualCost });
        } else if (activeColumn.startsWith("custom:")) {
          const fieldId = activeColumn.slice("custom:".length);
          next = setCustomValue(next, target.task.id, fieldId, source.task.custom?.[fieldId]);
        }
      }
      return next;
    });
  };

  const editActive = (id: string, initial?: string): boolean => {
    const row = rows.find((candidate) => candidate.kind === "task" && candidate.task.id === id);
    const column = columns.includes(activeColumn) ? activeColumn : "name";
    if (readOnly || !row || row.kind !== "task" || !isEditableCell(column, row, project)) return false;
    onEditingChange({ id, column, initial });
    return true;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (editing) return;
    const state = store.getState();
    const mod = event.metaKey || event.ctrlKey;
    const last = state.selection[state.selection.length - 1];
    let handled = true;
    if (event.key === "ArrowDown") moveSelection(1, event.shiftKey);
    else if (event.key === "ArrowUp") moveSelection(-1, event.shiftKey);
    else if (event.altKey && event.shiftKey && event.key === "ArrowRight") state.indentSelected();
    else if (event.altKey && event.shiftKey && event.key === "ArrowLeft") state.outdentSelected();
    else if (event.altKey && event.key === "ArrowRight") nudge(1);
    else if (event.altKey && event.key === "ArrowLeft") nudge(-1);
    else if (event.key === "ArrowRight" || (event.key === "Tab" && !event.shiftKey && last !== undefined)) moveColumnFocus(1);
    else if (event.key === "ArrowLeft" || (event.key === "Tab" && event.shiftKey && last !== undefined)) moveColumnFocus(-1);
    else if (mod && event.key.toLowerCase() === "z" && event.shiftKey) state.redo();
    else if (mod && event.key.toLowerCase() === "z") state.undo();
    else if (mod && event.key.toLowerCase() === "y") state.redo();
    else if (mod && event.key.toLowerCase() === "d") fillDown();
    else if (event.key === "Insert") state.addTask(t("task.newName"));
    else if (event.key === "Delete" || (event.key === "Backspace" && mod)) state.removeSelected();
    else if ((event.key === "F2" || event.key === "Enter") && last !== undefined) handled = editActive(last);
    else if (event.key === "Escape") state.select([]);
    else if (last !== undefined && event.key.length === 1 && !mod && !event.altKey) {
      // Typing on a selected row starts editing its active cell with the typed character.
      handled = editActive(last, event.key);
    } else handled = false;
    if (handled) event.preventDefault();
  };

  return onKeyDown;
}
