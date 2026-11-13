[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / createTask

# Function: createTask()

> **createTask**(`project`, `patch?`): [`Task`](../interfaces/Task.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:39](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L39)

A new task with the defaults of the project: one estimated day, scheduled
automatically, as soon as possible (as late as possible in a project
scheduled from its finish).

## Parameters

### project

[`Project`](../interfaces/Project.md)

### patch?

`Partial`\<[`Task`](../interfaces/Task.md)\> = `{}`

## Returns

[`Task`](../interfaces/Task.md)
