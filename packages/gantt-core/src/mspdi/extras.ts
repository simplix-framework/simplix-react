import { parseLocalDateTime, formatLocalDateTime } from "../time";
import type { Minutes } from "../time";
import type { CustomField, CustomFieldType, CustomValue, Id, Resource, WorkContour } from "../types";
import { formatFlag, formatNumber, parseNumber } from "./codes";
import { childElement, childElements, childText, type XmlElement, type XmlWriter } from "./xml";

/** Start of a resource's first rate in a rate table, as Microsoft Project writes it. */
const RATES_BEGIN = "1984-01-01T00:00:00";
/** End of a resource's last rate in a rate table, as Microsoft Project writes it. */
const RATES_END = "2049-12-31T23:59:00";
/** Rate format code of a rate per hour, and of a rate per unit of a material resource. */
const RATE_PER_HOUR = "2";
const RATE_PER_UNIT = "8";

/** Money as MSPDI stores it: hundredths, as a whole number. */
export function formatMoney(value: number): string {
  return formatNumber(Math.round(value * 100));
}

/** Money from its MSPDI form, or undefined for none: an absent element or zero. */
export function parseMoney(text: string | undefined, field: string): number | undefined {
  if (text === undefined || text.trim() === "") return undefined;
  const value = parseNumber(text.trim(), field) / 100;
  return value === 0 ? undefined : value;
}

const first = (from: number, count: number): number[] => Array.from({ length: count }, (_, i) => from + i);

/**
 * FieldID of every custom task field Microsoft Project offers, by type, in
 * the order of their numbers: Text1 to Text30, Number1 to Number20, Date1 to
 * Date10 and Flag1 to Flag20.
 */
const FIELD_IDS: Record<CustomFieldType, readonly number[]> = {
  text: [188743731, 188743734, 188743737, 188743740, 188743743, 188743746, ...first(188743747, 4), ...first(188743997, 20)],
  number: [...first(188743767, 5), ...first(188743982, 15)],
  date: first(188743945, 10),
  flag: [...first(188743752, 10), ...first(188743972, 10)],
};
const FIELD_NAMES: Record<CustomFieldType, string> = { text: "Text", number: "Number", date: "Date", flag: "Flag" };

/** A custom field's place among Microsoft Project's custom task fields. */
export interface FieldSlot {
  fieldId: number;
  /** Microsoft Project's own name of the field: Text1, Number3. */
  fieldName: string;
  field: CustomField;
}

/**
 * Gives each custom field the next free Microsoft Project field of its type.
 * `dropped` lists the fields left over once a type's fields are used up.
 */
export function assignFieldSlots(fields: readonly CustomField[]): { slots: FieldSlot[]; dropped: CustomField[] } {
  const used: Record<CustomFieldType, number> = { text: 0, number: 0, date: 0, flag: 0 };
  const slots: FieldSlot[] = [];
  const dropped: CustomField[] = [];
  for (const field of fields) {
    const index = used[field.type]++;
    const fieldId = FIELD_IDS[field.type][index];
    if (fieldId === undefined) dropped.push(field);
    else slots.push({ fieldId, fieldName: `${FIELD_NAMES[field.type]}${index + 1}`, field });
  }
  return { slots, dropped };
}

/** Writes the definitions of the custom fields, with each field's own name as the alias. */
export function writeFieldDefinitions(w: XmlWriter, slots: readonly FieldSlot[]): void {
  if (slots.length === 0) return;
  w.start("ExtendedAttributes");
  for (const slot of slots) {
    w.start("ExtendedAttribute").leaf("FieldID", String(slot.fieldId)).leaf("FieldName", slot.fieldName).leaf("Alias", slot.field.name).end();
  }
  w.end();
}

/** Writes one task's custom values. */
export function writeFieldValues(w: XmlWriter, slots: readonly FieldSlot[], values: Readonly<Record<Id, CustomValue>> | undefined): void {
  if (!values) return;
  for (const slot of slots) {
    const value = values[slot.field.id];
    if (value === undefined) continue;
    const text =
      slot.field.type === "flag"
        ? formatFlag(value === true)
        : slot.field.type === "date"
          ? formatLocalDateTime(value as Minutes)
          : slot.field.type === "number"
            ? formatNumber(value as number)
            : String(value);
    w.start("ExtendedAttribute").leaf("FieldID", String(slot.fieldId)).leaf("Value", text).end();
  }
}

/** The custom task fields a document defines, by FieldID. A field without an alias keeps Microsoft Project's name. */
export function readFieldDefinitions(root: XmlElement): Map<number, CustomField> {
  const known = new Map<number, { type: CustomFieldType; name: string }>();
  for (const type of Object.keys(FIELD_IDS) as CustomFieldType[]) {
    FIELD_IDS[type].forEach((id, index) => known.set(id, { type, name: `${FIELD_NAMES[type]}${index + 1}` }));
  }
  const fields = new Map<number, CustomField>();
  for (const el of childElements(childElement(root, "ExtendedAttributes") ?? root, "ExtendedAttribute")) {
    const fieldId = Number((childText(el, "FieldID") ?? "").trim());
    const slot = known.get(fieldId);
    if (!slot) continue;
    const alias = (childText(el, "Alias") ?? "").trim();
    fields.set(fieldId, { id: slot.name.toLowerCase(), name: alias === "" ? slot.name : alias, type: slot.type });
  }
  return fields;
}

/** One task's custom values, for the fields the document defines. */
export function readFieldValues(el: XmlElement, fields: ReadonlyMap<number, CustomField>): Record<Id, CustomValue> | undefined {
  const values: Record<Id, CustomValue> = {};
  for (const attribute of childElements(el, "ExtendedAttribute")) {
    const field = fields.get(Number((childText(attribute, "FieldID") ?? "").trim()));
    const text = childText(attribute, "Value");
    if (!field || text === undefined) continue;
    if (field.type === "flag") {
      // A flag that is off is the same as no value.
      if (text.trim() === "1") values[field.id] = true;
    } else if (field.type === "number") values[field.id] = parseNumber(text.trim(), "ExtendedAttribute Value");
    else if (field.type === "date") values[field.id] = parseLocalDateTime(text.trim());
    else values[field.id] = text;
  }
  return Object.keys(values).length > 0 ? values : undefined;
}

/** WorkContour code of each way of spreading work that the model has. */
const CONTOUR_CODES: Record<WorkContour, number> = { flat: 0, "back-loaded": 1, "front-loaded": 2, bell: 6 };

export function encodeWorkContour(contour: WorkContour): number {
  return CONTOUR_CODES[contour];
}

/** The contour of a WorkContour code, or undefined for one the model has no equal of. */
export function decodeWorkContour(code: number): WorkContour | undefined {
  return (Object.keys(CONTOUR_CODES) as WorkContour[]).find((contour) => CONTOUR_CODES[contour] === code);
}

/** Writes a resource's rates and cost per use, where it sits among the resource's elements. */
export function writeResourceRates(w: XmlWriter, resource: Resource): void {
  const format = resource.type === "material" ? RATE_PER_UNIT : RATE_PER_HOUR;
  if (resource.standardRate !== undefined) w.leaf("StandardRate", formatNumber(resource.standardRate)).leaf("StandardRateFormat", format);
  if (resource.overtimeRate !== undefined) w.leaf("OvertimeRate", formatNumber(resource.overtimeRate)).leaf("OvertimeRateFormat", format);
  if (resource.costPerUse !== undefined) w.leaf("CostPerUse", formatMoney(resource.costPerUse));
}

/**
 * Writes the dated rates of a resource as its first rate table: the
 * resource's own rate until the first date, then each dated rate until the
 * next.
 */
export function writeRateTable(w: XmlWriter, resource: Resource): void {
  const dated = [...(resource.rates ?? [])].sort((a, b) => a.from - b.from);
  if (dated.length === 0) return;
  const format = resource.type === "material" ? RATE_PER_UNIT : RATE_PER_HOUR;
  const steps = [{ from: RATES_BEGIN, rate: resource.standardRate ?? 0 }, ...dated.map((rate) => ({ from: formatLocalDateTime(rate.from), rate: rate.standardRate }))];
  w.start("Rates");
  steps.forEach((step, i) => {
    w.start("Rate")
      .leaf("RatesFrom", step.from)
      .leaf("RatesTo", steps[i + 1]?.from ?? RATES_END)
      .leaf("RateTable", "0")
      .leaf("StandardRate", formatNumber(step.rate))
      .leaf("StandardRateFormat", format)
      .leaf("OvertimeRate", formatNumber(resource.overtimeRate ?? 0))
      .leaf("OvertimeRateFormat", format)
      .leaf("CostPerUse", formatMoney(resource.costPerUse ?? 0))
      .end();
  });
  w.end();
}

/** A resource's rates, cost per use and the dated rates of its first rate table. */
export function readResourceRates(el: XmlElement): Pick<Resource, "standardRate" | "overtimeRate" | "costPerUse" | "rates"> {
  const rate = (name: string): number | undefined => {
    const text = (childText(el, name) ?? "").trim();
    const value = text === "" ? 0 : parseNumber(text, name);
    return value === 0 ? undefined : value;
  };
  const dated: { from: Minutes; standardRate: number }[] = [];
  for (const entry of childElements(childElement(el, "Rates") ?? el, "Rate")) {
    const from = (childText(entry, "RatesFrom") ?? "").trim();
    if ((childText(entry, "RateTable") ?? "0").trim() !== "0" || from === "" || from <= RATES_BEGIN) continue;
    dated.push({ from: parseLocalDateTime(from), standardRate: parseNumber((childText(entry, "StandardRate") ?? "0").trim(), "StandardRate") });
  }
  const standardRate = rate("StandardRate");
  const overtimeRate = rate("OvertimeRate");
  const costPerUse = parseMoney(childText(el, "CostPerUse"), "CostPerUse");
  return {
    ...(standardRate !== undefined ? { standardRate } : {}),
    ...(overtimeRate !== undefined ? { overtimeRate } : {}),
    ...(costPerUse !== undefined ? { costPerUse } : {}),
    ...(dated.length > 0 ? { rates: dated } : {}),
  };
}
