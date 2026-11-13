// Sideways scrolling of the task table: pinned columns, the active cell, the wheel, the keyboard and paper.
import assert from "node:assert/strict";
import { test } from "node:test";

import { box, drag, open } from "./helpers.mjs";

const scrollOf = (page) =>
  page.evaluate(() => ({
    table: document.querySelector('[data-gantt-slot="table-body"]').scrollLeft,
    header: document.querySelector('[data-gantt-slot="table-header"]').scrollLeft,
    bar: document.querySelector('[data-gantt-slot="table-scroller"]')?.scrollLeft,
    timeline: document.querySelector('[data-gantt-slot="scroll"]').scrollLeft,
  }));
const activeCell = (page, row) =>
  page.evaluate((id) => {
    const cell = [...document.querySelectorAll(`[data-gantt-row="${id}"] [role=gridcell]`)].find((element) => getComputedStyle(element).outlineStyle !== "none");
    const edge = cell?.getBoundingClientRect();
    return edge ? { left: edge.left, right: edge.right, column: cell.getAttribute("aria-colindex") } : null;
  }, row);

test("keeps the row numbers and the first column in place while the other columns scroll", async () => {
  const page = await open("default");
  const before = await page.evaluate(() => {
    const row = document.querySelector('[data-gantt-row="2"]');
    return [row.children[0], row.children[1], document.querySelector("[role=columnheader]")].map((element) => element.getBoundingClientRect().left);
  });
  await page.locator('[data-gantt-slot="table-scroller"]').evaluate((element) => (element.scrollLeft = element.scrollWidth));
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => {
    const row = document.querySelector('[data-gantt-row="2"]');
    const grid = document.querySelector('[data-gantt-slot="grid"]').getBoundingClientRect();
    const name = row.children[1].getBoundingClientRect();
    return {
      lefts: [row.children[0], row.children[1], document.querySelector("[role=columnheader]")].map((element) => element.getBoundingClientRect().left),
      // What lies on top a little inside the name cell, and where the last cell ends.
      onTop: document.elementFromPoint(name.left + 30, name.top + name.height / 2)?.closest("[role=gridcell]")?.getAttribute("aria-colindex"),
      lastRight: row.lastElementChild.getBoundingClientRect().right - grid.right,
    };
  });
  assert.deepEqual(after.lefts, before, "the row number, the name and the name's heading have not moved");
  assert.equal(after.onTop, "2", "the name cell covers the cells scrolled under it");
  assert.ok(Math.abs(after.lastRight) <= 1, `the last column ends ${after.lastRight}px from the table's edge`);
  const scroll = await scrollOf(page);
  assert.equal(scroll.table, scroll.bar);
  assert.equal(scroll.header, scroll.bar);
  await page.context().close();
});

test("scrolls the table to the active cell and to a column that was just added", async () => {
  const page = await open("default");
  const grid = await box(page, '[data-gantt-slot="grid"]');
  await page.locator('[data-gantt-row="2"] [role=gridcell]').first().click();
  for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  const last = await activeCell(page, 2);
  assert.equal(last.column, "7");
  assert.ok(last.right <= grid.x + grid.width + 1, `the active cell ends at ${last.right}, the table at ${grid.x + grid.width}`);
  // Back towards the start: the cell must clear the pinned name column, not hide under it.
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(200);
  const second = await activeCell(page, 2);
  const nameRight = await page.evaluate(() => document.querySelector('[data-gantt-row="2"]').children[1].getBoundingClientRect().right);
  assert.equal(second.column, "3");
  assert.ok(second.left >= nameRight - 1, `the active cell starts at ${second.left}, the pinned name ends at ${nameRight}`);
  // A column chosen from the list is brought into view.
  await page.locator('[data-gantt-slot="column-chooser-button"]').click();
  await page.getByRole("menuitemcheckbox", { name: "WBS" }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const added = await page.locator('[role=columnheader][data-gantt-column="wbs"]').boundingBox();
  assert.ok(added.x + added.width <= grid.x + grid.width + 1 && added.x >= nameRight - 1, `the new column lies at ${added.x} to ${added.x + added.width}`);
  await page.context().close();
});

test("moves the table and not the timeline when the wheel turns sideways over the table", async () => {
  const page = await open("default");
  const grid = await box(page, '[data-gantt-slot="grid"]');
  const before = await scrollOf(page);
  await page.mouse.move(grid.x + 300, grid.y + 150);
  await page.mouse.wheel(90, 0);
  await page.waitForTimeout(300);
  const after = await scrollOf(page);
  assert.equal(after.table, before.table + 90);
  assert.equal(after.bar, after.table);
  assert.equal(after.timeline, before.timeline, "the timeline stays where it was");
  // A downward wheel still scrolls the rows.
  const top = () => page.locator('[data-gantt-slot="scroll"]').evaluate((element) => element.scrollTop);
  const large = await open("large-plan");
  const largeGrid = await box(large, '[data-gantt-slot="grid"]');
  await large.mouse.move(largeGrid.x + 100, largeGrid.y + 150);
  await large.mouse.wheel(0, 200);
  await large.waitForTimeout(300);
  assert.equal(await large.locator('[data-gantt-slot="scroll"]').evaluate((element) => element.scrollTop), 200);
  assert.equal(await top(), 0);
  await large.context().close();
  await page.context().close();
});

test("resizes a column and the table from the keyboard", async () => {
  const page = await open("default");
  const width = (column) => page.locator(`[role=columnheader][data-gantt-column="${column}"]`).evaluate((cell) => Math.round(cell.getBoundingClientRect().width));
  const grip = page.locator('[role=columnheader][data-gantt-column="duration"] [data-gantt-slot="column-resize"]');
  await grip.focus();
  const start = await width("duration");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Shift+ArrowRight");
  assert.equal(await width("duration"), start + 40);
  assert.equal(await grip.getAttribute("aria-valuenow"), String(start + 40));
  await page.keyboard.press("Home");
  assert.equal(await width("duration"), start);
  // The arrow keys on a grip leave the selection and the active cell alone.
  assert.equal(await page.locator("[role=row][aria-selected=true]").count(), 0);
  const splitter = page.locator('[data-gantt-slot="splitter"]');
  const table = async () => Math.round((await box(page, '[data-gantt-slot="grid"]')).width);
  const opened = await table();
  await splitter.focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await table(), opened - 16);
  assert.equal(await splitter.getAttribute("aria-valuenow"), String(opened - 16));
  await page.keyboard.press("Shift+ArrowRight");
  assert.equal(await table(), opened + 48);
  await page.context().close();
});

test("prints every column of the table, from the first, whatever part of it was on screen", async () => {
  const page = await open("default");
  await page.evaluate(() => (window.print = () => {}));
  await page.locator('[data-gantt-slot="table-scroller"]').evaluate((element) => (element.scrollLeft = 200));
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: /Print/ }).first().click();
  await page.waitForFunction(() => !document.querySelector('[data-gantt-slot="table-scroller"]'));
  const paper = await page.evaluate(() => {
    const grid = document.querySelector('[data-gantt-slot="grid"]').getBoundingClientRect();
    const headings = [...document.querySelectorAll("[role=columnheader]")].map((cell) => cell.getBoundingClientRect());
    return { first: headings[0].left - grid.left, cut: headings.filter((cell) => cell.right > grid.right + 1 || cell.left < grid.left - 1).length, count: headings.length };
  });
  assert.equal(paper.count, 7);
  assert.ok(paper.first >= 0, `the first column prints ${Math.round(paper.first)}px from the table's left edge`);
  assert.equal(paper.cut, 0, `${paper.cut} columns reach past the printed table`);
  await page.context().close();
});

test("prints the rows the screen shows: a filter and a folded phase are left out on paper too", async () => {
  const page = await open("default");
  await page.evaluate(() => (window.print = () => {}));
  const all = await page.locator("[data-gantt-row]").count();
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: /^Filter:/ }).press("ArrowRight");
  await page.getByRole("menuitemradio", { name: "Critical", exact: true }).press("Enter");
  await page.waitForTimeout(300);
  const filtered = await page.locator("[data-gantt-row]").count();
  assert.ok(filtered > 0 && filtered < all, `the filter leaves ${filtered} of ${all} rows`);
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: /Print/ }).first().click();
  await page.waitForFunction(() => !document.querySelector('[data-gantt-slot="table-scroller"]') && !document.querySelector('[data-gantt-slot="splitter"]'));
  assert.equal(await page.locator("[data-gantt-row]").count(), filtered);
  assert.equal(await page.locator("[data-gantt-bar]").count(), filtered);
  await page.context().close();
});

test("moves a task by dragging it to another day of the calendar", async () => {
  const page = await open("calendar", { ready: "[data-gantt-calendar-task]" });
  const title = (await page.locator('[data-gantt-slot="calendar-title"]').textContent()).trim();
  assert.equal(title, "March 2026");
  // Task 2 works from 2 to 6 March; taken by its box on the 2nd and dropped on the 9th it starts a week later.
  const dayOf = (iso) => Math.floor(Date.UTC(...iso) / 86400000);
  const from = page.locator(`[data-gantt-day="${dayOf([2026, 2, 2])}"] [data-gantt-calendar-task="2"]`);
  const to = page.locator(`[data-gantt-day="${dayOf([2026, 2, 9])}"]`);
  const a = await from.boundingBox();
  const b = await to.boundingBox();
  await drag(page, { x: a.x + a.width / 2, y: a.y + a.height / 2 }, { x: b.x + b.width / 2, y: b.y + b.height - 8 });
  await page.waitForTimeout(300);
  assert.equal(await page.locator(`[data-gantt-day="${dayOf([2026, 2, 2])}"] [data-gantt-calendar-task="2"]`).count(), 0);
  assert.equal(await page.locator(`[data-gantt-day="${dayOf([2026, 2, 9])}"] [data-gantt-calendar-task="2"]`).count(), 1);
  assert.equal(await page.locator("[role=dialog]").count(), 0, "a drag does not open the task");
  // A click still opens it.
  await page.locator(`[data-gantt-day="${dayOf([2026, 2, 9])}"] [data-gantt-calendar-task="2"]`).click();
  await page.waitForSelector("[role=dialog]");
  await page.context().close();
  // A read-only chart does not move it.
  const fixed = await open("read-only");
  await fixed.getByRole("tab").nth(2).click();
  await fixed.waitForSelector("[data-gantt-calendar-task]");
  const c = await fixed.locator(`[data-gantt-day="${dayOf([2026, 2, 2])}"] [data-gantt-calendar-task="2"]`).boundingBox();
  const d = await fixed.locator(`[data-gantt-day="${dayOf([2026, 2, 9])}"]`).boundingBox();
  await drag(fixed, { x: c.x + c.width / 2, y: c.y + c.height / 2 }, { x: d.x + d.width / 2, y: d.y + d.height - 8 });
  await fixed.waitForTimeout(300);
  assert.equal(await fixed.locator(`[data-gantt-day="${dayOf([2026, 2, 2])}"] [data-gantt-calendar-task="2"]`).count(), 1);
  await fixed.context().close();
});

test("scrolls the table's columns under a finger, and the rows under a finger moving down", async () => {
  const page = await open("default", { viewport: { width: 375, height: 700 }, hasTouch: true, isMobile: true });
  await page.getByRole("button", { name: "More" }).tap();
  await page.getByRole("menuitem", { name: /^Show:/ }).press("ArrowRight");
  await page.getByRole("menuitemradio", { name: "Table only", exact: true }).press("Enter");
  await page.waitForTimeout(300);
  const session = await page.context().newCDPSession(page);
  const swipe = async (from, to) => {
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [from] });
    for (let i = 1; i <= 8; i++) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: from.x + ((to.x - from.x) * i) / 8, y: from.y + ((to.y - from.y) * i) / 8 }] });
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(600);
  };
  const table = await box(page, '[data-gantt-slot="table-body"]');
  const read = () =>
    page.evaluate(() => ({
      table: document.querySelector('[data-gantt-slot="table-body"]').scrollLeft,
      header: document.querySelector('[data-gantt-slot="table-header"]').scrollLeft,
      bar: document.querySelector('[data-gantt-slot="table-scroller"]').scrollLeft,
      rows: document.querySelector('[data-gantt-slot="scroll"]').scrollTop,
    }));
  await swipe({ x: table.x + 300, y: table.y + 200 }, { x: table.x + 120, y: table.y + 200 });
  const sideways = await read();
  assert.ok(sideways.table > 100, `a sideways swipe scrolled the table by ${sideways.table}px`);
  assert.equal(sideways.header, sideways.table, "the headings follow");
  assert.equal(sideways.bar, sideways.table, "and so does the bar");
  assert.equal(sideways.rows, 0);
  await swipe({ x: table.x + 250, y: table.y + 300 }, { x: table.x + 250, y: table.y + 120 });
  const down = await read();
  assert.ok(down.rows > 100, `a swipe upwards scrolled the rows by ${down.rows}px`);
  assert.equal(down.table, sideways.table);
  await page.context().close();
});

test("scrolls the columns under a dragged heading at the table's edge, so it can be dropped on one out of view", async () => {
  const page = await open("default");
  const order = () => page.$$eval("[role=columnheader]", (cells) => cells.map((cell) => cell.dataset.ganttColumn));
  assert.deepEqual(await order(), ["name", "duration", "start", "finish", "predecessors", "percentComplete", "resources"]);
  const grid = await box(page, '[data-gantt-slot="grid"]');
  const from = await box(page, '[role=columnheader][data-gantt-column="duration"]');
  await page.mouse.move(from.x + from.width / 2, from.y + 20);
  await page.mouse.down();
  // Held near the right edge, the pointer's small moves keep the columns coming.
  for (let i = 0; i < 60; i++) await page.mouse.move(grid.x + grid.width - 10 - (i % 2), from.y + 20);
  const scrolled = await page.locator('[data-gantt-slot="table-body"]').evaluate((element) => element.scrollLeft);
  assert.ok(scrolled > 200, `the table scrolled ${scrolled}px while the heading was held at its edge`);
  await page.mouse.up();
  await page.waitForTimeout(200);
  const after = await order();
  assert.ok(after.indexOf("duration") >= 4, `the heading was dropped at place ${after.indexOf("duration")}: ${after.join(", ")}`);
  await page.context().close();
});
