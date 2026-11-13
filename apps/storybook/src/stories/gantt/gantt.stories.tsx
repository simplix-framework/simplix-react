import type { Meta, StoryObj } from "@storybook/react";
import { Gantt } from "@simplix-react/gantt";

import { largePlan, planAroundToday, samplePlan } from "./sample-plan";

const meta: Meta<typeof Gantt> = {
  title: "Gantt/Gantt",
  component: Gantt,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="h-screen p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Gantt>;

/** A plan with phases, every link type, resources, progress and a baseline. */
export const Default: Story = {
  render: () => <Gantt defaultProject={samplePlan()} />,
};

/** Today, the status date and the ends of the plan, each marked with a line and a name tag. */
export const DateMarkers: Story = {
  render: () => <Gantt defaultProject={planAroundToday()} />,
};

/** The critical path and the saved baseline shown from the start. */
export const CriticalPathAndBaseline: Story = {
  render: () => <Gantt defaultProject={samplePlan()} showCriticalPath baselineNumber={0} />,
};

/** How far each task has moved from the saved baseline, as columns of the task table. */
export const BaselineVariance: Story = {
  render: () => (
    <Gantt
      defaultProject={samplePlan()}
      baselineNumber={0}
      columns={["wbs", "name", "duration", "start", "finish", "startVariance", "finishVariance", "totalSlack"]}
      defaultGridWidth={860}
    />
  ),
};

/** Work, cost and the plan's own custom fields as columns of the task table. */
export const CostsAndCustomFields: Story = {
  render: () => (
    <Gantt defaultProject={samplePlan()} columns={["name", "duration", "work", "cost", "custom:owner", "custom:risk"]} defaultGridWidth={760} />
  ),
};

/** The resource sheet. */
export const Resources: Story = {
  render: () => <Gantt defaultProject={samplePlan()} view="resources" />,
};

/** Booked hours per resource and day. */
export const Usage: Story = {
  render: () => <Gantt defaultProject={samplePlan()} view="usage" />,
};

/** Five thousand rows: only the rows on screen are drawn. */
export const LargePlan: Story = {
  render: () => <Gantt defaultProject={largePlan(250, 19)} zoom={3} />,
};

/** A plan without tasks. */
export const Empty: Story = {
  render: () => <Gantt defaultProject={{ ...samplePlan(), tasks: [], links: [], assignments: [], baselines: {} }} />,
};
