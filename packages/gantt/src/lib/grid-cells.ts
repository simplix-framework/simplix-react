import { formatLocalDate, formatPredecessors } from "@simplix-react/gantt-core";
import type { BaselineVariance, EarnedValue, Id, Project, TaskCost, TaskSchedule } from "@simplix-react/gantt-core";

import { formatDurationText } from "./duration-text";
import type { DurationWords } from "./duration-text";
import { formatDate, toDateInputValue } from "./format";
import { customFieldOf } from "./grid-columns";
import type { BuiltInColumnId, GanttColumnId } from "./grid-columns";
import type { VisibleRow } from "./rows";

const EDITABLE: ReadonlySet<GanttColumnId> = new Set(["name", "duration", "start", "finish", "predecessors", "percentComplete", "actualCost"]);
/** Columns whose value a summary task takes from the tasks under it. */
const ROLLED_UP: ReadonlySet<GanttColumnId> = new Set(["duration", "start", "finish", "actualCost"]);

/** What a cell needs besides the task and its dates. */
export interface CellContext {
  project: Project;
  language: string;
  words: DurationWords;
  variance?: BaselineVariance;
  cost?: TaskCost;
  earned?: EarnedValue;
}

/** An amount of money in the project's currency, or a plain number when the project names none. */
export function money(amount: number, project: Project, language: string): string {
  if (!project.currencyCode) return new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(amount);
  try {
    return new Intl.NumberFormat(language, { style: "currency", currency: project.currencyCode }).format(amount);
  } catch (error) {
    // A code the browser does not know as a currency falls back to the number.
    if (!(error instanceof RangeError)) throw error;
    return new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(amount);
  }
}

/** Whether a cell takes typed input: the column is editable and the row does not take the value from the rows under it. */
export function isEditableCell(column: GanttColumnId, row: VisibleRow, project: Project): boolean {
  const field = customFieldOf(column, project);
  if (field) return field.type !== "flag";
  return EDITABLE.has(column) && !(row.summary && ROLLED_UP.has(column));
}

export const EARNED_VALUE: ReadonlySet<GanttColumnId> = new Set(["plannedValue", "earnedValue", "actualCost", "scheduleVariance", "costVariance"]);

function resourceText(project: Project, taskId: Id): string {
  return project.assignments
    .filter((assignment) => assignment.taskId === taskId)
    .map((assignment) => {
      const name = project.resources.find((resource) => resource.id === assignment.resourceId)?.name ?? assignment.resourceId;
      return assignment.units === 1 ? name : `${name}[${Math.round(assignment.units * 100)}%]`;
    })
    .join(", ");
}

export function cellText(column: GanttColumnId, row: VisibleRow, at: TaskSchedule, context: CellContext): string {
  const { project, language, words, variance, cost, earned } = context;
  const { task } = row;
  const span = (minutes: number, unit: "d" | "h" = "d"): string =>
    formatDurationText({ minutes, unit, elapsed: false, estimated: false }, project, words);
  const field = customFieldOf(column, project);
  if (column.startsWith("custom:")) {
    const value = field ? task.custom?.[field.id] : undefined;
    if (!field || value === undefined) return "";
    if (field.type === "date") return formatDate(value as number, language);
    if (field.type === "flag") return value === true ? "✔" : "";
    return String(value);
  }
  switch (column as BuiltInColumnId) {
    case "wbs":
      return at.wbs;
    case "name":
      return task.name;
    case "duration":
      return row.summary
        ? span(at.duration)
        : formatDurationText(
            { minutes: task.duration, unit: task.durationUnit, elapsed: task.elapsed === true, estimated: task.estimated === true },
            project,
            words,
          );
    case "start":
      return formatDate(at.start, language);
    case "finish":
      return formatDate(at.finish, language);
    case "predecessors":
      return formatPredecessors(
        project.links.filter((link) => link.successorId === task.id),
        (id) => project.tasks.findIndex((other) => other.id === id) + 1,
        project,
      );
    case "percentComplete":
      return `${at.percentComplete}%`;
    case "resources":
      return resourceText(project, task.id);
    case "totalSlack":
      return span(at.totalSlack);
    case "startVariance":
    case "finishVariance": {
      // A task the baseline does not hold has no variance to show.
      if (!variance) return "";
      const minutes = column === "startVariance" ? variance.start : variance.finish;
      return span(minutes);
    }
    case "work":
      return cost ? span(cost.work, "h") : "";
    case "cost":
      return cost ? money(cost.cost, project, language) : "";
    case "plannedValue":
    case "earnedValue":
    case "actualCost":
    case "scheduleVariance":
    case "costVariance":
      // Earned value needs a status date; without one the cells stay empty.
      return earned ? money(earned[column as "plannedValue" | "earnedValue" | "actualCost" | "scheduleVariance" | "costVariance"], project, language) : "";
  }
}

/** The text an editor opens with: the stored value in the form the editor reads back. */
export function editorValue(column: GanttColumnId, row: VisibleRow, at: TaskSchedule, context: CellContext): string {
  const { project } = context;
  if (column === "start") return toDateInputValue(at.start);
  if (column === "finish") return toDateInputValue(at.finish);
  if (column === "percentComplete") return String(at.percentComplete);
  if (column === "actualCost") return row.task.actualCost === undefined ? "" : String(row.task.actualCost);
  const field = customFieldOf(column, project);
  const value = field ? row.task.custom?.[field.id] : undefined;
  if (field?.type === "date") return typeof value === "number" ? formatLocalDate(value) : "";
  return cellText(column, row, at, context);
}
