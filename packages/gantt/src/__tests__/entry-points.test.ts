import { describe, expect, it } from "vitest";

import * as root from "../index";
import * as pdf from "../pdf";

describe("entry points", () => {
  // The chart loads the PDF code when a PDF is first asked for only while the root entry does not hand it out too.
  it("hands the PDF export out from its own entry and not from the root", () => {
    for (const name of Object.keys(pdf)) expect(root, name).not.toHaveProperty(name);
    expect(Object.keys(pdf)).toEqual(expect.arrayContaining(["downloadPdf", "renderPdf", "buildPdf"]));
  });
});
