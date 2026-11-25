import { describe, expect, it } from "vitest";
import { crudListDetailDividerStyle } from "../../crud/patterns/list-detail.style";

// A handle inside the side edge of a drawer or a dialog draws its grip faint at rest, and whole on
// hover, press and focus. The rest state is a variant of the slot, since the slot's own rule
// outranks a class on the handle.
describe("crudListDetailDividerStyle", () => {
  const { base, variants } = crudListDetailDividerStyle;

  it("hides the grip of a track at rest and centres it on the rule", () => {
    expect(base).toContain("before:opacity-0");
    expect(base).toContain("before:left-1/2");
    expect(base).toContain("before:-translate-x-1/2");
    expect(variants.edge.false).toBe("");
  });

  it("draws the grip of an edge faint at rest, where the rule runs", () => {
    expect(variants.edge.true).toBe("before:opacity-40");
  });

  it("draws every grip whole on hover, press and keyboard focus", () => {
    for (const state of ["hover", "active", "focus-visible"]) expect(base).toContain(`${state}:before:opacity-100`);
  });
});
