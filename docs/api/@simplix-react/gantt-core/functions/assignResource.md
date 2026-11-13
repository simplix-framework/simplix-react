[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / assignResource

# Function: assignResource()

> **assignResource**(`project`, `taskId`, `resourceId`, `units?`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-links.ts:125](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-links.ts#L125)

Assigns a resource to a task at `units` (1 is full time).

The first work resource takes the task's duration as its work. A further
one on an effort-driven task shares the existing work: the task shortens,
or keeps its length and lowers every unit when its duration is fixed.
Without effort-driven scheduling the new resource adds its own work.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### taskId

`string`

### resourceId

`string`

### units?

`number` = `1`

## Returns

[`Project`](../interfaces/Project.md)
