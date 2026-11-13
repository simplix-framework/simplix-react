[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / setTaskFinish

# Function: setTaskFinish()

> **setTaskFinish**(`project`, `schedule`, `id`, `finish`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:184](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L184)

Moves a task's finish to `finish`, keeping its start: the duration becomes
the working time between the two.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

### id

`string`

### finish

`number`

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-date` when the finish is before the start.
