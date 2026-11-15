import type { Act, Id, Jump, Lane, ProcessDefinition, Section, Step } from "./types";
import { sameFlow } from "./flow";
import { validateDefinition } from "./validate";
import type { Problem, ProblemCode } from "./validate";

/**
 * Members of a part to set. A member given as `undefined` is taken off the part. Members this
 * package does not know are set like any other, so a caller keeps its own fields through the
 * same operation.
 */
export type Patch<T> = { [K in keyof T]?: T[K] | undefined } & Record<string, unknown>;

/** One change to a definition. Ids are given by the caller and never change afterwards. */
export type EditOperation =
  | { type: "rename"; name: string }
  | { type: "add-lane"; lane: Lane; at?: number }
  | { type: "update-lane"; id: Id; patch: Patch<Omit<Lane, "id">> }
  | { type: "move-lane"; id: Id; to: number }
  | { type: "remove-lane"; id: Id }
  | { type: "add-section"; section: Omit<Section, "steps"> & { steps?: Step[] }; at?: number }
  | { type: "update-section"; id: Id; patch: Patch<Omit<Section, "id" | "steps">> }
  | { type: "move-section"; id: Id; to: number }
  | { type: "remove-section"; id: Id }
  | { type: "add-step"; section: Id; step: Step; at?: number }
  | { type: "update-step"; id: Id; patch: Patch<Omit<Step, "id" | "acts" | "parallel">> }
  | { type: "move-step"; id: Id; section: Id; to: number }
  | { type: "remove-step"; id: Id }
  | { type: "set-parallel"; steps: Id[]; key?: string }
  | { type: "add-act"; step: Id; act: Act; at?: number }
  | { type: "update-act"; id: Id; patch: Patch<Omit<Act, "id">> }
  | { type: "move-act"; id: Id; to: number }
  | { type: "remove-act"; id: Id }
  | { type: "add-jump"; jump: Jump; at?: number }
  | { type: "update-jump"; id: Id; patch: Patch<Omit<Jump, "id">> }
  | { type: "remove-jump"; id: Id };

/** Why an operation was not applied: the part it names is missing, or applying it would leave a problem. */
export type RefusalCode = ProblemCode | "unknown-subject" | "lane-in-use" | "nothing-to-change" | "flow-changed";

/** How {@link applyEdit} is held. */
export interface EditOptions {
  /**
   * Applies an operation only when the procedure still does the same thing afterwards ({@link sameFlow}):
   * wording, sections, lanes and who is named for an act may change, the steps and what connects them may not.
   */
  keepFlow?: boolean;
}

/** An operation that was not applied, with what it is about. */
export interface EditRefusal {
  code: RefusalCode;
  subject: Id;
  other?: Id;
}

/** What an operation changed besides the part it names, so that a caller can tell the reader. */
export interface EditConsequence {
  kind: "jump-removed" | "repeat-cleared" | "parallel-cleared" | "parallel-joined";
  /** The jump or step it happened to. */
  id: Id;
}

/** The outcome of {@link applyEdit}. */
export type EditResult = { ok: true; definition: ProcessDefinition; consequences: EditConsequence[] } | { ok: false; refusal: EditRefusal };

function patched<T extends object>(part: T, patch: Record<string, unknown>): T {
  const next = { ...part } as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch)) {
    if (key === "id") continue;
    if (value === undefined) delete next[key];
    else next[key] = value;
  }
  return next as T;
}

function placed<T>(list: readonly T[], item: T, at: number | undefined): T[] {
  const index = at === undefined ? list.length : Math.max(0, Math.min(list.length, at));
  return [...list.slice(0, index), item, ...list.slice(index)];
}

function moved<T>(list: readonly T[], from: number, to: number): T[] {
  const rest = [...list.slice(0, from), ...list.slice(from + 1)];
  return placed(rest, list[from], to);
}

function withSteps(definition: ProcessDefinition, change: (step: Step) => Step): ProcessDefinition {
  return { ...definition, sections: definition.sections.map((section) => ({ ...section, steps: section.steps.map(change) })) };
}

function without<T extends object, K extends string>(part: T, key: K): T {
  const next = { ...part } as Record<string, unknown>;
  delete next[key];
  return next as T;
}

/**
 * Puts the parallel keys and the references to steps in order after steps were added, moved or
 * taken out: with `join`, a step standing between two steps of one run joins it; a run left with
 * one step loses its key and a run broken apart keeps its first part, a repeat whose ending step is gone is cleared, and a jump from or
 * to a step that is gone is removed.
 */
function settle(definition: ProcessDefinition, consequences: EditConsequence[], join: boolean): ProcessDefinition {
  let sections = definition.sections.map((section) => {
    const steps = section.steps.map((step, index) => {
      const before = section.steps[index - 1]?.parallel;
      const after = section.steps[index + 1]?.parallel;
      if (join && before !== undefined && before === after && step.parallel !== before) {
        consequences.push({ kind: "parallel-joined", id: step.id });
        return { ...step, parallel: before };
      }
      return step;
    });
    return { ...section, steps };
  });

  // A key keeps the first unbroken run of two or more steps that carry it, inside one section.
  const kept = new Set<Id>();
  const seen = new Set<string>();
  for (const section of sections) {
    let index = 0;
    while (index < section.steps.length) {
      const key = section.steps[index].parallel;
      let end = index + 1;
      while (key !== undefined && end < section.steps.length && section.steps[end].parallel === key) end += 1;
      if (key !== undefined && end - index >= 2 && !seen.has(key)) {
        seen.add(key);
        for (let at = index; at < end; at += 1) kept.add(section.steps[at].id);
      }
      index = end;
    }
  }
  sections = sections.map((section) => ({
    ...section,
    steps: section.steps.map((step) => {
      if (step.parallel === undefined || kept.has(step.id)) return step;
      consequences.push({ kind: "parallel-cleared", id: step.id });
      return without(step, "parallel");
    }),
  }));

  const ids = new Set(sections.flatMap((section) => section.steps.map((step) => step.id)));
  sections = sections.map((section) => ({
    ...section,
    steps: section.steps.map((step) => {
      if (step.repeat === undefined || ids.has(step.repeat.endedBy)) return step;
      consequences.push({ kind: "repeat-cleared", id: step.id });
      return without(step, "repeat");
    }),
  }));
  const jumps = definition.jumps.filter((jump) => {
    const stays = ids.has(jump.from) && (jump.to === undefined || ids.has(jump.to));
    if (!stays) consequences.push({ kind: "jump-removed", id: jump.id });
    return stays;
  });
  return { ...definition, sections, jumps };
}

const keyOf = (problem: Problem): string => `${problem.code}\u0000${problem.subject}\u0000${problem.other ?? ""}`;

type Raw = { definition: ProcessDefinition; settle?: "join" | "tidy"; key?: string } | EditRefusal;

function missing(subject: Id): EditRefusal {
  return { code: "unknown-subject", subject };
}

function change(definition: ProcessDefinition, operation: EditOperation): Raw {
  const steps = definition.sections.flatMap((section) => section.steps);
  switch (operation.type) {
    case "rename":
      return { definition: { ...definition, name: operation.name } };
    case "add-lane":
      return { definition: { ...definition, lanes: placed(definition.lanes, operation.lane, operation.at) } };
    case "update-lane": {
      if (!definition.lanes.some((lane) => lane.id === operation.id)) return missing(operation.id);
      return { definition: { ...definition, lanes: definition.lanes.map((lane) => (lane.id === operation.id ? patched(lane, operation.patch) : lane)) } };
    }
    case "move-lane": {
      const from = definition.lanes.findIndex((lane) => lane.id === operation.id);
      if (from < 0) return missing(operation.id);
      return { definition: { ...definition, lanes: moved(definition.lanes, from, operation.to) } };
    }
    case "remove-lane": {
      if (!definition.lanes.some((lane) => lane.id === operation.id)) return missing(operation.id);
      const user = steps.flatMap((step) => step.acts).find((act) => act.lanes.includes(operation.id));
      if (user !== undefined) return { code: "lane-in-use", subject: operation.id, other: user.id };
      return { definition: { ...definition, lanes: definition.lanes.filter((lane) => lane.id !== operation.id) } };
    }
    case "add-section":
      return { definition: { ...definition, sections: placed(definition.sections, { ...operation.section, steps: operation.section.steps ?? [] }, operation.at) }, settle: "join" };
    case "update-section": {
      if (!definition.sections.some((section) => section.id === operation.id)) return missing(operation.id);
      return { definition: { ...definition, sections: definition.sections.map((section) => (section.id === operation.id ? patched(section, without(operation.patch, "steps")) : section)) } };
    }
    case "move-section": {
      const from = definition.sections.findIndex((section) => section.id === operation.id);
      if (from < 0) return missing(operation.id);
      return { definition: { ...definition, sections: moved(definition.sections, from, operation.to) }, settle: "join" };
    }
    case "remove-section": {
      if (!definition.sections.some((section) => section.id === operation.id)) return missing(operation.id);
      return { definition: { ...definition, sections: definition.sections.filter((section) => section.id !== operation.id) }, settle: "join" };
    }
    case "add-step": {
      if (!definition.sections.some((section) => section.id === operation.section)) return missing(operation.section);
      const sections = definition.sections.map((section) => (section.id === operation.section ? { ...section, steps: placed(section.steps, operation.step, operation.at) } : section));
      return { definition: { ...definition, sections }, settle: "join" };
    }
    case "update-step": {
      if (!steps.some((step) => step.id === operation.id)) return missing(operation.id);
      const patch = without(without(operation.patch, "acts"), "parallel");
      return { definition: withSteps(definition, (step) => (step.id === operation.id ? patched(step, patch) : step)) };
    }
    case "move-step": {
      const step = steps.find((one) => one.id === operation.id);
      if (step === undefined) return missing(operation.id);
      if (!definition.sections.some((section) => section.id === operation.section)) return missing(operation.section);
      const sections = definition.sections.map((section) => {
        const rest = section.steps.filter((one) => one.id !== operation.id);
        return { ...section, steps: section.id === operation.section ? placed(rest, step, operation.to) : rest };
      });
      return { definition: { ...definition, sections }, settle: "join" };
    }
    case "remove-step": {
      if (!steps.some((step) => step.id === operation.id)) return missing(operation.id);
      const sections = definition.sections.map((section) => ({ ...section, steps: section.steps.filter((step) => step.id !== operation.id) }));
      return { definition: { ...definition, sections }, settle: "join" };
    }
    case "set-parallel": {
      const unknown = operation.steps.find((id) => !steps.some((step) => step.id === id));
      if (unknown !== undefined) return missing(unknown);
      const chosen = new Set(operation.steps);
      const next = withSteps(definition, (step) => {
        if (!chosen.has(step.id)) return step;
        return operation.key === undefined ? without(step, "parallel") : { ...step, parallel: operation.key };
      });
      return { definition: next, settle: "tidy", key: operation.key };
    }
    case "add-act": {
      if (!steps.some((step) => step.id === operation.step)) return missing(operation.step);
      return { definition: withSteps(definition, (step) => (step.id === operation.step ? { ...step, acts: placed(step.acts, operation.act, operation.at) } : step)) };
    }
    case "update-act": {
      if (!steps.some((step) => step.acts.some((act) => act.id === operation.id))) return missing(operation.id);
      return { definition: withSteps(definition, (step) => ({ ...step, acts: step.acts.map((act) => (act.id === operation.id ? patched(act, operation.patch) : act)) })) };
    }
    case "move-act": {
      const owner = steps.find((step) => step.acts.some((act) => act.id === operation.id));
      if (owner === undefined) return missing(operation.id);
      const from = owner.acts.findIndex((act) => act.id === operation.id);
      return { definition: withSteps(definition, (step) => (step.id === owner.id ? { ...step, acts: moved(step.acts, from, operation.to) } : step)) };
    }
    case "remove-act": {
      if (!steps.some((step) => step.acts.some((act) => act.id === operation.id))) return missing(operation.id);
      return { definition: withSteps(definition, (step) => ({ ...step, acts: step.acts.filter((act) => act.id !== operation.id) })) };
    }
    case "add-jump":
      return { definition: { ...definition, jumps: placed(definition.jumps, operation.jump, operation.at) } };
    case "update-jump": {
      if (!definition.jumps.some((jump) => jump.id === operation.id)) return missing(operation.id);
      return { definition: { ...definition, jumps: definition.jumps.map((jump) => (jump.id === operation.id ? patched(jump, operation.patch) : jump)) } };
    }
    case "remove-jump": {
      if (!definition.jumps.some((jump) => jump.id === operation.id)) return missing(operation.id);
      return { definition: { ...definition, jumps: definition.jumps.filter((jump) => jump.id !== operation.id) } };
    }
  }
}

/**
 * Applies one operation and returns a new definition; the one given is left as it is, and every
 * member no operation names is carried over, the ones this package does not know included.
 *
 * An operation is applied only when it leaves no problem {@link validateDefinition} did not
 * already report, so a definition without problems stays without them. Where steps are added,
 * moved or removed, what depends on them follows: a step put inside a parallel run joins it, a
 * run left with one step loses its key (also when `set-parallel` takes steps out of it), a repeat whose ending step is gone is cleared and a jump
 * from or to a removed step is removed. Each of those is listed in `consequences`.
 *
 * With `keepFlow` an operation that changes what the procedure does is refused as `flow-changed`,
 * for a product whose flow is fixed elsewhere and whose procedures are only worded and assigned here.
 *
 * @example
 * ```ts
 * const result = applyEdit(definition, { type: "remove-step", id: "review" });
 * if (result.ok) save(result.definition);
 * else explain(result.refusal);
 * ```
 */
export function applyEdit(definition: ProcessDefinition, operation: EditOperation, options: EditOptions = {}): EditResult {
  const raw = change(definition, operation);
  if ("code" in raw) return { ok: false, refusal: raw };
  const consequences: EditConsequence[] = [];
  const known = new Set(validateDefinition(definition).map(keyOf));
  // A run named outright has to stand as it was named: it is refused, never tidied away.
  const named = raw.key === undefined ? undefined : validateDefinition(raw.definition).find((problem) => problem.subject === raw.key && !known.has(keyOf(problem)));
  if (named !== undefined) return { ok: false, refusal: { code: named.code, subject: named.subject } };
  const next = raw.settle === undefined ? raw.definition : settle(raw.definition, consequences, raw.settle === "join");
  const fresh = validateDefinition(next).find((problem) => !known.has(keyOf(problem)));
  if (fresh !== undefined) return { ok: false, refusal: fresh.other === undefined ? { code: fresh.code, subject: fresh.subject } : { code: fresh.code, subject: fresh.subject, other: fresh.other } };
  if (options.keepFlow === true && !sameFlow(definition, next)) return { ok: false, refusal: { code: "flow-changed", subject: "id" in operation ? operation.id : definition.id } };
  if (JSON.stringify(next) === JSON.stringify(definition)) return { ok: false, refusal: { code: "nothing-to-change", subject: "id" in operation ? operation.id : definition.id } };
  return { ok: true, definition: next, consequences };
}

/** An id no lane, section, step, act or jump of the definition carries: `prefix` followed by the first free number. */
export function freshId(definition: ProcessDefinition, prefix: string): Id {
  const taken = new Set<Id>([
    ...definition.lanes.map((lane) => lane.id),
    ...definition.sections.map((section) => section.id),
    ...definition.sections.flatMap((section) => section.steps.flatMap((step) => [step.id, ...step.acts.map((act) => act.id)])),
    ...definition.jumps.map((jump) => jump.id),
  ]);
  let serial = 1;
  while (taken.has(`${prefix}${serial}`)) serial += 1;
  return `${prefix}${serial}`;
}
