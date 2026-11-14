import { PROCESS_FORMAT, PROCESS_VERSION } from "./types";
import type { ProcessDefinition } from "./types";

/** Why a stored definition was refused. */
export type FormatErrorReason = "not-json" | "not-a-definition" | "newer-version" | "shape";

/** A stored definition this package cannot read. `reason` says which way; `detail` names the member at fault for `shape`. */
export class ProcessFormatError extends Error {
  readonly reason: FormatErrorReason;
  readonly detail?: string;

  constructor(reason: FormatErrorReason, detail?: string) {
    super(detail === undefined ? `Process definition refused: ${reason}` : `Process definition refused: ${reason} (${detail})`);
    this.name = "ProcessFormatError";
    this.reason = reason;
    this.detail = detail;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(owner: Record<string, unknown>, key: string, path: string): void {
  if (typeof owner[key] !== "string") throw new ProcessFormatError("shape", `${path}.${key}`);
}

function requireList(owner: Record<string, unknown>, key: string, path: string): Record<string, unknown>[] {
  const list = owner[key];
  if (!Array.isArray(list)) throw new ProcessFormatError("shape", `${path}.${key}`);
  list.forEach((item, index) => {
    if (!isRecord(item)) throw new ProcessFormatError("shape", `${path}.${key}[${index}]`);
  });
  return list as Record<string, unknown>[];
}

/**
 * Reads a stored definition, as text or as the value parsed from it.
 *
 * Only the members this package reads are checked for their type; a member it does not know is
 * kept as it stands, so a definition written with more fields than this version reads comes back
 * out of {@link serializeDefinition} with them. A `version` above {@link PROCESS_VERSION} is
 * refused rather than read as far as it happens to parse.
 *
 * @throws ProcessFormatError when the input is not a definition this package reads.
 */
export function parseDefinition(input: string | unknown): ProcessDefinition {
  let value: unknown = input;
  if (typeof input === "string") {
    try {
      value = JSON.parse(input);
    } catch {
      throw new ProcessFormatError("not-json");
    }
  }
  if (!isRecord(value) || value.format !== PROCESS_FORMAT) throw new ProcessFormatError("not-a-definition");
  if (typeof value.version !== "number" || !Number.isInteger(value.version) || value.version < 1) throw new ProcessFormatError("shape", "version");
  if (value.version > PROCESS_VERSION) throw new ProcessFormatError("newer-version", String(value.version));

  requireString(value, "id", "definition");
  requireString(value, "name", "definition");
  requireList(value, "lanes", "definition").forEach((lane, index) => {
    requireString(lane, "id", `lanes[${index}]`);
    requireString(lane, "label", `lanes[${index}]`);
  });
  requireList(value, "sections", "definition").forEach((section, sectionIndex) => {
    const sectionPath = `sections[${sectionIndex}]`;
    requireString(section, "id", sectionPath);
    requireString(section, "label", sectionPath);
    requireList(section, "steps", sectionPath).forEach((step, stepIndex) => {
      const stepPath = `${sectionPath}.steps[${stepIndex}]`;
      requireString(step, "id", stepPath);
      requireString(step, "label", stepPath);
      requireList(step, "acts", stepPath).forEach((act, actIndex) => {
        const actPath = `${stepPath}.acts[${actIndex}]`;
        requireString(act, "id", actPath);
        requireString(act, "label", actPath);
        if (act.kind !== "do" && act.kind !== "check") throw new ProcessFormatError("shape", `${actPath}.kind`);
        if (!Array.isArray(act.lanes) || !act.lanes.every((lane) => typeof lane === "string")) throw new ProcessFormatError("shape", `${actPath}.lanes`);
      });
    });
  });
  requireList(value, "jumps", "definition").forEach((jump, index) => {
    requireString(jump, "id", `jumps[${index}]`);
    requireString(jump, "from", `jumps[${index}]`);
    requireString(jump, "label", `jumps[${index}]`);
  });
  return value as unknown as ProcessDefinition;
}

/** Writes a definition as the text {@link parseDefinition} reads back to an equal value. */
export function serializeDefinition(definition: ProcessDefinition): string {
  return JSON.stringify(definition, null, 2);
}
