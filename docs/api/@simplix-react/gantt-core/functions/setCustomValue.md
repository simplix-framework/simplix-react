[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / setCustomValue

# Function: setCustomValue()

> **setCustomValue**(`project`, `taskId`, `fieldId`, `value`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-extras.ts:95](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L95)

Sets a task's value of a custom field; `undefined` clears it.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### taskId

`string`

### fieldId

`string`

### value

[`CustomValue`](../type-aliases/CustomValue.md) | `undefined`

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `unknown-reference` for a field the plan does not
have, and `invalid-operation` for a value of the wrong kind.
