// Sideways scrolling of the task table: pinned columns, the active cell, the wheel, the keyboard and paper.
import assert from "node:assert/strict";
import { test } from "node:test";

import { box, open } from "./helpers.mjs";

const scrollOf = (page) =>
  page.evaluate(() => ({
    table: document.querySelector('[data-gantt-slot="table-body"]').scrollLeft,
    header: document.querySelector("[role=columnheader]").closest(".overflow-hidden").scrollLeft,
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
