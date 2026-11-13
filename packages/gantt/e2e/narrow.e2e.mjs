// Phone-width screens: the folded toolbar, the resource views, the calendar and the table or timeline alone.
import assert from "node:assert/strict";
import { test } from "node:test";

import { box, open } from "./helpers.mjs";

const PHONE = { viewport: { width: 375, height: 700 } };

test("reaches every command on a phone without scrolling the toolbar sideways", async () => {
  const page = await open("default", PHONE);
  const tools = await page.locator('[data-gantt-slot="toolbar-tools"]').evaluate((row) => ({ overflow: row.scrollWidth - row.clientWidth, search: row.querySelector("input[type=search]").getBoundingClientRect().width }));
  assert.ok(tools.overflow <= 0, `the commands reach ${tools.overflow}px past the bar`);
  assert.ok(tools.search >= 64, `the search box is ${Math.round(tools.search)}px wide`);
  const status = await box(page, '[data-gantt-slot="toolbar-status"]');
  const views = await box(page, '[data-gantt-slot="toolbar-views"]');
  assert.ok(status.y >= views.y && status.y + status.height <= views.y + views.height, "the marks stand on the views line");
  // What the bar has no room for is in the menu, and works from there.
  const barWidth = async () => (await box(page, '[data-gantt-bar="2"]')).width;
  const before = await barWidth();
  await page.getByRole("button", { name: "More" }).click();
  for (const name of ["Task information", "Outdent", "Indent", "Link tasks", "Unlink tasks", "Zoom out", "Zoom in", "Go to project start", "Go to today"]) {
    assert.equal(await page.getByRole("menuitem", { name, exact: true }).count(), 1, `the menu lists ${name}`);
  }
  assert.equal(await page.getByRole("menuitemcheckbox", { name: "Critical path" }).count(), 1);
  await page.getByRole("menuitem", { name: "Zoom in", exact: true }).click();
  await page.waitForTimeout(300);
  assert.ok((await barWidth()) > before, "zooming in from the menu widens the bars");
  await page.context().close();
  // A wide bar keeps them as buttons and leaves them out of the menu.
  const wide = await open("default");
  assert.equal(await wide.getByRole("button", { name: "Zoom in", exact: true }).count(), 1);
  await wide.getByRole("button", { name: "More" }).click();
  assert.equal(await wide.getByRole("menuitem", { name: "Zoom in", exact: true }).count(), 0);
  await wide.context().close();
});

test("shows the table alone or the timeline alone", async () => {
  const page = await open("default", PHONE);
  const choose = async (name) => {
    await page.getByRole("button", { name: "More" }).click();
    await page.getByRole("menuitem", { name: /^Show:/ }).press("ArrowRight");
    await page.getByRole("menuitemradio", { name, exact: true }).press("Enter");
    await page.waitForTimeout(300);
  };
  await choose("Table only");
  const scroll = await box(page, '[data-gantt-slot="scroll"]');
  const grid = await box(page, '[data-gantt-slot="grid"]');
  assert.ok(Math.abs(grid.width - scroll.width) <= 16, `the table is ${grid.width}px of ${scroll.width}px`);
  assert.equal(await page.locator("[data-gantt-bar]").count(), 0);
  assert.equal(await page.locator('[data-gantt-slot="splitter"]').count(), 0);
  assert.equal(await page.locator('[data-gantt-slot="scroll"]').evaluate((element) => element.scrollWidth - element.clientWidth), 0, "nothing scrolls sideways behind the table");
  await choose("Timeline only");
  assert.equal(await page.locator('[data-gantt-slot="grid"]').count(), 0);
  assert.equal(await page.locator("[role=columnheader]").count(), 0);
  const bar = await box(page, '[data-gantt-bar="2"]');
  assert.ok(bar.x >= scroll.x && bar.x < scroll.x + scroll.width, `the plan starts ${Math.round(bar.x - scroll.x)}px into the chart`);
  // With the table off screen a typed key starts no cell edit, so the keys after it still act.
  await page.locator('[data-gantt-bar="2"]').click();
  await page.keyboard.press("x");
  await page.keyboard.press("Delete");
  await page.waitForTimeout(300);
  assert.equal(await page.locator('[data-gantt-bar="2"]').count(), 0, "Delete removes the selected task");
  await page.keyboard.press("ControlOrMeta+z");
  await page.waitForTimeout(300);
  assert.equal(await page.locator('[data-gantt-bar="2"]').count(), 1, "and undo brings it back");
  await choose("Table and timeline");
  assert.equal(await page.locator('[data-gantt-slot="grid"]').count(), 1);
  assert.ok((await page.locator("[data-gantt-bar]").count()) > 0);
  await page.context().close();
});

test("keeps the resource sheet's fields wide enough to type in on a phone", async () => {
  const page = await open("resources", { ...PHONE, ready: '[data-gantt-slot="resource-sheet"] input' });
  const sheet = await page.locator('[data-gantt-slot="resource-sheet"]').evaluate((element) => {
    const inputs = [...element.querySelectorAll("tbody tr:first-child input")].map((input) => input.getBoundingClientRect().width);
    const headings = [...element.querySelectorAll("thead th")].map((cell) => cell.getBoundingClientRect().height);
    return { narrowest: Math.min(...inputs), tallest: Math.max(...headings), scrolls: element.scrollWidth > element.clientWidth, pageOverflow: document.documentElement.scrollWidth - window.innerWidth };
  });
  assert.ok(sheet.narrowest >= 64, `the narrowest field is ${Math.round(sheet.narrowest)}px`);
  assert.ok(sheet.tallest <= 56, `a heading is ${Math.round(sheet.tallest)}px tall`);
  assert.ok(sheet.scrolls, "the sheet scrolls sideways inside itself");
  assert.ok(sheet.pageOverflow <= 0, "the page does not");
  await page.context().close();
});

test("gives the dated columns most of a phone's width in the usage views and the graph", async () => {
  for (const [story, slot, name] of [
    ["usage", "resource-usage", "[role=rowheader]"],
    ["task-usage-table", "task-usage", "[role=rowheader]"],
    ["graph", "resource-graph", "[data-gantt-resource] > div"],
  ]) {
    const page = await open(story, { ...PHONE, ready: `[data-gantt-slot="${slot}"] ${name}` });
    const share = await page.locator(`[data-gantt-slot="${slot}"]`).evaluate((element, selector) => element.querySelector(selector).getBoundingClientRect().width / element.clientWidth, name);
    assert.ok(share <= 0.41, `in ${story} the names take ${Math.round(share * 100)}% of the width`);
    await page.context().close();
  }
});

test("draws only the part of a long plan's usage table that is on screen", async () => {
  const page = await open("large-task-usage", { ready: '[data-gantt-slot="task-usage"] [role=cell]' });
  const drawn = () => page.locator('[data-gantt-slot="task-usage"]').evaluate((element) => ({ rows: element.querySelectorAll("[role=row]").length, cells: element.querySelectorAll("[role=cell]").length, total: Number(element.getAttribute("aria-rowcount")) }));
  const first = await drawn();
  assert.ok(first.total > 400, `the plan has ${first.total} lines`);
  assert.ok(first.rows < 60 && first.cells < 2500, `${first.rows} rows and ${first.cells} cells are in the page`);
  // Scrolling brings the later lines and columns in, still within the bound.
  await page.locator('[data-gantt-slot="task-usage"]').evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    element.scrollLeft = element.scrollWidth;
  });
  await page.waitForTimeout(300);
  const last = await drawn();
  assert.ok(last.rows < 60 && last.cells < 2500, `${last.rows} rows and ${last.cells} cells after scrolling`);
  const shown = await page.locator('[data-gantt-slot="task-usage"] [role=row]').last().getAttribute("aria-rowindex");
  assert.equal(Number(shown), last.total);
  await page.context().close();
});

test("lists a day's tasks by name under a phone-width calendar", async () => {
  const page = await open("calendar", { ...PHONE, ready: "[data-gantt-day]" });
  const list = page.locator('[data-gantt-slot="calendar-day-list"]');
  assert.equal(await list.locator("button").count(), 0);
  // Names have no room in the boxes: each shows marks and how many tasks it has.
  assert.equal(await page.locator("[data-gantt-day] button:visible").evaluateAll((buttons) => buttons.filter((button) => button.dataset.ganttSlot !== "calendar-day-marks").length), 0);
  const marks = page.locator('[data-gantt-slot="calendar-day-marks"]:visible');
  const count = Number((await marks.nth(2).textContent()).trim());
  await marks.nth(2).click();
  const names = await list.locator("button").allTextContents();
  assert.equal(names.length, count);
  assert.ok(names.every((name) => name.trim().length > 3), `the list names its tasks: ${names.join(", ")}`);
  await list.locator("button").first().click();
  await page.waitForSelector("[role=dialog]");
  await page.context().close();
});

test("fits the merge dialog and the XML notice inside a phone screen", async () => {
  const inside = (page, slot) =>
    page.locator(`[data-gantt-slot="${slot}"]`).evaluate((dialog) => {
      const edge = dialog.getBoundingClientRect();
      const spill = [...dialog.querySelectorAll("button, li, p, h2")]
        .map((element) => element.getBoundingClientRect())
        .filter((box) => box.width > 0 && (box.right > edge.right + 1 || box.left < edge.left - 1)).length;
      return { spill, left: edge.left, right: window.innerWidth - edge.right, bottom: window.innerHeight - edge.bottom };
    });
  const merge = await open("merge-conflicts", PHONE);
  await merge.locator('[data-gantt-row="2"] [data-gantt-slot="row-handle"]').dblclick();
  await merge.getByRole("dialog").getByLabel("Name").first().fill("Workshops (local)");
  await merge.keyboard.press("Tab");
  await merge.keyboard.press("Escape");
  await merge.getByRole("button", { name: "Receive changes" }).click();
  await merge.locator('[data-gantt-slot="merge-dialog"]').waitFor();
  const first = await inside(merge, "merge-dialog");
  assert.equal(first.spill, 0, `${first.spill} parts reach past the merge dialog`);
  assert.ok(first.left >= 0 && first.right >= 0 && first.bottom >= 0, `the merge dialog lies ${JSON.stringify(first)} from the screen's edges`);
  await merge.context().close();
  const notice = await open("default", PHONE);
  await notice.getByRole("button", { name: "More" }).click();
  await notice.getByRole("menuitem", { name: "Add recurring task" }).click();
  await notice.getByRole("dialog").getByLabel("Name").fill("Weekly sync");
  await notice.getByRole("button", { name: "Create" }).click();
  await notice.waitForFunction(() => !document.querySelector("[role=dialog]"));
  await notice.getByRole("button", { name: "More" }).click();
  await notice.getByRole("menuitem", { name: "Export MS Project XML" }).click();
  await notice.locator('[data-gantt-slot="exchange-notice"]').waitFor();
  const second = await inside(notice, "exchange-notice");
  assert.equal(second.spill, 0, `${second.spill} parts reach past the notice`);
  assert.ok(second.left >= 0 && second.right >= 0 && second.bottom >= 0, `the notice lies ${JSON.stringify(second)} from the screen's edges`);
  await notice.context().close();
});
