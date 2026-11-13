import { childElement, childElements, childText, parseXml, type XmlElement } from "../mspdi/xml";
import { parseLocalDateTime } from "../time";
import type { Id, Schedule, TaskSchedule } from "../types";
import { parseMspdiDuration } from "../mspdi/codes";

interface FsModule {
  existsSync(path: string): boolean;
  readdirSync(path: string): string[];
  readFileSync(path: string, encoding: "utf8"): string;
}
interface PathModule {
  join(...parts: string[]): string;
  dirname(path: string): string;
}
interface UrlModule {
  fileURLToPath(url: string): string;
}
interface NodeProcess {
  getBuiltinModule(name: "node:fs"): FsModule;
  getBuiltinModule(name: "node:path"): PathModule;
  getBuiltinModule(name: "node:url"): UrlModule;
}

// The package compiles without Node typings, so the test reaches Node's
// built-in modules through the running process.
const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const fs = nodeProcess.getBuiltinModule("node:fs");
const path = nodeProcess.getBuiltinModule("node:path");
const url = nodeProcess.getBuiltinModule("node:url");

const here = path.dirname(url.fileURLToPath((import.meta as unknown as { url: string }).url));

/** Directory holding the Microsoft Project sample files, one folder per subject. */
export const ORACLE_DIR = path.join(here, "..", "..", ".oracle", "mpxj", "junit", "data", "generated");

/** Every sample file as folder-relative path, sorted. Throws when the samples were never fetched. */
export function listSamples(): string[] {
  if (!fs.existsSync(ORACLE_DIR)) {
    throw new Error(`MSPDI samples are missing at ${ORACLE_DIR}. Run \`node scripts/fetch-oracle.mjs\` in packages/gantt-core first.`);
  }
  const out: string[] = [];
  for (const folder of fs.readdirSync(ORACLE_DIR).sort()) {
    const dir = path.join(ORACLE_DIR, folder);
    for (const file of fs.readdirSync(dir).sort()) {
      if (file.endsWith("-mspdi.xml")) {
        out.push(`${folder}/${file}`);
      }
    }
  }
  return out;
}

/** Text of one sample file, by its folder-relative path. */
export function readSample(relative: string): string {
  return fs.readFileSync(path.join(ORACLE_DIR, relative), "utf8");
}

function dateOf(el: XmlElement, name: string, fallback: number): number {
  const t = childText(el, name);
  return t === undefined || t.trim() === "" ? fallback : parseLocalDateTime(t);
}

function flagOf(el: XmlElement, name: string): boolean {
  return childText(el, name)?.trim() === "1";
}

function numOf(el: XmlElement, name: string): number {
  const t = childText(el, name);
  return t === undefined || t.trim() === "" ? 0 : Number(t);
}

/**
 * Builds the schedule a sample file already holds: the computed dates, slack
 * and flags Microsoft Project saved, so a writer can be tested without the
 * scheduler.
 */
export function scheduleFromFile(xml: string): Schedule {
  const root = parseXml(xml);
  const tasks = new Map<Id, TaskSchedule>();
  const stack: { level: number; id: Id }[] = [];
  let index = 0;
  let projectStart = 0;
  let projectFinish = 0;
  for (const el of childElements(childElement(root, "Tasks") ?? root, "Task")) {
    const id = (childText(el, "UID") ?? "").trim();
    if (Number(id) === 0) {
      projectStart = dateOf(el, "Start", 0);
      projectFinish = dateOf(el, "Finish", 0);
      continue;
    }
    if (flagOf(el, "IsNull")) {
      continue;
    }
    const level = numOf(el, "OutlineLevel") || 1;
    while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 0) >= level) {
      stack.pop();
    }
    const start = dateOf(el, "Start", projectStart);
    const finish = dateOf(el, "Finish", start);
    const duration = childText(el, "Duration");
    tasks.set(id, {
      id,
      index,
      parentId: stack[stack.length - 1]?.id ?? null,
      wbs: childText(el, "WBS") ?? "",
      summary: flagOf(el, "Summary"),
      milestone: flagOf(el, "Milestone"),
      start,
      finish,
      segments: [{ start, finish }],
      duration: duration === undefined ? 0 : parseMspdiDuration(duration),
      earlyStart: dateOf(el, "EarlyStart", start),
      earlyFinish: dateOf(el, "EarlyFinish", finish),
      lateStart: dateOf(el, "LateStart", start),
      lateFinish: dateOf(el, "LateFinish", finish),
      totalSlack: numOf(el, "TotalSlack") / 10,
      freeSlack: numOf(el, "FreeSlack") / 10,
      critical: flagOf(el, "Critical"),
      percentComplete: numOf(el, "PercentComplete"),
      calendarId: (childText(el, "CalendarUID") ?? "").trim(),
    });
    stack.push({ level, id });
    index++;
  }
  return { start: projectStart, finish: projectFinish, tasks, links: new Map(), conflicts: [] };
}
