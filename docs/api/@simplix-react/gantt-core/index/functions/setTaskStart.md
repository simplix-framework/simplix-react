[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / setTaskStart

# Function: setTaskStart()

> **setTaskStart**(`project`, `id`, `start`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:157](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L157)

Moves a task to start at `start`, keeping its duration. An automatic task
gets a start-no-earlier-than constraint (finish-no-later-than keeps its
meaning in a project scheduled from its finish); a manual task takes the
date as typed. A task that has started moves its actual start with it.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

### start

`number`

## Returns

[`Project`](../interfaces/Project.md)
