# @simplix-react/gantt

Project Gantt chart for React: a task table with inline editing beside a timeline with drag scheduling and dependency links, with critical path, baselines, a resource sheet, resource usage, undo and redo, and Microsoft Project XML exchange.

The chart is built from `@simplix-react/ui` components and theme tokens, and schedules with `@simplix-react/gantt-core`.

## Installation

```bash
pnpm add @simplix-react/gantt @simplix-react/gantt-core
```

Import the stylesheet once, after the framework theme, so Tailwind picks up the chart's classes:

```css
@import "tailwindcss";
@import "@simplix-react/ui/theme.css";
@import "@simplix-react/gantt/styles.css";
```

## Quick start

```tsx
import { Gantt } from "@simplix-react/gantt";
import type { Project } from "@simplix-react/gantt-core";

export function PlanPage({ plan, onSave }: { plan: Project; onSave: (plan: Project) => void }) {
  return (
    <div className="h-[720px]">
      <Gantt defaultProject={plan} onChange={(project) => onSave(project)} />
    </div>
  );
}
```

Mount the chart in a box with a height; it fills the box and scrolls inside it. The chart owns its plan from `defaultProject` on and reports every accepted change, undo and redo included, through `onChange(project, schedule, changes)`. `changes` lists the records that differ from the plan before it, which is what a server needs to store the edit.

To take in a plan changed elsewhere, such as an edit another user saved, call `store.getState().merge(base, theirs)`, where `base` is the plan both sides started from: records only the other side changed are taken, a record both changed keeps the version here and is returned as a conflict, and the undo history is kept. `sync(project)` replaces the plan outright.

A guide in Korean is in [docs/guide.ko.md](docs/guide.ko.md).

## What the chart does

| Area | Behaviour |
| --- | --- |
| Task table | Columns resize from the right edge of a heading, move by dragging the heading and are shown or hidden from the toolbar menu; rows move by dragging the row number. A right click on a row or a bar opens the commands for the selected tasks. Durations are written in the reader's language (`3일`, `2주`) and read in both that form and the letter form. Outline with collapsible summary tasks. Double-click, F2, Enter or typing edits a cell: name, duration (`3d`, `2w`, `4h`, `2ed`), start, finish, predecessors (`3`, `4SS+2d`, `5FF-1d`) and percent complete. |
| Timeline | Two-tier date header with seven zoom steps from quarters to hours, and non-working time shaded from the project calendar. |
| Filter, sort, group | The toolbar menu narrows the rows to critical, incomplete, completed, late or unassigned tasks, milestones, or one resource's tasks; orders them by a column; or gathers them under a heading per resource, per status or by whether they are critical. A search box narrows by name. |
| Bars | A bar carries resource names, the task name, its progress, its dates or nothing beside it, and takes the chart's colour, one of its own or one per resource. A progress line joins the progress of every task at the status date. The row number column marks a task that has notes or a dated constraint. |
| Other views | A network diagram, a month calendar, a resource graph of work against capacity, and a task usage table of hours per assignment. |
| Read-only | `readOnly` shows the plan and refuses every edit. |
| Layout | Column widths, order and visibility, zoom, folded rows, the view and the bar settings are one `layout` value, reported through `onLayoutChange` and handed back through `layout`. |
| Date markers | Today, the status date and the two ends of the plan each get a line in their own colour and a name tag on the header; today's day is tinted, and a button scrolls to it. The timeline widens to today when today lies within a year of the plan. The markers can be switched off, and the PDF carries them too. |
| Bars | Drag a bar to move it, an edge to resize it, the mark under it to set progress. Summary tasks draw as brackets and milestones as diamonds. A deadline draws as an arrow. |
| Links | Drag from the dot at a bar's end onto another bar: the ends you start from and drop on pick finish-to-start, start-to-start, finish-to-finish or start-to-finish. Click a line to select it and press Delete to remove it. A violated link is dashed. |
| Critical path | Critical tasks and the links that drive them are drawn in the destructive colour. |
| Baseline | Save the current dates, then show them as a thin bar under each task. The `startVariance` and `finishVariance` columns show how far each task has moved. |
| Project information | The plan's name, start or finish date, status date and calendar; the working time of each weekday and the exception days of every calendar. |
| Costs | The `work` and `cost` columns total each task from resource rates, costs per use and fixed costs, rolled up into summary tasks. |
| Custom fields | Text, number, date and flag fields are defined in the project information dialog, edited in the task information dialog and shown as `custom:<field id>` columns. |
| Split tasks | The task information dialog pauses a task from a date for a length of working time; the bar shows the pause as its dashed, empty part. |
| Recurring tasks | A dialog adds a summary task with one task per occurrence of a daily, weekly or monthly recurrence. |
| Clipboard | Copy puts the selected tasks on the system clipboard as tab-separated text; paste takes rows from a spreadsheet, one task per line with the name in the first cell and the duration in the second. |
| PDF | Draws the plan as an A4 landscape PDF file: the task table on every sheet, rows running down the sheets and the timeline across up to six. |
| Print | Lays the whole plan out for landscape paper: every row, at the zoom step that fits the page width, with the rest of the page left off. |
| Resources | The resource sheet edits resources; the task information dialog assigns them; the usage screen totals booked hours per day (per week for a long plan) and marks overallocated cells. |
| Leveling | Delays tasks until no resource is overallocated, optionally only within slack or by splitting tasks, and can clear the leveling again. |
| Progress | With a status date set, moves uncompleted work to after it, and shows planned value, earned value, actual cost and the schedule and cost variances as columns. |
| Conflicts | The conflict count opens a list of the tasks in conflict; choosing one selects it and scrolls to it. |
| Undo | Every edit is one step. Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redoes. |
| Exchange | Reads and writes Microsoft Project XML from the toolbar menu. |
| Large plans | Only the rows and header cells on screen are drawn. |

An edit the engine refuses (a dependency loop, a duration that is not one) leaves the plan unchanged and shows the reason under the toolbar.

### Keyboard

| Key | Action |
| --- | --- |
| Arrow up, Arrow down | Move the selection; with Shift, extend it |
| Arrow left, Arrow right, Tab | Move the active cell along the row |
| Alt+Arrow left, Alt+Arrow right | Move the selected tasks one working day |
| Ctrl/Cmd+wheel | Zoom the timeline |
| Ctrl/Cmd+D | Copy the active cell of the first selected row into the other selected rows |
| Insert | Add a task under the selected row |
| Delete | Remove the selected link, or else the selected tasks |
| F2, Enter, or any character | Edit the active cell of the selected task |
| Alt+Shift+Arrow right, Alt+Shift+Arrow left | Indent, outdent |
| Ctrl/Cmd+C, Ctrl/Cmd+V | Copy and paste tasks with the links among them |
| Escape | Clear the selection, or cancel a drag |

## Props

`Gantt` takes the props of `GanttProvider` and `GanttShell`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultProject` | `Project` | required | The plan the chart opens with |
| `onChange` | `(project, schedule) => void` | | Called after every accepted change |
| `columns` | `GanttColumnId[]` | `DEFAULT_COLUMNS` | Columns the task table opens with, in order. `BUILT_IN_COLUMNS` lists every built-in one; `custom:<field id>` shows a custom field |
| `levelingOptions` | `LevelingOptions` | `{}` | What leveling may do: `withinSlack`, `split` |
| `readOnly` | `boolean` | `false` | Shows the plan and refuses every edit |
| `layout` | `Partial<GanttLayout>` | | A stored layout to open with |
| `onLayoutChange` | `(layout) => void` | | Called with the whole layout when it changes |
| `defaultGridWidth` | `number` | fits the columns, up to 560 | Width the task table opens at |
| `weekStartsOn` | `number` | `0` | First day of a week column; 0 is Sunday |
| `zoom` | `number` | `4` | Index into `ZOOM_LEVELS` |
| `view` | `"gantt" \| "resources" \| "usage"` | `"gantt"` | Screen shown first |
| `showCriticalPath` | `boolean` | `false` | |
| `showLinks` | `boolean` | `true` | |
| `showMarkers` | `boolean` | `true` | Marks today, the status date and the ends of the plan |
| `baselineNumber` | `number \| null` | `null` | Baseline drawn under the bars |
| `xmlExchange` | `boolean` | `true` | Shows the Microsoft Project XML commands |
| `trailing` | `ReactNode` | | Extra controls at the end of the toolbar |
| `emptyState` | `ReactNode` | | Replaces the message of a plan without tasks |

## Not included

- The PDF file holds each sheet as an image, so its text cannot be selected or searched. Printing through the browser scales a wide plan to one page width; the PDF export is what splits it across sheets.
- Pasted spreadsheet rows carry a name and a duration. Dates, links and resources in further cells are not read.
- A recurring task is created once: changing its recurrence afterwards means deleting it and adding it again.
- Costs, custom fields and splits are not written to Microsoft Project XML.
- A subproject is inserted as a copy under a summary task. It is not kept in step with the file it came from, and its calendars, baselines and custom fields are not carried over.
- Changing a recurring task makes its occurrences again; progress and links on the old occurrences are not kept.
- Fill down copies names, durations, actual costs and custom fields. Dates and predecessors are not filled.
- The network diagram places tasks in columns by their depth in the chain and does not avoid lines crossing boxes.
- The end-to-end tests need Storybook running and Google Chrome installed; they are not part of `pnpm test`.
- Lags in a predecessor list are written with unit letters (`4SS+2d`) in every language.
- Reading and writing Microsoft Project XML runs on the main thread: a plan of 20,000 tasks holds the page for about half a second, with a loading mark shown.

## Composition

Use the parts when the standard shell does not fit:

```tsx
import { GanttChart, GanttProvider, GanttToolbar, ProjectDialog, TaskDialog, useGantt, useGanttStore } from "@simplix-react/gantt";

function FinishDate() {
  const finish = useGantt((state) => state.schedule.finish);
  return <span>{finish}</span>;
}

<GanttProvider defaultProject={plan} columns={["wbs", "name", "duration", "totalSlack"]}>
  <GanttToolbar trailing={<FinishDate />} />
  <GanttChart />
  <TaskDialog />
  <ProjectDialog />
</GanttProvider>;
```

`useGanttStore()` returns the chart's store. `store.getState().apply(label, edit)` runs any `@simplix-react/gantt-core` operation as one undo step, and `load(project)` replaces the plan.

## Translations

The chart registers English, Korean and Japanese under the `simplix-gantt` namespace when the package is imported. Import it before the application creates its i18n configuration.

## License

MIT
