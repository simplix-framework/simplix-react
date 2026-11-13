// Touch screens, contrast themes, what a screen reader is told about the table, and the shape of the dependency lines.
import assert from "node:assert/strict";
import { test } from "node:test";

import { box, cells, open } from "./helpers.mjs";

const TABLET = { hasTouch: true, isMobile: true, viewport: { width: 800, height: 600 } };

/** A bar that lies whole inside the timeline, and its middle. */
const barInView = (page) =>
  page.evaluate(() => {
    const bar = [...document.querySelectorAll('[data-gantt-kind="task"]')].find((candidate) => {
      const rect = candidate.getBoundingClientRect();
      return rect.width > 80 && rect.x > 400 && rect.right < 780;
    });
    const rect = bar.getBoundingClientRect();
    return { id: bar.dataset.ganttBar, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
const scrolled = (page) => page.locator('[data-gantt-slot="scroll"]').evaluate((element) => element.scrollLeft);

/** A finger goes down, optionally rests, travels sideways and lifts. */
async function swipe(page, from, dx, { rest = 0, dy = 0 } = {}) {
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: from.x, y: from.y }] });
  if (rest > 0) await page.waitForTimeout(rest);
  for (let step = 1; step <= 10; step++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: from.x + (dx * step) / 10, y: from.y + (dy * step) / 10 }] });
    await page.waitForTimeout(16);
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForTimeout(400);
}

for (const story of ["default", "read-only"]) {
  test(`scrolls the timeline with a finger that starts on a bar (${story})`, async () => {
    const page = await open(story, TABLET);
    const bar = await barInView(page);
    const before = await scrolled(page);
    const start = (await cells(page, bar.id)).join("|");
    await swipe(page, bar, -150);
    assert.ok((await scrolled(page)) - before >= 100, `the timeline moved ${(await scrolled(page)) - before}px`);
    assert.equal((await cells(page, bar.id)).join("|"), start, "the task stays where it was");
    await page.context().close();
  });
}

test("moves a bar with a finger that rests on it first, without scrolling", async () => {
  const page = await open("default", TABLET);
  const bar = await barInView(page);
  const before = await scrolled(page);
  const start = (await cells(page, bar.id)).join("|");
  await swipe(page, bar, 120, { rest: 450 });
  assert.equal(await scrolled(page), before, "the timeline stays where it was");
  assert.notEqual((await cells(page, bar.id)).join("|"), start, "the task has new dates");
  await page.context().close();
});

test("keeps every kind of bar filled in a contrast theme", async () => {
  const page = await open("critical-path-and-baseline", { forcedColors: "active" });
  const paint = await page.evaluate(() => {
    const canvas = getComputedStyle(document.body).backgroundColor;
    const fill = (selector) => {
      const element = document.querySelector(selector);
      return element ? getComputedStyle(element).backgroundColor : null;
    };
    const critical = document.querySelector('[data-gantt-kind="task"][data-gantt-critical]');
    return {
      canvas,
      summary: fill('[data-gantt-kind="summary"]'),
      milestone: fill('[data-gantt-kind="milestone"]:not([data-gantt-critical]) > [data-gantt-slot="milestone"]'),
      criticalMilestone: (() => {
        const diamond = document.querySelector('[data-gantt-critical] > [data-gantt-slot="milestone"]');
        return diamond && getComputedStyle(diamond).borderTopStyle;
      })(),
      progress: fill('[data-gantt-slot="progress"]'),
      baseline: fill('[data-gantt-slot="baseline"]'),
      critical: critical && getComputedStyle(critical).borderTopStyle,
      plain: getComputedStyle(document.querySelector('[data-gantt-kind="task"]:not([data-gantt-critical])')).borderTopStyle,
    };
  });
  for (const part of ["summary", "progress", "baseline"]) {
    assert.ok(paint[part], `the story draws a ${part}`);
    assert.notEqual(paint[part], paint.canvas, `the ${part} is filled`);
    assert.doesNotMatch(paint[part], /^rgba\(.*, 0\)$/, `the ${part} is not transparent`);
  }
  assert.equal(paint.critical, "double", "a critical task is told by its outline");
  // A screen reader is told what the outline and the diamond show.
  assert.match(await page.locator('[data-gantt-kind="task"][data-gantt-critical]').first().getAttribute("aria-label"), /, Critical$/);
  assert.match(await page.locator('[data-gantt-kind="milestone"]').first().getAttribute("aria-label"), /, Milestone/);
  assert.doesNotMatch(await page.locator('[data-gantt-kind="task"]:not([data-gantt-critical])').first().getAttribute("aria-label"), /Critical|Milestone/);
  assert.equal(paint.criticalMilestone, "double", "and so is a critical milestone");
  assert.notEqual(paint.plain, "double");
  await page.context().close();
  const plain = await open("default", { forcedColors: "active" });
  const diamond = await plain.locator('[data-gantt-slot="milestone"]').first().evaluate((element) => [getComputedStyle(element).backgroundColor, getComputedStyle(document.body).backgroundColor]);
  assert.notEqual(diamond[0], diamond[1], "a milestone is filled");
  await plain.context().close();
});

test("numbers the rows a screen reader counts in the order they are shown", async () => {
  const page = await open("default");
  const read = () =>
    page.locator('[data-gantt-slot="scroll"]').evaluate((grid) => {
      const indexes = [...grid.querySelectorAll('[role="row"]')].map((row) => Number(row.getAttribute("aria-rowindex")));
      return { count: Number(grid.getAttribute("aria-rowcount")), indexes: indexes.sort((a, b) => a - b) };
    });
  const numbered = (state) => assert.deepEqual(state.indexes, Array.from({ length: state.count }, (_, i) => i + 1));
  const whole = await read();
  numbered(whole);
  await page.locator('[data-gantt-slot="scroll"] button[aria-expanded="true"]').first().click();
  const folded = await read();
  assert.ok(folded.count < whole.count, "folding a summary task leaves fewer rows");
  numbered(folded);
  await page.context().close();
});

test("keeps the columns scrolling while a dragged heading rests at the table's edge", async () => {
  const page = await open("costs-and-custom-fields");
  const header = page.locator('[data-gantt-slot="table-header"]');
  const at = () => header.evaluate((element) => element.scrollLeft);
  const edge = await box(page, '[data-gantt-slot="table-header"]');
  const heading = await box(page, '[data-gantt-slot="table-header"] [role=columnheader]:nth-of-type(3)');
  await page.mouse.move(heading.x + 20, heading.y + heading.height / 2);
  await page.mouse.down();
  await page.mouse.move(edge.x + edge.width - 10, heading.y + heading.height / 2, { steps: 5 });
  const first = await at();
  await page.waitForTimeout(150);
  const later = await at();
  assert.ok(later > first, `the columns went from ${first} to ${later} with the pointer at rest`);
  // Every frame moves them on: nothing pulls them back to where a following box still is.
  const steps = await header.evaluate(
    (element) =>
      new Promise((resolve) => {
        const seen = [element.scrollLeft];
        const frame = () => {
          seen.push(element.scrollLeft);
          if (seen.length < 6) requestAnimationFrame(frame);
          else resolve(seen);
        };
        requestAnimationFrame(frame);
      }),
  );
  const limit = await header.evaluate((element) => element.scrollWidth - element.clientWidth);
  steps.slice(1).forEach((value, i) => assert.ok(value > steps[i] || value === limit, `the columns went ${steps.join(", ")}`));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const stopped = await at();
  await page.waitForTimeout(200);
  assert.equal(await at(), stopped, "the columns stop when the drag is given up");
  await page.mouse.up();
  await page.context().close();
});

test("scrolls the columns back when a dragged heading rests beside what is pinned", async () => {
  const page = await open("costs-and-custom-fields");
  const header = page.locator('[data-gantt-slot="table-header"]');
  await header.evaluate((element) => (element.scrollLeft = element.scrollWidth));
  await page.waitForTimeout(100);
  const from = await header.evaluate((element) => element.scrollLeft);
  assert.ok(from > 100, "the story's table has columns out of view");
  const pinned = await box(page, '[data-gantt-pinned][role=columnheader]');
  const heading = await box(page, '[data-gantt-slot="table-header"] [role=columnheader]:last-of-type');
  const y = heading.y + heading.height / 2;
  await page.mouse.move(heading.x + 20, y);
  await page.mouse.down();
  // Just right of the pinned column, far from the table's own left edge.
  await page.mouse.move(pinned.x + pinned.width + 10, y, { steps: 5 });
  await page.waitForTimeout(300);
  const after = await header.evaluate((element) => element.scrollLeft);
  assert.ok(after < from - 30, `the columns went from ${from} to ${after}`);
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await page.context().close();
});

test("scrolls the table with a finger that starts on a heading or on a row number", async () => {
  const page = await open("costs-and-custom-fields", TABLET);
  const header = page.locator('[data-gantt-slot="table-header"]');
  const order = () => page.$$eval("[role=columnheader]", (list) => list.map((cell) => cell.dataset.ganttColumn).join(","));
  const columns = await order();
  const heading = await box(page, '[role=columnheader][data-gantt-column="name"]');
  await swipe(page, { x: heading.x + heading.width - 40, y: heading.y + heading.height / 2 }, -120);
  assert.ok((await header.evaluate((element) => element.scrollLeft)) >= 80, "the columns moved under the finger");
  assert.equal(await order(), columns, "no column changed place");
  const handle = await box(page, '[data-gantt-row="8"] [data-gantt-slot="row-handle"]');
  const rows = page.locator('[data-gantt-slot="scroll"]');
  const names = () => page.$$eval("[data-gantt-row]", (list) => list.map((row) => row.dataset.ganttRow).join(","));
  const before = await names();
  await swipe(page, { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 }, 0, { dy: -150 });
  assert.ok((await rows.evaluate((element) => element.scrollTop)) >= 100, "the rows moved under the finger");
  await rows.evaluate((element) => (element.scrollTop = 0));
  await page.waitForTimeout(200);
  assert.equal(await names(), before, "no row changed place");
  await page.context().close();
});

test("draws every corner of a dependency line as a curve, on the timeline and on the network diagram", async () => {
  const page = await open("default");
  // Counts the curves of each line and the corners left sharp: two straight runs that meet at an angle.
  const shapes = (selector) =>
    page.$$eval(selector, (paths) =>
      paths.map((path) => {
        const numbers = (text) => text.trim().split(/[ ,]+/).map(Number);
        let at = null;
        let heading = null;
        let curves = 0;
        let sharp = 0;
        for (const [, command, rest] of path.getAttribute("d").matchAll(/([MLQ])([^MLQ]*)/g)) {
          const values = numbers(rest);
          const to = { x: values[values.length - 2], y: values[values.length - 1] };
          const from = command === "Q" ? { x: values[0], y: values[1] } : at;
          const next = from && (to.x !== from.x || to.y !== from.y) ? Math.atan2(to.y - from.y, to.x - from.x) : heading;
          if (command === "Q") curves += 1;
          else if (command === "L" && heading !== null && next !== null && Math.abs(next - heading) > 1e-6) sharp += 1;
          heading = next;
          at = to;
        }
        return { curves, sharp };
      }),
    );
  const links = await shapes('[data-gantt-link] path[stroke="currentColor"]');
  assert.equal(links.length, 21);
  assert.equal(links.filter((link) => link.sharp > 0).length, 0, "no line of the timeline has a sharp corner");
  assert.ok(links.every((link) => link.curves >= 2), "every line here turns at least twice");
  // The wide stroke that takes the pointer follows the same line.
  const pairs = await page.$$eval("[data-gantt-link]", (groups) => groups.map((group) => [...group.querySelectorAll("path")].map((path) => path.getAttribute("d"))));
  for (const [hit, drawn] of pairs) assert.equal(hit, drawn);
  await page.getByRole("tab").nth(1).click();
  await page.waitForSelector("[data-gantt-edge]");
  const edges = await shapes("[data-gantt-edge]");
  assert.equal(edges.length, 21);
  assert.equal(edges.filter((edge) => edge.sharp > 0).length, 0, "no line of the network diagram has a sharp corner");
  assert.ok(edges.some((edge) => edge.curves >= 2));
  await page.context().close();
});
