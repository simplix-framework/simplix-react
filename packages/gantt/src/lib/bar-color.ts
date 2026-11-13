import type { Id, Project, Task } from "@simplix-react/gantt-core";

import type { BarColoring } from "../model/gantt-store-types";

/** Colours given to resources in turn. */
const RESOURCE_COLORS = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#65a30d", "#dc2626"] as const;

/**
 * Returns the colour of each task's bar under a colouring, or `undefined`
 * where the bar keeps the chart's own colour. The screen and the PDF both
 * ask here, so a bar is the same colour in both.
 */
export function barColors(project: Project, coloring: BarColoring): (task: Task) => string | undefined {
  if (coloring === "none") return () => undefined;
  if (coloring === "task") return (task) => task.color;
  const colorOfResource = new Map<Id, string>();
  project.resources.forEach((resource, i) => colorOfResource.set(resource.id, RESOURCE_COLORS[i % RESOURCE_COLORS.length]));
  const firstResource = new Map<Id, Id>();
  for (const assignment of project.assignments) {
    if (!firstResource.has(assignment.taskId)) firstResource.set(assignment.taskId, assignment.resourceId);
  }
  return (task) => {
    const resource = firstResource.get(task.id);
    return resource === undefined ? undefined : colorOfResource.get(resource);
  };
}
