[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / @simplix-react/gantt-core

# @simplix-react/gantt-core

Project scheduling engine with no runtime dependency and no UI: working calendars, dependency and constraint scheduling, critical path, baselines, resources and leveling, editing operations with undo, and Microsoft Project XML exchange.

`@simplix-react/gantt` draws a chart on top of it. Use this package alone to schedule on a server, in a worker or in a test.

## Installation

```bash
pnpm add @simplix-react/gantt-core
```

## Quick start

```ts
import { addLink, computeSchedule, createTask, formatLocalDateTime, insertTask, parseLocalDateTime, standardCalendar } from "@simplix-react/gantt-core";
import type { Project } from "@simplix-react/gantt-core";

let project: Project = {
  name: "Launch",
  scheduleFrom: "start",
  start: parseLocalDateTime("2026-03-02T08:00"),
  calendarId: "standard",
  minutesPerDay: 480,
  minutesPerWeek: 2400,
  daysPerMonth: 20,
  defaultStartTime: 480,
  defaultFinishTime: 1020,
  criticalSlackLimit: 0,
  honorConstraints: true,
  calendars: [standardCalendar()],
  tasks: [],
  links: [],
  resources: [],
  assignments: [],
  baselines: {},
};

project = insertTask(project, createTask(project, { id: "design", name: "Design", duration: 5 * 480 }));
project = insertTask(project, createTask(project, { id: "build", name: "Build", duration: 10 * 480 }));
project = addLink(project, { predecessorId: "design", successorId: "build" });

const schedule = computeSchedule(project);
const build = schedule.tasks.get("build");
console.log(build && formatLocalDateTime(build.start)); // 2026-03-09T08:00:00
console.log(build?.critical); // true
```

## Model

A `Project` is plain immutable data. Every operation takes a project and returns a new one, and the dates are never stored: `computeSchedule(project)` derives them.

| Record | Holds |
| --- | --- |
| `Task` | One row. Rows are kept in display order, and `outlineLevel` places a row under the nearest earlier row one level up. A row with rows under it is a summary task. |
| `Link` | A dependency: `FS`, `SS`, `FF` or `SF`, with a lag in working minutes, clock minutes or percent of the predecessor's duration. A negative lag is a lead. |
| `WorkCalendar` | Working time by weekday, with dated work weeks and exceptions, optionally inheriting from a base calendar. |
| `Resource`, `Assignment` | Who works on what, at which share of their time, for how much work. |
| `Baseline` | The dates every task had when the baseline was saved, by number 0 to 10. |
| `CustomField` | A text, number, date or flag field the plan adds to its tasks. |

Instants are whole minutes on the project's own wall clock (`Minutes`). No time zone is applied anywhere; `parseLocalDateTime` and `formatLocalDateTime` convert to and from `YYYY-MM-DDTHH:MM`.

## Scheduling

`computeSchedule` returns, for every task, `start`, `finish`, `earlyStart`, `earlyFinish`, `lateStart`, `lateFinish`, `totalSlack`, `freeSlack`, `critical`, the outline number (`wbs`) and the rolled-up progress, plus the state of every link (`violated`, `driving`) and a list of conflicts.

| Input | Effect |
| --- | --- |
| `scheduleFrom: "start"` | Tasks go as early as their links and constraints allow; late dates are read back from the resulting finish. `"finish"` does the reverse from `Project.finish`. |
| Constraint types | `asap`, `alap`, `must-start-on`, `must-finish-on`, `start-no-earlier-than`, `start-no-later-than`, `finish-no-earlier-than`, `finish-no-later-than`. |
| `honorConstraints` | When true a must-start-on, must-finish-on, start-no-later-than or finish-no-later-than date wins over a link, and the link is reported as violated. |
| `deadline` | Caps the late finish, so a missed deadline shows as negative slack and a `deadline-missed` conflict. |
| `mode: "manual"` | The task stays at `manualStart` and `manualFinish`; links into it are checked, not applied. |
| `actualStart`, `actualFinish` | A started task is held at its actual dates. |
| Task and resource calendars | A task works on its own calendar, or on its resources' calendars unless `ignoreResourceCalendar` is set. |
| `elapsed` | The duration or lag is counted on the clock, through nights and weekends. |
| Summary tasks | Take their dates from the tasks under them. A link on a summary task binds every task under it. |
| `splits` | A task pauses after a given amount of work for a given working time. Its finish moves by the pauses, its duration does not, and `TaskSchedule.segments` gives the stretches it works in. |

A project that cannot be scheduled at all (a dependency cycle, a calendar without working time, a reference to a missing record) raises a `ScheduleError` with a `code`. A broken link, constraint or deadline is not an error: the plan is scheduled and the break is listed in `Schedule.conflicts`.

### Agreement with Microsoft Project

The test suite reads plans that Microsoft Project 2002 to 2019 scheduled and saved, schedules them again, and compares the results. For each of the 1,248 automatic tasks in those plans the start, finish, early and late dates, total and free slack and the critical flag are equal.

What the plans exercise is narrow, and the comparison proves no more than that:

| Covered by the saved plans | Not covered by them |
| --- | --- |
| The four link types with a lag in days or weeks, on 64 linked tasks | Leads, elapsed and percent lags, links on summary tasks |
| As-soon-as-possible and start-no-earlier-than tasks, including a date ahead of the project start | The other six constraint types, deadlines |
| The standard calendar | Calendar exceptions, work weeks, task and resource calendars |
| Projects scheduled from their start | Projects scheduled from their finish |

The right-hand column is tested against values worked out by hand and against invariants over random plans (every link holds, no task loses or gains duration, slack is never negative without a missed date), not against Microsoft Project.

A manually scheduled task takes its dates from the file, so its dates say nothing about the scheduler. Microsoft Project does not derive a manual task's late dates and critical flag from its links the way it does for an automatic task, and those differ.

The sample files come from the MPXJ project (LGPL-2.1) and are not part of this package. `node scripts/fetch-oracle.mjs` fetches them into an ignored directory before the tests run.

## Editing

| Area | Functions |
| --- | --- |
| Rows | `createTask`, `insertTask`, `removeTasks`, `updateTask`, `indentTasks`, `outdentTasks`, `moveTask`, `copyTasks`, `pasteTasks` |
| Dates and progress | `setTaskStart`, `setTaskFinish`, `setTaskStartKeepingFinish`, `setTaskDuration`, `setPercentComplete` |
| Links | `addLink`, `updateLink`, `removeLinks` |
| Resources | `addResource`, `updateResource`, `removeResources`, `assignResource`, `updateAssignment`, `removeAssignments` |
| Project | `updateProject` |
| Calendars | `putCalendar`, `removeCalendar`, `standardCalendar`, `continuousCalendar`, `parseWorkingRanges`, `formatWorkingRanges` |
| Baselines | `setBaseline`, `clearBaseline`, `baselineVariance` |
| Splits | `splitTask`, `clearSplits` |
| Recurring tasks | `addRecurringTask`, `recurrenceDays` |
| Custom fields | `addCustomField`, `renameCustomField`, `removeCustomField`, `setCustomValue` |
| Costs | `computeCosts` |
| Resource load | `findOverallocations`, `resourceUsage`, `levelResources`, `clearLeveling` |
| Text entry | `parseDuration`, `formatDuration`, `parsePredecessors`, `formatPredecessors` |
| Undo | `createHistory`, `commit`, `undo`, `redo` |

Assignments follow the task type: on a fixed-units task a change of work moves the duration, on a fixed-duration task it moves the units, and an effort-driven task shares its work among the resources assigned to it.

`computeCosts` totals work and cost per task: a work resource's hourly `standardRate` for the hours of its assignment, a material resource's rate for its units, a `costPerUse` once per task and the task's own `fixedCost`, added up into summary tasks.

`addRecurringTask` adds a summary task with one task per occurrence of a daily, weekly or monthly recurrence, each held to its day by a start-no-earlier-than constraint.

`levelResources` delays tasks until no work resource is booked beyond its maximum units. It places tasks one at a time in dependency order, higher priority first, and only delays an automatic as-soon-as-possible task that has not started and whose priority is under 1000. It returns what it could not resolve.

## Microsoft Project XML

```ts
import { computeSchedule, readMspdi, writeMspdi } from "@simplix-react/gantt-core";

const { project, warnings } = readMspdi(xmlText);
const xml = writeMspdi(project, computeSchedule(project));
```

`readMspdi` returns the plan and a list of warnings for data it did not carry over. `writeMspdi` writes the plan with the computed dates, slack and outline numbers, in the element order of the files Microsoft Project saves.

Limits of the exchange:

- Reading every one of the 122 sample files, writing it and reading it back gives the same plan. Whether Microsoft Project opens a written file has not been tried.
- Costs, custom fields, splits and timephased data are not exchanged: they are dropped on read and not written.
- A leveling delay is read as zero, with a warning, and written as zero: the published unit of that field is contradictory. A leveled plan is exported with its leveled dates, and Microsoft Project recomputes them without the delays.

## License

MIT

## Classes

- [ScheduleError](classes/ScheduleError.md)

## Interfaces

- [Assignment](interfaces/Assignment.md)
- [BaselineEntry](interfaces/BaselineEntry.md)
- [BaselineVariance](interfaces/BaselineVariance.md)
- [CalendarException](interfaces/CalendarException.md)
- [CalendarWorkWeek](interfaces/CalendarWorkWeek.md)
- [CivilDateTime](interfaces/CivilDateTime.md)
- [CustomField](interfaces/CustomField.md)
- [DurationValue](interfaces/DurationValue.md)
- [History](interfaces/History.md)
- [HistoryEntry](interfaces/HistoryEntry.md)
- [LevelingResult](interfaces/LevelingResult.md)
- [Link](interfaces/Link.md)
- [LinkSchedule](interfaces/LinkSchedule.md)
- [MspdiReadResult](interfaces/MspdiReadResult.md)
- [MspdiWarning](interfaces/MspdiWarning.md)
- [Outline](interfaces/Outline.md)
- [Overallocation](interfaces/Overallocation.md)
- [PredecessorRef](interfaces/PredecessorRef.md)
- [Project](interfaces/Project.md)
- [Recurrence](interfaces/Recurrence.md)
- [Resource](interfaces/Resource.md)
- [ResourceUsage](interfaces/ResourceUsage.md)
- [Schedule](interfaces/Schedule.md)
- [ScheduleConflict](interfaces/ScheduleConflict.md)
- [Task](interfaces/Task.md)
- [TaskClipboard](interfaces/TaskClipboard.md)
- [TaskCost](interfaces/TaskCost.md)
- [TaskSchedule](interfaces/TaskSchedule.md)
- [TaskSplit](interfaces/TaskSplit.md)
- [WorkCalendar](interfaces/WorkCalendar.md)
- [WorkingRange](interfaces/WorkingRange.md)
- [WorkingTime](interfaces/WorkingTime.md)

## Type Aliases

- [Baseline](type-aliases/Baseline.md)
- [ConflictKind](type-aliases/ConflictKind.md)
- [ConstraintType](type-aliases/ConstraintType.md)
- [CustomFieldType](type-aliases/CustomFieldType.md)
- [CustomValue](type-aliases/CustomValue.md)
- [DurationUnit](type-aliases/DurationUnit.md)
- [Id](type-aliases/Id.md)
- [LagMode](type-aliases/LagMode.md)
- [LinkType](type-aliases/LinkType.md)
- [Minutes](type-aliases/Minutes.md)
- [MspdiWarningCode](type-aliases/MspdiWarningCode.md)
- [ProjectSettings](type-aliases/ProjectSettings.md)
- [ResourceType](type-aliases/ResourceType.md)
- [ScheduleErrorCode](type-aliases/ScheduleErrorCode.md)
- [TaskMode](type-aliases/TaskMode.md)
- [TaskType](type-aliases/TaskType.md)
- [UnitSizes](type-aliases/UnitSizes.md)
- [WeekPattern](type-aliases/WeekPattern.md)

## Variables

- [ELAPSED\_TIME](variables/ELAPSED_TIME.md)
- [MINUTES\_PER\_DAY](variables/MINUTES_PER_DAY.md)

## Functions

- [addCustomField](functions/addCustomField.md)
- [addLink](functions/addLink.md)
- [addRecurringTask](functions/addRecurringTask.md)
- [addResource](functions/addResource.md)
- [assignResource](functions/assignResource.md)
- [baselineVariance](functions/baselineVariance.md)
- [buildOutline](functions/buildOutline.md)
- [changeTask](functions/changeTask.md)
- [clearBaseline](functions/clearBaseline.md)
- [clearLeveling](functions/clearLeveling.md)
- [clearSplits](functions/clearSplits.md)
- [commit](functions/commit.md)
- [compileCalendars](functions/compileCalendars.md)
- [computeCosts](functions/computeCosts.md)
- [computeSchedule](functions/computeSchedule.md)
- [continuousCalendar](functions/continuousCalendar.md)
- [copyTasks](functions/copyTasks.md)
- [createHistory](functions/createHistory.md)
- [createTask](functions/createTask.md)
- [dayIndexOf](functions/dayIndexOf.md)
- [daysFromCivil](functions/daysFromCivil.md)
- [findOverallocations](functions/findOverallocations.md)
- [formatClockTime](functions/formatClockTime.md)
- [formatDuration](functions/formatDuration.md)
- [formatLocalDate](functions/formatLocalDate.md)
- [formatLocalDateTime](functions/formatLocalDateTime.md)
- [formatMspdiDuration](functions/formatMspdiDuration.md)
- [formatPredecessors](functions/formatPredecessors.md)
- [formatWorkingRanges](functions/formatWorkingRanges.md)
- [fromCivil](functions/fromCivil.md)
- [indentTasks](functions/indentTasks.md)
- [insertTask](functions/insertTask.md)
- [intersectWorkingTime](functions/intersectWorkingTime.md)
- [isAncestor](functions/isAncestor.md)
- [levelResources](functions/levelResources.md)
- [minutesPerUnit](functions/minutesPerUnit.md)
- [moveTask](functions/moveTask.md)
- [nextId](functions/nextId.md)
- [outdentTasks](functions/outdentTasks.md)
- [parseClockTime](functions/parseClockTime.md)
- [parseDuration](functions/parseDuration.md)
- [parseLocalDateTime](functions/parseLocalDateTime.md)
- [parseMspdiDuration](functions/parseMspdiDuration.md)
- [parsePredecessors](functions/parsePredecessors.md)
- [parseWorkingRanges](functions/parseWorkingRanges.md)
- [pasteTasks](functions/pasteTasks.md)
- [putCalendar](functions/putCalendar.md)
- [readMspdi](functions/readMspdi.md)
- [recurrenceDays](functions/recurrenceDays.md)
- [redo](functions/redo.md)
- [redoLabel](functions/redoLabel.md)
- [removeAssignments](functions/removeAssignments.md)
- [removeCalendar](functions/removeCalendar.md)
- [removeCustomField](functions/removeCustomField.md)
- [removeLinks](functions/removeLinks.md)
- [removeResources](functions/removeResources.md)
- [removeTasks](functions/removeTasks.md)
- [renameCustomField](functions/renameCustomField.md)
- [resourceUsage](functions/resourceUsage.md)
- [setBaseline](functions/setBaseline.md)
- [setCustomValue](functions/setCustomValue.md)
- [setPercentComplete](functions/setPercentComplete.md)
- [setTaskDuration](functions/setTaskDuration.md)
- [setTaskFinish](functions/setTaskFinish.md)
- [setTaskStart](functions/setTaskStart.md)
- [setTaskStartKeepingFinish](functions/setTaskStartKeepingFinish.md)
- [splitTask](functions/splitTask.md)
- [standardCalendar](functions/standardCalendar.md)
- [subtreeEnd](functions/subtreeEnd.md)
- [taskIndex](functions/taskIndex.md)
- [toCivil](functions/toCivil.md)
- [undo](functions/undo.md)
- [undoLabel](functions/undoLabel.md)
- [updateAssignment](functions/updateAssignment.md)
- [updateLink](functions/updateLink.md)
- [updateProject](functions/updateProject.md)
- [updateResource](functions/updateResource.md)
- [updateTask](functions/updateTask.md)
- [weekdayOfDay](functions/weekdayOfDay.md)
- [writeMspdi](functions/writeMspdi.md)
