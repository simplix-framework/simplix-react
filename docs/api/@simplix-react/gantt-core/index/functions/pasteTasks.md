[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / pasteTasks

# Function: pasteTasks()

> **pasteTasks**(`project`, `clipboard`, `beforeIndex`, `createId`, `outlineLevel?`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-outline.ts:124](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/edit-outline.ts#L124)

Inserts copied tasks before the row at `beforeIndex`, at `outlineLevel` or
as deep as the row above allows. Every pasted record gets a new id from
`createId`, and progress is not carried over.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### clipboard

[`TaskClipboard`](../interfaces/TaskClipboard.md)

### beforeIndex

`number`

### createId

(`kind`) => `string`

### outlineLevel?

`number` = `1`

## Returns

[`Project`](../interfaces/Project.md)
