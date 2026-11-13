import {
  MINUTES_PER_DAY,
  addCustomField,
  removeCustomField,
  renameCustomField,
  dayIndexOf,
  formatLocalDate,
  formatWorkingRanges,
  parseLocalDateTime,
  parseWorkingRanges,
  nextId,
  putCalendar,
  removeCalendar,
  standardCalendar,
  updateProject,
} from "@simplix-react/gantt-core";
import type { CalendarException, CustomFieldType, WorkCalendar } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";
import { Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { toDateInputValue } from "../lib/format";
import { useGanttTranslation } from "../lib/use-gantt-translation";

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;
const FIELD_TYPES: readonly CustomFieldType[] = ["text", "number", "date", "flag"];

/** The name of a weekday, Sunday first. 1970-01-04 was a Sunday. */
function weekdayName(weekday: number, language: string): string {
  return new Intl.DateTimeFormat(language, { weekday: "long", timeZone: "UTC" }).format(new Date((3 + weekday) * 86_400_000));
}

/**
 * The project information dialog: the plan's name, dates, status date and
 * calendar, and the working time and exception days of every calendar. Each
 * change is one undo step.
 */
export function ProjectDialog() {
  const { t, language } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const store = useGanttStore();
  const open = useGantt((state) => state.projectDialogOpen);
  const project = useGantt((state) => state.history.present);
  const [calendarId, setCalendarId] = useState(project.calendarId);
  if (!open) return null;

  const { apply, closeProjectDialog } = store.getState();
  const calendar = project.calendars.find((candidate) => candidate.id === calendarId) ?? project.calendars[0];
  const saveCalendar = (next: WorkCalendar): void => {
    apply("edit-calendar", (p) => putCalendar(p, next));
  };
  const setException = (index: number, change: Partial<CalendarException>): void => {
    const exceptions = (calendar.exceptions ?? []).map((exception, i) => (i === index ? { ...exception, ...change } : exception));
    saveCalendar({ ...calendar, exceptions });
  };
  const dateOf = (value: string, timeOfDay: number): number => parseLocalDateTime(value) + timeOfDay;

  return (
    <ui.Dialog open onOpenChange={(next) => !next && closeProjectDialog()}>
      <ui.DialogContent className="max-w-2xl">
        <ui.DialogHeader>
          <ui.DialogTitle>{t("toolbar.projectInformation")}</ui.DialogTitle>
          <ui.DialogDescription>{project.name}</ui.DialogDescription>
        </ui.DialogHeader>
        <ui.Tabs defaultValue="settings">
          <ui.TabsList>
            <ui.TabsTrigger value="settings">{t("project.settings")}</ui.TabsTrigger>
            <ui.TabsTrigger value="calendars">{t("project.calendars")}</ui.TabsTrigger>
            <ui.TabsTrigger value="fields">{t("project.customFields")}</ui.TabsTrigger>
          </ui.TabsList>

          <ui.TabsContent value="settings" className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
            <Field label={t("project.name")} wide>
              {(id) => (
                <ui.Input
                  id={id}
                  key={project.name}
                  defaultValue={project.name}
                  onBlur={(event) =>
                    event.target.value !== project.name && apply("edit-project", (p) => updateProject(p, { name: event.target.value }))
                  }
                />
              )}
            </Field>
            <Field label={t("project.scheduleFrom")}>
              {() => (
                <ui.Select
                  value={project.scheduleFrom}
                  onValueChange={(value) =>
                    apply("edit-project", (p, s) =>
                      // Turning the plan around keeps the end it had: the other end becomes the anchor.
                      updateProject(p, value === "finish" ? { scheduleFrom: "finish", finish: p.finish ?? s.finish } : { scheduleFrom: "start" }),
                    )
                  }
                >
                  <ui.SelectTrigger aria-label={t("project.scheduleFrom")} className="w-full">
                    <ui.SelectValue />
                  </ui.SelectTrigger>
                  <ui.SelectContent>
                    <ui.SelectItem value="start">{t("project.fromStart")}</ui.SelectItem>
                    <ui.SelectItem value="finish">{t("project.fromFinish")}</ui.SelectItem>
                  </ui.SelectContent>
                </ui.Select>
              )}
            </Field>
            <Field label={t("project.calendar")}>
              {() => (
                <ui.Select value={project.calendarId} onValueChange={(value) => apply("edit-project", (p) => updateProject(p, { calendarId: value }))}>
                  <ui.SelectTrigger aria-label={t("project.calendar")} className="w-full">
                    <ui.SelectValue />
                  </ui.SelectTrigger>
                  <ui.SelectContent>
                    {project.calendars.map((candidate) => (
                      <ui.SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name}
                      </ui.SelectItem>
                    ))}
                  </ui.SelectContent>
                </ui.Select>
              )}
            </Field>
            <Field label={t("project.start")}>
              {(id) => (
                <ui.Input
                  id={id}
                  type="date"
                  key={project.start}
                  disabled={project.scheduleFrom !== "start"}
                  defaultValue={toDateInputValue(project.start)}
                  onBlur={(event) => {
                    if (event.target.value === "") return;
                    const start = dateOf(event.target.value, project.defaultStartTime);
                    if (start !== project.start) apply("edit-project", (p) => updateProject(p, { start }));
                  }}
                />
              )}
            </Field>
            <Field label={t("project.finish")}>
              {(id) => (
                <ui.Input
                  id={id}
                  type="date"
                  key={project.finish ?? "none"}
                  disabled={project.scheduleFrom !== "finish"}
                  defaultValue={project.finish === undefined ? "" : toDateInputValue(project.finish)}
                  onBlur={(event) => {
                    if (event.target.value === "") return;
                    const finish = dateOf(event.target.value, project.defaultFinishTime);
                    if (finish !== project.finish) apply("edit-project", (p) => updateProject(p, { finish }));
                  }}
                />
              )}
            </Field>
            <Field label={t("project.statusDate")}>
              {(id) => (
                <ui.Input
                  id={id}
                  type="date"
                  key={project.statusDate ?? "none"}
                  defaultValue={project.statusDate === undefined ? "" : toDateInputValue(project.statusDate)}
                  onBlur={(event) => {
                    const statusDate = event.target.value === "" ? undefined : dateOf(event.target.value, project.defaultFinishTime);
                    if (statusDate !== project.statusDate) apply("edit-project", (p) => updateProject(p, { statusDate }));
                  }}
                />
              )}
            </Field>
          </ui.TabsContent>

          <ui.TabsContent value="calendars" className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pt-2">
            <div className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-2">
              <ui.Select value={calendar.id} onValueChange={setCalendarId}>
                <ui.SelectTrigger aria-label={t("field.calendar")} className="w-full">
                  <ui.SelectValue />
                </ui.SelectTrigger>
                <ui.SelectContent>
                  {project.calendars.map((candidate) => (
                    <ui.SelectItem key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </ui.SelectItem>
                  ))}
                </ui.SelectContent>
              </ui.Select>
              <ui.Input
                key={`${calendar.id}:${calendar.name}`}
                aria-label={t("calendar.name")}
                defaultValue={calendar.name}
                onBlur={(event) => event.target.value !== calendar.name && event.target.value !== "" && saveCalendar({ ...calendar, name: event.target.value })}
              />
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={t("calendar.add")}
                title={t("calendar.add")}
                onClick={() => {
                  const id = nextId(project.calendars);
                  if (apply("add-calendar", (p) => putCalendar(p, standardCalendar(id, t("calendar.newName"))))) setCalendarId(id);
                }}
              >
                <Plus />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={t("calendar.remove")}
                title={t("calendar.remove")}
                disabled={project.calendars.length < 2}
                onClick={() => apply("remove-calendar", (p) => removeCalendar(p, calendar.id))}
              >
                <Trash2 />
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium">{t("calendar.workingTime")}</p>
              <p className="text-xs text-muted-foreground">{t("calendar.workingTimeHint")}</p>
            </div>
            <div className="grid grid-cols-[7rem_1fr] items-center gap-x-3 gap-y-1.5">
              {WEEKDAYS.map((weekday) => {
                const ranges = calendar.weekDays[weekday];
                const text = ranges ? formatWorkingRanges(ranges) : "";
                return (
                  <WeekdayRow key={`${calendar.id}:${weekday}:${text}`} label={weekdayName(weekday, language)}>
                    {(id) => (
                      <ui.Input
                        id={id}
                        defaultValue={text}
                        placeholder={ranges === null ? t("calendar.inherited") : undefined}
                        onBlur={(event) => {
                          if (event.target.value.trim() === text) return;
                          const value = event.target.value;
                          apply("edit-calendar", (p) =>
                            putCalendar(p, { ...calendar, weekDays: calendar.weekDays.map((day, i) => (i === weekday ? parseWorkingRanges(value) : day)) }),
                          );
                        }}
                      />
                    )}
                  </WeekdayRow>
                );
              })}
            </div>
            <p className="text-sm font-medium">{t("calendar.exceptions")}</p>
            {(calendar.exceptions ?? []).map((exception, index) => {
              const hours = formatWorkingRanges(exception.ranges);
              return (
                <div
                  key={`${calendar.id}:${index}:${exception.fromDay}:${exception.toDay}:${exception.name ?? ""}:${hours}`}
                  className="grid grid-cols-[1fr_9.5rem_9.5rem_1fr_auto] items-center gap-2"
                >
                  <ui.Input
                    aria-label={t("calendar.exceptionName")}
                    defaultValue={exception.name ?? ""}
                    onBlur={(event) => event.target.value !== (exception.name ?? "") && setException(index, { name: event.target.value || undefined })}
                  />
                  <ui.Input
                    type="date"
                    aria-label={t("calendar.firstDay")}
                    defaultValue={formatLocalDate(exception.fromDay * MINUTES_PER_DAY)}
                    onBlur={(event) => {
                      if (event.target.value === "") return;
                      const fromDay = dayIndexOf(parseLocalDateTime(event.target.value));
                      if (fromDay !== exception.fromDay) setException(index, { fromDay, toDay: Math.max(fromDay, exception.toDay) });
                    }}
                  />
                  <ui.Input
                    type="date"
                    aria-label={t("calendar.lastDay")}
                    defaultValue={formatLocalDate(exception.toDay * MINUTES_PER_DAY)}
                    onBlur={(event) => {
                      if (event.target.value === "") return;
                      const toDay = dayIndexOf(parseLocalDateTime(event.target.value));
                      if (toDay !== exception.toDay) setException(index, { toDay, fromDay: Math.min(toDay, exception.fromDay) });
                    }}
                  />
                  <ui.Input
                    aria-label={t("calendar.workingTime")}
                    defaultValue={hours}
                    onBlur={(event) => {
                      if (event.target.value.trim() === hours) return;
                      const value = event.target.value;
                      apply("edit-calendar", (p) =>
                        putCalendar(p, {
                          ...calendar,
                          exceptions: (calendar.exceptions ?? []).map((other, i) => (i === index ? { ...other, ranges: parseWorkingRanges(value) } : other)),
                        }),
                      );
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("dialog.remove")}
                    onClick={() => saveCalendar({ ...calendar, exceptions: (calendar.exceptions ?? []).filter((_, i) => i !== index) })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })}
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const day = dayIndexOf(project.statusDate ?? project.start);
                  saveCalendar({
                    ...calendar,
                    exceptions: [...(calendar.exceptions ?? []), { name: t("calendar.newException"), fromDay: day, toDay: day, ranges: [] }],
                  });
                }}
              >
                <Plus />
                {t("calendar.addException")}
              </Button>
            </div>
          </ui.TabsContent>
          <ui.TabsContent value="fields" className="flex flex-col gap-2 pt-2">
            {(project.customFields ?? []).map((field) => (
              <div key={field.id} className="grid grid-cols-[1fr_9rem_auto] items-center gap-2" data-gantt-custom-field={field.id}>
                <ui.Input
                  key={field.name}
                  aria-label={t("customField.name")}
                  defaultValue={field.name}
                  onBlur={(event) =>
                    event.target.value !== field.name && event.target.value !== "" && apply("edit-custom-field", (p) => renameCustomField(p, field.id, event.target.value))
                  }
                />
                <span className="text-sm text-muted-foreground">{t(`customFieldType.${field.type}`)}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("dialog.remove")}
                  onClick={() => apply("remove-custom-field", (p) => removeCustomField(p, field.id))}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              {FIELD_TYPES.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => apply("add-custom-field", (p) => addCustomField(p, { name: t("customField.newName"), type }))}
                >
                  <Plus />
                  {`${t("customField.add")}: ${t(`customFieldType.${type}`)}`}
                </Button>
              ))}
            </div>
          </ui.TabsContent>
        </ui.Tabs>
        <ui.DialogFooter>
          <Button variant="outline" onClick={closeProjectDialog}>
            {t("dialog.close")}
          </Button>
        </ui.DialogFooter>
      </ui.DialogContent>
    </ui.Dialog>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: (id: string) => ReactNode }) {
  const ui = useFlatUIComponents();
  const id = useId();
  return (
    <div className={wide ? "col-span-2 flex flex-col gap-1.5" : "flex flex-col gap-1.5"}>
      <ui.Label htmlFor={id}>{label}</ui.Label>
      {children(id)}
    </div>
  );
}

function WeekdayRow({ label, children }: { label: string; children: (id: string) => ReactNode }) {
  const ui = useFlatUIComponents();
  const id = useId();
  return (
    <>
      <ui.Label htmlFor={id}>{label}</ui.Label>
      {children(id)}
    </>
  );
}
