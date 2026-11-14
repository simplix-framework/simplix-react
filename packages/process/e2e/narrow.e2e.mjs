// A phone and a narrow panel: one column, sections reached from the top, the step in progress in view.
import assert from "node:assert/strict";
import { test } from "node:test";

import { close, open } from "./helpers.mjs";

const PHONE = { width: 375, height: 700 };

test("lists every act with the lanes that perform it and every jump as a line of its card", async () => {
  const page = await open("stack", PHONE);
  assert.equal(await page.locator('[data-process-slot="lines"]').count(), 0, "one column draws no line");
  const card = page.locator('[data-process-step="quote"]');
  assert.deepEqual(await card.locator("[data-process-act]").evaluateAll((list) => list.map((item) => item.dataset.processAct)), ["collect", "compare"]);
  assert.match(await card.locator('[data-process-act="compare"] [data-process-slot="act-lanes"]').innerText(), /구매 담당 · 요청자/);
  assert.deepEqual(await page.locator("[data-process-jump]").evaluateAll((list) => list.map((item) => item.dataset.processJump)), ["direct", "rework", "requote"]);
  await close(page);
});

test("goes to a section from the links at the top", async () => {
  const page = await open("stack", PHONE);
  const heading = page.locator('[data-process-section="order"]');
  // The page opens on the step in progress, so the second section's heading stands somewhere down the window.
  const before = await heading.evaluate((element) => element.getBoundingClientRect().top);
  assert.ok(before > 200, `the second section starts ${before}px down the window`);
  await page.getByRole("navigation").getByRole("button", { name: "발주와 검수" }).click();
  // The page scrolls smoothly; the check waits for the heading to arrive, not for a length of time.
  await page.waitForFunction(() => document.querySelector('[data-process-section="order"]').getBoundingClientRect().top < 120);
  const top = await heading.evaluate((element) => element.getBoundingClientRect().top);
  assert.ok(top >= 0, `the section heading stands ${top}px from the top`);
  await close(page);
});

test("folds a step to one line when none of its acts stands in the lanes shown", async () => {
  const page = await open("stack", PHONE);
  await page.locator('[data-process-lane-toggle="manager"]').click();
  await page.locator('[data-process-lane-toggle="finance"]').click();
  assert.equal(await page.locator('[data-process-step="approve"]').getAttribute("data-inclusion"), "folded");
  assert.equal(await page.locator('[data-process-step="budget"]').getAttribute("data-inclusion"), "folded");
  assert.deepEqual(await page.locator('[data-process-step="draft"] [data-process-act]').evaluateAll((list) => list.map((item) => item.dataset.processAct)), ["write"]);
  assert.equal(await page.locator('[data-process-lane-toggle="manager"]').getAttribute("aria-pressed"), "false");
  await close(page);
});

test("shows the step in progress when a running case is first drawn", async () => {
  const page = await open("side-panel", { width: 1440, height: 420 });
  const active = page.locator('[data-process-step="approve"]');
  assert.equal(await active.getAttribute("data-run"), "active");
  const box = await active.locator("[data-process-stop]").first().boundingBox();
  assert.ok(box.y >= 0 && box.y + box.height <= 420, `the step in progress stands at ${box.y}px in a 420px window`);
  await close(page);
});
