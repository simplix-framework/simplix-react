[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / viewRows

# Function: viewRows()

> **viewRows**(`project`, `schedule`, `collapsed`, `view`): [`ViewRow`](../type-aliases/ViewRow.md)[]

Defined in: [lib/view-rows.ts:109](https://github.com/simplix-react/simplix-react/blob/main/lib/view-rows.ts#L109)

The rows a chart draws under a view.

A filter or a search keeps the matching tasks and the summary tasks above
them, so each match still shows where it belongs. A sort orders the tasks
under each summary task, leaving the outline whole. A group drops the
outline: the tasks without tasks under them are gathered under one heading
per group, and a task with several resources appears under each of them.

## Parameters

### project

`Project`

### schedule

`Schedule`

### collapsed

`ReadonlySet`\<`string`\>

### view

[`ViewOptions`](../interfaces/ViewOptions.md)

## Returns

[`ViewRow`](../type-aliases/ViewRow.md)[]
