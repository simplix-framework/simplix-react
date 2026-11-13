import { addLink, assignResource, formatDuration, parseDuration, removeAssignments, removeLinks, updateAssignment, updateLink } from "@simplix-react/gantt-core";
import type { Id, Link, LinkType, Project, Task, WorkContour } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";
import { Trash2 } from "lucide-react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { Choice } from "./dialog-fields";

const LINK_TYPES: readonly LinkType[] = ["FS", "SS", "FF", "SF"];
const CONTOURS: readonly WorkContour[] = ["flat", "front-loaded", "back-loaded", "bell"];

function lagText(link: Link, project: Project): string {
  if (link.lagMode === "percent") return `${link.lag}%`;
  return formatDuration({ minutes: link.lag, unit: link.lagUnit, elapsed: link.lagMode === "elapsed", estimated: false }, project);
}

/** The predecessors of one task, each with its link type and lag, and a list to add another from. */
export function TaskPredecessors({ task }: { task: Task }) {
  const { t } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const project = useGantt((state) => state.history.present);
  const { apply } = useGanttStore().getState();
  const incoming = project.links.filter((link) => link.successorId === task.id);
  const linkable = project.tasks.filter(
    (other) =>
      other.id !== task.id &&
      !project.links.some(
        (link) =>
          (link.predecessorId === other.id && link.successorId === task.id) ||
          (link.predecessorId === task.id && link.successorId === other.id),
      ),
  );
  const rowNumber = (id: Id): number => project.tasks.findIndex((other) => other.id === id) + 1;
  return (
    <>
        {incoming.map((link) => (
          <div key={link.id} className="grid min-w-max grid-cols-[1fr_11rem_6rem_auto] items-center gap-2">
            <span className="truncate text-sm">
              {rowNumber(link.predecessorId)}. {project.tasks.find((other) => other.id === link.predecessorId)?.name}
            </span>
            <Choice
              value={link.type}
              onChange={(value) => apply("set-link-type", (p) => updateLink(p, link.id, { type: value as LinkType }))}
              options={LINK_TYPES.map((type) => ({ value: type, label: t(`linkType.${type}`) }))}
              label={t("field.linkType")}
            />
            <ui.Input
              key={lagText(link, project)}
              aria-label={t("field.lag")}
              defaultValue={lagText(link, project)}
              onBlur={(event) => {
                const text = event.target.value.trim();
                if (text === lagText(link, project)) return;
                apply("set-lag", (p) => {
                  if (text.endsWith("%")) return updateLink(p, link.id, { lag: Number(text.slice(0, -1)), lagMode: "percent" });
                  const lag = parseDuration(text === "" ? "0" : text, p, link.lagUnit);
                  return updateLink(p, link.id, { lag: lag.minutes, lagMode: lag.elapsed ? "elapsed" : "working", lagUnit: lag.unit });
                });
              }}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("dialog.remove")}
              onClick={() => apply("remove-link", (p) => removeLinks(p, [link.id]))}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {linkable.length > 0 && (
          <ui.Select value="" onValueChange={(value) => apply("link-tasks", (p) => addLink(p, { predecessorId: value, successorId: task.id }))}>
            <ui.SelectTrigger aria-label={t("dialog.add")} className="w-full">
              <ui.SelectValue placeholder={t("dialog.add")} />
            </ui.SelectTrigger>
            <ui.SelectContent>
              {linkable.map((other) => (
                <ui.SelectItem key={other.id} value={other.id}>
                  {rowNumber(other.id)}. {other.name}
                </ui.SelectItem>
              ))}
            </ui.SelectContent>
          </ui.Select>
        )}
    </>
  );
}

/** The resources assigned to one task, each with its units, overtime and work contour, and a list to assign another from. */
export function TaskAssignments({ task }: { task: Task }) {
  const { t } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const project = useGantt((state) => state.history.present);
  const { apply } = useGanttStore().getState();
  const assignments = project.assignments.filter((assignment) => assignment.taskId === task.id);
  const assignable = project.resources.filter((resource) => !assignments.some((a) => a.resourceId === resource.id));
  return (
    <>
        {assignments.map((assignment) => (
          <div key={assignment.id} className="grid min-w-max grid-cols-[1fr_5rem_6rem_9rem_auto] items-center gap-2" data-gantt-assignment={assignment.id}>
            <span className="truncate text-sm">{project.resources.find((r) => r.id === assignment.resourceId)?.name}</span>
            <ui.Input
              key={assignment.units}
              type="number"
              min={1}
              aria-label={t("field.units")}
              defaultValue={Math.round(assignment.units * 100)}
              onBlur={(event) => {
                const units = Number(event.target.value) / 100;
                if (units !== assignment.units) apply("set-units", (p) => updateAssignment(p, assignment.id, { units }));
              }}
            />
            <ui.Input
              key={`overtime:${assignment.overtimeWork ?? 0}`}
              type="number"
              min={0}
              step="0.5"
              aria-label={t("field.overtime")}
              title={t("field.overtime")}
              defaultValue={(assignment.overtimeWork ?? 0) / 60}
              onBlur={(event) => {
                const overtimeWork = Math.round(Number(event.target.value) * 60);
                if (overtimeWork !== (assignment.overtimeWork ?? 0)) {
                  apply("set-overtime", (p) => updateAssignment(p, assignment.id, { overtimeWork }));
                }
              }}
            />
            <Choice
              value={assignment.contour ?? "flat"}
              onChange={(value) => apply("set-contour", (p) => updateAssignment(p, assignment.id, { contour: value as WorkContour }))}
              options={CONTOURS.map((contour) => ({ value: contour, label: t(`contour.${contour}`) }))}
              label={t("field.contour")}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("dialog.remove")}
              onClick={() => apply("unassign", (p) => removeAssignments(p, [assignment.id]))}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {assignable.length > 0 && (
          <ui.Select value="" onValueChange={(value) => apply("assign", (p) => assignResource(p, task.id, value))}>
            <ui.SelectTrigger aria-label={t("dialog.add")} className="w-full">
              <ui.SelectValue placeholder={t("dialog.add")} />
            </ui.SelectTrigger>
            <ui.SelectContent>
              {assignable.map((resource) => (
                <ui.SelectItem key={resource.id} value={resource.id}>
                  {resource.name}
                </ui.SelectItem>
              ))}
            </ui.SelectContent>
          </ui.Select>
        )}
        {assignments.length === 0 && assignable.length === 0 && <p className="text-sm text-muted-foreground">{t("resource.emptyHint")}</p>}
    </>
  );
}
