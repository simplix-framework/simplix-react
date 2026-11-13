[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / updateAssignment

# Function: updateAssignment()

> **updateAssignment**(`project`, `id`, `patch`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-links.ts:170](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-links.ts#L170)

Changes the units or the work of an assignment and settles the third value
by the task's type: fixed units and fixed work move the duration, fixed
duration moves the other of units and work.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

### patch

#### units?

`number`

#### work?

`number`

## Returns

[`Project`](../interfaces/Project.md)
