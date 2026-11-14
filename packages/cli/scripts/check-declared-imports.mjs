#!/usr/bin/env node
/**
 * Every bare import in a workspace package names a dependency of that package.
 *
 * A stylesheet or a module that imports a package its own `package.json` never declared still
 * resolves on the machine that wrote it, through a copy hoisted by an earlier install, and fails
 * on the next clean install: the consumer's bundler reports `Can't resolve '<package>'` from a
 * file inside the package, and every screen drawn with it goes blank. Nothing in the package's own
 * type check or build sees it, because the build runs where the hoisted copy is.
 *
 * What is read: `@import` / `@plugin` / `@reference` / `@config` in the stylesheets under each
 * package's `src` directory, and `import ... from`, `export ... from`, `import "x"`, `import("x")`
 * and `require("x")` in the script files beside them. Comments and string contents are skipped, so a quoted example of an
 * import is not one. A specifier is bare when it is neither relative, absolute, a URL, a Node
 * built-in nor a `#` subpath import; its package is the first segment, or the first two for a
 * scoped name.
 *
 * What counts as declared: `dependencies`, `peerDependencies` and `optionalDependencies` of the
 * package that owns the file, and the package's own name. `devDependencies` count for test files
 * only, because a published package is installed without them.
 *
 * **One relation counts as declared without being listed: a meta package.** The workspace's `.npmrc`
 * hoists some scopes publicly (`public-hoist-pattern[]=@simplix-react/*`) so that what a meta
 * package such as `simplix-react` depends on is importable the way a product imports it. An
 * import of a package that matches such a pattern and that a declared dependency itself lists in
 * `dependencies` or `peerDependencies` is covered by that dependency. A package matching the
 * pattern that no declared dependency lists is still reported: it resolves only through some
 * other package's hoisted copy. The declared dependency's manifest is read from the package's
 * `node_modules`, so the check needs an install; without one it stops with exit 2 rather than
 * judge against manifests it could not read.
 *
 * Usage:
 *   simplix-declared-imports                # checks the workspace in the working directory
 *   simplix-declared-imports --root <dir>   # checks another workspace
 *   simplix-declared-imports --selftest     # hit and miss cases on temp trees
 *
 * Exit code 1 when an import is not declared, 2 when the run cannot decide: an unrecognised
 * option, or dependencies that are not installed.
 */

import fs from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Directories that never hold a package's own source. */
const SKIP_DIRS = new Set(["node_modules", "dist", ".turbo", "coverage"]);

/** Script files whose imports are read. */
const SCRIPT_FILE = /\.(?:[cm]?[jt]sx?)$/;

/** A file that runs under the test runner, where `devDependencies` are installed. */
const TEST_FILE = /\.test\.[cm]?[jt]sx?$/;

/** The at-rules that resolve a package from a stylesheet. */
const CSS_AT_RULE = /@(?:import|plugin|reference|config)\s+(?:url\(\s*)?(["']?)([^"')\s;]+)\1/g;

const BUILTINS = new Set(builtinModules);

/**
 * The package a bare specifier names, or `null` when it names something else.
 *
 * @param {string} specifier the text between the quotes
 * @returns {string | null}
 */
export function packageOf(specifier) {
  if (specifier === "" || specifier.startsWith(".") || specifier.startsWith("/")) return null;
  if (specifier.startsWith("#") || specifier.startsWith("node:")) return null;
  // `https://`, `data:`, `file:` and every other scheme: a URL, not a package.
  if (/^[a-z][a-z0-9+.-]*:/i.test(specifier)) return null;
  const parts = specifier.split("/");
  const name = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
  return BUILTINS.has(name) ? null : name;
}

/**
 * The source with comments blanked out and the content of strings kept, so the import patterns
 * below cannot match inside a comment. Line structure is kept, which is what lets a hit report a
 * line number.
 *
 * @param {string} text script source
 * @returns {string}
 */
function withoutComments(text) {
  let out = "";
  let i = 0;
  let quote = null;
  while (i < text.length) {
    const c = text[i];
    const next = text[i + 1];
    if (quote) {
      out += c;
      if (c === "\\" && next !== undefined) {
        out += next;
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i += 1;
      continue;
    }
    if (c === "/" && next === "/") {
      while (i < text.length && text[i] !== "\n") i += 1;
      continue;
    }
    if (c === "/" && next === "*") {
      const end = text.indexOf("*/", i + 2);
      const stop = end === -1 ? text.length : end + 2;
      out += text.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") quote = c;
    out += c;
    i += 1;
  }
  return out;
}

/**
 * The statements that start an import in code, which excludes a quoted example of one: an import
 * has to open a line or follow a `;`, `}` or `)` on its line, and its keyword is not inside a
 * string.
 */
const SCRIPT_IMPORTS = [
  // import x from "a" / import { x } from "a" / export * from "a" / import type { x } from "a"
  /(?:^|[;}\s])(?:import|export)\b[^"'`;]*?\bfrom\s*(["'])([^"']+)\1/gm,
  // import "a"
  /(?:^|[;}\s])import\s*(["'])([^"']+)\1/gm,
  // import("a") / require("a")
  /(?:^|[^.\w$])(?:import|require)\s*\(\s*(["'])([^"']+)\1\s*\)/gm,
];

/** Positions of the string literals in the comment-free source, so an import keyword inside one is dropped. */
function stringRanges(code) {
  const ranges = [];
  let i = 0;
  while (i < code.length) {
    const c = code[i];
    if (c === '"' || c === "'" || c === "`") {
      const start = i;
      i += 1;
      while (i < code.length && code[i] !== c) {
        if (code[i] === "\\") i += 1;
        i += 1;
      }
      ranges.push([start, i]);
    }
    i += 1;
  }
  return ranges;
}

/**
 * Bare specifiers a script file imports, with the line of each.
 *
 * @param {string} text script source
 * @returns {{ specifier: string, line: number }[]}
 */
export function scriptImports(text) {
  const code = withoutComments(text);
  const strings = stringRanges(code);
  const found = [];
  for (const pattern of SCRIPT_IMPORTS) {
    for (const m of code.matchAll(pattern)) {
      // The keyword is the first `import` / `export` / `require` in the match.
      const keyword = m.index + m[0].search(/import|export|require/);
      // An import keyword inside a string literal is text, not a statement.
      if (strings.some(([from, to]) => keyword > from && keyword < to)) continue;
      // The line of the specifier, which is the last line of a multi-line import.
      found.push({ specifier: m[2], line: code.slice(0, m.index + m[0].length).split("\n").length });
    }
  }
  return found;
}

/**
 * Bare specifiers a stylesheet resolves, with the line of each.
 *
 * @param {string} text stylesheet source
 * @returns {{ specifier: string, line: number }[]}
 */
export function styleImports(text) {
  const code = text.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "));
  return [...code.matchAll(CSS_AT_RULE)].map((m) => ({
    specifier: m[2],
    line: code.slice(0, m.index).split("\n").length,
  }));
}

/** Raised when a package's dependencies are not installed, so a meta package cannot be read. */
export class NotInstalled extends Error {
  constructor(owner) {
    super(`${owner} has no installed dependencies to read`);
    this.owner = owner;
  }
}

/**
 * The `public-hoist-pattern[]` globs of a workspace's `.npmrc`, as matchers over a package name.
 * A pattern starting with `!` excludes and is not a hoist.
 *
 * @param {string} root the workspace's root directory
 * @returns {RegExp[]}
 */
export function publicHoistPatterns(root) {
  let text;
  try {
    text = fs.readFileSync(path.join(root, ".npmrc"), "utf8");
  } catch {
    return [];
  }
  const patterns = [];
  for (const line of text.split("\n")) {
    const m = /^\s*public-hoist-pattern\[\]\s*=\s*(\S+)\s*$/.exec(line);
    if (!m || m[1].startsWith("!")) continue;
    const source = m[1].split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
    patterns.push(new RegExp(`^${source}$`));
  }
  return patterns;
}

/**
 * The manifest of a package as installed for `packageDir`, or `null` when it is not installed.
 *
 * @param {string} packageDir a workspace package's directory
 * @param {string} name the dependency's name
 */
function installedManifest(packageDir, name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(packageDir, "node_modules", name, "package.json"), "utf8"));
  } catch {
    return null;
  }
}

/** Every file under `dir` the check reads, depth first. */
function sourceFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) files.push(...sourceFiles(path.join(dir, entry.name)));
    } else if (entry.name.endsWith(".css") || SCRIPT_FILE.test(entry.name)) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

/**
 * The imports under each package's `src` directory, in `<root>/packages`, that the package does
 * not declare.
 *
 * @param {string} root the workspace's root directory
 * @returns {{ file: string, line: number, specifier: string, owner: string }[]}
 */
export function undeclaredImports(root) {
  const hits = [];
  const hoisted = publicHoistPatterns(root);
  const packagesDir = path.join(root, "packages");
  for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const packageDir = path.join(packagesDir, entry.name);
    const srcDir = path.join(packageDir, "src");
    const manifestFile = path.join(packageDir, "package.json");
    if (!fs.existsSync(srcDir) || !fs.existsSync(manifestFile)) continue;
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
    const shipped = new Set([
      manifest.name,
      ...Object.keys(manifest.dependencies ?? {}),
      ...Object.keys(manifest.peerDependencies ?? {}),
      ...Object.keys(manifest.optionalDependencies ?? {}),
    ]);
    const tested = new Set([...shipped, ...Object.keys(manifest.devDependencies ?? {})]);

    // What the declared dependencies themselves list, read once and only when an import needs it.
    let provided = null;
    const providedByDependencies = () => {
      if (provided) return provided;
      provided = new Set();
      let installed = 0;
      for (const dependency of shipped) {
        const dependencyManifest = installedManifest(packageDir, dependency);
        if (!dependencyManifest) continue;
        installed += 1;
        for (const field of ["dependencies", "peerDependencies"]) {
          for (const name of Object.keys(dependencyManifest[field] ?? {})) provided.add(name);
        }
      }
      if (installed === 0) throw new NotInstalled(manifest.name);
      return provided;
    };

    for (const file of sourceFiles(srcDir)) {
      const text = fs.readFileSync(file, "utf8");
      const imports = file.endsWith(".css") ? styleImports(text) : scriptImports(text);
      const declared = TEST_FILE.test(file) ? tested : shipped;
      for (const { specifier, line } of imports) {
        const name = packageOf(specifier);
        if (name === null || declared.has(name)) continue;
        if (hoisted.some((pattern) => pattern.test(name)) && providedByDependencies().has(name)) continue;
        hits.push({ file: path.relative(root, file), line, specifier, owner: manifest.name });
      }
    }
  }
  return hits;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main(argv) {
  let root = process.cwd();
  let selftest = false;
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--selftest") selftest = true;
    else if (a === "--root" && i + 1 < argv.length) root = path.resolve(argv[++i]);
    else if (a.startsWith("--root=")) root = path.resolve(a.slice("--root=".length));
    else {
      console.error(`unrecognised option: ${a}\n  options: --root <dir>  --selftest`);
      return 2;
    }
  }
  if (selftest) return (await import("./check-declared-imports.selftest.mjs")).selfTest();

  let hits;
  try {
    hits = undeclaredImports(root);
  } catch (e) {
    if (!(e instanceof NotInstalled)) throw e;
    console.error(
      `✖ ${e.owner}: its dependencies are not installed, so the packages they bring along cannot be read. ` +
        "Run the package manager's install, then run this check again.",
    );
    return 2;
  }
  for (const h of hits) {
    console.log(`✖ ${h.file}:${h.line}  imports "${h.specifier}", which ${h.owner} does not declare`);
  }
  if (hits.length > 0) {
    console.log(
      `\n✖ ${hits.length} import${hits.length === 1 ? "" : "s"} of a package missing from the manifest. ` +
        "A clean install resolves only what a package.json lists; add the package to dependencies " +
        "(or peerDependencies when the app supplies it), or drop the import.",
    );
    return 1;
  }
  console.log("✔ every bare import names a dependency or peer dependency of its package");
  return 0;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(await main(process.argv.slice(2)));
}
