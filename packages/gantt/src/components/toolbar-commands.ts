import { addLink, removeLinks } from "@simplix-react/gantt-core";
import type { Project } from "@simplix-react/gantt-core";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { ZOOM_LEVELS } from "../lib/time-scale";

/** Links the given tasks into a finish-to-start chain in row order, skipping pairs already linked. */
function chain(project: Project, ids: readonly string[]): Project {
  const ordered = project.tasks.filter((task) => ids.includes(task.id)).map((task) => task.id);
  let next = project;
  for (let i = 0; i + 1 < ordered.length; i++) {
    const linked = next.links.some(
      (link) =>
        (link.predecessorId === ordered[i] && link.successorId === ordered[i + 1]) ||
        (link.predecessorId === ordered[i + 1] && link.successorId === ordered[i]),
    );
    if (!linked) next = addLink(next, { predecessorId: ordered[i], successorId: ordered[i + 1] });
  }
  return next;
}

/** One command of the toolbar, as a button on the bar or a line in its menu. */
export interface ToolbarCommand {
  id: "taskInformation" | "outdent" | "indent" | "link" | "unlink" | "zoomOut" | "zoomIn" | "scrollToStart" | "scrollToToday";
  disabled: boolean;
  run: () => void;
}

/**
 * The commands a narrow toolbar moves from the bar into its menu: outline,
 * task information, links, zoom and the two jumps. Both places read them from here, so a
 * command is enabled and acts the same wherever it is shown.
 */
export function useFoldableCommands(): ToolbarCommand[] {
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const selection = useGantt((state) => state.selection);
  const zoom = useGantt((state) => state.zoom);
  const state = store.getState();
  const selected = new Set(selection);
  const linksAmongSelection = project.links.filter((link) => selected.has(link.predecessorId) && selected.has(link.successorId));
  const last = selection[selection.length - 1];
  return [
    { id: "taskInformation", disabled: last === undefined, run: () => last !== undefined && state.openTaskDialog(last) },
    { id: "outdent", disabled: selection.length === 0, run: state.outdentSelected },
    { id: "indent", disabled: selection.length === 0, run: state.indentSelected },
    { id: "link", disabled: selection.length < 2, run: () => state.apply("link-tasks", (p) => chain(p, selection)) },
    {
      id: "unlink",
      disabled: linksAmongSelection.length === 0,
      run: () => state.apply("unlink-tasks", (p) => removeLinks(p, linksAmongSelection.map((link) => link.id))),
    },
    { id: "zoomOut", disabled: zoom === 0, run: () => state.setZoom(zoom - 1) },
    { id: "zoomIn", disabled: zoom === ZOOM_LEVELS.length - 1, run: () => state.setZoom(zoom + 1) },
    { id: "scrollToStart", disabled: false, run: state.scrollToStart },
    { id: "scrollToToday", disabled: false, run: state.scrollToToday },
  ];
}
