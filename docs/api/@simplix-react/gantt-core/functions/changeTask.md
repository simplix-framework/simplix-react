[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / changeTask

# Function: changeTask()

> **changeTask**(`project`, `id`, `change`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:17](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L17)

Returns the project with one task replaced by what `change` returns for it.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

### change

(`task`) => [`Task`](../interfaces/Task.md)

## Returns

[`Project`](../interfaces/Project.md)
