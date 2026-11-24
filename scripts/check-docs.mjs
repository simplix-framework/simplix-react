#!/usr/bin/env node
// Checks the documentation: every relative link resolves, the English and Korean documents of a
// pair agree, and the names a code example uses exist in the packages.
//
//   node scripts/check-docs.mjs <links|parity|symbols|all> [path prefix ...]
//
// A path prefix limits the documents read (docs/en/guides, packages/ui). With none, every
// document is read. The exit code is 1 when a check reports a problem.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { githubIds } from "./build-docs.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [mode = "all", ...prefixes] = process.argv.slice(2);

/** Documents that are generated, internal, instructions for agents, or the site's own navigation: not part of the reader's set. */
const EXCLUDED = [/^docs\/api\//, /^docs\/figures\//, /(^|\/)_[^/]*\.md$/, /^build-docs\//, /^skills\//, /^\.claude\//, /(^|\/)CHANGELOG\.md$/, /(^|\/)node_modules\//, /(^|\/)templates\//, /(^|\/)__fixtures__\//];

const tracked = execFileSync("git", ["ls-files", "-co", "--exclude-standard", "*.md"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
const documents = tracked.filter((file) => !EXCLUDED.some((pattern) => pattern.test(file)) && existsSync(join(ROOT, file)));
const selected = documents.filter((file) => prefixes.length === 0 || prefixes.some((prefix) => file === prefix || file.startsWith(prefix.replace(/\/?$/, "/"))));

const problems = [];
const report = (file, line, message) => problems.push(file + ":" + line + ": " + message);

/** A document split into what the checks read: headings, fenced blocks, and the links outside them. */
function parse(file) {
  const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
  const headings = [];
  const blocks = [];
  const links = [];
  let fence = null;
  lines.forEach((text, index) => {
    const line = index + 1;
    const mark = /^\s*(`{3,}|~{3,})(.*)$/.exec(text);
    if (fence === null && mark) {
      fence = { mark: mark[1], lang: mark[2].trim().split(/\s+/)[0] ?? "", line, body: [] };
      return;
    }
    if (fence !== null) {
      if (mark && mark[1].startsWith(fence.mark) && mark[2].trim() === "") {
        blocks.push({ lang: fence.lang, line: fence.line, body: fence.body.join("\n") });
        fence = null;
      } else fence.body.push(text);
      return;
    }
    const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(text);
    if (heading) headings.push({ level: heading[1].length, text: heading[2], line });
    const bare = text.replace(/`[^`]*`/g, "");
    for (const found of bare.matchAll(/!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|(?:src|href)="([^"]+)"/g)) links.push({ target: found[1] ?? found[2], line });
  });
  if (fence !== null) report(file, fence.line, "a fenced block is never closed");
  return { headings, blocks, links };
}

const parsed = new Map();
const read = (file) => parsed.get(file) ?? parsed.set(file, parse(file)).get(file);

/** The anchors GitHub gives the headings of a document. */
function anchorsOf(file) {
  const texts = read(file).headings.map(({ text }) => text);
  const anchors = new Set(githubIds(texts.map((text) => text.replace(/\{#[^}]+\}\s*$/, ""))));
  for (const text of texts) {
    const explicit = /\{#([^}]+)\}\s*$/.exec(text);
    if (explicit) anchors.add(explicit[1]);
  }
  return anchors;
}

const isExternal = (target) => /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(target);

/** Where a relative link of a document points, as a path from the repository root. */
function resolveLink(file, target) {
  const [path, anchor] = target.split("#");
  const to = path === "" ? file : posix.normalize(posix.join(posix.dirname(file), decodeURI(path)));
  return { to: to.replace(/\/$/, ""), anchor };
}

function checkLinks() {
  for (const file of selected) {
    for (const { target, line } of read(file).links) {
      if (isExternal(target)) continue;
      if (target.startsWith("/")) { report(file, line, "link " + target + " starts at the site root: write a relative path"); continue; }
      const { to, anchor } = resolveLink(file, target);
      if (to.startsWith("..")) { report(file, line, "link " + target + " leaves the repository"); continue; }
      if (!existsSync(join(ROOT, to))) { report(file, line, "link " + target + " points at " + to + ", which does not exist"); continue; }
      // TypeDoc copies whatever a package README links to into docs/api/_media, a directory with everything under it.
      if (/^packages\/[^/]+\/README(\.ko)?\.md$/.test(file) && statSync(join(ROOT, to)).isDirectory()) { report(file, line, "link " + target + " points at the directory " + to + ": link to a file, because the API reference build copies a linked directory whole"); continue; }
      if (anchor === undefined || anchor === "" || !to.endsWith(".md") || statSync(join(ROOT, to)).isDirectory()) continue;
      if (EXCLUDED.some((pattern) => pattern.test(to))) continue;
      if (!anchorsOf(to).has(decodeURIComponent(anchor).toLowerCase())) report(file, line, "link " + target + ": " + to + " has no heading with the anchor #" + anchor);
    }
  }
}

/** The Korean counterpart of an English document, and the reverse. */
const koreanOf = (file) => (file.startsWith("docs/en/") ? file.replace("docs/en/", "docs/ko/") : file.replace(/\.md$/, ".ko.md"));
const isKorean = (file) => file.startsWith("docs/ko/") || file.endsWith(".ko.md");
const englishOf = (file) => (file.startsWith("docs/ko/") ? file.replace("docs/ko/", "docs/en/") : file.replace(/\.ko\.md$/, ".md"));
/** A link target with its language taken out, so the two documents of a pair can be compared. */
const neutral = (path) => path.replace(/^docs\/ko\//, "docs/en/").replace(/\.ko\.md$/, ".md").replace(/\.ko\.svg$/, ".en.svg");

function checkParity() {
  for (const file of selected) {
    if (isKorean(file)) {
      if (!documents.includes(englishOf(file))) report(file, 1, "has no English counterpart " + englishOf(file));
      continue;
    }
    const korean = koreanOf(file);
    if (!documents.includes(korean)) { report(file, 1, "has no Korean counterpart " + korean); continue; }
    const [en, ko] = [read(file), read(korean)];
    const shape = (doc) => doc.headings.map((heading) => heading.level).join("");
    if (shape(en) !== shape(ko)) {
      const at = [...shape(en)].findIndex((level, index) => level !== shape(ko)[index]);
      const where = at < 0 ? Math.min(en.headings.length, ko.headings.length) : at;
      report(korean, ko.headings[where]?.line ?? 1, "headings differ from " + file + " from heading " + (where + 1) + " on (" + en.headings.length + " against " + ko.headings.length + "): English has " + JSON.stringify(en.headings[where]?.text ?? "none") + " here");
    }
    if (en.blocks.length !== ko.blocks.length) report(korean, 1, "has " + ko.blocks.length + " fenced blocks, " + file + " has " + en.blocks.length);
    en.blocks.forEach((block, index) => {
      const other = ko.blocks[index];
      if (other !== undefined && (other.body !== block.body || other.lang !== block.lang)) report(korean, other.line, "fenced block " + (index + 1) + " differs from the one at " + file + ":" + block.line);
    });
    const targets = (doc, own, pair) => doc.links.filter(({ target }) => !isExternal(target) && !target.startsWith("#")).map(({ target }) => neutral(resolveLink(own, target).to)).filter((to) => to !== neutral(pair) || true).filter((to) => to !== neutral(own));
    const [a, b] = [targets(en, file, korean), targets(ko, korean, file)];
    const missing = a.filter((to) => !b.includes(to));
    const extra = b.filter((to) => !a.includes(to));
    if (missing.length > 0) report(korean, 1, "does not link to what " + file + " links to: " + [...new Set(missing)].join(", "));
    if (extra.length > 0) report(korean, 1, "links to what " + file + " does not: " + [...new Set(extra)].join(", "));
  }
}

/** Every workspace package by name, with the source file of each entry point it exports. */
function workspacePackages() {
  const manifests = execFileSync("git", ["ls-files", "packages/*/package.json", "extensions/*/packages/*/package.json"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
  const packages = new Map();
  for (const manifest of manifests) {
    const json = JSON.parse(readFileSync(join(ROOT, manifest), "utf8"));
    const dir = dirname(manifest);
    const entries = new Map();
    const exported = typeof json.exports === "object" && json.exports !== null ? json.exports : { ".": json.main ?? "./src/index.ts" };
    for (const [subpath, value] of Object.entries(exported)) {
      const source = typeof value === "string" ? value : value.source ?? value.types ?? value.import;
      if (typeof source === "string" && /\.(tsx?|d\.ts)$/.test(source) && existsSync(join(ROOT, dir, source))) entries.set(subpath, join(ROOT, dir, source));
    }
    packages.set(json.name, { dir, entries });
  }
  return packages;
}

async function checkSymbols() {
  const ts = (await import("typescript")).default;
  const packages = workspacePackages();
  const roots = [...packages.values()].flatMap((pkg) => [...pkg.entries.values()]);
  const program = ts.createProgram(roots, { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, target: ts.ScriptTarget.ESNext, jsx: ts.JsxEmit.ReactJSX, skipLibCheck: true, noEmit: true, allowJs: false, customConditions: ["source"] });
  const checker = program.getTypeChecker();
  const exportsOf = new Map();
  const namesOf = (entry) => {
    if (!exportsOf.has(entry)) {
      const symbol = checker.getSymbolAtLocation(program.getSourceFile(entry));
      exportsOf.set(entry, new Set(symbol === undefined ? [] : checker.getExportsOfModule(symbol).map((exported) => exported.name)));
    }
    return exportsOf.get(entry);
  };

  // The commands and options the CLI and its plugins declare with commander.
  const cliFiles = execFileSync("git", ["ls-files", "packages/cli/src", "extensions/*/packages/*/src"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter((file) => /\.tsx?$/.test(file) && !file.includes("__tests__"));
  const commands = new Set(["help"]);
  const flags = new Set(["--help", "--version", "-h", "-V"]);
  for (const file of cliFiles) {
    const text = readFileSync(join(ROOT, file), "utf8");
    for (const found of text.matchAll(/(?:\.command|new Command)\(\s*["'`]([\w:-]+)/g)) commands.add(found[1]);
    for (const found of text.matchAll(/\.(?:option|requiredOption)\(\s*["'`]([^"'`]+)/g)) for (const flag of found[1].matchAll(/--?[\w-]+/g)) flags.add(flag[0].replace(/^--no-/, "--"));
  }

  for (const file of selected) {
    for (const block of read(file).blocks) {
      if (/^(ts|tsx|typescript|js|jsx|javascript)$/.test(block.lang)) {
        for (const found of block.body.matchAll(/import\s+(?:type\s+)?(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*from\s*["']([^"']+)["']/g)) {
          const [, list, specifier] = found;
          const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
          if (!/^(@simplix-react|simplix-react)/.test(name)) continue;
          const line = block.line + block.body.slice(0, found.index).split("\n").length;
          const pkg = packages.get(name);
          if (pkg === undefined) { report(file, line, "import from " + specifier + ": no workspace package is named " + name); continue; }
          const subpath = "." + specifier.slice(name.length);
          const entry = pkg.entries.get(subpath);
          if (entry === undefined) { report(file, line, "import from " + specifier + ": " + name + " exports no " + subpath + " (it exports " + [...pkg.entries.keys()].join(", ") + ")"); continue; }
          for (const item of list.split(",").map((part) => part.trim()).filter(Boolean)) {
            const imported = item.replace(/^type\s+/, "").split(/\s+as\s+/)[0];
            if (!namesOf(entry).has(imported)) report(file, line, specifier + " does not export " + imported);
          }
        }
      }
      if (/^(bash|sh|shell|zsh|console)$/.test(block.lang)) {
        block.body.split("\n").forEach((text, offset) => {
          const found = /(?:^|[\s;&|])simplix\s+([a-z][\w:-]*)(.*)$/.exec(text.replace(/#.*$/, ""));
          if (found === null) return;
          const line = block.line + offset + 1;
          if (!commands.has(found[1])) report(file, line, "simplix " + found[1] + ": the CLI declares no such command");
          for (const flag of found[2].split(/[|;&]/)[0].matchAll(/(?<=\s)--[\w-]+/g)) if (!flags.has(flag[0].replace(/^--no-/, "--"))) report(file, line, "simplix " + found[1] + " " + flag[0] + ": the CLI declares no such option");
        });
      }
    }
  }
}

if (!["links", "parity", "symbols", "all"].includes(mode)) {
  console.error("usage: node scripts/check-docs.mjs <links|parity|symbols|all> [path prefix ...]");
  process.exit(2);
}
if (mode === "links" || mode === "all") checkLinks();
if (mode === "parity" || mode === "all") checkParity();
if (mode === "symbols" || mode === "all") await checkSymbols();
for (const problem of problems) console.log(problem);
console.log(problems.length === 0 ? "✔ " + mode + ": " + selected.length + " documents, no problem" : "✖ " + mode + ": " + problems.length + " problems in " + selected.length + " documents");
process.exit(problems.length === 0 ? 0 : 1);
