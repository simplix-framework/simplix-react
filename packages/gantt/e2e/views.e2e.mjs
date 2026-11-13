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

test("says what an XML export leaves out and what an import read differently", async () => {
  const page = await open("default");
  // The rule of a recurring task is something the XML file has no place for.
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: "Add recurring task" }).click();
  await page.getByRole("dialog").getByLabel("Name").fill("Weekly sync");
  await page.getByLabel("Occurrences").fill("3");
  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForFunction(() => document.querySelectorAll("[data-gantt-row]").length === 26);
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: "Export MS Project XML" }).click();
  const notice = page.locator('[data-gantt-slot="exchange-notice"]');
  await notice.waitFor();
  assert.match(await notice.textContent(), /Rules of recurring tasks: 1 tasks/);
  // Going on downloads the file.
  const download = page.waitForEvent("download");
  await notice.getByRole("button", { name: "Export anyway" }).click();
  assert.match((await download).suggestedFilename(), /\.xml$/);
  assert.equal(await notice.count(), 0);
  // A file whose link names a task that is not in it is read without the link, and says so.
  const xml = `<?xml version="1.0"?><Project xmlns="http://schemas.microsoft.com/project"><Name>Small</Name><ScheduleFromStart>1</ScheduleFromStart><StartDate>2024-01-01T08:00:00</StartDate><CalendarUID>1</CalendarUID>
<Calendars><Calendar><UID>1</UID><Name>Standard</Name><IsBaseCalendar>1</IsBaseCalendar><BaseCalendarUID>-1</BaseCalendarUID><WeekDays>${[2, 3, 4, 5, 6].map((day) => `<WeekDay><DayType>${day}</DayType><DayWorking>1</DayWorking><WorkingTimes><WorkingTime><FromTime>08:00:00</FromTime><ToTime>17:00:00</ToTime></WorkingTime></WorkingTimes></WeekDay>`).join("")}</WeekDays></Calendar></Calendars>
<Tasks><Task><UID>1</UID><Name>Only task</Name><OutlineLevel>1</OutlineLevel><Duration>PT8H0M0S</Duration><PredecessorLink><PredecessorUID>99</PredecessorUID><Type>1</Type></PredecessorLink></Task></Tasks></Project>`;
  await page.locator('input[type=file]:not([data-gantt-slot])').setInputFiles({ name: "small.xml", mimeType: "application/xml", buffer: Buffer.from(xml) });
  await notice.waitFor();
  assert.match(await notice.textContent(), /Links to tasks that are not in the file, skipped: 1/);
  await notice.getByRole("button", { name: "Close" }).first().click();
  assert.equal(await page.locator("[data-gantt-row]").count(), 1);
  await page.context().close();
});
