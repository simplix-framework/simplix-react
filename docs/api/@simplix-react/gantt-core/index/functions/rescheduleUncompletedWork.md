[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / rescheduleUncompletedWork

# Function: rescheduleUncompletedWork()

> **rescheduleUncompletedWork**(`project`, `schedule`, `date?`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/progress.ts:17](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L17)

Moves work that has not been done to after `date` (the status date when
omitted). A task that has not started gets a start-no-earlier-than
constraint at the date; a task in progress pauses where its completed work
ends and resumes at the date. Finished, manual and summary tasks are left.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

### date?

`number` | `undefined`

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-date` when no date is given and the project
has no status date.
