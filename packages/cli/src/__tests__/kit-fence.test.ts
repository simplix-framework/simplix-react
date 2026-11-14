import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

import { compareFence, compareFenceOverrides, kitFenceOf, readKitFence, writeFence } from "../commands/kit-fence.js";

const kit = [{ name: "@scope/ui", importNames: ["CrudList", "ListDetail"], message: "use the kit" }];

describe("kit fence", () => {
  it("agrees when the lint config refuses the same names in any order", () => {
    expect(compareFence(kit, [{ name: "@scope/ui", importNames: ["ListDetail", "CrudList"], message: "use the kit" }])).toEqual([]);
  });

  it("names a part the lint config lets through", () => {
    expect(compareFence(kit, [{ name: "@scope/ui", importNames: ["CrudList"], message: "use the kit" }])).toEqual(["lint lacks @scope/ui#ListDetail"]);
  });

  it("names a part the lint config refuses that the kit does not fence", () => {
    expect(compareFence(kit, [{ name: "@scope/ui", importNames: ["CrudList", "ListDetail", "Button"], message: "use the kit" }])).toEqual([
      "lint adds @scope/ui#Button, which the kit does not fence",
    ]);
  });

  it("refuses a lint config with no fence at all", () => {
    expect(compareFence(kit, [])).toEqual(["lint lacks @scope/ui#CrudList", "lint lacks @scope/ui#ListDetail"]);
  });
});

describe("a lint config that narrows imports per group", () => {
  const config = () => ({
    overrides: [
      { files: ["modules/**"], rules: { "no-restricted-imports": ["error", { paths: [kit[0]] }] } },
      { files: ["modules/admin/**"], rules: { "no-restricted-imports": ["error", { paths: [kit[0]], patterns: [{ group: ["**/portal/**"] }] }] } },
      { files: ["tests/**"], rules: { eqeqeq: "error" } },
    ],
  });
  const wider = [...kit, { name: "@scope/kit/layout", importNames: ["Tiles"], message: "the page draws it" }];

  it("writes the fence into every override holding the rule, keeping each one's patterns", () => {
    const lint = config();
    expect(writeFence(lint, wider)).toBe(2);
    const admin = lint.overrides[1]!.rules["no-restricted-imports"] as [string, { paths: unknown[]; patterns: unknown[] }];
    expect(admin[1].paths).toEqual(wider);
    expect(admin[1].patterns).toEqual([{ group: ["**/portal/**"] }]);
    expect(lint.overrides[2]!.rules).toEqual({ eqeqeq: "error" });
  });

  it("names a later override that lacks a fenced part, which the first one alone would hide", () => {
    const lint = config();
    (lint.overrides[0]!.rules["no-restricted-imports"] as [string, { paths: unknown[] }])[1].paths = wider;
    expect(compareFenceOverrides(lint, wider)).toEqual(["modules/admin/**: lint lacks @scope/kit/layout#Tiles"]);
  });

  it("agrees once every override carries the fence", () => {
    const lint = config();
    writeFence(lint, wider);
    expect(compareFenceOverrides(lint, wider)).toEqual([]);
  });
});

describe("the fence of a kit chain", () => {
  const made: string[] = [];
  afterAll(async () => {
    for (const dir of made) await rm(dir, { recursive: true, force: true });
  });

  /** A project with each package installed under node_modules, named by its manifest. */
  async function project(manifests: readonly Record<string, unknown>[]): Promise<string> {
    const root = await mkdtemp(join(tmpdir(), "simplix-fence-"));
    made.push(root);
    for (const manifest of manifests) {
      const dir = join(root, "node_modules", manifest.name as string);
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, "package.json"), JSON.stringify(manifest), "utf-8");
    }
    return root;
  }

  const core = {
    name: "@scope/area-core",
    simplix: {
      templates: "templates",
      fence: [
        { name: "@scope/ui", importNames: ["CrudList"], message: "compose the parts of {{@kit.package}}" },
        { name: "{{@kit.package}}/layout", importNames: ["Tiles"], message: "the page draws it" },
      ],
    },
  };

  it("reads the core kit's fence for a design kit, with the design kit's name written in", async () => {
    const root = await project([core, { name: "@scope/area-plain", simplix: { extends: "@scope/area-core", id: "plain" } }]);
    expect(await readKitFence(root, "@scope/area-plain")).toEqual([
      { name: "@scope/ui", importNames: ["CrudList"], message: "compose the parts of @scope/area-plain" },
      { name: "@scope/area-plain/layout", importNames: ["Tiles"], message: "the page draws it" },
    ]);
  });

  it("puts a design kit's own entries after the core kit's", async () => {
    const own = { name: "@scope/ui", importNames: ["Chart"] };
    const root = await project([core, { name: "@scope/area-plain", simplix: { extends: "@scope/area-core", id: "plain", fence: [own] } }]);
    const fence = await readKitFence(root, "@scope/area-plain");
    expect(fence).toHaveLength(3);
    expect(fence[2]).toEqual(own);
  });

  it("reads a kit that extends nothing as it is written", async () => {
    const root = await project([{ name: "@scope/alone", simplix: { templates: "templates", fence: [{ name: "@scope/ui", importNames: ["CrudList"] }] } }]);
    expect(await readKitFence(root, "@scope/alone")).toEqual([{ name: "@scope/ui", importNames: ["CrudList"] }]);
  });

  it("refuses a chain in which no kit declares a fence", async () => {
    const root = await project([
      { name: "@scope/bare-core", simplix: { templates: "templates" } },
      { name: "@scope/bare", simplix: { extends: "@scope/bare-core" } },
    ]);
    await expect(readKitFence(root, "@scope/bare")).rejects.toThrow("neither @scope/bare nor a kit it extends declares simplix.fence");
    expect(await kitFenceOf(root, "@scope/bare")).toBeUndefined();
  });

  it("refuses a kit value the fence names and the kit lacks", async () => {
    const root = await project([
      { name: "@scope/id-core", simplix: { templates: "templates", fence: [{ name: "@scope/{{@kit.id}}" }] } },
      { name: "@scope/no-id", simplix: { extends: "@scope/id-core" } },
    ]);
    await expect(readKitFence(root, "@scope/no-id")).rejects.toThrow("simplix.fence of @scope/id-core names {{@kit.id}}, and @scope/no-id declares no simplix.id");
  });
});
