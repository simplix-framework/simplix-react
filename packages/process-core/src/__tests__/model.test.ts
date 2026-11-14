import { describe, expect, it } from "vitest";

import { conditionFacts, evaluateCondition, isCondition } from "../condition";
import { parseDefinition, ProcessFormatError, serializeDefinition } from "../format";
import { chooseLayout, DEFAULT_LAYOUT_METRICS, requiredWidth } from "../layout-mode";
import { resolveProcess } from "../resolve";
import { assignTracks } from "../tracks";
import type { Condition, ProcessDefinition } from "../types";
import { validateDefinition } from "../validate";
import type { Problem, ProblemCode } from "../validate";
import storedCases from "./cases/validation.json";
import { act, definition, equipmentInspection, fact, jump, lane, purchaseRequest, section, step } from "./fixtures";
import { generator } from "./random-definitions";

interface ValidationCase {
  name: string;
  definition: ProcessDefinition;
  problems: Problem[];
}

const CASES = storedCases as unknown as ValidationCase[];

/** Every code the validator can report. A code missing here fails to compile; one no case produces fails the test below. */
const CODES: Record<ProblemCode, true> = {
  "duplicate-lane": true,
  "duplicate-section": true,
  "duplicate-step": true,
  "duplicate-act": true,
  "duplicate-jump": true,
  "step-without-acts": true,
  "act-without-lanes": true,
  "act-repeats-lane": true,
  "unknown-lane": true,
  "invalid-condition": true,
  "jump-unknown-from": true,
  "jump-unknown-to": true,
  "jump-to-self": true,
  "jump-target-count": true,
  "repeat-unknown-end": true,
  "repeat-end-not-after": true,
  "parallel-not-adjacent": true,
  "parallel-single": true,
  "parallel-spans-sections": true,
};

describe("validateDefinition", () => {
  it.each(CASES)("$name", ({ definition: stored, problems }) => {
    expect(validateDefinition(parseDefinition(stored))).toEqual(problems);
  });

  it("has a case for every code it can report, and cases it leaves alone", () => {
    const reported = new Set(CASES.flatMap((entry) => entry.problems.map((problem) => problem.code)));
    expect([...reported].sort()).toEqual(Object.keys(CODES).sort());
    expect(CASES.filter((entry) => entry.problems.length === 0).length).toBeGreaterThanOrEqual(5);
  });

  it("finds nothing wrong with the sample procedures", () => {
    expect(validateDefinition(purchaseRequest())).toEqual([]);
    expect(validateDefinition(equipmentInspection())).toEqual([]);
  });
});

describe("evaluateCondition", () => {
  const f = fact("f");
  const g = fact("g");
  const table: [string, Condition, Record<string, boolean>, string][] = [
    ["a true fact", f, { f: true }, "true"],
    ["a false fact", f, { f: false }, "false"],
    ["a fact left out", f, {}, "unknown"],
    ["not of true", { not: f }, { f: true }, "false"],
    ["not of unknown", { not: f }, {}, "unknown"],
    ["all with one false and one unknown", { all: [f, g] }, { f: false }, "false"],
    ["all with one true and one unknown", { all: [f, g] }, { f: true }, "unknown"],
    ["all of nothing", { all: [] }, {}, "true"],
    ["any with one true and one unknown", { any: [f, g] }, { g: true }, "true"],
    ["any with one false and one unknown", { any: [f, g] }, { f: false }, "unknown"],
    ["any of nothing", { any: [] }, {}, "false"],
  ];
  it.each(table)("%s", (_name, condition, facts, verdict) => {
    expect(evaluateCondition(condition, facts)).toBe(verdict);
  });

  it("lists each fact once in the order met", () => {
    expect(conditionFacts({ all: [g, { not: f }, { any: [g, fact("h")] }] })).toEqual(["g", "f", "h"]);
  });

  it("tells a condition from what only resembles one", () => {
    expect(isCondition({ all: [f, { not: g }] })).toBe(true);
    for (const wrong of [null, "f", [], {}, { fact: "" }, { fact: 1 }, { not: "f" }, { all: f }, { any: [f, 1] }, { fact: "f", not: g }]) expect(isCondition(wrong)).toBe(false);
  });
});

describe("parseDefinition", () => {
  const stored = (): Record<string, unknown> => JSON.parse(serializeDefinition(purchaseRequest()));
  const reasonOf = (input: unknown): string => {
    try {
      parseDefinition(input);
    } catch (error) {
      if (error instanceof ProcessFormatError) return error.detail === undefined ? error.reason : `${error.reason}:${error.detail}`;
      throw error;
    }
    return "accepted";
  };

  it("reads back what it wrote, as text and as a value", () => {
    expect(parseDefinition(serializeDefinition(purchaseRequest()))).toEqual(purchaseRequest());
    expect(parseDefinition(stored())).toEqual(purchaseRequest());
  });

  it("keeps a member it does not know", () => {
    const value = stored();
    value.owner = "team";
    (value.sections as { steps: Record<string, unknown>[] }[])[0].steps[0].completion = "screen";
    const read = parseDefinition(value) as unknown as { owner: string; sections: { steps: { completion: string }[] }[] };
    expect(read.owner).toBe("team");
    expect(JSON.parse(serializeDefinition(read as unknown as ProcessDefinition)).sections[0].steps[0].completion).toBe("screen");
  });

  it("refuses by reason, naming the member at fault", () => {
    expect(reasonOf("{")).toBe("not-json");
    expect(reasonOf({ ...stored(), format: "other" })).toBe("not-a-definition");
    expect(reasonOf([])).toBe("not-a-definition");
    expect(reasonOf({ ...stored(), version: 2 })).toBe("newer-version:2");
    expect(reasonOf({ ...stored(), version: 0 })).toBe("shape:version");
    expect(reasonOf({ ...stored(), lanes: {} })).toBe("shape:definition.lanes");
    const noKind = stored();
    delete (noKind.sections as { steps: { acts: Record<string, unknown>[] }[] }[])[1].steps[0].acts[1].kind;
    expect(reasonOf(noKind)).toBe("shape:sections[1].steps[0].acts[1].kind");
    expect(reasonOf({ ...stored(), jumps: [{ id: "j", label: "j" }] })).toBe("shape:jumps[0].from");
    expect(reasonOf(stored())).toBe("accepted");
  });
});

describe("resolveProcess", () => {
  const numbers = (facts: Record<string, boolean>): string =>
    resolveProcess(purchaseRequest(), facts)
      .sections.flatMap((entry) => entry.steps)
      .map((entry) => `${entry.number}${entry.inclusion[0]}`)
      .join(" ");

  it("numbers every step and marks each by what its condition comes to", () => {
    expect(numbers({ large: true })).toBe("1i 2i 3i 4i 5i 6i");
    expect(numbers({ large: false })).toBe("1i 2e 3i 4i 5i 6i");
    expect(numbers({})).toBe("1i 2c 3i 4i 5i 6i");
  });

  it("excludes a step whose every act is excluded, and leaves its lane out", () => {
    const process = resolveProcess(
      definition([lane("a"), lane("b")], [section("s", [step("t1", [act("x1", "a")]), step("t2", [act("x2", "b", "do", { condition: fact("f") })])])]),
      { f: false },
    );
    expect(process.sections[0].steps.map((entry) => entry.inclusion)).toEqual(["included", "excluded"]);
    expect(process.lanes.map((entry) => entry.id)).toEqual(["a"]);
  });

  it("gives each jump its direction and draws it only between steps of the case", () => {
    const read = (facts: Record<string, boolean>): string =>
      resolveProcess(equipmentInspection(), facts)
        .jumps.map((entry) => `${entry.jump.id}:${entry.direction}:${entry.fromNumber}>${entry.toNumber ?? "-"}:${entry.drawn}`)
        .join(" ");
    expect(read({ defect: true })).toBe("no-defect:skip:4>6:true escalate:external:5>-:true");
    expect(read({ defect: false })).toBe("no-defect:skip:4>6:true escalate:external:5>-:false");
    const back = resolveProcess(definition([lane("a")], [section("s", [step("t1", [act("x1", "a")]), step("t2", [act("x2", "a")], { condition: fact("f") })])], [jump("j", "t2", "t1")]), { f: false });
    expect(back.jumps.map((entry) => `${entry.direction}:${entry.drawn}`)).toEqual(["back:false"]);
  });
});

describe("assignTracks", () => {
  it("keeps apart every two ranges that share a row, on random ranges", () => {
    const next = generator(7);
    for (let round = 0; round < 300; round += 1) {
      const ranges = Array.from({ length: Math.floor(next() * 9) }, () => {
        const low = Math.floor(next() * 30);
        return { low, high: low + Math.floor(next() * 12) };
      });
      const tracks = assignTracks(ranges);
      expect(tracks.every((track) => track >= 0)).toBe(true);
      for (let a = 0; a < ranges.length; a += 1) {
        for (let b = a + 1; b < ranges.length; b += 1) {
          const overlap = ranges[a].low <= ranges[b].high && ranges[b].low <= ranges[a].high;
          if (overlap) expect(tracks[a], `ranges ${a} and ${b} of round ${round}`).not.toBe(tracks[b]);
        }
      }
    }
  });

  it("shares a track between ranges that do not overlap, and gives the shorter range the inner track", () => {
    expect(assignTracks([{ low: 0, high: 3 }, { low: 4, high: 9 }])).toEqual([0, 0]);
    expect(assignTracks([{ low: 0, high: 9 }, { low: 2, high: 4 }])).toEqual([1, 0]);
    expect(assignTracks([{ low: 2, high: 2 }, { low: 2, high: 2 }])).toEqual([0, 1]);
  });
});

describe("chooseLayout", () => {
  const input = { laneCount: 4, trackCount: 1 };
  const fits = requiredWidth(4, 1);

  it("needs the title column, every track and every lane at its narrowest", () => {
    expect(fits).toBe(DEFAULT_LAYOUT_METRICS.titleWidth + DEFAULT_LAYOUT_METRICS.trackWidth + 4 * DEFAULT_LAYOUT_METRICS.laneMinWidth);
  });

  it("chooses by the width of the container", () => {
    expect(chooseLayout({ ...input, width: fits })).toBe("lanes");
    expect(chooseLayout({ ...input, width: fits - 1 })).toBe("lanes-scroll");
    expect(chooseLayout({ ...input, width: DEFAULT_LAYOUT_METRICS.stackBelow })).toBe("lanes-scroll");
    expect(chooseLayout({ ...input, width: DEFAULT_LAYOUT_METRICS.stackBelow - 1 })).toBe("stack");
    expect(chooseLayout({ laneCount: 1, trackCount: 0, width: 400 })).toBe("stack");
  });

  it("leaves a narrower layout only once the container is wider than the threshold by the slack", () => {
    const { stackBelow, slack } = DEFAULT_LAYOUT_METRICS;
    expect(chooseLayout({ ...input, width: stackBelow + slack - 1, previous: "stack" })).toBe("stack");
    expect(chooseLayout({ ...input, width: stackBelow + slack, previous: "stack" })).toBe("lanes-scroll");
    expect(chooseLayout({ ...input, width: fits + slack - 1, previous: "lanes-scroll" })).toBe("lanes-scroll");
    expect(chooseLayout({ ...input, width: fits + slack, previous: "lanes-scroll" })).toBe("lanes");
    expect(chooseLayout({ ...input, width: fits, previous: "lanes" })).toBe("lanes");
  });
});
