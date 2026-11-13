// Drawing, editing, dragging and the other views.
import assert from "node:assert/strict";
import { test } from "node:test";

import { open, cells, box, drag } from "./helpers.mjs";

test("draws the plan and keeps only the rows on screen in the page", async () => {
  const page = await open("default");
  assert.equal(await page.locator("[data-gantt-row]").count(), 22);
  assert.equal(await page.locator("[data-gantt-link]").count(), 21);
  const large = await open("large-plan");
  const rows = await large.locator("[data-gantt-row]").count();
  assert.ok(rows > 10 && rows < 80, `a 5,000 row plan drew ${rows} rows`);
  await page.context().close();
  await large.context().close();
});

test("edits a cell in place and undoes it from the keyboard", async () => {
  const page = await open("default");
  await page.locator('[data-gantt-row="6"] [role=gridcell]').nth(1).dblclick();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.type("10d");
  await page.keyboard.press("Enter");
  assert.equal((await cells(page, "6"))[1], "10d");
  await page.keyboard.press("ControlOrMeta+z");
  assert.equal((await cells(page, "6"))[1], "8d");
  await page.context().close();
});

test("moves a bar by dragging it and resizes it from its right edge", async () => {
  const page = await open("default");
  const before = await cells(page, "6");
  const bar = await box(page, '[data-gantt-bar="6"]');
  // Two days at the opening zoom of 28 pixels a day.
  await drag(page, { x: bar.x + 40, y: bar.y + bar.height / 2 }, { x: bar.x + 96, y: bar.y + bar.height / 2 });
  const moved = await cells(page, "6");
  assert.notEqual(moved[2], before[2]);
  assert.equal(moved[1], before[1]);
  const after = await box(page, '[data-gantt-bar="6"]');
  await drag(page, { x: after.x + after.width - 2, y: after.y + after.height / 2 }, { x: after.x + after.width + 26, y: after.y + after.height / 2 });
  assert.equal((await cells(page, "6"))[1], "9d");
  await page.context().close();
});

test("draws a link by dragging from one bar's end onto another bar", async () => {
  const page = await open("default");
  const from = await box(page, '[data-gantt-bar="3"]');
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  const dot = await box(page, '[data-gantt-bar="3"] [data-gantt-slot="link-finish"]');
  const to = await box(page, '[data-gantt-bar="7"]');
  await drag(page, { x: dot.x + dot.width / 2, y: dot.y + dot.height / 2 }, { x: to.x + 6, y: to.y + to.height / 2 });
  assert.equal(await page.locator("[data-gantt-link]").count(), 22);
  assert.match((await cells(page, "7"))[4], /(^|,)3$/);
  await page.context().close();
});

test("lays the rows out under the header with the table beside the timeline", async () => {
  const page = await open("default");
  const header = await box(page, "[role=columnheader]");
  const row = await box(page, '[data-gantt-row="1"]');
  const bar = await box(page, '[data-gantt-bar="2"]');
  const grid = await box(page, '[data-gantt-slot="grid"]');
  assert.ok(row.y >= header.y + header.height - 1, "the first row starts under the header");
  assert.ok(bar.x >= grid.x + grid.width, "a bar starts to the right of the table");
  const second = await box(page, '[data-gantt-row="2"]');
  assert.ok(Math.abs(bar.y + bar.height / 2 - (second.y + second.height / 2)) <= 1, "a bar is centred on its row");
  await page.context().close();
});

test("groups, searches and opens the menu of a row", async () => {
  const page = await open("default");
  await page.getByRole("searchbox").fill("review");
  await page.waitForFunction(() => document.querySelectorAll("[data-gantt-row]").length < 22);
  const shown = await page.$$eval("[data-gantt-row]", (rows) => rows.map((row) => row.getAttribute("data-gantt-row")));
  assert.deepEqual(shown, ["5", "9", "15", "18"]);
  await page.getByRole("searchbox").fill("");
  await page.locator('[data-gantt-row="9"]').click({ button: "right" });
  assert.equal(await page.locator('[data-gantt-slot="row-menu"] [role=menuitem]').count(), 5);
  await page.keyboard.press("Escape");
  await page.context().close();
});

test("marks today and the status date on a plan around today", async () => {
  const page = await open("date-markers");
  const tags = await page.$$eval("[data-gantt-marker-tag]", (list) => list.map((tag) => tag.getAttribute("data-gantt-marker-tag")));
  assert.deepEqual(tags.sort(), ["projectFinish", "projectStart", "statusDate", "today"]);
  await page.context().close();
});

test("moves a bar under a finger", async () => {
  const page = await open("default", { hasTouch: true });
  const before = (await cells(page, "6"))[2];
  const bar = await box(page, '[data-gantt-bar="6"]');
  const y = bar.y + bar.height / 2;
  const client = await page.context().newCDPSession(page);
  const touch = (type, x) => client.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
  await touch("touchStart", bar.x + 40);
  for (const dx of [10, 25, 40, 56]) await touch("touchMove", bar.x + 40 + dx);
  await touch("touchEnd", 0);
  await page.waitForTimeout(200);
  assert.notEqual((await cells(page, "6"))[2], before, "a touch drag moved the task instead of scrolling the page");
  await page.context().close();
});

test("shows the plan as a network, a calendar, a resource graph and a task usage table", async () => {
  const network = await open("default");
  await network.getByRole("tab").nth(1).click();
  await network.waitForSelector("[data-gantt-node]");
  assert.equal(await network.locator("[data-gantt-node]").count(), 17);
  assert.equal(await network.locator("[data-gantt-edge]").count(), 21);
  // A successor sits in a column to the right of its predecessor.
  const a = await box(network, '[data-gantt-node="2"]');
  const b = await box(network, '[data-gantt-node="4"]');
  assert.ok(b.x > a.x + a.width);
  await network.getByRole("tab").nth(2).click();
  await network.waitForSelector("[data-gantt-day]");
  assert.equal(await network.locator("[data-gantt-day]").count(), 42);
  assert.ok((await network.locator("[data-gantt-day] button").count()) > 10, "the first month names the tasks of its days");
  await network.getByRole("tab").nth(5).click();
  await network.waitForSelector("[data-gantt-usage-task]");
  assert.ok((await network.locator("[data-gantt-usage-task]").count()) >= 8);
  assert.ok(Number(await network.locator('[data-gantt-slot="task-usage"]').getAttribute("aria-rowcount")) >= 30, "every task with resources has its lines");
  await network.getByRole("tab").nth(6).click();
  await network.waitForSelector('[data-gantt-slot="resource-graph"] svg');
  assert.equal(await network.locator('[data-gantt-slot="resource-graph"] svg').count(), 5);
  assert.ok((await network.locator('[data-gantt-slot="over"]').count()) > 0, "the overallocated days stand out in the graph");
  await network.context().close();
});

test("shows a read-only chart without letting it change", async () => {
  const page = await open("read-only");
  const before = await cells(page, "6");
  await page.locator('[data-gantt-row="6"] [role=gridcell]').nth(1).dblclick();
  assert.equal(await page.locator("[data-gantt-row] input").count(), 0);
  const bar = await box(page, '[data-gantt-bar="6"]');
  await drag(page, { x: bar.x + 40, y: bar.y + bar.height / 2 }, { x: bar.x + 96, y: bar.y + bar.height / 2 });
  await page.locator('[data-gantt-slot="scroll"]').press("Delete");
  assert.deepEqual(await cells(page, "6"), before);
  assert.equal(await page.locator("[data-gantt-row]").count(), 22);
  await page.context().close();
});

test("gathers tasks by resource with coloured bars and the progress line", async () => {
  const page = await open("grouped-by-resource");
  const groups = await page.locator("[data-gantt-group]").count();
  assert.equal(groups, 6);
  assert.equal(await page.locator('[data-gantt-slot="progress-line"]').count(), 1);
  const colours = await page.$$eval("[data-gantt-bar]", (bars) => [...new Set(bars.map((bar) => bar.style.borderColor).filter(Boolean))]);
  assert.ok(colours.length >= 3, `bars carry ${colours.length} colours`);
  // No bar is drawn on a heading row, and every bar still sits on a task row.
  const headings = await page.$$eval("[data-gantt-group]", (rows) => rows.map((row) => row.getBoundingClientRect().top));
  const bars = await page.$$eval("[data-gantt-bar]", (list) => list.map((bar) => bar.getBoundingClientRect().top + bar.getBoundingClientRect().height / 2));
  for (const top of headings) assert.ok(!bars.some((y) => y > top && y < top + 32), "a bar is drawn on a group heading");
  await page.context().close();
});

test("keeps text readable against its background", async () => {
  const page = await open("default");
  const ratios = await page.evaluate(() => {
    const parse = (value) => {
      const context = document.createElement("canvas").getContext("2d");
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };
    const luminance = ([r, g, b]) => [r, g, b].map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const background = (element) => {
      for (let at = element; at; at = at.parentElement) {
        const colour = parse(getComputedStyle(at).backgroundColor);
        if (colour[3] > 250) return colour;
      }
      return [255, 255, 255, 255];
    };
    const check = (selector) => {
      const element = document.querySelector(selector);
      const a = luminance(parse(getComputedStyle(element).color));
      const b = luminance(background(element));
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    return {
      cell: check('[data-gantt-row="2"] [role=gridcell]'),
      heading: check("[role=columnheader]"),
      timelineHeading: check('[data-gantt-slot="scale-cell"]'),
      rowNumber: check('[data-gantt-slot="row-handle"]'),
    };
  });
  for (const [name, ratio] of Object.entries(ratios)) assert.ok(ratio >= 4.5, `${name} has a contrast of ${ratio.toFixed(2)}`);
  await page.context().close();
});

const more = async (page, item) => {
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: item }).click();
};

test("adds a recurring task and changes its rule afterwards", async () => {
  const page = await open("default");
  await more(page, "Add recurring task");
  await page.getByRole("dialog").getByLabel("Name").fill("Weekly sync");
  await page.getByLabel("Occurrences").fill("3");
  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForFunction(() => document.querySelectorAll("[data-gantt-row]").length === 26);
  const names = () => page.$$eval("[data-gantt-row]", (rows) => rows.slice(22).map((row) => row.querySelector("[role=gridcell]").textContent.trim()));
  assert.deepEqual(await names(), ["Weekly sync", "Weekly sync 1", "Weekly sync 2", "Weekly sync 3"]);
  await page.locator('[data-gantt-row] [role=gridcell]', { hasText: /^Weekly sync$/ }).click();
  await more(page, "Add recurring task");
  assert.equal(await page.getByRole("heading", { name: "Edit recurring task" }).count(), 1);
  await page.getByLabel("Occurrences").fill("2");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForFunction(() => document.querySelectorAll("[data-gantt-row]").length === 25);
  assert.deepEqual(await names(), ["Weekly sync", "Weekly sync 1", "Weekly sync 2"]);
  await page.context().close();
});

test("fills a duration down the selected rows and filters from the menu", async () => {
  const page = await open("default");
  await page.locator('[data-gantt-row="6"] [role=gridcell]').nth(1).click();
  await page.locator('[data-gantt-row="8"] [role=gridcell]').nth(1).click({ modifiers: ["Shift"] });
  await page.keyboard.press("ControlOrMeta+d");
  assert.deepEqual([(await cells(page, "6"))[1], (await cells(page, "7"))[1], (await cells(page, "8"))[1]], ["8d", "8d", "8d"]);
  await page.getByRole("button", { name: "More" }).click();
  // The submenu is opened and its item chosen from the keyboard: a pointer that jumps
  // straight from the trigger to the item leaves the path the submenu stays open along.
  await page.getByRole("menuitem", { name: /^Filter/ }).press("ArrowRight");
  await page.getByRole("menuitemradio", { name: "Milestones" }).press("Enter");
  await page.waitForFunction(() => document.querySelectorAll("[data-gantt-row]").length < 22);
  const shown = await page.$$eval("[data-gantt-row]", (rows) => rows.map((row) => row.getAttribute("data-gantt-row")));
  assert.deepEqual(shown, ["1", "4", "19", "22"]);
  await page.context().close();
});

test("inserts a plan from a file as a subproject and edits a resource's dated rates", async () => {
  const page = await open("default");
  const download = page.waitForEvent("download");
  await more(page, "Export MS Project XML");
  const file = await (await download).path();
  await page.locator('[data-gantt-slot="subproject-file"]').setInputFiles(file);
  await page.waitForFunction(() => document.querySelectorAll("[data-gantt-row]").length > 22, undefined, { timeout: 20_000 });
  const grid = page.locator('[data-gantt-slot="scroll"]');
  await grid.evaluate((element) => (element.scrollTop = element.scrollHeight));
  await page.waitForTimeout(300);
  const last = await page.$$eval("[data-gantt-row]", (rows) => rows[rows.length - 1].querySelector("[data-gantt-slot=row-handle]").textContent.trim());
  assert.equal(last, "45");
  await page.getByRole("tab").nth(3).click();
  await page.locator('[data-gantt-resource="1"]').getByRole("button", { name: "Rates by date" }).click();
  await page.getByRole("button", { name: "Add rate" }).click();
  assert.equal(await page.locator('[data-gantt-slot="rate-table"] input[type=date]').count(), 1);
  await page.context().close();
});

