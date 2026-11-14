import { Command } from "commander";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { loadConfig } from "../config/config-loader.js";
import { reportConfigError } from "../config/report-config-error.js";
import { requireProjectRoot } from "../utils/fs.js";
import { log } from "../utils/logger.js";
import { resolveKitChain, writeKitValues } from "../utils/project-templates.js";

/** One restricted import, in the shape oxlint's and ESLint's `no-restricted-imports` take. */
export interface FencedImport {
  readonly name: string;
  readonly importNames?: readonly string[];
  readonly message?: string;
}

/** Where a kit's manifest lists the framework parts a screen must not import. */
export const KIT_FENCE_FIELD = "fence";

const RULE = "no-restricted-imports";

/**
 * The fence a project's kit puts around its screens: the `simplix.fence` of every kit in its chain,
 * the core kit's first, with the kit's own values written in place of `{{@kit.*}}`.
 *
 * <p>A core kit declares the fence its design kits share once and names the design kit through
 * `{{@kit.package}}`, so a screen is refused the same imports whichever design draws it; a design
 * kit's own entries follow the core's.
 */
export async function readKitFence(rootDir: string, kit: string): Promise<FencedImport[]> {
  const fence = await kitFenceOf(rootDir, kit);
  if (fence === undefined) throw new Error(`neither ${kit} nor a kit it extends declares simplix.${KIT_FENCE_FIELD} in its package.json`);
  return fence;
}

/**
 * The fence of {@link readKitFence}, or undefined where no kit of the chain declares one.
 */
export async function kitFenceOf(rootDir: string, kit: string): Promise<FencedImport[] | undefined> {
  const chain = await resolveKitChain(rootDir, kit);
  if (!chain.kit) throw new Error(`templates.from names "${kit}", which is no UI kit`);
  let fence: FencedImport[] | undefined;
  for (const layer of chain.layers) {
    const manifest = JSON.parse(await readFile(join(layer.dir, "package.json"), "utf-8")) as { simplix?: { fence?: FencedImport[] } };
    const own = manifest.simplix?.[KIT_FENCE_FIELD];
    if (own === undefined) continue;
    if (!Array.isArray(own)) throw new Error(`simplix.${KIT_FENCE_FIELD} of ${layer.name} is not a list`);
    const where = `simplix.${KIT_FENCE_FIELD} of ${layer.name}`;
    fence = [
      ...(fence ?? []),
      ...own.map((entry) => ({
        ...entry,
        name: writeKitValues(entry.name, chain.kit, where),
        ...(entry.message === undefined ? {} : { message: writeKitValues(entry.message, chain.kit, where) }),
      })),
    ];
  }
  return fence;
}

type Override = { files?: string[]; rules?: Record<string, unknown> };

/**
 * Every override in a lint config that holds the rule the fence is written in.
 *
 * <p>A later override for the same files replaces the rule an earlier one set, so a config that
 * narrows imports per group (`modules/admin/**` beside `modules/**`) carries the fence in each of
 * them, and a fence written into the first alone reaches none of the files the later ones match.
 */
export function fenceOverrides(config: { overrides?: Override[] }): Override[] {
  return config.overrides?.filter((o) => o.rules !== undefined && RULE in o.rules) ?? [];
}

/**
 * Writes the kit's fence as the restricted paths of every override holding the rule, keeping
 * whatever else each one restricts (its `patterns`).
 *
 * @returns how many overrides were written
 */
export function writeFence(config: { overrides?: Override[] }, fence: readonly FencedImport[]): number {
  const overrides = fenceOverrides(config);
  for (const override of overrides) {
    const rule = override.rules?.[RULE];
    const options = Array.isArray(rule) && rule[1] && typeof rule[1] === "object" ? (rule[1] as Record<string, unknown>) : {};
    (override.rules as Record<string, unknown>)[RULE] = ["error", { ...options, paths: [...fence] }];
  }
  return overrides.length;
}

/**
 * Each override whose restricted paths disagree with the kit's fence, with how it disagrees.
 *
 * @returns one line per disagreement, naming the override's files; empty when every one agrees
 */
export function compareFenceOverrides(config: { overrides?: Override[] }, fence: readonly FencedImport[]): string[] {
  const overrides = fenceOverrides(config);
  if (overrides.length === 0) return compareFence(fence, []);
  return overrides.flatMap((override) => compareFence(fence, pathsOf(override)).map((d) => `${(override.files ?? []).join(", ")}: ${d}`));
}

function pathsOf(override: Override | undefined): FencedImport[] {
  const rule = override?.rules?.[RULE];
  if (!Array.isArray(rule)) return [];
  const options = rule[1] as { paths?: FencedImport[] } | undefined;
  return options?.paths ?? [];
}

/** A fence in a form two lists can be compared in, ignoring the order of names. */
function canonical(fence: readonly FencedImport[]): string {
  return JSON.stringify(
    [...fence]
      .map((f) => ({ name: f.name, importNames: [...(f.importNames ?? [])].sort(), message: f.message ?? "" }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
}

/**
 * Whether the lint config's fence is the kit's, and the differences when it is not.
 *
 * @returns the names each side has that the other lacks; both empty when they agree
 */
export function compareFence(kit: readonly FencedImport[], lint: readonly FencedImport[]): string[] {
  if (canonical(kit) === canonical(lint)) return [];
  const flat = (fence: readonly FencedImport[]) =>
    new Set(fence.flatMap((f) => (f.importNames && f.importNames.length > 0 ? f.importNames.map((n) => `${f.name}#${n}`) : [f.name])));
  const k = flat(kit);
  const l = flat(lint);
  const missing = [...k].filter((x) => !l.has(x)).map((x) => `lint lacks ${x}`);
  const extra = [...l].filter((x) => !k.has(x)).map((x) => `lint adds ${x}, which the kit does not fence`);
  return missing.length + extra.length > 0 ? [...missing, ...extra] : ["the messages differ"];
}

export const kitFenceCommand = new Command("kit-fence")
  .description("Check that the lint config refuses exactly the framework imports the UI kit fences (simplix.fence)")
  .option("--lint <file>", "The lint config holding the fence", ".oxlintrc.json")
  .option("--write", "Write the kit's fence into the lint config instead of checking it")
  .action(reportConfigError(async (flags: { lint: string; write?: boolean }) => {
    const rootDir = await requireProjectRoot(process.cwd());
    const config = await loadConfig(rootDir);
    const kit = config.templates?.from;
    if (!kit) {
      log.error("simplix.config.ts names no templates.from, so there is no kit whose fence to read");
      process.exitCode = 1;
      return;
    }
    const fence = await readKitFence(rootDir, kit);
    const lintPath = join(rootDir, flags.lint);
    const lint = JSON.parse(await readFile(lintPath, "utf-8")) as { overrides?: Override[] };
    if (flags.write) {
      const written = writeFence(lint, fence);
      if (written === 0) throw new Error(`${flags.lint} has no override holding ${RULE}; add one naming the screen files first`);
      await writeFile(lintPath, JSON.stringify(lint, null, 2) + "\n", "utf-8");
      log.success(`${flags.lint}: fence written from ${kit} into ${written} overrides`);
      return;
    }
    const differences = compareFenceOverrides(lint, fence);
    if (differences.length === 0) {
      log.success(`kit fence: ${flags.lint} refuses what ${kit} fences`);
      return;
    }
    for (const d of differences) log.error(d);
    log.error(`${flags.lint} disagrees with ${kit}'s simplix.fence; run \`simplix kit-fence --write\``);
    process.exitCode = 1;
  }));
