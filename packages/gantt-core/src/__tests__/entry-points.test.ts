import { describe, expect, it } from "vitest";

import * as root from "../index";
import * as mspdi from "../mspdi";

describe("entry points", () => {
  // An application loads the XML exchange on demand only while the root entry does not hand it out too.
  it("hands the XML exchange out from its own entry and not from the root", () => {
    for (const name of Object.keys(mspdi)) expect(root, name).not.toHaveProperty(name);
    expect(Object.keys(mspdi)).toEqual(expect.arrayContaining(["readMspdi", "writeMspdi", "mspdiExportLosses"]));
  });
});
