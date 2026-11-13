// Shared setup for the end-to-end checks of the chart in a real browser, against the Storybook stories.
//
// Run Storybook first (`pnpm storybook` in the repository root), then
// `pnpm --filter @simplix-react/gantt test:e2e`. The checks drive the Google
// Chrome installed on the machine, so no browser is downloaded. Set
// GANTT_STORYBOOK_URL when Storybook is not on http://localhost:6006.
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { after, before } from "node:test";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";

import { chromium } from "playwright-core";

export const BASE = process.env.GANTT_STORYBOOK_URL ?? "http://localhost:6006";

/** Everything the stories under test are built from: the two packages and the stories themselves. */
const SOURCE_ROOTS = ["../src", "../../gantt-core/src", "../../../apps/storybook/src/stories/gantt"].map((path) => join(dirname(fileURLToPath(import.meta.url)), path));

async function sourceFiles(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "__tests__") found.push(...(await sourceFiles(path)));
    } else if (/\.(tsx?|json)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      found.push(path);
    }
  }
  return found;
}

/** Whether the module the dev server hands out for a file was made from the file as it is on disk. */
async function servedFromDisk(file) {
  const json = file.endsWith(".json");
  // A JSON file is handed out as itself unless it is asked for as the module the page imports.
  const response = await fetch(`${BASE}/@fs${file}${json ? "?import" : ""}`);
  // A file no story reaches is not served, and has no say in what the checks see.
  if (!response.ok) return true;
  const served = await response.text();
  const onDisk = await readFile(file, "utf8");
  if (json) {
    // The module carries the file's values, not its text: the values are compared.
    const module = await import(`data:text/javascript,${encodeURIComponent(served)}`);
    return isDeepStrictEqual(module.default, JSON.parse(onDisk));
  }
  const map = served.match(/sourceMappingURL=data:application\/json;base64,([A-Za-z0-9+/=]+)\s*$/);
  // A file of types alone is served as an empty module, which runs the same whatever the file says.
  if (!map) return served.trim() === "export {};";
  return JSON.parse(Buffer.from(map[1], "base64").toString("utf8")).sourcesContent?.[0] === onDisk;
}

/**
 * Fails when the dev server hands out a module that differs from the file on
 * disk. A dev server whose file watcher lags serves the code from before an
 * edit, and a check run against it reports on the wrong code.
 */
async function assertServedSource() {
  const files = (await Promise.all(SOURCE_ROOTS.map(sourceFiles))).flat();
  const fresh = await Promise.all(files.map(servedFromDisk));
  const stale = files.filter((_, i) => !fresh[i]);
  assert.equal(stale.length, 0, `Storybook serves an older copy of:\n${stale.join("\n")}\nRestart Storybook and run the checks again.`);
}

/** @type {import("playwright-core").Browser} */
let browser;

before(async () => {
  await assertServedSource();
  browser = await chromium.launch({ channel: "chrome", headless: true });
});
after(async () => {
  await browser?.close();
});

/**
 * Opens a story in a fresh page and waits for it to draw. `ready` names what
 * to wait for in a story that opens on another view than the Gantt chart.
 */
export async function open(story, { ready = "[data-gantt-bar]", ...options } = {}) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 }, ...options });
  const page = await context.newPage();
  await page.goto(`${BASE}/iframe.html?id=gantt-gantt--${story}&viewMode=story`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(ready, { timeout: 90_000 });
  return page;
}

export const cells = (page, id) => page.$$eval(`[data-gantt-row="${id}"] [role=gridcell]`, (list) => list.map((cell) => cell.textContent?.trim() ?? ""));
export const box = async (page, selector) => {
  const found = await page.locator(selector).first().boundingBox();
  assert.ok(found, `nothing on screen for ${selector}`);
  return found;
};
export const drag = async (page, from, to) => {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 4 });
  await page.mouse.move(to.x, to.y, { steps: 4 });
  await page.mouse.up();
};

