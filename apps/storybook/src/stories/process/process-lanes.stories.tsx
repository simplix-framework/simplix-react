import type { Meta, StoryObj } from "@storybook/react";
import { ProcessLanes } from "@simplix-react/process";
import type { ProcessTarget } from "@simplix-react/process";
import { useState } from "react";
import type { ReactNode } from "react";

import { documentReview, emptyProcess, equipmentInspection, inspectionFinished, largeProcess, longLabels, purchaseRequest, purchaseRunning, singleLane } from "./sample-processes";

const meta: Meta<typeof ProcessLanes> = {
  title: "Process/ProcessLanes",
  component: ProcessLanes,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ProcessLanes>;

/** A box of a stated width, standing in for a side panel or a narrow column on a wide screen. */
function Box({ width, children }: { width: number; children: ReactNode }) {
  return (
    <div data-testid="box" style={{ width, maxWidth: "100%" }} className="border border-dashed border-border">
      {children}
    </div>
  );
}

/** Keeps the picked target and draws what was picked, as an application would in its own panel. */
function Picking(props: React.ComponentProps<typeof ProcessLanes>) {
  const [selected, setSelected] = useState<ProcessTarget | null>(null);
  return (
    <ProcessLanes
      {...props}
      selected={selected}
      onSelect={setSelected}
      renderDetail={(target) => (
        <p data-testid="detail" className="m-0 text-sm">
          {target.kind} · {target.id}
          {target.ref === undefined ? "" : ` · ${target.ref}`}
        </p>
      )}
    />
  );
}

/** A purchase over the limit: every step, a rework jump, a jump ahead and an act two lanes perform together. */
export const Default: Story = {
  render: () => <Picking definition={purchaseRequest()} facts={{ large: true }} />,
};

/** The same procedure with no facts given: the step that depends on one is marked conditional. */
export const Conditional: Story = {
  render: () => <ProcessLanes definition={purchaseRequest()} />,
};

/** A purchase under the limit: the budget step is left out and the line passes it. */
export const Excluded: Story = {
  render: () => <ProcessLanes definition={purchaseRequest()} facts={{ large: false }} />,
};

/** The facts of the case switched from the controls panel. */
export const Facts: StoryObj<{ large: boolean; defect: boolean }> = {
  args: { large: true, defect: true },
  render: ({ large, defect }) => (
    <div className="flex flex-col gap-6">
      <ProcessLanes definition={purchaseRequest()} facts={{ large }} />
      <ProcessLanes definition={equipmentInspection()} facts={{ defect }} />
    </div>
  ),
};

/** A parallel run, a repeating step, a jump ahead and a jump out to another procedure. */
export const ParallelAndRepeat: Story = {
  render: () => <ProcessLanes definition={equipmentInspection()} facts={{ defect: true }} />,
};

/** Three jumps back into one step share one track. */
export const JumpsIntoOneStep: Story = {
  render: () => <ProcessLanes definition={documentReview()} facts={{ contract: true }} />,
};

/** A running case: done, in progress and waiting steps, with who holds the step in progress. */
export const Running: Story = {
  render: () => <ProcessLanes definition={purchaseRequest()} facts={{ large: true }} run={purchaseRunning()} />,
};

/** The reader's own lane tinted and named, on a running case. */
export const MyLane: Story = {
  render: () => <ProcessLanes definition={purchaseRequest()} facts={{ large: true }} run={purchaseRunning()} highlightLanes={["manager"]} />,
};

/** A finished case with a skipped step and a count on the repeating one. */
export const Finished: Story = {
  render: () => <ProcessLanes definition={equipmentInspection()} facts={{ defect: false }} run={inspectionFinished()} />,
};

/** Lane toggles above the procedure: a step with no act in the lanes shown folds to one line. */
export const LaneFilter: Story = {
  render: () => <ProcessLanes definition={purchaseRequest()} facts={{ large: true }} laneFilter />,
};

/** Only two of the four lanes drawn. */
export const TwoLanes: Story = {
  render: () => <ProcessLanes definition={purchaseRequest()} facts={{ large: true }} visibleLanes={["requester", "buyer"]} />,
};

export const SingleLane: Story = {
  render: () => <ProcessLanes definition={singleLane()} />,
};

export const Empty: Story = {
  render: () => <ProcessLanes definition={emptyProcess()} />,
};

/** Labels that wrap: long Korean, long English and words with no space to break at. */
export const LongLabels: Story = {
  render: () => <ProcessLanes definition={longLabels()} facts={{ f: true }} />,
};

/** Fourteen lanes and forty steps: wider than most boxes, so the grid scrolls and the titles stay. */
export const Large: Story = {
  render: () => (
    <div className="h-screen">
      <ProcessLanes definition={largeProcess()} className="h-full" />
    </div>
  ),
};

/** One column, whatever the width. */
export const Stack: Story = {
  render: () => <Picking definition={purchaseRequest()} facts={{ large: true }} layout="stack" run={purchaseRunning()} laneFilter />,
};

/** One column with a parallel run and an excluded step. */
export const StackParallel: Story = {
  render: () => <ProcessLanes definition={equipmentInspection()} facts={{ defect: false }} layout="stack" />,
};

/** A 360px side panel on a wide screen takes the one-column layout. */
export const SidePanel: Story = {
  render: () => (
    <Box width={360}>
      <ProcessLanes definition={purchaseRequest()} facts={{ large: true }} run={purchaseRunning()} />
    </Box>
  ),
};

/** A 620px box: too narrow for four lanes side by side, wide enough to scroll them. */
export const NarrowBox: Story = {
  render: () => (
    <Box width={620}>
      <ProcessLanes definition={purchaseRequest()} facts={{ large: true }} />
    </Box>
  ),
};
