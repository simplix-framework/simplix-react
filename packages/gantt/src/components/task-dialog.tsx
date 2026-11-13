import {
  addLink,
  assignResource,
  setCustomValue,
  formatDuration,
  parseDuration,
  parseLocalDateTime,
  removeAssignments,
  removeLinks,
  setPercentComplete,
  updateAssignment,
  updateLink,
  updateTask,
} from "@simplix-react/gantt-core";
import type { ConstraintType, Id, Link, LinkType, Project, Task, TaskMode, TaskType, WorkContour } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";
import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { durationWords, formatDurationText, toCanonicalDuration } from "../lib/duration-text";
import { toDateInputValue } from "../lib/format";
import { useGanttTranslation } from "../lib/use-gantt-translation";
import { Field, Toggle } from "./dialog-fields";
import { TaskSplits } from "./task-splits";

const NONE = "__none";
const CONSTRAINTS: readonly ConstraintType[] = [
  "asap",
  "alap",
  "must-start-on",
  "must-finish-on",
  "start-no-earlier-than",
  "start-no-later-than",
  "finish-no-earlier-than",
  "finish-no-later-than",
];
const TASK_TYPES: readonly TaskType[] = ["fixed-units", "fixed-duration", "fixed-work"];
const LINK_TYPES: readonly LinkType[] = ["FS", "SS", "FF", "SF"];
const CONTOURS: readonly WorkContour[] = ["flat", "front-loaded", "back-loaded", "bell"];

function lagText(link: Link, project: Project): string {
  if (link.lagMode === "percent") return `${link.lag}%`;
  return formatDuration({ minutes: link.lag, unit: link.lagUnit, elapsed: link.lagMode === "elapsed", estimated: false }, project);
}

/** The task information dialog: every field of one task, its predecessors and its resources. Each change is one undo step. */
export function TaskDialog() {
  const { t } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const store = useGanttStore();
  const taskId = useGantt((state) => state.dialogTaskId);
  const readOnly = useGantt((state) => state.readOnly);
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const task = taskId === null ? undefined : project.tasks.find((candidate) => candidate.id === taskId);
  const at = task ? schedule.tasks.get(task.id) : undefined;
  if (!task || !at) return null;

  const { apply, setDurationText, closeTaskDialog } = store.getState();
  const words = durationWords((key) => t(key));
  const patch = (label: string, change: Partial<Omit<Task, "id">>): void => {
    apply(label, (p) => updateTask(p, task.id, change));
  };
  const dated = task.constraintType !== "asap" && task.constraintType !== "alap";
  const incoming = project.links.filter((link) => link.successorId === task.id);
  const assignments = project.assignments.filter((assignment) => assignment.taskId === task.id);
  const linkable = project.tasks.filter(
    (other) =>
      other.id !== task.id &&
      !project.links.some(
        (link) =>
          (link.predecessorId === other.id && link.successorId === task.id) ||
          (link.predecessorId === task.id && link.successorId === other.id),
      ),
  );
  const assignable = project.resources.filter((resource) => !assignments.some((a) => a.resourceId === resource.id));
  const rowNumber = (id: Id): number => project.tasks.findIndex((other) => other.id === id) + 1;

  const select = (value: string, onChange: (value: string) => void, options: readonly { value: string; label: string }[], label: string): ReactNode => (
    <ui.Select value={value} onValueChange={onChange}>
      <ui.SelectTrigger aria-label={label} className="w-full">
        <ui.SelectValue />
      </ui.SelectTrigger>
      <ui.SelectContent>
        {options.map((option) => (
          <ui.SelectItem key={option.value} value={option.value}>
            {option.label}
          </ui.SelectItem>
        ))}
      </ui.SelectContent>
    </ui.Select>
  );

  return (
    <ui.Dialog open onOpenChange={(open) => !open && closeTaskDialog()}>
      <ui.DialogContent className="max-w-2xl">
        <ui.DialogHeader>
          <ui.DialogTitle>{t("toolbar.taskInformation")}</ui.DialogTitle>
          <ui.DialogDescription>{`${at.wbs} ${task.name}`}</ui.DialogDescription>
        </ui.DialogHeader>
        {/* A read-only chart shows the dialog with every control switched off. */}
        <fieldset disabled={readOnly} className="contents">
        <ui.Tabs defaultValue="general">
          <ui.TabsList>
            <ui.TabsTrigger value="general">{t("dialog.general")}</ui.TabsTrigger>
            <ui.TabsTrigger value="predecessors">{t("dialog.predecessors")}</ui.TabsTrigger>
            <ui.TabsTrigger value="resources">{t("dialog.resources")}</ui.TabsTrigger>
            <ui.TabsTrigger value="advanced">{t("dialog.advanced")}</ui.TabsTrigger>
            <ui.TabsTrigger value="custom">{t("dialog.custom")}</ui.TabsTrigger>
            <ui.TabsTrigger value="notes">{t("dialog.notes")}</ui.TabsTrigger>
          </ui.TabsList>

          <ui.TabsContent value="general" className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
            <Field label={t("field.name")} wide>
              {(id) => (
                <ui.Input
                  id={id}
                  key={task.name}
                  defaultValue={task.name}
                  onBlur={(event) => event.target.value !== task.name && patch("rename", { name: event.target.value })}
                />
              )}
            </Field>
            <Field label={t("column.duration")}>
              {(id) => {
                const text = at.summary
                  ? formatDurationText({ minutes: at.duration, unit: "d", elapsed: false, estimated: false }, project, words)
                  : formatDurationText(
                      { minutes: task.duration, unit: task.durationUnit, elapsed: task.elapsed === true, estimated: task.estimated === true },
                      project,
                      words,
                    );
                return (
                  <ui.Input
                    id={id}
                    key={text}
                    defaultValue={text}
                    disabled={at.summary}
                    onBlur={(event) => event.target.value !== text && setDurationText(task.id, toCanonicalDuration(event.target.value, words))}
                  />
                );
              }}
            </Field>
            <Field label={t("column.percentComplete")}>
              {(id) => (
                <ui.Input
                  id={id}
                  key={at.percentComplete}
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={at.percentComplete}
                  onBlur={(event) =>
                    Number(event.target.value) !== at.percentComplete &&
                    apply("set-progress", (p, s) => setPercentComplete(p, s, task.id, Number(event.target.value)))
                  }
                />
              )}
            </Field>
            <Field label={t("field.mode")}>
              {() =>
                select(
                  task.mode,
                  (value) =>
                    patch(
                      "set-mode",
                      // A task switched to manual keeps the dates it has.
                      value === "manual" ? { mode: "manual", manualStart: at.start } : { mode: value as TaskMode },
                    ),
                  [
                    { value: "auto", label: t("task.auto") },
                    { value: "manual", label: t("task.manual") },
                  ],
                  t("field.mode"),
                )
              }
            </Field>
            <Field label={t("field.priority")}>
              {(id) => (
                <ui.Input
                  id={id}
                  key={task.priority}
                  type="number"
                  min={0}
                  max={1000}
                  defaultValue={task.priority}
                  onBlur={(event) => {
                    const value = Math.max(0, Math.min(1000, Math.round(Number(event.target.value))));
                    if (value !== task.priority) patch("set-priority", { priority: value });
                  }}
                />
              )}
            </Field>
            <Toggle label={t("field.markAsMilestone")} checked={task.milestone === true} onChange={(checked) => patch("set-milestone", { milestone: checked })} />
            <Toggle label={t("field.inactive")} checked={task.inactive === true} onChange={(checked) => patch("set-inactive", { inactive: checked })} />
          </ui.TabsContent>

          <ui.TabsContent value="predecessors" className="flex flex-col gap-2 pt-2">
            {incoming.map((link) => (
              <div key={link.id} className="grid grid-cols-[1fr_11rem_6rem_auto] items-center gap-2">
                <span className="truncate text-sm">
                  {rowNumber(link.predecessorId)}. {project.tasks.find((other) => other.id === link.predecessorId)?.name}
                </span>
                {select(
                  link.type,
                  (value) => apply("set-link-type", (p) => updateLink(p, link.id, { type: value as LinkType })),
                  LINK_TYPES.map((type) => ({ value: type, label: t(`linkType.${type}`) })),
                  t("field.linkType"),
                )}
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
          </ui.TabsContent>

          <ui.TabsContent value="resources" className="flex flex-col gap-2 pt-2">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="grid grid-cols-[1fr_5rem_6rem_9rem_auto] items-center gap-2" data-gantt-assignment={assignment.id}>
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
                {select(
                  assignment.contour ?? "flat",
                  (value) => apply("set-contour", (p) => updateAssignment(p, assignment.id, { contour: value as WorkContour })),
                  CONTOURS.map((contour) => ({ value: contour, label: t(`contour.${contour}`) })),
                  t("field.contour"),
                )}
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
          </ui.TabsContent>

          <ui.TabsContent value="advanced" className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
            <Field label={t("field.constraintType")}>
              {() =>
                select(
                  task.constraintType,
                  (value) => {
                    const type = value as ConstraintType;
                    const needsDate = type !== "asap" && type !== "alap";
                    // A dated constraint starts from the date the task already has.
                    const date = type.includes("finish") ? at.finish : at.start;
                    patch("set-constraint", needsDate ? { constraintType: type, constraintDate: task.constraintDate ?? date } : { constraintType: type });
                  },
                  CONSTRAINTS.map((type) => ({ value: type, label: t(`constraint.${type}`) })),
                  t("field.constraintType"),
                )
              }
            </Field>
            <Field label={t("field.constraintDate")}>
              {(id) => (
                <ui.Input
                  id={id}
                  type="date"
                  disabled={!dated}
                  key={task.constraintDate ?? "none"}
                  defaultValue={dated && task.constraintDate !== undefined ? toDateInputValue(task.constraintDate) : ""}
                  onBlur={(event) => {
                    if (event.target.value === "") return;
                    const timeOfDay = task.constraintType.includes("finish") ? project.defaultFinishTime : project.defaultStartTime;
                    const date = parseLocalDateTime(event.target.value) + timeOfDay;
                    if (date !== task.constraintDate) patch("set-constraint", { constraintDate: date });
                  }}
                />
              )}
            </Field>
            <Field label={t("field.deadline")}>
              {(id) => (
                <ui.Input
                  id={id}
                  type="date"
                  key={task.deadline ?? "none"}
                  defaultValue={task.deadline === undefined ? "" : toDateInputValue(task.deadline)}
                  onBlur={(event) => {
                    const deadline = event.target.value === "" ? undefined : parseLocalDateTime(event.target.value) + project.defaultFinishTime;
                    if (deadline !== task.deadline) patch("set-deadline", { deadline });
                  }}
                />
              )}
            </Field>
            <Field label={t("field.calendar")}>
              {() =>
                select(
                  task.calendarId ?? NONE,
                  (value) => patch("set-calendar", { calendarId: value === NONE ? undefined : value }),
                  [{ value: NONE, label: t("dialog.none") }, ...project.calendars.map((calendar) => ({ value: calendar.id, label: calendar.name }))],
                  t("field.calendar"),
                )
              }
            </Field>
            <Field label={t("field.taskType")}>
              {() =>
                select(
                  task.type,
                  (value) => patch("set-task-type", { type: value as TaskType }),
                  TASK_TYPES.map((type) => ({ value: type, label: t(`taskType.${type}`) })),
                  t("field.taskType"),
                )
              }
            </Field>
            <Toggle label={t("field.effortDriven")} checked={task.effortDriven === true} onChange={(checked) => patch("set-effort-driven", { effortDriven: checked })} />
            <Field label={t("field.color")}>
              {(id) => (
                <div className="flex items-center gap-2">
                  <input
                    id={id}
                    type="color"
                    className="h-9 w-14 rounded-md border bg-background p-1"
                    value={task.color ?? "#2563eb"}
                    onChange={(event) => patch("set-color", { color: event.target.value })}
                  />
                  <Button type="button" variant="ghost" size="sm" disabled={task.color === undefined} onClick={() => patch("set-color", { color: undefined })}>
                    {t("dialog.remove")}
                  </Button>
                </div>
              )}
            </Field>
            <Field label={t("field.fixedCost")}>
              {(id) => (
                <ui.Input
                  id={id}
                  type="number"
                  min={0}
                  key={task.fixedCost ?? "none"}
                  defaultValue={task.fixedCost ?? ""}
                  onBlur={(event) => {
                    const fixedCost = event.target.value === "" ? undefined : Number(event.target.value);
                    if (fixedCost !== task.fixedCost) patch("set-fixed-cost", { fixedCost });
                  }}
                />
              )}
            </Field>
            {!at.summary && <TaskSplits task={task} start={at.start} />}
          </ui.TabsContent>

          <ui.TabsContent value="custom" className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
            {(project.customFields ?? []).length === 0 && <p className="col-span-2 text-sm text-muted-foreground">{t("customField.empty")}</p>}
            {(project.customFields ?? []).map((field) => {
              const value = task.custom?.[field.id];
              const set = (next: string | number | boolean | undefined): void => {
                if (next !== value) apply("set-custom-value", (p) => setCustomValue(p, task.id, field.id, next));
              };
              if (field.type === "flag") {
                return <Toggle key={field.id} label={field.name} checked={value === true} onChange={(checked) => set(checked ? true : undefined)} />;
              }
              return (
                <Field key={field.id} label={field.name}>
                  {(id) => (
                    <ui.Input
                      id={id}
                      key={String(value ?? "")}
                      type={field.type === "text" ? "text" : field.type}
                      defaultValue={value === undefined ? "" : field.type === "date" ? toDateInputValue(value as number) : String(value)}
                      onBlur={(event) => {
                        const text = event.target.value;
                        if (text === "") set(undefined);
                        else if (field.type === "number") set(Number(text));
                        else if (field.type === "date") set(parseLocalDateTime(text));
                        else set(text);
                      }}
                    />
                  )}
                </Field>
              );
            })}
          </ui.TabsContent>

          <ui.TabsContent value="notes" className="pt-2">
            <ui.Textarea
              key={task.notes ?? ""}
              aria-label={t("dialog.notes")}
              rows={8}
              defaultValue={task.notes ?? ""}
              onBlur={(event) => (event.target.value || undefined) !== task.notes && patch("set-notes", { notes: event.target.value || undefined })}
            />
          </ui.TabsContent>
        </ui.Tabs>
        </fieldset>
        <ui.DialogFooter>
          <Button variant="outline" onClick={closeTaskDialog}>
            {t("dialog.close")}
          </Button>
        </ui.DialogFooter>
      </ui.DialogContent>
    </ui.Dialog>
  );
}
