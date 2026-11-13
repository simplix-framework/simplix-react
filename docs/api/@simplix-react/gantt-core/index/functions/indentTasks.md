[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / indentTasks

# Function: indentTasks()

> **indentTasks**(`project`, `ids`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-outline.ts:41](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-outline.ts#L41)

Moves tasks one level deeper, with the tasks under them. A task with no
earlier row at its own level has nothing to go under and stays.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### ids

readonly `string`[]

## Returns

[`Project`](../interfaces/Project.md)
