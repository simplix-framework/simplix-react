import { formatLocalDate, parseLocalDateTime, addResource, removeResources, updateResource } from "@simplix-react/gantt-core";
import type { Resource, ResourceType } from "@simplix-react/gantt-core";
import { Button, useFlatUIComponents } from "@simplix-react/ui";
import { CalendarRange, Plus, Trash2 } from "lucide-react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { useGanttTranslation } from "../lib/use-gantt-translation";

const NONE = "__none";
const TYPES: readonly ResourceType[] = ["work", "material", "cost"];

/** The resource sheet: every resource of the plan as an editable line. Each change is one undo step. */
export function ResourceSheet() {
  const { t } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const readOnly = useGantt((state) => state.readOnly);
  const { apply } = store.getState();
  const patch = (resource: Resource, change: Partial<Omit<Resource, "id">>): void => {
    apply("edit-resource", (p) => updateResource(p, resource.id, change));
  };

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-background" data-gantt-slot="resource-sheet">
      <fieldset disabled={readOnly} className="contents">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-muted text-xs text-muted-foreground">
          <tr>
            <th className="w-12 border-b border-r px-2 py-2 text-right font-medium" />
            <th className="border-b border-r px-2 py-2 text-left font-medium">{t("resource.name")}</th>
            <th className="w-36 border-b border-r px-2 py-2 text-left font-medium">{t("resource.type")}</th>
            <th className="w-28 border-b border-r px-2 py-2 text-right font-medium">{t("resource.maxUnits")}</th>
            <th className="w-36 border-b border-r px-2 py-2 text-right font-medium">{t("resource.standardRate")}</th>
            <th className="w-36 border-b border-r px-2 py-2 text-right font-medium">{t("resource.overtimeRate")}</th>
            <th className="w-28 border-b border-r px-2 py-2 text-right font-medium">{t("resource.costPerUse")}</th>
            <th className="w-40 border-b border-r px-2 py-2 text-left font-medium">{t("resource.group")}</th>
            <th className="w-44 border-b border-r px-2 py-2 text-left font-medium">{t("field.calendar")}</th>
            <th className="w-24 border-b px-2 py-2" />
          </tr>
        </thead>
        <tbody>
          {project.resources.map((resource, index) => (
            <tr key={resource.id} data-gantt-resource={resource.id}>
              <td className="border-b border-r px-2 text-right text-xs text-muted-foreground tabular-nums">{index + 1}</td>
              <td className="border-b border-r p-1">
                <ui.Input
                  key={resource.name}
                  aria-label={t("resource.name")}
                  defaultValue={resource.name}
                  onBlur={(event) => event.target.value !== resource.name && patch(resource, { name: event.target.value })}
                />
              </td>
              <td className="border-b border-r p-1">
                <ui.Select value={resource.type} onValueChange={(value) => patch(resource, { type: value as ResourceType })}>
                  <ui.SelectTrigger aria-label={t("resource.type")} className="w-full">
                    <ui.SelectValue />
                  </ui.SelectTrigger>
                  <ui.SelectContent>
                    {TYPES.map((type) => (
                      <ui.SelectItem key={type} value={type}>
                        {t(`resourceType.${type}`)}
                      </ui.SelectItem>
                    ))}
                  </ui.SelectContent>
                </ui.Select>
              </td>
              <td className="border-b border-r p-1">
                <ui.Input
                  key={resource.maxUnits}
                  type="number"
                  min={0}
                  aria-label={t("resource.maxUnits")}
                  className="text-right"
                  disabled={resource.type !== "work"}
                  defaultValue={Math.round(resource.maxUnits * 100)}
                  onBlur={(event) => {
                    const maxUnits = Math.max(0, Number(event.target.value)) / 100;
                    if (maxUnits !== resource.maxUnits) patch(resource, { maxUnits });
                  }}
                />
              </td>
              {(["standardRate", "overtimeRate", "costPerUse"] as const).map((key) => (
                <td key={key} className="border-b border-r p-1">
                  <ui.Input
                    key={resource[key] ?? "none"}
                    type="number"
                    min={0}
                    aria-label={t(`resource.${key}`)}
                    className="text-right"
                    defaultValue={resource[key] ?? ""}
                    onBlur={(event) => {
                      const value = event.target.value === "" ? undefined : Math.max(0, Number(event.target.value));
                      if (value !== resource[key]) patch(resource, { [key]: value });
                    }}
                  />
                </td>
              ))}
              <td className="border-b border-r p-1">
                <ui.Input
                  key={resource.group ?? ""}
                  aria-label={t("resource.group")}
                  defaultValue={resource.group ?? ""}
                  onBlur={(event) => (event.target.value || undefined) !== resource.group && patch(resource, { group: event.target.value || undefined })}
                />
              </td>
              <td className="border-b border-r p-1">
                <ui.Select
                  value={resource.calendarId ?? NONE}
                  onValueChange={(value) => patch(resource, { calendarId: value === NONE ? undefined : value })}
                >
                  <ui.SelectTrigger aria-label={t("field.calendar")} className="w-full">
                    <ui.SelectValue />
                  </ui.SelectTrigger>
                  <ui.SelectContent>
                    <ui.SelectItem value={NONE}>{t("dialog.none")}</ui.SelectItem>
                    {project.calendars.map((calendar) => (
                      <ui.SelectItem key={calendar.id} value={calendar.id}>
                        {calendar.name}
                      </ui.SelectItem>
                    ))}
                  </ui.SelectContent>
                </ui.Select>
              </td>
              <td className="border-b p-1 text-center">
                <ui.Popover>
                  <ui.PopoverTrigger asChild>
                    <Button variant={resource.rates?.length ? "secondary" : "ghost"} size="icon-sm" aria-label={t("resource.rates")} title={t("resource.rates")}>
                      <CalendarRange />
                    </Button>
                  </ui.PopoverTrigger>
                  <ui.PopoverContent align="end" className="flex w-80 flex-col gap-2" data-gantt-slot="rate-table">
                    <p className="text-sm font-medium">{t("resource.rates")}</p>
                    {(resource.rates ?? []).map((rate, i) => (
                      <div key={`${rate.from}:${rate.standardRate}:${i}`} className="grid grid-cols-[1fr_6rem_auto] items-center gap-2">
                        <ui.Input
                          type="date"
                          aria-label={t("resource.rateFrom")}
                          defaultValue={formatLocalDate(rate.from)}
                          onBlur={(event) => {
                            if (event.target.value === "") return;
                            const from = parseLocalDateTime(event.target.value);
                            if (from !== rate.from) patch(resource, { rates: (resource.rates ?? []).map((other, k) => (k === i ? { ...other, from } : other)) });
                          }}
                        />
                        <ui.Input
                          type="number"
                          min={0}
                          aria-label={t("resource.standardRate")}
                          className="text-right"
                          defaultValue={rate.standardRate}
                          onBlur={(event) => {
                            const standardRate = Math.max(0, Number(event.target.value));
                            if (standardRate !== rate.standardRate) {
                              patch(resource, { rates: (resource.rates ?? []).map((other, k) => (k === i ? { ...other, standardRate } : other)) });
                            }
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t("dialog.remove")}
                          onClick={() => patch(resource, { rates: (resource.rates ?? []).filter((_, k) => k !== i) })}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        patch(resource, {
                          rates: [...(resource.rates ?? []), { from: project.statusDate ?? project.start, standardRate: resource.standardRate ?? 0 }],
                        })
                      }
                    >
                      <Plus />
                      {t("resource.addRate")}
                    </Button>
                  </ui.PopoverContent>
                </ui.Popover>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("resource.remove")}
                  title={t("resource.remove")}
                  onClick={() => apply("remove-resource", (p) => removeResources(p, [resource.id]))}
                >
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {project.resources.length === 0 && (
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium">{t("resource.empty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("resource.emptyHint")}</p>
        </div>
      )}
      <div className="p-2">
        <Button variant="outline" size="sm" onClick={() => apply("add-resource", (p) => addResource(p, { name: t("resource.newName") }))}>
          <Plus />
          {t("resource.add")}
        </Button>
      </div>
      </fieldset>
    </div>
  );
}
