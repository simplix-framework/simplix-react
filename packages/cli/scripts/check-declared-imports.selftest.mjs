// The self-test of check-declared-imports.mjs: each case is a workspace written to a temporary
// directory, with the imports the check must report for it. The check hands itself in, so this
// file imports nothing from the script that runs it.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Writes a kit with one package: its manifest, the files given by relative path, the kit's
 * `.npmrc` when the case has one, and the manifests of installed dependencies.
 */
function writeKit(root, manifest, { files, npmrc, installed = {} }) {
  const packageDir = path.join(root, "packages", "demo");
  fs.mkdirSync(packageDir, { recursive: true });
  fs.writeFileSync(path.join(packageDir, "package.json"), JSON.stringify(manifest));
  if (npmrc !== undefined) fs.writeFileSync(path.join(root, ".npmrc"), npmrc);
  for (const [name, dependencyManifest] of Object.entries(installed)) {
    const dir = path.join(packageDir, "node_modules", name);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(dependencyManifest));
  }
  for (const [name, text] of Object.entries(files)) {
    const file = path.join(packageDir, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
}

const MANIFEST = {
  name: "@kit/demo",
  dependencies: { "declared-dep": "1" },
  peerDependencies: { "declared-peer": "1", "@scope/peer": "1" },
  optionalDependencies: { "declared-optional": "1" },
  devDependencies: { "dev-only": "1" },
};

/** Each case: a name, the files, and the specifiers the check must report (none for a miss). */
const META_FILES = { "src/index.ts": 'import { Button } from "@fw/ui";\nimport { sync } from "@fw/headless";\n' };
const META_NPMRC = "# comment\npublic-hoist-pattern[]=@fw/*\n";
const META_INSTALLED = {
  "declared-dep": { name: "declared-dep", dependencies: { "@fw/ui": "1" }, peerDependencies: { "@fw/theme": "1" } },
};

const CASES = [
  {
    name: "hit: a stylesheet imports a package the manifest never declared",
    files: { "src/styles/app.css": "@import 'ghost-css';\n" },
    expect: ["ghost-css"],
  },
  {
    name: "hit: a stylesheet imports a subpath and a url() form of undeclared packages",
    files: {
      "src/styles/app.css": '@import "ghost-a/theme.css";\n@import url("@ghost/b/styles.css") layer(base);\n@plugin "ghost-plugin";\n',
    },
    expect: ["ghost-a/theme.css", "@ghost/b/styles.css", "ghost-plugin"],
  },
  {
    name: "hit: every import form in a script names an undeclared package",
    files: {
      "src/index.ts": [
        'import { a } from "ghost-from";',
        'import type { T } from "ghost-type";',
        'export * from "ghost-reexport";',
        'import "ghost-side-effect";',
        'const lazy = () => import("ghost-dynamic");',
        'const legacy = require("ghost-require");',
        "import {",
        "  multi,",
        '} from "@ghost/multi/sub";',
      ].join("\n"),
    },
    expect: [
      "ghost-from",
      "ghost-type",
      "ghost-reexport",
      "ghost-side-effect",
      "ghost-dynamic",
      "ghost-require",
      "@ghost/multi/sub",
    ],
  },
  {
    name: "hit: a dev dependency imported by shipped code",
    files: { "src/widget.tsx": 'import { render } from "dev-only";\n' },
    expect: ["dev-only"],
  },
  {
    name: "miss: declared dependency, peer, optional and the package's own name",
    files: {
      "src/styles/app.css": "@import 'declared-dep/x.css';\n@import '@scope/peer/y.css';\n",
      "src/index.ts": [
        'import a from "declared-dep";',
        'import b from "declared-peer/sub/path";',
        'import c from "declared-optional";',
        'import d from "@kit/demo/styles/app.css";',
        'import e from "@scope/peer";',
      ].join("\n"),
    },
    expect: [],
  },
  {
    name: "miss: relative, absolute, URL, built-in and subpath-import specifiers",
    files: {
      "src/styles/app.css": [
        "@import './local.css';",
        "@import '../other.css';",
        "@import url(https://fonts.example.test/x.css);",
        "@import 'data:text/css,a{}';",
      ].join("\n"),
      "src/index.ts": [
        'import a from "./a";',
        'import b from "../b";',
        'import c from "/abs/c";',
        'import d from "node:fs";',
        'import e from "path";',
        'import f from "fs/promises";',
        'import g from "#internal/g";',
        'import h from "https://cdn.example.test/h.js";',
      ].join("\n"),
    },
    expect: [],
  },
  {
    name: "miss: an import written inside a comment or a string",
    files: {
      "src/index.ts": [
        '// import x from "ghost-line";',
        '/* import y from "ghost-block"; */',
        "/**",
        ' * import z from "ghost-doc";',
        " */",
        "const doc = 'import w from \"ghost-string\"';",
        "const tpl = `import v from 'ghost-template'`;",
        "export const ok = 1;",
      ].join("\n"),
      "src/styles/app.css": "/* @import 'ghost-comment'; */\n.a { color: red }\n",
    },
    expect: [],
  },
  {
    name: "miss: a dev dependency imported by a test file",
    files: { "src/widget.test.tsx": 'import { render } from "dev-only";\nimport a from "declared-dep";\n' },
    expect: [],
  },
  {
    name: "miss: a hoisted package that a declared dependency lists",
    files: { "src/index.ts": 'import { Button } from "@fw/ui";\nimport theme from "@fw/theme/tokens.css";\n' },
    npmrc: META_NPMRC,
    installed: META_INSTALLED,
    expect: [],
  },
  {
    name: "hit: a hoisted package that no declared dependency lists",
    files: META_FILES,
    npmrc: META_NPMRC,
    installed: META_INSTALLED,
    expect: ["@fw/headless"],
  },
  {
    name: "hit: a package a declared dependency lists, when the kit does not hoist it",
    files: { "src/index.ts": 'import { Button } from "@fw/ui";\n' },
    npmrc: "public-hoist-pattern[]=@other/*\n",
    installed: META_INSTALLED,
    expect: ["@fw/ui"],
  },
  {
    name: "hit: a package a declared dependency lists, when there is no .npmrc at all",
    files: { "src/index.ts": 'import { Button } from "@fw/ui";\n' },
    installed: META_INSTALLED,
    expect: ["@fw/ui"],
  },
  {
    name: "hit: a stylesheet import covered only by a dev dependency's own list",
    files: { "src/styles/app.css": "@import '@fw/theme/tokens.css';\n" },
    npmrc: META_NPMRC,
    installed: {
      "declared-dep": { name: "declared-dep", dependencies: {} },
      "dev-only": { name: "dev-only", dependencies: { "@fw/theme": "1" } },
    },
    expect: ["@fw/theme/tokens.css"],
  },
  {
    name: "stop: a hoisted import with no installed dependency to read the meta package from",
    files: { "src/index.ts": 'import { Button } from "@fw/ui";\n' },
    npmrc: META_NPMRC,
    stops: true,
  },
  {
    name: "miss: directories that never hold the package's source",
    files: {
      "src/node_modules/ghost/index.js": 'import x from "ghost-vendored";\n',
      "src/dist/out.js": 'import x from "ghost-built";\n',
    },
    expect: [],
  },
];

/**
 * @param {{ undeclaredImports: (root: string) => { specifier: string }[], NotInstalled: Function }} check
 * @returns {number} the exit code: 0 when every case comes out as expected
 */
export function selfTest({ undeclaredImports, NotInstalled }) {
  let failed = 0;
  for (const c of CASES) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "check-declared-imports-"));
    try {
      writeKit(root, MANIFEST, c);
      let ok;
      let detail = "";
      if (c.stops) {
        try {
          undeclaredImports(root);
          ok = false;
          detail = "expected the run to stop, but it judged";
        } catch (e) {
          ok = e instanceof NotInstalled;
          if (!ok) detail = `expected a stop for missing installs, got ${e}`;
        }
      } else {
        const got = undeclaredImports(root).map((h) => h.specifier).sort();
        const want = [...c.expect].sort();
        ok = JSON.stringify(got) === JSON.stringify(want);
        if (!ok) detail = `expected ${JSON.stringify(want)}, got ${JSON.stringify(got)}`;
      }
      if (!ok) failed += 1;
      console.log(`${ok ? "✔" : "✖"} ${c.name}${ok ? "" : `\n   ${detail}`}`);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
  console.log(failed === 0 ? `\n✔ ${CASES.length} cases` : `\n✖ ${failed} of ${CASES.length} cases came out wrong`);
  return failed === 0 ? 0 : 1;
}
