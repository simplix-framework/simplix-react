# @simplix-react/gantt

**English** | [한국어](/ko/packages/gantt/README.md)

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

To take in a plan changed elsewhere, such as an edit another user saved, call `store.getState().merge(base, theirs)`, where `base` is the plan both sides started from: records only the other side changed are taken, a record both changed keeps the version here and is returned as a conflict, and the undo history is kept. The chart then lists the conflicts in a dialog where the reader picks the records that take the other side's version; `settleMerge(conflicts)` does the same from code, and the choice is one undo step. `sync(project)` replaces the plan outright.

Store a plan with `serializeProject(project)` and read it back with `parseProject(text)`, both from `@simplix-react/gantt-core`: the stored text names its form and version, so a plan saved by a later version is refused instead of being misread, and a bare project stored earlier still opens.

A guide to building a plan screen, storing plans and keeping each reader's layout is in [docs/guide.md](/en/packages/gantt/docs/guide.md).

## What the chart does

| Area | Behaviour |
| --- | --- |
| Task table | Columns resize by dragging the grip on the right edge of a heading (a double click returns the default width), move by dragging the heading, which carries its name beside the pointer, marks the edge it would drop at with a line down the table and scrolls the columns when it is held at the table's edge, and are shown or hidden from the column button in the table corner and in the toolbar. When the columns are wider than the table, the table scrolls sideways by the bar under it or by a sideways wheel, under a finger, with the row numbers and the first column staying in place; it scrolls by itself to the active cell and to a column that was just added. The splitter between table and timeline resizes the table. A column grip and the splitter take the keyboard too: the arrow keys resize, Shift makes the step larger, Home returns a column to its default width. Rows move by dragging the row number, whose column is as wide as the longest number and the marks beside it need. A right click on a row or a bar opens the commands for the selected tasks. Durations are written in the reader's language (`3일`, `2주`) and read in both that form and the letter form. Outline with collapsible summary tasks. Double-click, F2, Enter or typing edits a cell: name, duration (`3d`, `2w`, `4h`, `2ed`), start, finish, predecessors (`3`, `4SS+2d`, `5FF-1d`) and percent complete. |
| Timeline | Two-tier date header with zoom steps from quarters to hours (`ZOOM_LEVELS`), and non-working time shaded from the project calendar. |
| Filter, sort, group | The toolbar menu narrows the rows to critical, incomplete, completed, late or unassigned tasks, milestones, or one resource's tasks; orders them by a column; or gathers them under a heading per resource, per status or by whether they are critical. A search box narrows by name. |
| Bars | A bar carries resource names, the task name, its progress, its dates or nothing beside it, and takes the chart's colour, one of its own or one per resource. A progress line joins the progress of every task at the status date. The row number column marks a task that has notes or a dated constraint. |
| Other views | A network diagram that zooms in steps and fits itself to the screen, with a line that skips columns routed between the boxes; a month calendar in which a task dragged onto another day moves by that many days; a resource graph of work against capacity; and a task usage table of hours per assignment. The usage tables and the graph draw only the rows and columns on screen. |
| Read-only | `readOnly` shows the plan and refuses every edit. |
| Layout | Column widths, order and visibility, zoom, folded rows, the view, whether the table, the timeline or both are shown, and the bar settings are one `layout` value, reported through `onLayoutChange` and handed back through `layout`. |
| Narrow screens | The task table opens at no more than 45% of the chart and never takes the whole of it, so the timeline stays in reach; the menu shows the table alone or the timeline alone. The views take a line of their own above the commands, as a strip or, where the strip does not fit, a list. A toolbar narrower than 560 px keeps undo, add, delete, the column list and search on the bar and lists the other commands in its menu. The usage views give the names at most two fifths of the width, the resource sheet scrolls sideways with fields wide enough to type in, the calendar marks each day's tasks and lists the chosen day's tasks by name, and dialogs lay their fields out in one column. |
| Date markers | Today, the status date and the two ends of the plan each get a line in their own colour and a name tag on the header, which stays whole beside the table while its date scrolls towards it and goes when the date is under the table; today's day is tinted, and a button scrolls to it. The timeline widens to today when today lies within a month of the plan. The markers can be switched off, and the PDF carries them too. |
| Bars | Drag a bar to move it, an edge to resize it, the mark under it to set progress. Summary tasks draw as brackets and milestones as diamonds. A deadline draws as an arrow. |
| Links | Drag from the dot at a bar's end onto another bar: the ends you start from and drop on pick finish-to-start, start-to-start, finish-to-finish or start-to-finish. Click a line to select it and press Delete to remove it. A violated link is dashed. A line takes each of its corners with a curve, on the timeline, on the network diagram and in the PDF. |
| Touch screens | A finger that moves at once scrolls the chart, wherever it goes down: on a bar, a column heading, a row number or a task of the calendar. A finger that rests for 300 ms picks the thing up and drags it. A mouse or a pen drags at once. |
| Contrast themes | Under forced colours (the Windows contrast themes) summary bars, milestones, progress, baselines, non-working time and the date markers keep a fill in the theme's own colours. A critical task has a double outline and a selected bar a highlight outline, since hue tells neither there. |
| Screen readers | The table is a grid whose rows are counted in the order they are shown, the heading row first. A bar is read as the task's name, dates and progress, and as a milestone or a critical task where it is one. |
| Critical path | Critical tasks and the links that drive them are drawn in the destructive colour. |
| Baseline | Save the current dates, then show them as a thin bar under each task. The `startVariance` and `finishVariance` columns show how far each task has moved. |
| Project information | The plan's name, start or finish date, status date and calendar; the working time of each weekday and the exception days of every calendar. |
| Costs | The `work` and `cost` columns total each task from resource rates, costs per use and fixed costs, rolled up into summary tasks. |
| Custom fields | Text, number, date and flag fields are defined in the project information dialog, edited in the task information dialog and shown as `custom:<field id>` columns. |
| Split tasks | The task information dialog pauses a task from a date for a length of working time; the bar shows the pause as its dashed, empty part. |
| Recurring tasks | A dialog adds a summary task with one task per occurrence of a daily, weekly or monthly recurrence. |
| Clipboard | Copy puts the selected tasks on the system clipboard as tab-separated text; paste takes rows from a spreadsheet, one task per line with the name in the first cell and the duration in the second. |
| PDF | Draws the plan as an A4 landscape PDF file: the task table on every sheet, rows running down the sheets and the timeline across up to six. It shows the rows of the screen, so what a filter or a folded summary task hides is left out, in the screen's order and bar colours, with the heading of each group of rows. The functions that draw it are exported from `@simplix-react/gantt/pdf`, and the chart loads them when a PDF is first asked for. |
| Print | Lays the plan out for landscape paper: every row the screen shows and every column of the table, at the zoom step that fits the page width, with the rest of the page left off. |
| Resources | The resource sheet edits resources; the task information dialog assigns them; the usage screen totals booked hours per day (per week for a long plan) and marks overallocated cells. |
| Leveling | Delays tasks until no resource is overallocated, optionally only within slack or by splitting tasks, and can clear the leveling again. |
| Progress | With a status date set, moves uncompleted work to after it, and shows planned value, earned value, actual cost and the schedule and cost variances as columns. |
| Conflicts | The conflict count opens a list of the tasks in conflict; choosing one selects it and scrolls to it. |
| Undo | Every edit is one step. Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redoes. |
| Exchange | Reads and writes Microsoft Project XML from the toolbar menu. Before an export the chart lists what of the plan the file has no place for, and after an import what was read differently from the file. |
| Plan files | Saves the plan to a `.gantt.json` file that holds all of it, and opens one. |
| Empty plan | A plan without tasks shows a button that adds the first one. |
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
| `onChange` | `(project, schedule, changes) => void` | | Called after every accepted change, with the records that differ from the plan before it |
| `columns` | `GanttColumnId[]` | `DEFAULT_COLUMNS` | Columns the task table opens with, in order. `BUILT_IN_COLUMNS` lists every built-in one; `custom:<field id>` shows a custom field |
| `levelingOptions` | `LevelingOptions` | `{}` | What leveling may do: `withinSlack`, `split` |
| `readOnly` | `boolean` | `false` | Shows the plan and refuses every edit |
| `layout` | `Partial<GanttLayout>` | | A stored layout to open with |
| `onLayoutChange` | `(layout) => void` | | Called with the whole layout when it changes |
| `defaultGridWidth` | `number` | fits the columns, up to 560 and 45% of the chart | Width the task table opens at |
| `weekStartsOn` | `number` | `0` | First day of a week column; 0 is Sunday |
| `zoom` | `number` | `4` | Index into `ZOOM_LEVELS` |
| `view` | `GanttView` | `"gantt"` | Screen shown first: `gantt`, `network`, `calendar`, `resources`, `usage`, `taskUsage` or `graph` |
| `showCriticalPath` | `boolean` | `false` | |
| `showLinks` | `boolean` | `true` | |
| `showMarkers` | `boolean` | `true` | Marks today, the status date and the ends of the plan |
| `baselineNumber` | `number \| null` | `null` | Baseline drawn under the bars |
| `xmlExchange` | `boolean` | `true` | Shows the Microsoft Project XML commands |
| `planFiles` | `boolean` | `true` | Shows the commands that save and open a plan file |
| `trailing` | `ReactNode` | | Extra controls at the end of the toolbar |
| `emptyState` | `ReactNode` | | Replaces the message of a plan without tasks |
| `className` | `string` | | Class names added to the chart's outer element |

## Not included

- The PDF file holds each sheet as an image, so its text cannot be selected or searched. Printing through the browser scales a wide plan to one page width; the PDF export is what splits it across sheets.
- Pasted spreadsheet rows carry a name and a duration. Dates, links and resources in further cells are not read.
- Microsoft Project XML has no place for the pauses of split tasks, the colours of single tasks, the rule of a recurring task or custom fields beyond the number Microsoft Project offers per type. The chart says so before an export.
- A custom field read from Microsoft Project XML has the id Microsoft Project gives it (`text1`, `number3`), so a `custom:<id>` column stored before an export and import has to be chosen again.
- A subproject is inserted as a copy under a summary task. It is not kept in step with the file it came from, and its calendars, baselines and custom fields are not carried over.
- Changing a recurring task makes its occurrences again; progress and links on the old occurrences are not kept.
- Fill down copies names, durations, actual costs and custom fields. Dates and predecessors are not filled.
- In the network diagram two lines can share a stretch of the gap between two rows or two columns.
- The end-to-end tests need Storybook running and Google Chrome installed; they are not part of `pnpm test`. Storybook takes the chart's stylesheet from the built package, so a change to `src/styles.css` needs `pnpm --filter @simplix-react/gantt build` first, and the tests stop when the two differ. They stop when Storybook serves an older copy of a source file than the one on disk, which a slow file watcher causes; restarting Storybook clears it, and starting it with `CHOKIDAR_USEPOLLING=1` keeps it from coming back on a machine where the watcher lags. The `Gantt` workflow runs them on changes to these packages.
- Touch was tried in Google Chrome. A pen drags at once like a mouse, so on a device where a pen also scrolls, the scroll can take the drag.
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

`useGanttStore()` returns the chart's store. `store.getState().apply(label, edit)` runs any `@simplix-react/gantt-core` operation as one undo step, and `load(project)` replaces the plan and forgets the undo history. `createGanttStore(project, options)` makes a store outside React.

The other screens are exported on their own too: `ResourceSheet`, `ResourceUsage`, `ResourceGraph`, `TaskUsage`, `CalendarView`, `NetworkDiagram`, `ColumnChooser` and `RecurringDialog`. `GanttShell` is the standard toolbar, screen and dialogs without the provider. The PDF functions `downloadPdf`, `layoutPdf`, `pdfRows`, `renderPdf` and `buildPdf` come from `@simplix-react/gantt/pdf`.

## Translations

The chart registers English, Korean and Japanese under the `simplix-gantt` namespace when the package is imported. Import it before the application creates its i18n configuration.

## License

MIT

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt/README.md" target="_blank" rel="noopener noreferrer">View source</a></p>
