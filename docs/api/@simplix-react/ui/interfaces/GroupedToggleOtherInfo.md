[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / GroupedToggleOtherInfo

# Interface: GroupedToggleOtherInfo\<T\>

Defined in: [packages/ui/src/fields/form/grouped-toggle-field.tsx:56](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/grouped-toggle-field.tsx#L56)

Information passed to [GroupedToggleFieldProps.renderOtherNote](GroupedToggleFieldProps.md#renderothernote).

## Type Parameters

### T

`T` *extends* `string` = `string`

## Properties

### all

> **all**: `T`[]

Defined in: [packages/ui/src/fields/form/grouped-toggle-field.tsx:62](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/grouped-toggle-field.tsx#L62)

Flattened list of all out-of-catalog selected values.

***

### byGroup

> **byGroup**: `Record`\<`string`, `T`[]\>

Defined in: [packages/ui/src/fields/form/grouped-toggle-field.tsx:60](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/grouped-toggle-field.tsx#L60)

Out-of-catalog selected values keyed by group id.

***

### count

> **count**: `number`

Defined in: [packages/ui/src/fields/form/grouped-toggle-field.tsx:58](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/grouped-toggle-field.tsx#L58)

Total count of selected values not present in any group's catalog.
