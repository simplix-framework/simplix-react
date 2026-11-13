// Bringing a plan in and out: merging changes made elsewhere, and the plan file.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { cells, open } from "./helpers.mjs";

const rename = async (page, row, name) => {
  await page.locator(`[data-gantt-row="${row}"] [role=gridcell]`).first().dblclick();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type(name);
  await page.keyboard.press("Enter");
};

test("puts a record changed here and elsewhere to the reader, and takes the other side's version when asked", async () => {
  const page = await open("merge-conflicts");
  await rename(page, 2, "Workshops (local)");
  await page.getByRole("button", { name: "Receive changes" }).click();
  const dialog = page.locator('[data-gantt-slot="merge-dialog"]');
  await dialog.waitFor();
  // Task 3 was changed only there and is taken at once; task 2 was changed on both sides and waits.
  assert.equal(await dialog.locator("[data-gantt-conflict]").count(), 1);
  assert.match(await dialog.locator('[data-gantt-conflict="task:2"]').textContent(), /Task: Workshops \(local\)/);
  assert.equal((await cells(page, "3"))[0], "Current system survey (remote)");
  assert.equal((await cells(page, "2"))[0], "Workshops (local)");
  await dialog.getByRole("radio", { name: "Take theirs" }).click();
  await dialog.getByRole("button", { name: "Apply" }).click();
  assert.equal(await dialog.count(), 0);
  assert.equal((await cells(page, "2"))[0], "Requirements workshops (remote)");
  // Taking theirs is an edit like any other: it can be undone.
  await page.getByRole("button", { name: "Undo" }).click();
  assert.equal((await cells(page, "2"))[0], "Workshops (local)");
  await page.context().close();
});

test("keeps this side's version when the reader applies without choosing", async () => {
  const page = await open("merge-conflicts");
  await rename(page, 2, "Workshops (local)");
  await page.getByRole("button", { name: "Receive changes" }).click();
  const dialog = page.locator('[data-gantt-slot="merge-dialog"]');
  await dialog.getByRole("button", { name: "Apply" }).click();
  assert.equal(await dialog.count(), 0);
  assert.equal((await cells(page, "2"))[0], "Workshops (local)");
  // With nothing changed here, a merge has nothing to ask.
  const clean = await open("merge-conflicts");
  await clean.getByRole("button", { name: "Receive changes" }).click();
  await clean.waitForTimeout(300);
  assert.equal(await clean.locator('[data-gantt-slot="merge-dialog"]').count(), 0);
  assert.equal((await cells(clean, "2"))[0], "Requirements workshops (remote)");
  await clean.context().close();
  await page.context().close();
});

test("saves the plan to a file of its own form and opens it again", async () => {
  const page = await open("default");
  await rename(page, 2, "Kick-off workshops");
  const saved = page.waitForEvent("download");
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: "Save plan file" }).click();
  const file = await saved;
  assert.match(file.suggestedFilename(), /\.gantt\.json$/);
  const text = await readFile(await file.path(), "utf8");
  const stored = JSON.parse(text);
  assert.equal(stored.format, "simplix-gantt");
  assert.equal(stored.version, 1);
  // The file opens in a fresh chart with the edit in it.
  const other = await open("default");
  await other.locator('[data-gantt-slot="plan-file"]').setInputFiles({ name: "plan.gantt.json", mimeType: "application/json", buffer: Buffer.from(text) });
  await other.waitForFunction(() => document.querySelector('[data-gantt-row="2"] [role=gridcell]')?.textContent.trim() === "Kick-off workshops");
  // A plan stored before the form carried a version opens too; one from a later version is refused with its reason.
  await other.locator('[data-gantt-slot="plan-file"]').setInputFiles({ name: "old.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ ...stored.project, name: "Stored earlier" })) });
  await other.waitForTimeout(400);
  assert.equal(await other.locator("[role=alert]").count(), 0);
  await other.locator('[data-gantt-slot="plan-file"]').setInputFiles({ name: "later.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ ...stored, version: 2 })) });
  await other.locator("[role=alert]").waitFor();
  assert.match(await other.locator("[role=alert]").textContent(), /newer version/);
  assert.equal((await cells(other, "2"))[0], "Kick-off workshops");
  await other.context().close();
  await page.context().close();
});
