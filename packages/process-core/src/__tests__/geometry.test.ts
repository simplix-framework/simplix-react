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

/** The same line read off the lane grid: a step where its row or its first act stands, a jump in its exit row. */
const laneOrder = (geometry: LaneGeometry): string => {
  const parts: string[] = [];
  let step: string | undefined;
  for (const row of geometry.rows) {
    if (row.kind === "excluded" || row.kind === "folded") parts.push(`s:${row.stepId}`);
    else if (row.kind === "act") {
      if (row.stepId !== step) parts.push(`s:${row.stepId}`);
      step = row.stepId;
      parts.push(`a:${row.actId}`);
    } else if (row.kind === "exit") parts.push(...row.jumps.map((id) => `j:${id}`));
  }
  return parts.join(" ");
};

describe("laneGeometry", () => {
  it("lays a straight procedure out as a start, each act with the line between them, and an end", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b")], [section("s", [step("t1", [act("x1", "a"), act("x2", "b", "check")]), step("t2", [act("x3", "b")])])])));
    expect(rowKinds(geometry)).toBe("section start act flow act flow act end");
    expect(geometry.trackCount).toBe(0);
    expect(geometry.steps).toEqual([
      { stepId: "t1", firstRow: 2, lastRow: 4 },
      { stepId: "t2", firstRow: 6, lastRow: 6 },
    ]);
    // From lane a across to lane b, then straight down within lane b.
    expect(cellAt(geometry, 3, laneColumn(geometry, 0))).toBe("top>right:flow");
    expect(cellAt(geometry, 3, laneColumn(geometry, 1))).toBe("left>bottom:flow");
    expect(cellAt(geometry, 5, laneColumn(geometry, 1))).toBe("top>bottom:flow");
    expect(cellAt(geometry, 4, laneColumn(geometry, 1))).toBe("top>center:flow* center>bottom:flow");
    expect(geometryProblems(geometry)).toEqual([]);
  });

  it("routes a jump back through a track, out under the step it leaves and in above the step it arrives at", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b")], [section("s", [step("t1", [act("x1", "b")]), step("t2", [act("x2", "a")]), step("t3", [act("x3", "b")])])], [jump("j", "t3", "t1")])));
    expect(rowKinds(geometry)).toBe("section start entry act flow act flow act exit end");
    expect(geometry.trackCount).toBe(1);
    const track = trackColumn(geometry, 0);
    expect(track).toBe(1);
    expect(cellAt(geometry, 8, laneColumn(geometry, 1))).toBe("top>bottom:flow center>left:back");
    expect(cellAt(geometry, 8, laneColumn(geometry, 0))).toBe("left>right:back");
    expect(cellAt(geometry, 8, track)).toBe("right>top:back");
    for (const row of [3, 4, 5, 6, 7]) expect(cellAt(geometry, row, track)).toBe("top>bottom:back");
    expect(cellAt(geometry, 2, track)).toBe("bottom>right:back");
    expect(cellAt(geometry, 2, laneColumn(geometry, 1))).toBe("top>bottom:flow left>center:back*");
    expect(geometry.rows[8]).toEqual({ kind: "exit", stepId: "t3", jumps: ["j"] });
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

  it("draws acts performed together in each of their lanes, joined", () => {
    const geometry = laneGeometry(resolveProcess(definition([lane("a"), lane("b"), lane("c")], [section("s", [step("t", [act("x", ["c", "a"])]), step("u", [act("y", "b")])])])));
    const row = geometry.rows.findIndex((entry) => entry.kind === "act");
    expect(geometry.rows[row]).toEqual({ kind: "act", stepId: "t", actId: "x", primary: 2, boxes: [0, 2] });
    expect(cellAt(geometry, row, laneColumn(geometry, 0))).toBe("center>right:joint");
    expect(cellAt(geometry, row, laneColumn(geometry, 1))).toBe("left>right:joint");
    expect(cellAt(geometry, row, laneColumn(geometry, 2))).toBe("top>center:flow* center>bottom:flow left>center:joint");
  });

  it("gives an excluded step a row the line passes, and draws the line into a parallel run's later members as part of the run", () => {
    const excluded = laneGeometry(resolveProcess(purchaseRequest(), { large: false }));
    expect(excluded.rows.filter((row) => row.kind === "excluded")).toEqual([{ kind: "excluded", stepId: "budget" }]);
    const inspection = laneGeometry(resolveProcess(equipmentInspection(), { defect: true }));
    expect(inspection.groups.map((group) => group.key)).toEqual(["ready"]);
    const tools = inspection.rows.findIndex((row) => row.kind === "act" && row.actId === "stage");
    expect(cellAt(inspection, tools, laneColumn(inspection, 2))).toBe("top>center:parallel* center>bottom:flow");
    const isolate = inspection.rows.findIndex((row) => row.kind === "act" && row.actId === "isolate");
    expect(cellAt(inspection, isolate, laneColumn(inspection, 0))).toBe("top>center:flow* center>bottom:flow");
  });

  it("folds a step none of whose acts stands in the lanes drawn, and drops the jumps that touch it", () => {
    const process = resolveProcess(purchaseRequest(), { large: true });
    const geometry = laneGeometry(process, { lanes: ["requester", "buyer"] });
    expect(geometry.lanes.map((entry) => entry.id)).toEqual(["requester", "buyer"]);
    expect(geometry.rows.filter((row) => row.kind === "folded").map((row) => (row as { stepId: string }).stepId)).toEqual(["budget", "approve"]);
    // `rework` leaves the folded step `approve`; `requote` and `direct` keep both ends.
    expect(geometry.rows.flatMap((row) => (row.kind === "exit" ? row.jumps : []))).toEqual(["direct", "requote"]);
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
    expect([...kinds].sort()).toEqual(["act", "end", "entry", "excluded", "exit", "flow", "section", "start"]);
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
