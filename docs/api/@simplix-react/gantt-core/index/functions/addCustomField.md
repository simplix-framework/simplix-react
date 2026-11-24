[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / addCustomField

# Function: addCustomField()

> **addCustomField**(`project`, `field`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-extras.ts:61](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L61)

Adds a custom field to the plan. Omitted `id` takes the next free one.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### field

`Omit`\<[`CustomField`](../interfaces/CustomField.md), `"id"`\> & `object`

## Returns

[`Project`](../interfaces/Project.md)
