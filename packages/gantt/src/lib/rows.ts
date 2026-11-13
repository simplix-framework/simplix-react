import type { Id, Task } from "@simplix-react/gantt-core";

/** A task as one visible line of the chart. */
export interface VisibleRow {
  kind: "task";
  task: Task;
  /** Position in the project's row list; the row number is one more. */
  index: number;
  summary: boolean;
  collapsed: boolean;
}

/** The rows on screen: every task except those under a collapsed summary task. */
export function visibleRows(tasks: readonly Task[], collapsed: ReadonlySet<Id>): VisibleRow[] {
  const rows: VisibleRow[] = [];
  // Rows deeper than this level are hidden while it is set.
  let hiddenBelow = Infinity;
  tasks.forEach((task, index) => {
    if (task.outlineLevel > hiddenBelow) return;
    hiddenBelow = Infinity;
    const summary = index + 1 < tasks.length && tasks[index + 1].outlineLevel > task.outlineLevel;
    const isCollapsed = summary && collapsed.has(task.id);
    if (isCollapsed) hiddenBelow = task.outlineLevel;
    rows.push({ kind: "task", task, index, summary, collapsed: isCollapsed });
  });
  return rows;
}
