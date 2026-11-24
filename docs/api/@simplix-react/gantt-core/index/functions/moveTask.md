[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / moveTask

# Function: moveTask()

> **moveTask**(`project`, `id`, `beforeIndex`, `outlineLevel?`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-outline.ts:71](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/edit-outline.ts#L71)

Moves a task and the tasks under it so the task lands before the row now at
`beforeIndex` (the end when it equals the row count), at `outlineLevel` or
as deep as the row above allows.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

### beforeIndex

`number`

### outlineLevel?

`number`

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-operation` when the target is inside the
moved rows.
