import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, resolve, sep } from "node:path";
import { promisify } from "node:util";

import { noteKeptRender, pathExists, writeFileWithDir } from "./fs.js";
import { carryStamp, GENERATED_HASH_MARKER, isUntouchedRender, renderFingerprint } from "./project-templates.js";

const run = promisify(execFile);

/**
 * The committed folder that holds, per generated file, the exact render the CLI last wrote for it.
 *
 * <p>That render is the merge base the next regeneration reads an edited file against. It lives in
 * the project, beside the templates, so a fresh clone merges exactly as the machine that wrote it.
 */
export const GENERATED_BASE_DIR = ".simplix/generated";

/**
 * What writing one generated file came to.
 *
 * - `written`: absent or untouched, so the fresh render was written
 * - `merged`: edited, and the template change merged into the edits without a conflict
 * - `current`: edited, and the merge changes nothing (the edits already carry the template change)
 * - `conflict`: edited, and the template change collides with the edits; nothing was written
 *   unless conflict markers were asked for
 * - `no-base`: edited, and no stored base exists to merge against; the file was kept
 * - `removed`: absent while a base is stored, so somebody deleted it after it was laid down; a
 *   regeneration leaves it deleted (see {@link withRemovalsHonoured})
 */
export type GeneratedOutcome = "written" | "merged" | "current" | "conflict" | "no-base" | "removed";

/** One file's outcome, as collected for the report. */
export interface GeneratedWrite {
  readonly path: string;
  readonly outcome: GeneratedOutcome;
  /** For a conflict: each conflicting region, with markers, as `git merge-file` prints it. */
  readonly hunks?: readonly string[];
  /** Whether conflict markers were written into the file. */
  readonly markersWritten?: boolean;
}

/** The project's formatter, run over every render before it is written, recorded or compared. */
export type GeneratedFormatter = (source: string, filePath: string) => string | Promise<string>;

let outcomes: GeneratedWrite[] = [];
let formatter: GeneratedFormatter | undefined;

/** Puts the project's formatter in force for every later generated write; undefined removes it. */
export function setGeneratedFormatter(format: GeneratedFormatter | undefined): void {
  formatter = format;
}

/**
 * Runs the project's formatter over a stamped render and stamps the result with its own
 * fingerprint, so a file formatted on disk still reads as the untouched render it is.
 */
async function formatRender(filePath: string, stamped: string): Promise<string> {
  if (formatter === undefined) return stamped;
  const formatted = await formatter(stamped, resolve(filePath));
  const fingerprint = renderFingerprint(formatted);
  return formatted.replace(new RegExp(`(${GENERATED_HASH_MARKER}\\s+)[0-9a-f]{12}`), `$1${fingerprint}`);
}
let conflictMarkers = false;
let honourRemovals = false;

/**
 * Runs `body` with every deleted generated file left deleted: a file that is absent while its base
 * is stored was laid down once and removed since, so a regeneration must not bring it back. A
 * file with no stored base is new to the templates and is still written.
 */
export async function withRemovalsHonoured<T>(body: () => Promise<T>): Promise<T> {
  const before = honourRemovals;
  honourRemovals = true;
  try {
    return await body();
  } finally {
    honourRemovals = before;
  }
}

/** Runs `body` with conflicting merges written into the file with markers instead of left alone. */
export async function withConflictMarkers<T>(body: () => Promise<T>): Promise<T> {
  const before = conflictMarkers;
  conflictMarkers = true;
  try {
    return await body();
  } finally {
    conflictMarkers = before;
  }
}

/** Returns and clears the outcomes collected since the last call. */
export function takeGeneratedOutcomes(): GeneratedWrite[] {
  const taken = outcomes;
  outcomes = [];
  return taken;
}

/**
 * Where the stored base of a generated file lives, in the project the file belongs to. A file
 * outside the project root (a story directory beside it) keeps its `..` segments spelled as
 * `__up__` so the base stays inside the folder.
 *
 * @param rootDir the root of the project the file belongs to, spelled the way `filePath` is
 * @param filePath the generated file
 */
export function basePathFor(rootDir: string, filePath: string): string {
  const rel = relative(rootDir, resolve(filePath));
  const safe = rel
    .split(sep)
    .map((part) => (part === ".." ? "__up__" : part))
    .join("/");
  return join(rootDir, GENERATED_BASE_DIR, safe);
}

/** The stored base of a generated file, or undefined when none was ever recorded. */
export async function readBase(rootDir: string, filePath: string): Promise<string | undefined> {
  const at = basePathFor(rootDir, filePath);
  return (await pathExists(at)) ? readFile(at, "utf-8") : undefined;
}

/** Stores `render` as the merge base the file's later regenerations read its edits against. */
export async function recordBase(rootDir: string, filePath: string, render: string): Promise<void> {
  await writeFileWithDir(basePathFor(rootDir, filePath), render);
}

/** The fingerprint an edited file still carries from the render it was laid down as. */
function recordedFingerprint(held: string): string | undefined {
  const line = held.split("\n").find((one) => one.includes(GENERATED_HASH_MARKER));
  return line === undefined ? undefined : new RegExp(`${GENERATED_HASH_MARKER}\\s+([0-9a-f]{12})`).exec(line)?.[1];
}

/** Each region of a text between the conflict markers {@link mergeThreeWay} writes, markers included. */
export function conflictHunksOf(text: string): string[] {
  return [...text.matchAll(/^<<<<<<< edited\n[\s\S]*?^>>>>>>> template\n?/gm)].map((m) => m[0]);
}

/** A three-way merge of `ours` and `theirs` against `base`, through `git merge-file`. */
export async function mergeThreeWay(base: string, ours: string, theirs: string): Promise<{ text: string; hunks: string[] }> {
  const dir = await mkdtemp(join(tmpdir(), "simplix-merge-"));
  try {
    const [o, b, t] = ["edited", "base", "template"].map((name) => join(dir, name));
    await Promise.all([writeFile(o, ours), writeFile(b, base), writeFile(t, theirs)]);
    let text: string;
    try {
      ({ stdout: text } = await run("git", ["merge-file", "-p", "-L", "edited", "-L", "base", "-L", "template", o, b, t], { maxBuffer: 64 * 1024 * 1024 }));
    } catch (err) {
      // A positive exit status is the number of conflicts, and stdout still holds the merge.
      const failed = err as { code?: unknown; stdout?: string };
      if (typeof failed.code !== "number" || failed.code < 0 || failed.stdout === undefined) throw err;
      text = failed.stdout;
    }
    return { text, hunks: conflictHunksOf(text) };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/**
 * Writes one stamped generated file under the rule every generated file follows: laid down when
 * absent, rewritten while untouched, merged three-way into the edits once somebody has edited it.
 *
 * <p>Every render written is kept as the file's base under {@link GENERATED_BASE_DIR}. An edited
 * file with no stored base gets one when its recorded fingerprint is the fingerprint of the
 * current render: that render is then the one the file was laid down as.
 *
 * @param rootDir the root of the project the file belongs to, where its base is kept
 * @param filePath where the file goes
 * @param stamped the fresh render, already stamped with its fingerprint
 * @returns the outcome and what the file holds after this call
 */
export async function writeStampedGenerated(rootDir: string, filePath: string, stamped: string): Promise<{ outcome: GeneratedOutcome; held: string }> {
  stamped = await formatRender(filePath, stamped);
  const note = (entry: Omit<GeneratedWrite, "path">) => outcomes.push({ path: resolve(filePath), ...entry });
  if (!(await pathExists(filePath))) {
    if (honourRemovals && (await readBase(rootDir, filePath)) !== undefined) {
      note({ outcome: "removed" });
      return { outcome: "removed", held: "" };
    }
    await writeFileWithDir(filePath, stamped);
    await recordBase(rootDir, filePath, stamped);
    note({ outcome: "written" });
    return { outcome: "written", held: stamped };
  }
  const ours = await readFile(filePath, "utf-8");
  if (isUntouchedRender(ours)) {
    await writeFileWithDir(filePath, stamped);
    await recordBase(rootDir, filePath, stamped);
    note({ outcome: "written" });
    return { outcome: "written", held: stamped };
  }
  noteKeptRender(filePath, stamped);
  // A file still holding the markers of an earlier merge (an earlier run, or an earlier origin of this
  // run) is merged no further: a second merge over the markers would nest a second set in the first.
  const unresolved = conflictHunksOf(ours);
  if (unresolved.length > 0) {
    note({ outcome: "conflict", hunks: unresolved, markersWritten: false });
    return { outcome: "conflict", held: ours };
  }
  let base = await readBase(rootDir, filePath);
  if (base === undefined && recordedFingerprint(ours) === renderFingerprint(stamped)) base = stamped;
  if (base === undefined) {
    note({ outcome: "no-base" });
    return { outcome: "no-base", held: ours };
  }
  // The stamp line names the render a file was read against and is not content: every side takes
  // the fresh render's, so a fingerprint that moved never collides with one an edit carried.
  const { text, hunks } = await mergeThreeWay(carryStamp(base, stamped), carryStamp(ours, stamped), stamped);
  if (hunks.length > 0) {
    if (conflictMarkers) {
      await writeFileWithDir(filePath, text);
      await recordBase(rootDir, filePath, stamped);
    }
    note({ outcome: "conflict", hunks, markersWritten: conflictMarkers });
    return { outcome: "conflict", held: conflictMarkers ? text : ours };
  }
  await recordBase(rootDir, filePath, stamped);
  if (text === ours || text === carryStamp(ours, stamped)) {
    note({ outcome: "current" });
    return { outcome: "current", held: ours };
  }
  await writeFileWithDir(filePath, text);
  note({ outcome: "merged" });
  return { outcome: "merged", held: text };
}
