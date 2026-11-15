import { describe, expect, it } from "vitest";

import * as edit from "../edit";
import * as root from "../index";

describe("entry points", () => {
  // A screen that only draws a procedure loads no editing code only while the root entry does not hand it out too.
  it("hands the editing components out from their own entry and not from the root", () => {
    for (const name of Object.keys(edit)) expect(root, name).not.toHaveProperty(name);
    expect(Object.keys(edit).sort()).toEqual(["ProcessDiff", "ProcessEditor", "ProcessProblems", "useProcessEditing", "useProcessProblems"]);
  });
});
