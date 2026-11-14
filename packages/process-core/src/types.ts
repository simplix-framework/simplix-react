/** Identifier of a lane, a section, a step, an act or a jump. Unique within its own kind. */
export type Id = string;

/** One column of the procedure: a role, a department or a system that performs acts. */
export interface Lane {
  id: Id;
  label: string;
  /** Name of the group the lane is drawn under. Lanes sharing a name stand side by side. */
  group?: string;
}

/**
 * A condition over named facts. A fact is a boolean the caller supplies for one case of the
 * procedure (a kind of work, a kind of contract); a fact the caller leaves out is unknown.
 */
export type Condition =
  | { fact: string }
  | { not: Condition }
  | { all: Condition[] }
  | { any: Condition[] };

/** One thing one lane (or several lanes together) does inside a step. */
export interface Act {
  id: Id;
  /** The lanes that perform it. More than one means they perform it together; the first is where the flow enters and leaves. */
  lanes: Id[];
  /** `do` performs the work, `check` confirms or approves what was done. */
  kind: "do" | "check";
  label: string;
  condition?: Condition;
  /** The condition in the reader's words, shown where the act is left out or conditional. */
  conditionLabel?: string;
  /** Opaque to this package. Handed back when the act is selected. */
  ref?: string;
}

/** One step of the procedure: an ordered run of acts. */
export interface Step {
  id: Id;
  label: string;
  /** In the order they are performed. */
  acts: Act[];
  condition?: Condition;
  /** The condition in the reader's words, shown where the step is left out or conditional. */
  conditionLabel?: string;
  /** Neighbouring steps that share this key proceed together; the step after them waits for all of them. */
  parallel?: string;
  /** The step is performed again and again until the step named here is performed. */
  repeat?: { endedBy: Id };
  note?: string;
}

/** A named run of steps. */
export interface Section {
  id: Id;
  label: string;
  steps: Step[];
}

/**
 * A move out of the stated order: back to an earlier step, ahead to a later one, or out to
 * another procedure. Exactly one of `to` and `external` is set.
 */
export interface Jump {
  id: Id;
  from: Id;
  /** The step it arrives at. */
  to?: Id;
  /** The name of the procedure it leaves for. */
  external?: string;
  label: string;
}

/** The name every stored definition carries in `format`. */
export const PROCESS_FORMAT = "simplix-process";
/** The highest `version` this package reads. */
export const PROCESS_VERSION = 1;

/**
 * A procedure. Its steps have one order: the sections as listed, and inside each the steps as
 * listed. Everything that departs from that order is a parallel key, a condition, a repeat or a jump.
 */
export interface ProcessDefinition {
  format: typeof PROCESS_FORMAT;
  version: number;
  id: Id;
  name: string;
  lanes: Lane[];
  sections: Section[];
  jumps: Jump[];
}

/** The facts of one case, by name. A name left out is unknown. */
export type Facts = Readonly<Record<string, boolean>>;

/** Where a step or an act of a running case stands. */
export type RunStatus = "done" | "active" | "pending" | "skipped";

/** How one step or act of a running case stands, and who holds it. */
export interface RunMark {
  status: RunStatus;
  /** Who it is waiting on or who did it, in the reader's words. */
  assignee?: string;
  /** How many times a repeating step has been recorded. */
  count?: number;
}

/** The progress of one running case, separate from the definition it follows. */
export interface ProcessRunState {
  steps: Readonly<Record<Id, RunMark>>;
  acts?: Readonly<Record<Id, RunMark>>;
}

/** Whether a step or an act belongs to the case: its condition held, could not be decided, or failed. */
export type Inclusion = "included" | "conditional" | "excluded";

/** An act as one case sees it. */
export interface ResolvedAct {
  act: Act;
  inclusion: Inclusion;
}

/** A step as one case sees it. `number` counts every step of the definition from 1, excluded ones too. */
export interface ResolvedStep {
  step: Step;
  sectionId: Id;
  number: number;
  inclusion: Inclusion;
  acts: ResolvedAct[];
}

/** Which way a jump goes. */
export type JumpDirection = "back" | "skip" | "external";

/** A jump as one case sees it. It is `drawn` when both of its ends belong to the case. */
export interface ResolvedJump {
  jump: Jump;
  direction: JumpDirection;
  fromNumber: number;
  /** Absent on an external jump. */
  toNumber?: number;
  drawn: boolean;
}

/** A definition read for one case. */
export interface ResolvedProcess {
  definition: ProcessDefinition;
  sections: { section: Section; steps: ResolvedStep[] }[];
  /** The lanes at least one act of the case stands in, in the definition's order. */
  lanes: Lane[];
  jumps: ResolvedJump[];
}
