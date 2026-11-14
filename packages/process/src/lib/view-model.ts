import type { Act, Id, Lane, ProcessRunState, ResolvedJump, ResolvedProcess, ResolvedStep, RunMark, Section } from "@simplix-react/process-core";

/** A case with everything a component looks up by id. */
export interface ProcessView {
  process: ResolvedProcess;
  steps: ReadonlyMap<Id, ResolvedStep>;
  acts: ReadonlyMap<Id, Act>;
  jumps: ReadonlyMap<Id, ResolvedJump>;
  sections: ReadonlyMap<Id, Section>;
  lanes: ReadonlyMap<Id, Lane>;
  /** The mark of a step or an act of the running case, where there is one. */
  stepMark: (id: Id) => RunMark | undefined;
  actMark: (id: Id) => RunMark | undefined;
}

/** Indexes a case once for the components that draw it. */
export function viewOf(process: ResolvedProcess, run: ProcessRunState | undefined): ProcessView {
  const steps = new Map<Id, ResolvedStep>();
  const acts = new Map<Id, Act>();
  const sections = new Map<Id, Section>();
  for (const { section, steps: list } of process.sections) {
    sections.set(section.id, section);
    for (const step of list) {
      steps.set(step.step.id, step);
      for (const { act } of step.acts) acts.set(act.id, act);
    }
  }
  return {
    process,
    steps,
    acts,
    sections,
    jumps: new Map(process.jumps.map((jump) => [jump.jump.id, jump])),
    lanes: new Map(process.definition.lanes.map((lane) => [lane.id, lane])),
    stepMark: (id) => run?.steps[id],
    actMark: (id) => run?.acts?.[id],
  };
}

/** The lane labels of an act, in the order it names them. */
export function laneLabels(view: ProcessView, act: Act): string[] {
  return act.lanes.map((id) => view.lanes.get(id)?.label ?? id);
}

type Words = (key: string, values?: Record<string, string | number | boolean>) => string;

/** A jump as the grid writes it beside its step: its ground, an arrow, and the step it goes to. */
export function jumpWords(jump: ResolvedJump, t: Words): string {
  const number = jump.toNumber === undefined ? "" : String(jump.toNumber).padStart(2, "0");
  return t(`jump.${jump.direction}`, { label: jump.jump.label, number, name: jump.jump.external ?? "" });
}

/** A jump as a screen reader speaks it: where it goes, then on what ground. */
export function jumpSpoken(jump: ResolvedJump, t: Words): string {
  const where = t(`jumpSpoken.${jump.direction}`, { number: jump.toNumber ?? 0, name: jump.jump.external ?? "" });
  return jump.jump.label.length > 0 ? `${where}: ${jump.jump.label}` : where;
}
