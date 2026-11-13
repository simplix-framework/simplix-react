// Narrow screens, the task table's columns and scrolling, the toolbar and printing.
import assert from "node:assert/strict";
import { test } from "node:test";

import { open, cells, box, drag } from "./helpers.mjs";

test("keeps the timeline in reach and the views on a line above the commands on narrow screens", async () => {
  for (const width of [1024, 768, 480, 375]) {
    const page = await open("default", { viewport: { width, height: 800 } });
    const layout = await page.evaluate(() => {
      const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
      const scroll = document.querySelector('[data-gantt-slot="scroll"]');
      const grid = rect('[data-gantt-slot="grid"]');
      const first = rect('[data-gantt-bar="1"]');
      return {
        share: grid.width / scroll.clientWidth,
        timeline: scroll.clientWidth - grid.width,
        toolbar: rect('[data-gantt-slot="toolbar"]').height,
        viewsBottom: rect('[data-gantt-slot="toolbar-views"]').bottom,
        toolsTop: rect('[data-gantt-slot="toolbar-tools"]').top,
        // The view control, strip or list, lies whole inside the chart.
        viewSpill: Math.max(
          0,
          ...[...document.querySelectorAll('[data-gantt-slot="toolbar-views"] > *')]
            .map((element) => element.getBoundingClientRect())
            .filter((box) => box.width > 0)
            .map((box) => box.right - rect('[data-gantt-slot="toolbar"]').right),
        ),
        firstBarGap: first.left - grid.right,
        pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    assert.ok(layout.share <= 0.5, `at ${width}px the table takes ${Math.round(layout.share * 100)}% of the chart`);
    assert.ok(layout.timeline >= 160, `at ${width}px the timeline shows ${Math.round(layout.timeline)}px`);
    assert.ok(layout.toolbar <= 100, `at ${width}px the toolbar is ${Math.round(layout.toolbar)}px tall`);
    assert.ok(layout.viewsBottom <= layout.toolsTop, `at ${width}px the views end at ${layout.viewsBottom} and the commands start at ${layout.toolsTop}`);
    assert.ok(layout.viewSpill <= 0, `at ${width}px the view control reaches ${Math.round(layout.viewSpill)}px past the chart`);
    assert.ok(layout.firstBarGap >= 0 && layout.firstBarGap <= 60, `at ${width}px the plan opens ${Math.round(layout.firstBarGap)}px from the table`);
    assert.ok(layout.pageOverflow <= 0, `at ${width}px the page scrolls sideways by ${layout.pageOverflow}px`);
    await page.context().close();
  }
});

test("fits the task dialog inside a phone screen", async () => {
  const page = await open("default", { viewport: { width: 375, height: 700 } });
  // A double click on the row number opens the dialog; on a cell it would start editing the cell.
  await page.locator('[data-gantt-row="6"] [data-gantt-slot="row-handle"]').dblclick();
  await page.waitForSelector("[role=dialog]");
  const spill = await page.evaluate(() => {
    const dialog = document.querySelector("[role=dialog]");
    const edge = dialog.getBoundingClientRect();
    return [...dialog.querySelectorAll("input, label, button")]
      .filter((element) => !element.closest("[role=tablist]"))
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && (rect.right > edge.right + 1 || rect.left < edge.left - 1)).length;
  });
  assert.equal(spill, 0, `${spill} controls reach past the dialog`);
  await page.context().close();
});

test("resizes a column from its grip, resets it with a double click and scrolls the table sideways", async () => {
  const page = await open("default");
  const width = (n) => page.locator("[role=columnheader]").nth(n).evaluate((cell) => Math.round(cell.getBoundingClientRect().width));
  const grip = await box(page, '[role=columnheader]:nth-of-type(2) [data-gantt-slot="column-resize"]');
  assert.equal(await width(0), 240);
  await drag(page, { x: grip.x + grip.width / 2, y: grip.y + 20 }, { x: grip.x + grip.width / 2 + 70, y: grip.y + 20 });
  assert.equal(await width(0), 310);
  const moved = await box(page, '[role=columnheader]:nth-of-type(2) [data-gantt-slot="column-resize"]');
  await page.mouse.dblclick(moved.x + moved.width / 2, moved.y + 20);
  assert.equal(await width(0), 240);
  // The last column lies outside the table until the table's own scroll bar brings it in.
  const grid = await box(page, '[data-gantt-slot="grid"]');
  const last = page.locator("[role=columnheader]").last();
  assert.ok((await last.boundingBox()).x > grid.x + grid.width, "the last column starts out of view");
  await page.locator('[data-gantt-slot="table-scroller"]').evaluate((element) => (element.scrollLeft = element.scrollWidth));
  await page.waitForTimeout(200);
  const shown = await last.boundingBox();
  assert.ok(shown.x + shown.width <= grid.x + grid.width + 1, "the last column is in view after scrolling the table");
  await page.context().close();
});

test("chooses the columns to show from the table corner and from the toolbar", async () => {
  const page = await open("default");
  const headers = () => page.locator("[role=columnheader]").count();
  assert.equal(await headers(), 7);
  await page.locator('[data-gantt-slot="column-chooser-button"]').click();
  await page.getByRole("menuitemcheckbox", { name: "Total slack" }).click();
  await page.getByRole("menuitemcheckbox", { name: "Predecessors" }).click();
  await page.keyboard.press("Escape");
  const names = await page.$$eval("[role=columnheader]", (cells) => cells.map((cell) => cell.textContent.trim()));
  assert.deepEqual(names, ["Task name", "Duration", "Start", "Finish", "% complete", "Resource names", "Total slack"]);
  await page.getByRole("button", { name: "Choose columns" }).first().click();
  await page.getByRole("menuitemcheckbox", { name: "WBS" }).click();
  await page.keyboard.press("Escape");
  assert.equal(await headers(), 8);
  await page.context().close();
});

test("keeps a date tag out of the task table while the timeline scrolls under it", async () => {
  const page = await open("default");
  const tag = page.locator("[data-gantt-marker-tag]").first();
  const grid = await box(page, '[data-gantt-slot="grid"]');
  const tagBox = await tag.boundingBox();
  // Scroll until the tag's centre lies under the table.
  const by = Math.round(tagBox.x + tagBox.width / 2 - (grid.x + grid.width / 2));
  await page.locator('[data-gantt-slot="scroll"]').evaluate((element, delta) => (element.scrollLeft += delta), by);
  await page.waitForTimeout(300);
  const moved = await tag.boundingBox();
  assert.ok(moved.x + moved.width < grid.x + grid.width, "the tag's place is now under the table");
  const top = await page.evaluate(([x, y]) => {
    const hit = document.elementFromPoint(x, y);
    return Boolean(hit?.closest("[data-gantt-marker-tag]"));
  }, [moved.x + moved.width / 2, moved.y + moved.height - 3]);
  assert.equal(top, false, "the table covers the tag");
  await page.context().close();
});

test("shows the last row at full height above the table's scroll bar", async () => {
  const page = await open("default");
  await page.locator('[data-gantt-slot="scroll"]').evaluate((element) => (element.scrollTop = element.scrollHeight));
  await page.waitForTimeout(300);
  const heights = await page.$$eval('[data-gantt-slot="grid"] [role=row]', (rows) => rows.map((row) => row.getBoundingClientRect()).map((r) => [r.height, r.bottom]));
  const [height, bottom] = heights[heights.length - 1];
  const scroller = await box(page, '[data-gantt-slot="table-scroller"]');
  assert.equal(height, 32);
  assert.ok(bottom <= scroller.y + 0.5, `the last row ends at ${bottom}, the scroll bar starts at ${scroller.y}`);
  await page.context().close();
});

test("keeps the table splitter's grip at the middle of the rows in view", async () => {
  const offCentre = async (page) => {
    const grip = await box(page, '[data-gantt-slot="splitter-grip"]');
    const area = await page.evaluate(() => {
      const scroll = document.querySelector('[data-gantt-slot="scroll"]').getBoundingClientRect();
      const body = document.querySelector('[data-gantt-slot="grid"]').getBoundingClientRect();
      const header = document.querySelector("[role=columnheader]").getBoundingClientRect();
      const scrollBottom = scroll.top + document.querySelector('[data-gantt-slot="scroll"]').clientHeight;
      return { top: Math.max(body.top, header.bottom), bottom: Math.min(body.bottom, scrollBottom) };
    });
    return Math.abs(grip.y + grip.height / 2 - (area.top + area.bottom) / 2);
  };
  // A plan shorter than the chart, then a long one scrolled part of the way down.
  const short = await open("default");
  assert.ok((await offCentre(short)) <= 1, "centred on a plan that fits");
  await short.context().close();
  const long = await open("large-plan");
  assert.ok((await offCentre(long)) <= 1, "centred at the top of a long plan");
  await long.locator('[data-gantt-slot="scroll"]').evaluate((element) => (element.scrollTop = 1234));
  await long.waitForTimeout(300);
  assert.ok((await offCentre(long)) <= 1, "centred after scrolling down");
  await long.context().close();
});
