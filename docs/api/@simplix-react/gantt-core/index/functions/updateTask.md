[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / updateTask

# Function: updateTask()

> **updateTask**(`project`, `id`, `patch`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:98](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L98)

Changes fields of a task as given, with no side effect on other fields.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

### patch

`Partial`\<`Omit`\<[`Task`](../interfaces/Task.md), `"id"`\>\>

## Returns

[`Project`](../interfaces/Project.md)
