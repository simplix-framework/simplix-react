// @vitest-environment jsdom
import { validateDefinition } from "@simplix-react/process-core";
import type { ProcessDefinition } from "@simplix-react/process-core";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProcessDiff } from "../components/edit/process-diff";
import { ProcessEditor } from "../components/edit/process-editor";
import type { EditorProblem } from "../components/edit/process-problems";
import { useProcessEditing } from "../lib/use-process-editing";
import type { ProcessEditing } from "../lib/use-process-editing";

const start: ProcessDefinition = {
  format: "simplix-process",
  version: 1,
  id: "review",
  name: "Review",
  lanes: [{ id: "author", label: "Author" }, { id: "reviewer", label: "Reviewer" }],
  sections: [
    {
      id: "main",
      label: "Main",
      steps: [
        { id: "draft", label: "Draft", acts: [{ id: "write", lanes: ["author"], kind: "do", label: "Write" }] },
        { id: "check", label: "Check", acts: [{ id: "read", lanes: ["reviewer"], kind: "check", label: "Read" }] },
      ],
    },
  ],
  jumps: [{ id: "back", from: "check", to: "draft", label: "Send back" }],
};

let editing: ProcessEditing;
function Harness({ problems }: { problems?: EditorProblem[] }) {
  editing = useProcessEditing(start);
  return <ProcessEditor editing={editing} problems={problems} renderFields={(target) => <span data-testid="own">{target.kind}</span>} />;
}

afterEach(cleanup);

const press = (root: HTMLElement, selector: string): void => {
  const element = root.querySelector<HTMLElement>(selector);
  if (element === null) throw new Error(`nothing matches ${selector}`);
  fireEvent.click(element);
};

describe("ProcessEditor", () => {
  it("edits through the panel, one operation a change, and undoes it", () => {
    const { container } = render(<Harness />);
    expect(container.querySelector('[data-process-slot="editor-panel"]')?.getAttribute("data-target")).toBe("process");

    press(container, '[data-process-do="add-lane"]');
    expect(editing.definition.lanes).toHaveLength(3);
    press(container, '[data-process-list="sections"] [data-process-do="add-step"]');
    expect(editing.definition.sections[0].steps).toHaveLength(3);
    // The new step is the one the panel shows.
    expect(container.querySelector('[data-process-slot="editor-panel"]')?.getAttribute("data-target")).toBe("step");

    const label = container.querySelector<HTMLInputElement>('[data-process-field="step-label"]');
    if (label === null) throw new Error("no step label field");
    fireEvent.change(label, { target: { value: "Publish" } });
    expect(editing.definition.sections[0].steps[2].label).not.toBe("Publish");
    fireEvent.blur(label);
    expect(editing.definition.sections[0].steps[2].label).toBe("Publish");

    press(container, '[data-process-do="step-up"]');
    expect(editing.definition.sections[0].steps.map((step) => step.label)).toEqual(["Draft", "Publish", "Check"]);
    expect(validateDefinition(editing.definition)).toEqual([]);

    for (let turn = 0; turn < 4; turn += 1) fireEvent.click(container.querySelectorAll<HTMLElement>('[data-process-slot="editor-bar"] button')[0]);
    expect(editing.definition).toBe(start);
    expect(editing.canUndo).toBe(false);
  });

  it("shows why an operation was refused and changes nothing", () => {
    const { container } = render(<Harness />);
    press(container, '[data-process-list="lanes"] [data-process-row="author"] [data-process-do="remove"]');
    expect(container.querySelector('[data-process-slot="editor-refusal"]')?.getAttribute("data-refusal")).toBe("lane-in-use");
    expect(editing.definition).toBe(start);
  });

  it("says what else an operation changed", () => {
    const { container } = render(<Harness />);
    press(container, '[data-process-open="draft"]');
    press(container, '[data-process-do="step-remove"]');
    expect(editing.definition.jumps).toEqual([]);
    expect(container.querySelector('[data-process-slot="editor-consequence"]')).not.toBeNull();
    // The step shown is gone, so the panel is back on the procedure.
    expect(container.querySelector('[data-process-slot="editor-panel"]')?.getAttribute("data-target")).toBe("process");
  });

  it("lists the caller's own problems and shows the part one is about", () => {
    const { container, getByTestId } = render(<Harness problems={[{ subject: "read", message: "No screen offers this act" }]} />);
    expect(container.querySelector('[data-process-slot="editor-count"]')?.getAttribute("data-problems")).toBe("1");
    press(container, '[data-process-problem="read"]');
    expect(container.querySelector('[data-process-slot="editor-panel"]')?.getAttribute("data-target")).toBe("act");
    expect(getByTestId("own").textContent).toBe("act");
  });
});

describe("ProcessEditor with the wording scope", () => {
  function Worded() {
    editing = useProcessEditing(start, { keepFlow: true });
    return <ProcessEditor editing={editing} scope="wording" lanesFor={() => ["reviewer"]} />;
  }

  it("offers no control that makes, removes or moves a step, an act or a jump", () => {
    const { container } = render(<Worded />);
    const controls = (): string[] => [...container.querySelectorAll("[data-process-do]")].map((element) => element.getAttribute("data-process-do") ?? "");
    // On the procedure: the lanes keep their order buttons, and nothing is added or removed.
    expect(new Set(controls())).toEqual(new Set(["up", "down"]));
    press(container, '[data-process-open="draft"]');
    expect(controls()).toEqual(["show"]);
    press(container, '[data-process-list="acts"] [data-process-do="show"]');
    expect(controls()).toEqual([]);
    expect(container.querySelector('[data-process-field="act-kind"]')).toBeNull();
  });

  it("changes a name and who is named for an act, and refuses a change of the flow", () => {
    const { container } = render(<Worded />);
    press(container, '[data-process-open="draft"]');
    const label = container.querySelector<HTMLInputElement>('[data-process-field="step-label"]');
    if (label === null) throw new Error("no step label field");
    fireEvent.change(label, { target: { value: "Write" } });
    fireEvent.blur(label);
    expect(editing.definition.sections[0].steps[0].label).toBe("Write");
    press(container, '[data-process-list="acts"] [data-process-do="show"]');
    // Only the lanes the caller allows, and the one the act stands in, are offered.
    expect([...container.querySelectorAll('[data-process-list="act-lanes"] [data-process-field]')].map((element) => element.getAttribute("data-process-field"))).toEqual(["act-lane-author", "act-lane-reviewer"]);
    press(container, '[data-process-field="act-lane-reviewer"]');
    expect(editing.definition.sections[0].steps[0].acts[0].lanes).toEqual(["reviewer"]);
    const refused = editing.apply({ type: "remove-step", id: "check" });
    expect(refused.ok ? "applied" : refused.refusal.code).toBe("flow-changed");
  });
});

describe("ProcessDiff", () => {
  it("marks what was added and changed on the drawing and lists every difference", () => {
    const after: ProcessDefinition = {
      ...start,
      sections: [{ ...start.sections[0], steps: [{ ...start.sections[0].steps[0], label: "Write the draft" }, start.sections[0].steps[1], { id: "publish", label: "Publish", acts: [{ id: "post", lanes: ["author"], kind: "do", label: "Post" }] }] }],
      jumps: [],
    };
    const { container } = render(<ProcessDiff before={start} after={after} />);
    const rows = [...container.querySelectorAll('[data-process-slot="diff-row"]')].map((row) => `${row.getAttribute("data-kind")} ${row.getAttribute("data-subject")} ${row.getAttribute("data-process-change")}`);
    expect(rows).toEqual(["changed step draft", "added step publish", "added act post", "removed jump back"]);
    expect(container.querySelectorAll('[data-mark="added"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-mark="changed"]').length).toBeGreaterThan(0);
  });

  it("says so when the versions are the same", () => {
    const { container } = render(<ProcessDiff before={start} after={start} />);
    expect(container.querySelector('[data-process-slot="diff-none"]')).not.toBeNull();
  });
});
