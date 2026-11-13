[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / insertTask

# Function: insertTask()

> **insertTask**(`project`, `task`, `index?`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:60](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L60)

Inserts a row at `index` (the end when omitted). An outline level deeper
than one under the row before it is pulled up to that depth.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### task

[`Task`](../interfaces/Task.md)

### index?

`number` = `project.tasks.length`

## Returns

[`Project`](../interfaces/Project.md)
