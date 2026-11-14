// Shared setup for the checks of the lanes in a real browser, against the Storybook stories.
//
// Run Storybook first (`pnpm storybook` in the repository root), then
// `pnpm --filter @simplix-react/process test:e2e`. The checks drive the Google Chrome installed
// on the machine, headless, so no browser is downloaded and no window is opened. Set
// PROCESS_STORYBOOK_URL when Storybook is not on http://localhost:6006.
import { after, before } from "node:test";

import { chromium } from "playwright-core";

export const BASE = process.env.PROCESS_STORYBOOK_URL ?? "http://localhost:6006";

/** The widths every layout check is run at, in CSS pixels: three phones, two tablets, two desktops. */
export const WIDTHS = [320, 375, 414, 600, 768, 1024, 1440];

/** The widest viewport opened as a phone, with a finger for a pointer. */
export const PHONE_WIDTH = 414;

/** How long a page may take to show the lanes. A hang guard for a busy machine, not a pace. */
const READY_TIMEOUT = 90_000;

let browser;

before(async () => {
  browser = await chromium.launch({ channel: "chrome", headless: true });
});

after(async () => {
  await browser?.close();
});

/**
 * Opens a story of `Process/ProcessLanes` in a page of the width given and waits for the lanes.
 *
 * @param story the story's name as its id spells it (`default`, `side-panel`)
 * @param options `width` and `height` of the viewport, `locale` of the wording, `ready` selector
 */
export async function open(story, { width = 1440, height = 900, locale = "en", ready = "[data-process-root]" } = {}) {
  // A phone is held in a hand: at a phone's width the page is given a finger for a pointer.
  const phone = width <= PHONE_WIDTH;
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: phone, isMobile: phone });
  const page = await context.newPage();
  await page.goto(`${BASE}/iframe.html?id=process-processlanes--${story}&viewMode=story&globals=locale:${locale}`, { waitUntil: "domcontentloaded" });
  try {
    await page.waitForSelector(ready, { timeout: READY_TIMEOUT });
  } catch {
    throw new Error(`story ${story} at ${width}px never showed ${ready}: is Storybook running at ${BASE}?`);
  }
  // The layout is chosen after the box has been measured; wait for the measured choice to settle.
  await page.waitForFunction(() => document.querySelector("[data-process-root]")?.getAttribute("data-layout") !== null);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  return page;
}

/** Closes the page and the context it was opened in. */
export async function close(page) {
  await page.context().close();
}

/** The layout the lanes are drawn in. */
export const layoutOf = (page) => page.locator("[data-process-root]").first().getAttribute("data-layout");
