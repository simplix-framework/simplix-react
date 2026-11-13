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

/** Every dependency as boxes and lines, by how deep a task sits in the chain. */
export const Network: Story = {
  render: () => <Gantt defaultProject={samplePlan()} view="network" />,
};

/** One month as a grid of days, each naming the tasks that work on it. */
export const Calendar: Story = {
  render: () => <Gantt defaultProject={samplePlan()} view="calendar" />,
};

/** Booked work against capacity, as a column per day for every resource. */
export const Graph: Story = {
  render: () => <Gantt defaultProject={samplePlan()} view="graph" />,
};

/** Hours per assignment and day, under each task. */
export const TaskUsageTable: Story = {
  render: () => <Gantt defaultProject={samplePlan()} view="taskUsage" />,
};

/** A long plan's assignments: only the lines and days on screen are drawn. */
export const LargeTaskUsage: Story = {
  render: () => <Gantt defaultProject={largePlan(40, 12, 6)} view="taskUsage" />,
};

/** A chart that shows its plan and refuses every edit. */
export const ReadOnly: Story = {
  render: () => <Gantt defaultProject={samplePlan()} readOnly />,
};

/** Tasks gathered by resource, with bars coloured by resource and the progress line on. */
export const GroupedByResource: Story = {
  render: () => (
    <Gantt
      defaultProject={{ ...samplePlan(), statusDate: samplePlan().start + 9 * 1440 }}
      layout={{ viewOptions: { filter: "all", resourceId: null, search: "", sort: "start", sortDescending: false, group: "resource" }, barColoring: "resource", barText: "name", showProgressLine: true }}
    />
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
