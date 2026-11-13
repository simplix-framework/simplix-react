import { buildOutline } from "./outline";
import type { Id, Project, Resource, Schedule } from "./types";

/** Work and cost of one task. A summary task carries the totals of the tasks under it. */
export interface TaskCost {
  /** Working minutes its work resources spend on it. */
  work: number;
  cost: number;
}

/** The standard rate of a resource at an instant: the latest dated rate at or before it, else the plain rate. */
function rateAt(resource: Resource, at: number | undefined): number {
  let rate = resource.standardRate ?? 0;
  if (at === undefined) return rate;
  let latest = -Infinity;
  for (const entry of resource.rates ?? []) {
    if (entry.from <= at && entry.from > latest) {
      latest = entry.from;
      rate = entry.standardRate;
    }
  }
  return rate;
}

/**
 * Totals the work and the cost of every task.
 *
 * A work resource costs its hourly rate for the hours of its assignment; a
 * material resource costs its rate for the assignment's units; either adds
 * its cost per use once per task. A task's own fixed cost is added on top,
 * and a summary task adds up the tasks under it. Overtime work costs the
 * overtime rate. With a schedule, a resource whose rate changes by date is
 * costed at the rate in effect when the task starts.
 */
export function computeCosts(project: Project, schedule?: Schedule): Map<Id, TaskCost> {
  const outline = buildOutline(project.tasks);
  const resources = new Map(project.resources.map((resource) => [resource.id, resource]));
  const totals = project.tasks.map((task) => ({ work: 0, cost: task.fixedCost ?? 0 }));
  for (const assignment of project.assignments) {
    const index = outline.indexById.get(assignment.taskId);
    const resource = resources.get(assignment.resourceId);
    if (index === undefined || !resource) continue;
    const rate = rateAt(resource, schedule?.tasks.get(assignment.taskId)?.start);
    if (resource.type === "work") {
      const overtime = Math.min(assignment.overtimeWork ?? 0, assignment.work);
      totals[index].work += assignment.work;
      totals[index].cost += ((assignment.work - overtime) / 60) * rate + (overtime / 60) * (resource.overtimeRate ?? rate);
    } else if (resource.type === "material") {
      totals[index].cost += assignment.units * rate;
    }
    totals[index].cost += resource.costPerUse ?? 0;
  }
  // A parent comes before its children in row order, so adding upward from the last row settles every summary.
  for (let i = project.tasks.length - 1; i >= 0; i--) {
    const parent = outline.parent[i];
    if (parent === -1 || !outline.active[i]) continue;
    totals[parent].work += totals[i].work;
    totals[parent].cost += totals[i].cost;
  }
  return new Map(project.tasks.map((task, i) => [task.id, totals[i]]));
}
