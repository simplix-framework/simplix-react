[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / setTaskDuration

# Function: setTaskDuration()

> **setTaskDuration**(`project`, `id`, `minutes`, `options?`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:128](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L128)

Sets a task's duration. Assignments follow the task's type: fixed work
changes their units, the other types change their work. A recorded actual
finish is dropped, so a finished task ends where the new duration puts it.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

### minutes

`number`

### options?

#### elapsed?

`boolean`

#### estimated?

`boolean`

#### unit?

[`DurationUnit`](../type-aliases/DurationUnit.md)

## Returns

[`Project`](../interfaces/Project.md)
