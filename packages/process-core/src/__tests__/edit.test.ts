import { describe, expect, it } from "vitest";

import { diffDefinitions } from "../diff";
import { applyEdit, freshId } from "../edit";
import { flowOf, sameFlow } from "../flow";
import type { EditOperation } from "../edit";
import { commitEdit, createHistory, redoEdit, undoEdit } from "../history";
import type { ProcessDefinition, Step } from "../types";
import { validateDefinition } from "../validate";
import { generator, randomDefinition } from "./random-definitions";

/** Members no function of this package reads, put on every part so that a test can tell whether an operation kept them. */
function withForeignMembers(definition: ProcessDefinition): ProcessDefinition {
  const mark = <T extends object>(part: T, name: string): T => ({ ...part, foreign: { of: name } });
  return {
    ...mark(definition, "process"),
    lanes: definition.lanes.map((lane) => mark(lane, lane.id)),
    sections: definition.sections.map((section) => ({
      ...mark(section, section.id),
      steps: section.steps.map((step) => ({ ...mark(step, step.id), acts: step.acts.map((act) => mark(act, act.id)) })),
    })),
    jumps: definition.jumps.map((jump) => mark(jump, jump.id)),
  };
}

/** Every part by kind and id, with whether it carries the foreign member under its own name. */
function foreignOwners(definition: ProcessDefinition): Map<string, boolean> {
  const owners = new Map<string, boolean>();
  const note = (kind: string, id: string, part: object): void => void owners.set(`${kind}:${id}`, (part as { foreign?: { of: string } }).foreign?.of === (kind === "process" ? "process" : id));
  note("process", definition.id, definition);
  for (const lane of definition.lanes) note("lane", lane.id, lane);
  for (const section of definition.sections) {
    note("section", section.id, section);
    for (const step of section.steps) {
      note("step", step.id, step);
      for (const act of step.acts) note("act", act.id, act);
    }
  }
  for (const jump of definition.jumps) note("jump", jump.id, jump);
  return owners;
}

/** A random operation on the definition: mostly one that names parts it holds, sometimes one that names a part it does not. */
function randomOperation(definition: ProcessDefinition, next: () => number): EditOperation {
  const pick = (count: number): number => Math.floor(next() * count);
  const one = <T>(list: readonly T[]): T | undefined => (list.length === 0 ? undefined : list[pick(list.length)]);
  const steps = definition.sections.flatMap((section) => section.steps);
  const acts = steps.flatMap((step) => step.acts);
  const lane = one(definition.lanes)?.id ?? "none";
  const section = one(definition.sections)?.id ?? "none";
  const step = one(steps)?.id ?? "none";
  const act = one(acts)?.id ?? "none";
  const jump = one(definition.jumps)?.id ?? "none";
  const newStep = (): Step => ({ id: freshId(definition, "ns"), label: "new step", acts: [{ id: freshId(definition, "na"), lanes: [lane], kind: "do", label: "new act" }] });
  const choices: (() => EditOperation)[] = [
    () => ({ type: "rename", name: `renamed ${pick(100)}` }),
    () => ({ type: "add-lane", lane: { id: freshId(definition, "nl"), label: "new lane" }, at: pick(definition.lanes.length + 1) }),
    () => ({ type: "update-lane", id: lane, patch: { label: `lane ${pick(100)}`, group: next() < 0.5 ? "g" : undefined } }),
    () => ({ type: "move-lane", id: lane, to: pick(definition.lanes.length + 1) }),
    () => ({ type: "remove-lane", id: lane }),
    () => ({ type: "add-section", section: { id: freshId(definition, "nsec"), label: "new section" }, at: pick(definition.sections.length + 1) }),
    () => ({ type: "update-section", id: section, patch: { label: `section ${pick(100)}` } }),
    () => ({ type: "move-section", id: section, to: pick(definition.sections.length + 1) }),
    () => ({ type: "remove-section", id: section }),
    () => ({ type: "add-step", section, step: newStep(), at: pick(7) }),
    () => ({ type: "update-step", id: step, patch: { label: `step ${pick(100)}`, note: next() < 0.5 ? "note" : undefined, repeat: next() < 0.3 ? { endedBy: one(steps)?.id ?? "none" } : undefined } }),
    () => ({ type: "move-step", id: step, section, to: pick(7) }),
    () => ({ type: "move-step", id: step, section, to: pick(7) }),
    () => ({ type: "remove-step", id: step }),
    () => ({ type: "remove-step", id: step }),
    () => ({ type: "set-parallel", steps: [step, one(steps)?.id ?? "none"], key: next() < 0.6 ? `p${pick(3)}` : undefined }),
    () => ({ type: "add-act", step, act: { id: freshId(definition, "na"), lanes: [lane], kind: "check", label: "new act" }, at: pick(5) }),
    () => ({ type: "update-act", id: act, patch: { label: `act ${pick(100)}`, lanes: next() < 0.3 ? [lane, lane] : [lane] } }),
    () => ({ type: "move-act", id: act, to: pick(5) }),
    () => ({ type: "remove-act", id: act }),
    () => ({ type: "add-jump", jump: { id: next() < 0.1 ? jump : freshId(definition, "nj"), from: step, to: one(steps)?.id ?? "none", label: "new jump" } }),
    () => ({ type: "update-jump", id: jump, patch: next() < 0.5 ? { to: one(steps)?.id, external: undefined } : { to: undefined, external: "elsewhere" } }),
    () => ({ type: "remove-jump", id: jump }),
    () => ({ type: "remove-step", id: "no-such-step" }),
  ];
  return choices[pick(choices.length)]();
}

describe("applyEdit", () => {
  it("keeps a definition without problems without problems, keeps members it does not know, and undoes to the same definition", () => {
    let applied = 0;
    let refused = 0;
    const kinds = new Set<string>();
    for (let seed = 1; seed <= 300; seed += 1) {
      const next = generator(seed);
      let history = createHistory(withForeignMembers(randomDefinition(next)));
      expect(validateDefinition(history.present)).toEqual([]);
      for (let turn = 0; turn < 25; turn += 1) {
        const before = history.present;
        const frozen = JSON.stringify(before);
        const operation = randomOperation(before, next);
        const result = applyEdit(before, operation);
        expect(JSON.stringify(before), "the definition given is left as it is").toBe(frozen);
        if (!result.ok) {
          refused += 1;
          continue;
        }
        applied += 1;
        kinds.add(operation.type);
        expect(validateDefinition(result.definition), `seed ${seed} turn ${turn} ${JSON.stringify(operation)}`).toEqual([]);
        // Every part still there carries the foreign member it carried before.
        const carried = foreignOwners(before);
        for (const [part, has] of foreignOwners(result.definition)) if (carried.has(part)) expect(has, `seed ${seed} turn ${turn} ${part} ${JSON.stringify(operation)}`).toBe(carried.get(part));
        history = commitEdit(history, result.definition, operation.type);
        expect(JSON.stringify(undoEdit(history).present)).toBe(frozen);
        expect(redoEdit(undoEdit(history)).present).toBe(result.definition);
      }
    }
    expect(applied).toBeGreaterThan(2000);
    expect(refused).toBeGreaterThan(200);
    // Every kind of operation was applied at least once, so none passes for never having run.
    expect([...kinds].sort()).toEqual(["add-act", "add-jump", "add-lane", "add-section", "add-step", "move-act", "move-lane", "move-section", "move-step", "remove-act", "remove-jump", "remove-lane", "remove-section", "remove-step", "rename", "set-parallel", "update-act", "update-jump", "update-lane", "update-section", "update-step"]);
  });

  const lanes = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
  const step = (id: string, extra: Partial<Step> = {}): Step => ({ id, label: id, acts: [{ id: `${id}-1`, lanes: ["a"], kind: "do", label: "do" }], ...extra });
  const base: ProcessDefinition = {
    format: "simplix-process",
    version: 1,
    id: "p",
    name: "P",
    lanes,
    sections: [
      { id: "one", label: "One", steps: [step("s1", { repeat: { endedBy: "s4" } }), step("s2", { parallel: "k" }), step("s3", { parallel: "k" }), step("s4")] },
      { id: "two", label: "Two", steps: [step("s5")] },
    ],
    jumps: [{ id: "j1", from: "s4", to: "s2", label: "back" }, { id: "j2", from: "s5", external: "other", label: "out" }],
  };

  it("removing a step removes its jumps, clears the repeat it ended and the parallel run it left single", () => {
    const first = applyEdit(base, { type: "remove-step", id: "s2" });
    expect(first.ok && first.consequences).toEqual([{ kind: "parallel-cleared", id: "s3" }, { kind: "jump-removed", id: "j1" }]);
    const second = applyEdit(base, { type: "remove-step", id: "s4" });
    expect(second.ok && second.consequences).toEqual([{ kind: "repeat-cleared", id: "s1" }, { kind: "jump-removed", id: "j1" }]);
  });

  it("a step put inside a parallel run joins it", () => {
    const result = applyEdit(base, { type: "move-step", id: "s5", section: "one", to: 2 });
    expect(result.ok && result.consequences).toEqual([{ kind: "parallel-joined", id: "s5" }]);
    expect(result.ok && result.definition.sections[0].steps.map((one) => one.parallel)).toEqual([undefined, "k", "k", "k", undefined]);
  });

  it("refuses with the reason", () => {
    const refusal = (operation: EditOperation): unknown => {
      const result = applyEdit(base, operation);
      return result.ok ? "applied" : result.refusal;
    };
    expect(refusal({ type: "remove-lane", id: "a" })).toEqual({ code: "lane-in-use", subject: "a", other: "s1-1" });
    expect(refusal({ type: "remove-act", id: "s1-1" })).toEqual({ code: "step-without-acts", subject: "s1" });
    expect(refusal({ type: "move-step", id: "s4", section: "one", to: 0 })).toEqual({ code: "repeat-end-not-after", subject: "s1", other: "s4" });
    expect(refusal({ type: "set-parallel", steps: ["s5"], key: "x" })).toEqual({ code: "parallel-single", subject: "x" });
    expect(refusal({ type: "set-parallel", steps: ["s1", "s4"], key: "x" })).toEqual({ code: "parallel-not-adjacent", subject: "x" });
    expect(refusal({ type: "add-lane", lane: { id: "a", label: "again" } })).toEqual({ code: "duplicate-lane", subject: "a" });
    expect(refusal({ type: "update-act", id: "s1-1", patch: { lanes: ["z"] } })).toEqual({ code: "unknown-lane", subject: "s1-1", other: "z" });
    expect(refusal({ type: "add-jump", jump: { id: "j3", from: "s1", to: "s1", label: "self" } })).toEqual({ code: "jump-to-self", subject: "j3", other: "s1" });
    expect(refusal({ type: "remove-step", id: "nope" })).toEqual({ code: "unknown-subject", subject: "nope" });
    expect(refusal({ type: "update-step", id: "s1", patch: { label: "s1" } })).toEqual({ code: "nothing-to-change", subject: "s1" });
    expect(refusal({ type: "remove-lane", id: "b" })).toBe("applied");
  });

  it("taking a step out of a parallel run leaves the rest in order", () => {
    const three = applyEdit(base, { type: "move-step", id: "s5", section: "one", to: 2 });
    if (!three.ok) throw new Error("not applied");
    // Out of the middle: the first part is one step and loses its key with it; the step stays out.
    const middle = applyEdit(three.definition, { type: "set-parallel", steps: ["s5"] });
    expect(middle.ok && middle.definition.sections[0].steps.map((one) => one.parallel)).toEqual([undefined, undefined, undefined, undefined, undefined]);
    // The rest of the run named as a run of its own.
    const split = applyEdit(three.definition, { type: "set-parallel", steps: ["s5", "s3"], key: "m" });
    expect(split.ok && split.definition.sections[0].steps.map((one) => one.parallel)).toEqual([undefined, undefined, "m", "m", undefined]);
    expect(split.ok && split.consequences).toEqual([{ kind: "parallel-cleared", id: "s2" }]);
  });

  it("a patch member given as undefined is taken off the part, and a caller's own member is set", () => {
    const result = applyEdit(base, { type: "update-step", id: "s1", patch: { repeat: undefined, due: "P3D" } });
    expect(result.ok && result.definition.sections[0].steps[0]).toEqual({ id: "s1", label: "s1", acts: base.sections[0].steps[0].acts, due: "P3D" });
  });
});

describe("diffDefinitions", () => {
  it("finds nothing between a definition and itself", () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const definition = randomDefinition(generator(seed));
      expect(diffDefinitions(definition, JSON.parse(JSON.stringify(definition)) as ProcessDefinition)).toEqual([]);
    }
  });

  it("reports each applied operation as the difference it makes", () => {
    const lanes = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
    const step = (id: string): Step => ({ id, label: id, acts: [{ id: `${id}-1`, lanes: ["a"], kind: "do", label: "do" }, { id: `${id}-2`, lanes: ["b"], kind: "check", label: "check" }] });
    const before: ProcessDefinition = { format: "simplix-process", version: 1, id: "p", name: "P", lanes, sections: [{ id: "one", label: "One", steps: [step("s1"), step("s2"), step("s3")] }, { id: "two", label: "Two", steps: [step("s4")] }], jumps: [{ id: "j1", from: "s3", to: "s1", label: "back" }] };
    const after = (operation: EditOperation): ProcessDefinition => {
      const result = applyEdit(before, operation);
      if (!result.ok) throw new Error(JSON.stringify(result.refusal));
      return result.definition;
    };
    expect(diffDefinitions(before, after({ type: "rename", name: "Q" }))).toEqual([{ kind: "changed", subject: "process", id: "p", fields: ["name"] }]);
    expect(diffDefinitions(before, after({ type: "add-lane", lane: { id: "c", label: "C" }, at: 0 }))).toEqual([{ kind: "added", subject: "lane", id: "c" }]);
    expect(diffDefinitions(before, after({ type: "move-lane", id: "b", to: 0 }))).toEqual([{ kind: "moved", subject: "lane", id: "a" }]);
    expect(diffDefinitions(before, after({ type: "update-step", id: "s2", patch: { note: "n", due: "P1D" } }))).toEqual([{ kind: "changed", subject: "step", id: "s2", fields: ["note", "due"] }]);
    expect(diffDefinitions(before, after({ type: "move-step", id: "s1", section: "one", to: 2 }))).toEqual([{ kind: "moved", subject: "step", id: "s1" }]);
    expect(diffDefinitions(before, after({ type: "move-step", id: "s3", section: "two", to: 0 }))).toEqual([{ kind: "moved", subject: "step", id: "s3" }]);
    expect(diffDefinitions(before, after({ type: "move-act", id: "s1-2", to: 0 }))).toEqual([{ kind: "moved", subject: "act", id: "s1-1" }]);
    expect(diffDefinitions(before, after({ type: "remove-step", id: "s1" }))).toEqual([
      { kind: "removed", subject: "step", id: "s1" },
      { kind: "removed", subject: "act", id: "s1-1" },
      { kind: "removed", subject: "act", id: "s1-2" },
      { kind: "removed", subject: "jump", id: "j1" },
    ]);
    expect(diffDefinitions(before, after({ type: "update-jump", id: "j1", patch: { to: "s2" } }))).toEqual([{ kind: "changed", subject: "jump", id: "j1", fields: ["to"] }]);
  });
});

describe("keepFlow", () => {
  /** What a random definition does, spelled out apart from flowOf: an operation that is let through may not change any of it. */
  const doing = (definition: ProcessDefinition): unknown => {
    const steps = definition.sections.flatMap((section) => section.steps);
    const runs = steps.map((step) => (step.parallel === undefined ? -1 : steps.findIndex((other) => other.parallel === step.parallel)));
    return {
      order: steps.map((step) => step.id),
      acts: steps.map((step) => step.acts.map((act) => [act.id, act.kind, act.lanes.length, act.condition ?? null])),
      conditions: steps.map((step) => step.condition ?? null),
      runs,
      repeats: steps.map((step) => step.repeat?.endedBy ?? null),
      reworks: steps.map((step) => step.rework !== undefined),
      jumps: [...definition.jumps].sort((x, y) => (x.id < y.id ? -1 : 1)).map((jump) => [jump.id, jump.from, jump.to ?? null, jump.external ?? null]),
    };
  };

  it("lets through only operations that leave what the procedure does as it was", () => {
    let applied = 0;
    let refused = 0;
    const kinds = new Set<string>();
    for (let seed = 1; seed <= 300; seed += 1) {
      const next = generator(seed);
      let definition = randomDefinition(next);
      for (let turn = 0; turn < 25; turn += 1) {
        const operation = randomOperation(definition, next);
        const free = applyEdit(definition, operation);
        const held = applyEdit(definition, operation, { keepFlow: true });
        if (held.ok) {
          applied += 1;
          kinds.add(operation.type);
          expect(doing(held.definition), `seed ${seed} turn ${turn} ${JSON.stringify(operation)}`).toEqual(doing(definition));
          definition = held.definition;
        } else if (free.ok) {
          refused += 1;
          expect(held.refusal.code).toBe("flow-changed");
          expect(doing(free.definition), `seed ${seed} turn ${turn} ${JSON.stringify(operation)}`).not.toEqual(doing(definition));
        }
      }
    }
    expect(applied).toBeGreaterThan(1000);
    expect(refused).toBeGreaterThan(500);
    // Wording, lanes and who is named for an act go through; what makes or unmakes a step, an act or a jump never does.
    for (const kind of ["rename", "update-lane", "move-lane", "add-lane", "update-section", "update-act", "update-step"]) expect(kinds, kind).toContain(kind);
    for (const kind of ["add-step", "remove-step", "add-act", "remove-act", "add-jump", "remove-jump", "move-act"]) expect(kinds, kind).not.toContain(kind);
  });

  it("tells a parallel run by its steps, not by its key", () => {
    const one = randomDefinition(generator(7));
    const renamed: ProcessDefinition = { ...one, sections: one.sections.map((section) => ({ ...section, steps: section.steps.map((step) => (step.parallel === undefined ? step : { ...step, parallel: `renamed-${step.parallel}` })) })) };
    expect(sameFlow(one, renamed)).toBe(true);
    expect(flowOf(one)).toBe(flowOf(renamed));
  });
});
