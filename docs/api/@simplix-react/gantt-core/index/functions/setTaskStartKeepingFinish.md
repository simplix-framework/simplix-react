[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / setTaskStartKeepingFinish

# Function: setTaskStartKeepingFinish()

> **setTaskStartKeepingFinish**(`project`, `schedule`, `id`, `start`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:203](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L203)

Moves a task's start to `start`, keeping its finish: the duration becomes
the working time between the two.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

### id

`string`

### start

`number`

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-date` when the start is after the finish.
