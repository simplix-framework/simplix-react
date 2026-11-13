import type { Id, Project } from "../types";
import { assignFieldSlots } from "./extras";

/**
 * Something of a plan that a Microsoft Project XML document has no place for.
 *
 * - `splits`: the pauses inside split tasks; the tasks are written without them.
 * - `color`: the colours given to single tasks.
 * - `recurrence`: the rule of a recurring task; its occurrences are written as ordinary tasks.
 * - `custom-fields`: custom fields beyond the number of fields of their type that Microsoft Project offers.
 */
export type MspdiLossCode = "splits" | "color" | "recurrence" | "custom-fields";

/** One kind of data an export leaves out, with the ids of the tasks or fields it concerns. */
export interface MspdiLoss {
  code: MspdiLossCode;
  ids: Id[];
}

/**
 * Lists what `writeMspdi` leaves out of the document for this plan. With an
 * empty list everything the plan holds is in the document; a custom field
 * still comes back under Microsoft Project's id for it (`text1`, `number3`),
 * so a `custom:<id>` column stored with the old id no longer finds it.
 */
export function mspdiExportLosses(project: Project): MspdiLoss[] {
  const of = (code: MspdiLossCode, ids: Id[]): MspdiLoss[] => (ids.length > 0 ? [{ code, ids }] : []);
  const tasks = (test: (task: Project["tasks"][number]) => boolean): Id[] => project.tasks.filter(test).map((task) => task.id);
  return [
    ...of("splits", tasks((task) => (task.splits?.length ?? 0) > 0)),
    ...of("color", tasks((task) => task.color !== undefined)),
    ...of("recurrence", tasks((task) => task.recurrence !== undefined)),
    ...of("custom-fields", assignFieldSlots(project.customFields ?? []).dropped.map((field) => field.id)),
  ];
}
