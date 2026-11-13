import type { Id, Project, Schedule, Task, TaskSchedule } from "@simplix-react/gantt-core";

import { visibleRows } from "./rows";
import type { VisibleRow } from "./rows";

/** Which tasks a chart shows. */
export type TaskFilter = "all" | "critical" | "incomplete" | "completed" | "milestones" | "late" | "unassigned";
/** What the rows are ordered by; `none` keeps the plan's own order. */
export type SortKey = "none" | "name" | "start" | "finish" | "duration" | "percentComplete" | "totalSlack" | "priority";
/** What the rows are gathered under; `none` keeps the outline. */
export type GroupKey = "none" | "resource" | "critical" | "status";

/** How a chart narrows, orders and gathers its rows. */
export interface ViewOptions {
  filter: TaskFilter;
  /** Shows only the tasks this resource is assigned to. */
  resourceId: Id | null;
  /** Shows only the tasks whose name contains this text, in any letter case. */
  search: string;
  sort: SortKey;
  sortDescending: boolean;
  group: GroupKey;
}

/** The view a chart opens with: every task, in the plan's order, in its outline. */
export const DEFAULT_VIEW: ViewOptions = { filter: "all", resourceId: null, search: "", sort: "none", sortDescending: false, group: "none" };

/** Whether a view shows the plan as it is, so rows can be dragged to a new place. */
export function isPlainView(view: ViewOptions): boolean {
  return view.filter === "all" && view.resourceId === null && view.search.trim() === "" && view.sort === "none" && view.group === "none";
}

/** A heading above the rows of one group. */
export interface GroupHeaderRow {
  kind: "group";
  /** What the rows under it share: a resource id, or a fixed word such as `critical`. */
  key: string;
  count: number;
}

/** One line of the chart: a task, or the heading of a group of tasks. */
export type ViewRow = VisibleRow | GroupHeaderRow;

/** Status words a task is grouped under. */
export type TaskStatus = "not-started" | "in-progress" | "complete";

/** Where a task stands, from its percent complete. */
export function taskStatus(percentComplete: number): TaskStatus {
  if (percentComplete >= 100) return "complete";
  return percentComplete > 0 ? "in-progress" : "not-started";
}

function matches(task: Task, at: TaskSchedule, project: Project, view: ViewOptions, assigned: ReadonlyMap<Id, readonly Id[]>): boolean {
  const search = view.search.trim().toLowerCase();
  if (search !== "" && !task.name.toLowerCase().includes(search)) return false;
  const resources = assigned.get(task.id) ?? [];
  if (view.resourceId !== null && !resources.includes(view.resourceId)) return false;
  switch (view.filter) {
    case "critical":
      return at.critical;
    case "incomplete":
      return at.percentComplete < 100;
    case "completed":
      return at.percentComplete >= 100;
    case "milestones":
      return at.milestone;
    case "unassigned":
      return !at.summary && resources.length === 0;
    case "late": {
      // Later than the first baseline planned, or past its deadline.
      const planned = project.baselines[0]?.[task.id];
      return (planned !== undefined && at.finish > planned.finish) || (task.deadline !== undefined && at.finish > task.deadline);
    }
    default:
      return true;
  }
}

function compare(a: TaskSchedule, b: TaskSchedule, tasks: readonly Task[], key: SortKey): number {
  switch (key) {
    case "name":
      return tasks[a.index].name.localeCompare(tasks[b.index].name);
    case "start":
      return a.start - b.start;
    case "finish":
      return a.finish - b.finish;
    case "duration":
      return a.duration - b.duration;
    case "percentComplete":
      return a.percentComplete - b.percentComplete;
    case "totalSlack":
      return a.totalSlack - b.totalSlack;
    case "priority":
      return tasks[a.index].priority - tasks[b.index].priority;
    default:
      return a.index - b.index;
  }
}

/**
 * The rows a chart draws under a view.
 *
 * A filter or a search keeps the matching tasks and the summary tasks above
 * them, so each match still shows where it belongs. A sort orders the tasks
 * under each summary task, leaving the outline whole. A group drops the
 * outline: the tasks without tasks under them are gathered under one heading
 * per group, and a task with several resources appears under each of them.
 */
export function viewRows(project: Project, schedule: Schedule, collapsed: ReadonlySet<Id>, view: ViewOptions): ViewRow[] {
  const tasks = project.tasks;
  if (isPlainView(view)) return visibleRows(tasks, collapsed);

  const assigned = new Map<Id, Id[]>();
  for (const assignment of project.assignments) {
    const list = assigned.get(assignment.taskId) ?? [];
    list.push(assignment.resourceId);
    assigned.set(assignment.taskId, list);
  }
  const at = (id: Id): TaskSchedule | undefined => schedule.tasks.get(id);
  const direction = view.sortDescending ? -1 : 1;
  const row = (index: number, summary: boolean, isCollapsed: boolean): VisibleRow => ({ kind: "task", task: tasks[index], index, summary, collapsed: isCollapsed });

  if (view.group !== "none") {
    const groups = new Map<string, TaskSchedule[]>();
    for (const task of tasks) {
      const scheduled = at(task.id);
      if (!scheduled || scheduled.summary || !matches(task, scheduled, project, view, assigned)) continue;
      const keys =
        view.group === "resource"
          ? (assigned.get(task.id)?.length ? (assigned.get(task.id) as Id[]) : [""])
          : [view.group === "critical" ? (scheduled.critical ? "critical" : "not-critical") : taskStatus(scheduled.percentComplete)];
      for (const key of keys) {
        const list = groups.get(key) ?? [];
        list.push(scheduled);
        groups.set(key, list);
      }
    }
    const rows: ViewRow[] = [];
    for (const [key, members] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
      rows.push({ kind: "group", key, count: members.length });
      if (collapsed.has(`group:${key}`)) continue;
      members.sort((a, b) => direction * compare(a, b, tasks, view.sort) || a.index - b.index);
      for (const member of members) rows.push(row(member.index, false, false));
    }
    return rows;
  }

  // Keep a task that matches, and every summary task above one that does.
  const keep = new Array<boolean>(tasks.length).fill(false);
  const stack: number[] = [];
  tasks.forEach((task, index) => {
    while (stack.length > 0 && tasks[stack[stack.length - 1]].outlineLevel >= task.outlineLevel) stack.pop();
    const scheduled = at(task.id);
    if (scheduled && matches(task, scheduled, project, view, assigned)) {
      keep[index] = true;
      for (const ancestor of stack) keep[ancestor] = true;
    }
    stack.push(index);
  });

  // Children of each row, in the order the view sorts them.
  const children = new Map<number, number[]>();
  const parents: number[] = [];
  tasks.forEach((task, index) => {
    while (parents.length > 0 && tasks[parents[parents.length - 1]].outlineLevel >= task.outlineLevel) parents.pop();
    const parent = parents.length > 0 ? parents[parents.length - 1] : -1;
    if (keep[index]) {
      const list = children.get(parent) ?? [];
      list.push(index);
      children.set(parent, list);
    }
    parents.push(index);
  });
  const rows: ViewRow[] = [];
  const walk = (parent: number): void => {
    const list = children.get(parent) ?? [];
    if (view.sort !== "none") {
      list.sort((a, b) => {
        const x = at(tasks[a].id);
        const y = at(tasks[b].id);
        return x && y ? direction * compare(x, y, tasks, view.sort) || a - b : a - b;
      });
    }
    for (const index of list) {
      const summary = index + 1 < tasks.length && tasks[index + 1].outlineLevel > tasks[index].outlineLevel;
      const isCollapsed = summary && collapsed.has(tasks[index].id);
      rows.push(row(index, summary, isCollapsed));
      if (!isCollapsed) walk(index);
    }
  };
  walk(-1);
  return rows;
}

/** The task rows among a chart's rows. */
export function taskRows(rows: readonly ViewRow[]): VisibleRow[] {
  return rows.filter((candidate): candidate is VisibleRow => candidate.kind === "task");
}
