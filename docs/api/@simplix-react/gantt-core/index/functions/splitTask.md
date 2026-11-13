[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / splitTask

# Function: splitTask()

> **splitTask**(`project`, `schedule`, `id`, `at`, `gap`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-extras.ts:17](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L17)

Pauses a task at `at` for `gap` working minutes: the work before `at` stays
where it is and the rest resumes after the pause.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

### id

`string`

### at

`number`

### gap

`number`

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-operation` for a summary task, a milestone,
an instant outside the task's work, or a gap that is not above zero.
