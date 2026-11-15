import type { Meta, StoryObj } from "@storybook/react";
import { applyEdit } from "@simplix-react/process-core";
import type { EditOperation, ProcessDefinition } from "@simplix-react/process-core";
import { ProcessDiff, ProcessEditor, useProcessEditing } from "@simplix-react/process/edit";
import type { EditorProblem } from "@simplix-react/process/edit";

import { documentReview, emptyProcess, purchaseRequest } from "./sample-processes";

const meta: Meta<typeof ProcessEditor> = {
  title: "Process/ProcessEditor",
  component: ProcessEditor,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ProcessEditor>;

function Editing({ definition, problems }: { definition: ProcessDefinition; problems?: (definition: ProcessDefinition) => EditorProblem[] }) {
  const editing = useProcessEditing(definition);
  return <ProcessEditor editing={editing} facts={{ large: true }} problems={problems?.(editing.definition)} />;
}

/** A procedure picked apart on the drawing and edited in the panel: steps added, moved and removed, jumps added. */
export const Default: Story = {
  render: () => <Editing definition={purchaseRequest()} />,
};

/** Starting from nothing: a lane first, then a section and its steps. */
export const FromEmpty: Story = {
  render: () => <Editing definition={emptyProcess()} />,
};

/** A rule of the caller's own beside the format's: every step here has to hold a confirming act. */
export const OwnProblems: Story = {
  render: () => (
    <Editing
      definition={documentReview()}
      problems={(definition) => definition.sections.flatMap((section) => section.steps.filter((step) => !step.acts.some((act) => act.kind === "check")).map((step) => ({ subject: step.id, message: `${step.label}: no act confirms this step` })))}
    />
  ),
};

/** The editor in a narrow box: the panel stands under the drawing, which takes its one-column layout. */
export const Narrow: Story = {
  render: () => (
    <div data-testid="box" style={{ width: 375, maxWidth: "100%" }} className="border border-dashed border-border">
      <Editing definition={purchaseRequest()} />
    </div>
  ),
};

function edited(definition: ProcessDefinition, operations: EditOperation[]): ProcessDefinition {
  return operations.reduce((current, operation) => {
    const result = applyEdit(current, operation);
    return result.ok ? result.definition : current;
  }, definition);
}

/** Two versions compared: a step added, one renamed, one moved and a jump removed. */
export const Compared: Story = {
  render: () => {
    const before = purchaseRequest();
    const steps = before.sections.flatMap((section) => section.steps);
    const after = edited(before, [
      { type: "update-step", id: steps[0].id, patch: { label: `${steps[0].label} (revised)` } },
      { type: "add-step", section: before.sections[0].id, at: 1, step: { id: "added-step", label: "Added step", acts: [{ id: "added-act", lanes: [before.lanes[0].id], kind: "do", label: "Added act" }] } },
      { type: "move-step", id: steps[steps.length - 1].id, section: before.sections[before.sections.length - 1].id, to: 0 },
      ...(before.jumps[0] === undefined ? [] : [{ type: "remove-jump", id: before.jumps[0].id } as const]),
    ]);
    return <ProcessDiff before={before} after={after} facts={{ large: true }} />;
  },
};

/** The same version on both sides. */
export const ComparedSame: Story = {
  render: () => <ProcessDiff before={purchaseRequest()} after={purchaseRequest()} />,
};
