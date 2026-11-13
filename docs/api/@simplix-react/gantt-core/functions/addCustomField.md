[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / addCustomField

# Function: addCustomField()

> **addCustomField**(`project`, `field`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-extras.ts:59](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L59)

Adds a custom field to the plan. Omitted `id` takes the next free one.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### field

`Omit`\<[`CustomField`](../interfaces/CustomField.md), `"id"`\> & `object`

## Returns

[`Project`](../interfaces/Project.md)
