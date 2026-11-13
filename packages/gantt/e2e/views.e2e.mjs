// The other screens and states: the network diagram, an empty plan, a read-only chart, the date header.
import assert from "node:assert/strict";
import { test } from "node:test";

import { box, open } from "./helpers.mjs";

test("zooms the network diagram in steps and fits it to the screen", async () => {
  const page = await open("network", { ready: "[data-gantt-node]", viewport: { width: 900, height: 500 } });
  const scale = async () => (await page.locator('[data-gantt-slot="network-scale"]').textContent()).trim();
  const nodeWidth = async () => Math.round((await box(page, '[data-gantt-node="2"]')).width);
  assert.equal(await scale(), "100%");
  assert.equal(await nodeWidth(), 184);
  await page.getByRole("button", { name: "Zoom out" }).click();
  assert.equal(await scale(), "85%");
  assert.equal(await nodeWidth(), Math.round(184 * 0.85));
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page.getByRole("button", { name: "Zoom in" }).click();
  assert.equal(await scale(), "125%");
  // Fitted, the whole diagram lies inside the screen and nothing scrolls.
  await page.getByRole("button", { name: "Fit to screen" }).click();
  await page.waitForTimeout(200);
  const fitted = await page.locator('[data-gantt-slot="network-diagram"]').evaluate((element) => ({ x: element.scrollWidth - element.clientWidth, y: element.scrollHeight - element.clientHeight }));
  assert.ok(fitted.x <= 0 && fitted.y <= 0, `the fitted diagram still scrolls by ${fitted.x}px and ${fitted.y}px`);
  // A box still opens its task after scaling.
  await page.locator('[data-gantt-node="2"]').dblclick();
  await page.waitForSelector("[role=dialog]");
  await page.context().close();
});

test("adds the first task from the empty plan's own button", async () => {
  const page = await open("empty", { ready: '[data-gantt-slot="empty-add-task"]' });
  await page.locator('[data-gantt-slot="empty-add-task"]').click();
  await page.waitForSelector("[data-gantt-row]");
  assert.equal(await page.locator("[data-gantt-row]").count(), 1);
  await page.context().close();
});

test("offers no link handles on a milestone of a read-only chart", async () => {
  const count = async (story) => {
    const page = await open(story);
    // Task 4 is the milestone of the sample plan.
    const handles = await page.locator('[data-gantt-bar="4"] [data-gantt-slot^="link-"]').count();
    await page.context().close();
    return handles;
  };
  assert.equal(await count("default"), 2);
  assert.equal(await count("read-only"), 0);
});

test("leaves the label out of a month that has all but scrolled under the table", async () => {
  const page = await open("default");
  const rooms = () =>
    page.evaluate(() => {
      const edge = document.querySelector('[data-gantt-slot="grid"]').getBoundingClientRect().right;
      const header = document.querySelector('[data-gantt-slot="scale-cell"]').parentElement;
      return [...header.querySelectorAll('[data-gantt-slot="scale-cell"]')]
        .filter((cell) => cell.querySelector("span"))
        .map((cell) => cell.getBoundingClientRect())
        .filter((cell) => cell.right > edge)
        .map((cell) => Math.round(cell.right - Math.max(cell.left, edge)));
    });
  // The chart opens with the month before the plan showing a sliver beside the table.
  for (const room of await rooms()) assert.ok(room >= 36, `a labelled month shows ${room}px of itself`);
  await page.locator('[data-gantt-slot="scroll"]').evaluate((element) => (element.scrollLeft += 620));
  await page.waitForTimeout(300);
  const after = await rooms();
  assert.ok(after.length > 0, "a month is labelled");
  for (const room of after) assert.ok(room >= 36, `after scrolling a labelled month shows ${room}px of itself`);
  await page.context().close();
});
