import { describe, expect, it } from "vitest";
import { arrowStep, overflowEdges, whollyInSight } from "../base/navigation/tab-overflow";

describe("overflowEdges", () => {
  it("reports no overflow when everything fits", () => {
    expect(overflowEdges(0, 600, 600)).toEqual({ start: false, end: false });
  });
  it("reports the end when the strip starts at its beginning and runs past the view", () => {
    expect(overflowEdges(0, 600, 900)).toEqual({ start: false, end: true });
  });
  it("reports both ends in the middle", () => {
    expect(overflowEdges(120, 600, 900)).toEqual({ start: true, end: true });
  });
  it("reports only the start at the far end", () => {
    expect(overflowEdges(300, 600, 900)).toEqual({ start: true, end: false });
  });
  it("ignores sub-pixel scroll positions", () => {
    expect(overflowEdges(0.5, 600, 900.6)).toEqual({ start: false, end: true });
    expect(overflowEdges(299.5, 600, 900)).toEqual({ start: true, end: false });
  });
});

describe("arrowStep", () => {
  it("moves most of a view and never less than one tab", () => {
    expect(arrowStep(600)).toBe(480);
    expect(arrowStep(40)).toBe(48);
  });
});

describe("whollyInSight", () => {
  const view = { start: 40, end: 340 };
  it("counts a tab inside the view, edges included", () => {
    expect(whollyInSight({ start: 40, end: 140 }, view)).toBe(true);
    expect(whollyInSight({ start: 240, end: 340 }, view)).toBe(true);
  });
  it("does not count a tab cut by either edge", () => {
    expect(whollyInSight({ start: 20, end: 120 }, view)).toBe(false);
    expect(whollyInSight({ start: 300, end: 400 }, view)).toBe(false);
  });
  it("ignores a sub-pixel overhang", () => {
    expect(whollyInSight({ start: 39.5, end: 139.5 }, view)).toBe(true);
    expect(whollyInSight({ start: 240.6, end: 340.6 }, view)).toBe(true);
  });
});
