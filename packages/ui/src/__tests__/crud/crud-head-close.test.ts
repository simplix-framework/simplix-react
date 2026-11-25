import { describe, expect, it } from "vitest";
import { crudDetailActionsStyle, crudDetailFooterStyle, crudDetailHeaderStyle } from "../../crud/detail/crud-detail.style";
import { crudFormHeaderStyle } from "../../crud/form/crud-form.style";
import claritySpec from "../../design/clarity.spec";

// The close control of a head is the small control a head holds at its top: 28 by 24px with a 14px
// glyph. A detail and a form declare the same metrics, so a record's close does not move or change
// size between reading it and editing it.
const CLOSE = "[&_[data-slot=button][data-size=icon-xs]]";

describe("the close control of a detail head and a form head", () => {
  const heads = { "crud-detail-header": crudDetailHeaderStyle.base, "crud-form-header": crudFormHeaderStyle.base };

  for (const [slot, base] of Object.entries(heads)) {
    it(`${slot} draws it 28 by 24px with a 14px glyph`, () => {
      expect(base).toContain(`${CLOSE}:h-6`);
      expect(base).toContain(`${CLOSE}:w-7`);
      expect(base).toContain("[&_[data-slot=button][data-size=icon-xs]_svg]:!size-3.5");
      expect(base).not.toMatch(/data-size=icon-xs\]\]:size-\d/);
    });
  }

  it("clarity restates no other size for it", () => {
    for (const slot of Object.keys(heads)) {
      const drawn = claritySpec.slots?.[slot] ?? "";
      expect(drawn).not.toMatch(/data-size=icon-xs\]\]:size-\d/);
      expect(drawn).not.toMatch(/data-size=icon-xs\]_svg\]:!size-4\b/);
    }
  });
});

// The head of a detail is set apart from the body by a rule, as a form's head is.
describe("the rule under a detail head and a form head", () => {
  it("is drawn by both declarations", () => {
    expect(crudDetailHeaderStyle.base.split(" ")).toContain("border-b");
    expect(crudFormHeaderStyle.base.split(" ")).toContain("border-b");
  });

  it("is a hairline in clarity", () => {
    expect((claritySpec.slots?.["crud-detail-header"] ?? "").split(" ")).toContain("border-[var(--border)]");
    expect((claritySpec.slots?.["crud-form-header"] ?? "").split(" ")).toContain("border-[var(--border)]");
  });
});

// A row that would hold only a close the header already draws is not drawn, and neither is a footer
// that holds nothing else.
describe("a bare actions row", () => {
  it("is hidden with its rule and padding", () => {
    expect(crudDetailActionsStyle.variants.bare.true).toBe("hidden");
    expect(crudDetailActionsStyle.variants.bare.false).toBe("");
  });

  it("takes its footer with it", () => {
    expect(crudDetailFooterStyle.base).toContain("has-[>[data-part-bare=true]:only-child]:hidden");
  });
});
