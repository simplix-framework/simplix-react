[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / computeEarnedValue

# Function: computeEarnedValue()

> **computeEarnedValue**(`project`, `schedule`, `baselineNumber?`, `date?`): `Map`\<`string`, [`EarnedValue`](../interfaces/EarnedValue.md)\>

Defined in: [packages/gantt-core/src/progress.ts:95](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L95)

Computes earned value against a baseline as of a date (the status date when
omitted).

A task's planned value is its budget times the share of its baseline
working time that lies before the date; its earned value is its budget
times its percent complete. A summary task adds up the tasks under it, and
the entry under the empty id holds the whole project.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

### baselineNumber?

`number` = `0`

### date?

`number` | `undefined`

## Returns

`Map`\<`string`, [`EarnedValue`](../interfaces/EarnedValue.md)\>

## Throws

ScheduleError `invalid-date` when no date is given and the project
has no status date.
