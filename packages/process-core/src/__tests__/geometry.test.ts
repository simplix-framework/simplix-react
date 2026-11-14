import { describe, expect, it } from "vitest";

import { laneColumn, laneGeometry, trackColumn } from "../lane-geometry";
import type { LaneGeometry } from "../lane-geometry";
import { readingOrder } from "../reading-order";
import { resolveProcess } from "../resolve";
import { stackGeometry } from "../stack-geometry";
import type { ResolvedProcess } from "../types";
import { validateDefinition } from "../validate";
import { act, definition, equipmentInspection, jump, lane, purchaseRequest, section, step } from "./fixtures";
import { agreementProblems, geometryProblems } from "./geometry-checks";
import { generator, randomDefinition, randomFacts } from "./random-definitions";

const rowKinds = (geometry: LaneGeometry): string => geometry.rows.map((row) => row.kind).join(" ");

const cellAt = (geometry: LaneGeometry, row: number, column: number): string =>
  (geometry.cells.find((cell) => cell.row === row && cell.column === column)?.segments ?? [])
    .map((segment) => `${segment.from}>${segment.to}:${segment.style}${segment.arrow ? "*" : ""}`)
    .join(" ");

/** The steps, acts and jumps of a case in the order read, as one line. */
const readOrder = (process: ResolvedProcess): string =>
  readingOrder(process)
    .flatMap((item) => (item.kind === "step" ? [`s:${item.stepId}`] : item.kind === "act" ? [`a:${item.actId}`] : item.kind === "jump" ? [`j:${item.jumpId}`] : []))
    .join(" ");

const stackOrder = (process: ResolvedProcess): string =>
  stackGeometry(process)
    .flatMap((block) => (block.kind === "step" ? [`s:${block.stepId}`, ...block.acts.map((entry) => `a:${entry.actId}`), ...block.jumps.map((entry) => `j:${entry.jumpId}`)] : []))
    .join(" ");

/** The same line read off the lane grid: a step where its row or its first act stands, its jumps after its acts. */
const laneOrder = (geometry: LaneGeometry): string => {
  const parts: string[] = [];
  const spans = new Map(geometry.steps.map((span) => [span.stepId, span]));
  let step: string | undefined;
  const flush = (): void => {
    if (step !== undefined) parts.push(...spans.get(step)!.jumps.map((id) => `j:${id}`));
    step = undefined;
  };
  for (const row of geometry.rows) {
    if (row.kind === "excluded" || row.kind === "folded") {
      flush();
      parts.push(`s:${row.stepId}`);
    } else if (row.kind === "acts") {
      if (row.stepId !== step) {
        flush();
        parts.push(`s:${row.stepId}`);
      }
      step = row.stepId;
      parts.push(...row.acts.map((act) => `a:${act.actId}`));
    }
  }
  flush();
  return parts.join(" ");
};

describe("laneGeometry", () => {
  it("stands the acts of a step on one row, joined in order, and carries the line down to the next step", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b")], [section("s", [step("t1", [act("x1", "a"), act("x2", "b", "check")]), step("t2", [act("x3", "b")])])])));
    expect(rowKinds(geometry)).toBe("section start acts flow acts end");
    expect(geometry.trackCount).toBe(0);
    expect(geometry.rows[2]).toEqual({
      kind: "acts",
      stepId: "t1",
      acts: [
        { actId: "x1", boxes: [0], enter: 0, order: 1 },
        { actId: "x2", boxes: [1], enter: 1, order: 2 },
      ],
    });
    expect(geometry.steps).toEqual([
      { stepId: "t1", firstRow: 2, lastRow: 2, jumps: [], arrivals: [], node: { row: 2, lane: 0 } },
      { stepId: "t2", firstRow: 4, lastRow: 4, jumps: [], arrivals: [], node: { row: 4, lane: 1 } },
    ]);
    expect(cellAt(geometry, 2, laneColumn(geometry, 0))).toBe("top>center:flow* center>right:inner");
    expect(cellAt(geometry, 2, laneColumn(geometry, 1))).toBe("left>center:inner* center>bottom:flow");
    expect(cellAt(geometry, 3, laneColumn(geometry, 1))).toBe("top>bottom:flow");
    expect(geometryProblems(geometry)).toEqual([]);
  });

  it("starts another row of the step where an act would turn the row back", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b"), lane("c")], [section("s", [step("t", [act("x1", "a"), act("x2", "c"), act("x3", "b"), act("x4", "a")])])])));
    // a to c runs right; b would turn back across the line already drawn, a follows b leftwards.
    expect(rowKinds(geometry)).toBe("section start acts flow acts end");
    expect((geometry.rows[2] as { acts: { actId: string }[] }).acts.map((entry) => entry.actId)).toEqual(["x1", "x2"]);
    expect((geometry.rows[4] as { acts: { actId: string; order: number }[] }).acts.map((entry) => `${entry.actId}:${entry.order}`)).toEqual(["x3:3", "x4:4"]);
    expect(cellAt(geometry, 2, laneColumn(geometry, 1))).toBe("left>right:inner");
    expect(cellAt(geometry, 3, laneColumn(geometry, 2))).toBe("top>left:inner");
    expect(cellAt(geometry, 4, laneColumn(geometry, 1))).toBe("top>center:inner* center>left:inner");
    expect(geometry.steps[0]).toMatchObject({ firstRow: 2, lastRow: 4 });
    expect(geometryProblems(geometry)).toEqual([]);
  });

  it("runs a jump on the rows of the first acts it joins where nothing stands to their left", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b")], [section("s", [step("t1", [act("x1", "b")]), step("t2", [act("x2", "a")]), step("t3", [act("x3", "b")])])], [jump("j", "t3", "t1")])));
    expect(rowKinds(geometry)).toBe("section start acts flow acts flow acts end");
    expect(geometry.trackCount).toBe(1);
    const track = trackColumn(geometry, 0);
    expect(track).toBe(1);
    expect(cellAt(geometry, 6, laneColumn(geometry, 1))).toBe("top>center:flow* center>bottom:flow center>left:back");
    expect(cellAt(geometry, 6, laneColumn(geometry, 0))).toBe("right>left:back");
    expect(cellAt(geometry, 6, track)).toBe("right>top:back");
    for (const row of [3, 4, 5]) expect(cellAt(geometry, row, track)).toBe("top>bottom:back");
    expect(cellAt(geometry, 2, track)).toBe("bottom>right:back");
    expect(cellAt(geometry, 2, laneColumn(geometry, 0))).toBe("left>right:back");
    expect(cellAt(geometry, 2, laneColumn(geometry, 1))).toBe("top>center:flow* center>bottom:flow left>center:back*");
    expect(geometry.tags).toEqual([{ jumpId: "j", row: 6, column: laneColumn(geometry, 1), gate: false }]);
    expect(geometry.steps.map((span) => `${span.stepId}:${span.jumps.join()}:${span.arrivals.join()}`)).toEqual(["t1::j", "t2::", "t3:j:"]);
  });

  it("takes a jump over a gate row and down beside the lane's own line where the first act has something to its left", () => {
    // The first step runs leftwards from b to a, so a jump cannot reach its first act along the row.
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b")], [section("s", [step("t1", [act("x1", "b"), act("x2", "a", "check")]), step("t2", [act("x3", "b")])])], [jump("j", "t2", "t1")])));
    expect(rowKinds(geometry)).toBe("section start gate acts flow acts end");
    const track = trackColumn(geometry, 0);
    expect(cellAt(geometry, 2, track)).toBe("bottom>right:back");
    expect(cellAt(geometry, 2, laneColumn(geometry, 0))).toBe("left>right:back");
    expect(cellAt(geometry, 2, laneColumn(geometry, 1))).toBe("top>bottom:flow left>side-bottom:back");
    expect(cellAt(geometry, 3, laneColumn(geometry, 1))).toBe("top>center:flow* center>left:inner side-top>center:back*");
    expect(cellAt(geometry, 3, laneColumn(geometry, 0))).toBe("right>center:inner* center>bottom:flow");
    expect(cellAt(geometry, 3, track)).toBe("top>bottom:back");
    expect(geometry.steps[0]).toMatchObject({ firstRow: 2, lastRow: 3, node: { row: 3, lane: 1 } });
    expect(geometryProblems(geometry)).toEqual([]);
  });

  it("sends a step that is both reached and left out over its gate row, keeping its own row for the arrival", () => {
    const steps = ["t1", "t2", "t3"].map((id, index) => step(id, [act(`x${index}`, "a")]));
    const geometry = laneGeometry(resolveProcess(definition([lane("a")], [section("s", steps)], [jump("in", "t3", "t2"), jump("out", "t2", "t1")])));
    expect(rowKinds(geometry)).toBe("section start acts flow gate acts flow acts end");
    const column = laneColumn(geometry, 0);
    expect(cellAt(geometry, 5, column)).toBe("top>center:flow* center>bottom:flow left>center:back* center>side-top:back");
    expect(cellAt(geometry, 4, column)).toBe("top>bottom:flow side-bottom>left:back");
    expect(geometry.tags).toEqual([
      { jumpId: "in", row: 7, column, gate: false },
      { jumpId: "out", row: 5, column, gate: true },
    ]);
    expect(geometryProblems(geometry)).toEqual([]);
  });

  it("shares one track between jumps into one step from one side, and keeps overlapping jumps apart", () => {
    const steps = ["t1", "t2", "t3", "t4"].map((id, index) => step(id, [act(`x${index}`, "a")]));
    const shared = laneGeometry(resolveProcess(definition([lane("a")], [section("s", steps)], [jump("j1", "t3", "t1"), jump("j2", "t4", "t1")])));
    expect(shared.trackCount).toBe(1);
    const apart = laneGeometry(resolveProcess(definition([lane("a")], [section("s", steps)], [jump("j1", "t3", "t1"), jump("j2", "t4", "t2")])));
    expect(apart.trackCount).toBe(2);
    expect(geometryProblems(shared)).toEqual([]);
    expect(geometryProblems(apart)).toEqual([]);
  });

  it("brings a rework line from the last act back up the side of the first act's lane", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b")], [section("s", [step("t", [act("x1", "a"), act("x2", "b", "check")], { rework: { label: "again" } })])])));
    expect(rowKinds(geometry)).toBe("section start acts rework end");
    expect(geometry.rows[3]).toEqual({ kind: "rework", stepId: "t", lane: 0, from: 1 });
    expect(cellAt(geometry, 3, laneColumn(geometry, 1))).toBe("center>left:rework top>bottom:flow");
    expect(cellAt(geometry, 3, laneColumn(geometry, 0))).toBe("right>center:rework* center>top-left:rework");
    expect(cellAt(geometry, 2, laneColumn(geometry, 0))).toBe("top>center:flow* center>right:inner bottom-left>center:rework*");
    expect(geometry.steps[0]).toMatchObject({ firstRow: 2, lastRow: 3 });
    expect(geometryProblems(geometry)).toEqual([]);
    // A step of one act has nothing to come back from.
    const single = laneGeometry(resolveProcess(definition([lane("a")], [section("s", [step("t", [act("x1", "a")], { rework: { label: "again" } })])])));
    expect(rowKinds(single)).toBe("section start acts end");
  });

  it("gives the rework line and a jump arriving on the same row a head each before they meet", () => {
    const geometry = laneGeometry(
      resolveProcess(definition([lane("a"), lane("b")], [section("s", [step("t1", [act("x1", "a"), act("x2", "b", "check")], { rework: { label: "again" } }), step("t2", [act("x3", "a")])])], [jump("j", "t2", "t1")])),
    );
    expect(rowKinds(geometry)).toBe("section start acts rework flow acts end");
    expect(cellAt(geometry, 3, laneColumn(geometry, 0))).toBe("right>center:rework* center>top-left:rework*");
    expect(cellAt(geometry, 2, trackColumn(geometry, 0))).toBe("bottom>right:back*");
    expect(cellAt(geometry, 2, laneColumn(geometry, 0))).toBe("top>center:flow* center>right:inner bottom-left>center:rework* left>center:back*");
    expect(geometryProblems(geometry)).toEqual([]);
  });

  it("draws acts performed together in each of their lanes, joined", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b"), lane("c")], [section("s", [step("t", [act("x", ["c", "a"])]), step("u", [act("y", "b")])])])));
    const row = geometry.rows.findIndex((entry) => entry.kind === "acts");
    expect(geometry.rows[row]).toEqual({ kind: "acts", stepId: "t", acts: [{ actId: "x", boxes: [0, 2], enter: 0, order: 1 }] });
    expect(cellAt(geometry, row, laneColumn(geometry, 0))).toBe("top>center:flow* center>right:joint center>bottom:flow");
    expect(cellAt(geometry, row, laneColumn(geometry, 1))).toBe("left>right:joint");
    expect(cellAt(geometry, row, laneColumn(geometry, 2))).toBe("left>center:joint");
  });

  it("gives an excluded step a row the line passes, and draws the lines of a parallel run and a repeat without a head", () => {
    const excluded = laneGeometry(resolveProcess(purchaseRequest(), { large: false }));
    expect(excluded.rows.filter((row) => row.kind === "excluded")).toEqual([{ kind: "excluded", stepId: "budget" }]);
    const inspection = laneGeometry(resolveProcess(equipmentInspection(), { defect: true }));
    expect(inspection.groups.map((group) => group.key)).toEqual(["ready"]);
    const rowOf = (actId: string): number => inspection.rows.findIndex((row) => row.kind === "acts" && row.acts.some((entry) => entry.actId === actId));
    // `tools` is the later member of the run; the step after it repeats.
    expect(cellAt(inspection, rowOf("stage"), laneColumn(inspection, 2))).toBe("top>center:parallel center>bottom:repeat");
    expect(cellAt(inspection, rowOf("measure"), laneColumn(inspection, 1)).split(" ")[0]).toBe("top>center:repeat");
    expect(cellAt(inspection, rowOf("isolate"), laneColumn(inspection, 0))).toBe("top>center:flow* center>right:inner");
  });

  it("folds a step none of whose acts stands in the lanes drawn, and drops the jumps that touch it", () => {
    const process = resolveProcess(purchaseRequest(), { large: true });
    const geometry = laneGeometry(process, { lanes: ["requester", "buyer"] });
    expect(geometry.lanes.map((entry) => entry.id)).toEqual(["requester", "buyer"]);
    expect(geometry.rows.filter((row) => row.kind === "folded").map((row) => (row as { stepId: string }).stepId)).toEqual(["budget", "approve"]);
    // `rework` leaves the folded step `approve`; `direct` and `requote` keep both ends.
    expect(geometry.steps.flatMap((span) => span.jumps)).toEqual(["direct", "requote"]);
    expect(geometryProblems(geometry)).toEqual([]);
    expect(agreementProblems(process, geometry)).toEqual([]);
  });

  it("lays out a case with no step to draw as its headings alone", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a")], [section("s", [])])));
    expect(rowKinds(geometry)).toBe("section");
    expect(geometry.cells).toEqual([]);
  });
});

describe("the sample procedures", () => {
  it.each([
    ["a purchase request, large", purchaseRequest(), { large: true }],
    ["a purchase request, facts unknown", purchaseRequest(), {}],
    ["an inspection with a defect", equipmentInspection(), { defect: true }],
    ["an inspection without one", equipmentInspection(), { defect: false }],
  ])("%s: the grid is whole and agrees with the case", (_name, stored, facts) => {
    const process = resolveProcess(stored, facts);
    const geometry = laneGeometry(process);
    expect(geometryProblems(geometry)).toEqual([]);
    expect(agreementProblems(process, geometry)).toEqual([]);
    expect(laneOrder(geometry)).toBe(readOrder(process));
    expect(stackOrder(process)).toBe(readOrder(process));
  });
});

describe("random procedures", () => {
  const ROUNDS = 400;

  it("are valid definitions that exercise every kind of row", () => {
    const next = generator(2026);
    const kinds = new Set<string>();
    let tracks = 0;
    for (let round = 0; round < ROUNDS; round += 1) {
      const stored = randomDefinition(next);
      expect(validateDefinition(stored), `round ${round}`).toEqual([]);
      const geometry = laneGeometry(resolveProcess(stored, randomFacts(next)));
      geometry.rows.forEach((row) => kinds.add(row.kind));
      tracks = Math.max(tracks, geometry.trackCount);
    }
    expect([...kinds].sort()).toEqual(["acts", "end", "excluded", "flow", "gate", "rework", "section", "start"]);
    expect(tracks).toBeGreaterThanOrEqual(3);
  });

  it("lay out whole, agree with the case, and read in one order as a grid and as a stack", () => {
    const next = generator(11);
    for (let round = 0; round < ROUNDS; round += 1) {
      const process = resolveProcess(randomDefinition(next), randomFacts(next));
      const geometry = laneGeometry(process);
      expect(geometryProblems(geometry), `round ${round}`).toEqual([]);
      expect(agreementProblems(process, geometry), `round ${round}`).toEqual([]);
      expect(laneOrder(geometry), `round ${round}`).toBe(readOrder(process));
      expect(stackOrder(process), `round ${round}`).toBe(readOrder(process));
    }
  });

  it("lay out whole under any choice of lanes to draw", () => {
    const next = generator(404);
    let folded = 0;
    for (let round = 0; round < ROUNDS; round += 1) {
      const process = resolveProcess(randomDefinition(next), randomFacts(next));
      const lanes = process.lanes.filter(() => next() < 0.5).map((entry) => entry.id);
      const geometry = laneGeometry(process, { lanes });
      expect(geometryProblems(geometry), `round ${round}`).toEqual([]);
      expect(agreementProblems(process, geometry), `round ${round}`).toEqual([]);
      folded += geometry.rows.filter((row) => row.kind === "folded").length;
    }
    expect(folded).toBeGreaterThan(100);
  });
});
