// The lanes without a pointer and without sight: what a screen reader is given, and where the keys go.
import assert from "node:assert/strict";
import { test } from "node:test";

import { close, open } from "./helpers.mjs";

const focused = (page) => page.evaluate(() => document.activeElement?.getAttribute("data-process-stop") ?? null);

for (const [story, width] of [
  ["default", 1440],
  ["stack", 375],
]) {
  test(`${story}: names the procedure, its sections, steps, acts and jumps, and hides the drawing`, async () => {
    const page = await open(story, { width });
    const root = page.locator("[data-process-root]");
    assert.equal(await root.getAttribute("role"), "group");
    assert.equal(await root.getAttribute("aria-label"), "구매 요청");
    assert.deepEqual(await page.getByRole("heading", { level: 3 }).allTextContents(), ["요청과 승인", "발주와 검수"]);
    assert.equal(await page.getByRole("region").count(), 2, "each section is a region named by its heading");
    // Every step is an item of its section's list, in order.
    const steps = await page.locator("[data-process-step]").evaluateAll((list) => list.map((item) => `${item.tagName}:${item.parentElement.tagName}:${item.dataset.processStep}`));
    assert.deepEqual(steps, ["draft", "budget", "approve", "quote", "place", "receive"].map((id) => `LI:OL:${id}`));
    // An act says what kind it is, what it is and who performs it; a jump says where it goes and why.
    const act = page.locator('[data-process-stop="act:review"]');
    const actName = (await act.getAttribute("aria-label")) ?? (await act.innerText());
    for (const part of ["Check", "필요성 검토", "부서장"]) assert.ok(actName.includes(part), `the act is named "${actName}"`);
    assert.equal(await page.locator('[data-process-stop="jump:rework"]').getAttribute("aria-label"), "Back to step 1: 보완 요청");
    // Lines, markers and lane headings are drawing; nothing of them reaches a screen reader.
    const drawn = await page.locator('[data-process-slot="lines"], [data-process-slot="marker-cell"], [data-process-slot="lane"], [data-process-slot="tag-cell"], [data-process-slot="rework-cell"]').evaluateAll((list) => list.filter((item) => item.getAttribute("aria-hidden") !== "true").length);
    assert.equal(drawn, 0);
    if (story === "default") assert.ok((await page.locator('[data-process-slot="lines"]').count()) > 20, "the lane grid draws its lines");
    await close(page);
  });

  test(`${story}: takes one Tab stop and moves between steps and inside a step with the arrow keys`, async () => {
    const page = await open(story, { width });
    assert.equal(await page.locator("[data-process-root] [data-process-stop][tabindex='0']").count(), 1, "one stop takes the Tab key");
    await page.locator('[data-process-stop="step:draft"]').focus();
    await page.keyboard.press("ArrowDown");
    assert.equal(await focused(page), "step:budget");
    await page.keyboard.press("ArrowUp");
    assert.equal(await focused(page), "step:draft");
    // Inside the step: its title, its acts in order, then its jump.
    const order = ["act:write", "act:review", "jump:direct"];
    for (const stop of order) {
      await page.keyboard.press("ArrowRight");
      assert.equal(await focused(page), stop);
    }
    await page.keyboard.press("ArrowRight");
    assert.equal(await focused(page), "jump:direct", "Right stays on the step's last stop");
    await page.keyboard.press("ArrowLeft");
    assert.equal(await focused(page), "act:review");
    await page.keyboard.press("End");
    assert.equal(await focused(page), "step:receive");
    await page.keyboard.press("Home");
    assert.equal(await focused(page), "step:draft");
    // The stop last focused is the one Tab comes back to.
    assert.equal(await page.locator("[data-process-root] [data-process-stop][tabindex='0']").getAttribute("data-process-stop"), "step:draft");
    await close(page);
  });

  test(`${story}: picks with Enter, and a jump's line takes the focus to the step it names`, async () => {
    const page = await open(story, { width });
    await page.locator('[data-process-stop="act:write"]').focus();
    await page.keyboard.press("Enter");
    assert.equal((await page.getByTestId("detail").innerText()).trim(), "act · write · screen:request-form");
    assert.equal(await page.locator('[data-process-stop="act:write"]').getAttribute("data-selected"), "true");
    await page.locator('[data-process-stop="jump:rework"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(await focused(page), "step:draft", "the jump back to step 1 lands on step 1");
    assert.equal((await page.getByTestId("detail").innerText()).trim(), "jump · rework");
    await close(page);
  });
}
