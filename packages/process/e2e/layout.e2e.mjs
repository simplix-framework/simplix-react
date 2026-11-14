// The lanes at every width: nothing cut, nothing overlapping, every line whole, the layout the width calls for.
import assert from "node:assert/strict";
import { test } from "node:test";

import { chooseLayout } from "@simplix-react/process-core";

import { close, open, PHONE_WIDTH, WIDTHS } from "./helpers.mjs";
import { measure, TOLERANCE, TOUCH_TARGET } from "./measure.mjs";

const STORIES = [
  "default",
  "conditional",
  "excluded",
  "parallel-and-repeat",
  "jumps-into-one-step",
  "running",
  "finished",
  "my-lane",
  "lane-filter",
  "two-lanes",
  "single-lane",
  "long-labels",
  "large",
  "stack",
  "stack-parallel",
  "side-panel",
  "narrow-box",
];

/** Stories that state their own layout or box, and the layout they must have at a width where the choice is theirs. */
const FIXED = { stack: "stack", "stack-parallel": "stack" };

for (const story of STORIES) {
  test(`${story}: whole at every width`, async () => {
    for (const width of WIDTHS) {
      const page = await open(story, { width, locale: "ko" });
      const result = await page.evaluate(measure, { touch: TOUCH_TARGET, tolerance: TOLERANCE });
      await close(page);
      assert.deepEqual(result.problems, [], `${story} at ${width}px`);
      assert.ok(result.counted.labels > 0 && result.counted.pressed > 0, `${story} at ${width}px measured nothing`);
      if (result.layout !== "stack") assert.ok(result.counted.ends > 0 && result.counted.nodes > 0, `${story} at ${width}px drew no line`);
      assert.equal(result.coarse, width <= PHONE_WIDTH, `${story} at ${width}px has the wrong pointer`);
      const expected = FIXED[story] ?? chooseLayout({ width: result.width, laneCount: result.lanes, trackCount: result.tracks });
      assert.equal(result.layout, expected, `${story} at ${width}px in a box of ${result.width}px with ${result.lanes} lanes and ${result.tracks} tracks`);
    }
  });
}

test("the layout follows the box, not the screen", async () => {
  const panel = await open("side-panel", { width: 1440 });
  assert.equal(await panel.locator("[data-process-root]").getAttribute("data-layout"), "stack", "a 360px panel on a 1440px screen");
  await close(panel);
  const box = await open("narrow-box", { width: 1440 });
  assert.equal(await box.locator("[data-process-root]").getAttribute("data-layout"), "lanes-scroll", "a 620px box on a 1440px screen");
  const scrolls = await box.locator('[data-process-slot="scroll"]').evaluate((element) => element.scrollWidth - element.clientWidth);
  assert.ok(scrolls > 0, "the grid is wider than its box and scrolls inside it");
  await close(box);
  // Four lanes and two tracks need 688px: a 1440px screen shows them whole, a 600px one scrolls them, a 375px one stacks them.
  for (const [width, layout] of [[1440, "lanes"], [600, "lanes-scroll"], [375, "stack"]]) {
    const page = await open("default", { width });
    assert.equal(await page.locator("[data-process-root]").getAttribute("data-layout"), layout, `default at ${width}px`);
    await close(page);
  }
});

test("the titles stay in view while the lanes scroll sideways", async () => {
  const page = await open("large", { width: 1024 });
  const scroll = page.locator('[data-process-slot="scroll"]');
  const before = await page.locator('[data-process-slot="step-title"]').first().boundingBox();
  await scroll.evaluate((element) => element.scrollTo({ left: 600 }));
  const after = await page.locator('[data-process-slot="step-title"]').first().boundingBox();
  assert.ok(Math.abs(after.x - before.x) < 1, `the first title moved from ${before.x} to ${after.x}`);
  const lane = await page.locator('[data-process-slot="lane-head"]').first().boundingBox();
  assert.ok(lane.x < before.x + before.width, "the first lane scrolled under the titles");
  await close(page);
});
