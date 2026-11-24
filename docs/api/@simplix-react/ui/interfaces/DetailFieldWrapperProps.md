[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / DetailFieldWrapperProps

# Interface: DetailFieldWrapperProps

Defined in: [packages/ui/src/fields/shared/detail-field-wrapper.tsx:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/shared/detail-field-wrapper.tsx#L22)

Props for the [DetailFieldWrapper](../functions/DetailFieldWrapper.md) component.

## Extends

- `Partial`\<[`FieldVariant`](FieldVariant.md)\>

## Properties

### children

> **children**: `ReactNode`

Defined in: [packages/ui/src/fields/shared/detail-field-wrapper.tsx:28](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/shared/detail-field-wrapper.tsx#L28)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/fields/shared/detail-field-wrapper.tsx:27](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/shared/detail-field-wrapper.tsx#L27)

***

### label?

> `optional` **label**: `string`

Defined in: [packages/ui/src/fields/shared/detail-field-wrapper.tsx:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/shared/detail-field-wrapper.tsx#L24)

Visible label text for the field.

***

### labelKey?

> `optional` **labelKey**: `string`

Defined in: [packages/ui/src/fields/shared/detail-field-wrapper.tsx:26](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/shared/detail-field-wrapper.tsx#L26)

i18n key for label resolution.

***

### layout?

> `optional` **layout**: `"inline"` \| `"left"` \| `"top"` \| `"hidden"` \| `"trailing"`

Defined in: [packages/ui/src/crud/shared/types.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L12)

Label placement. `"top"` stacks the label above the input, `"left"` puts
it in a leading column, `"inline"` keeps label and input on one row,
`"trailing"` right-aligns the control with a dashed leader line from the
label (settings-row style, used by toggle fields), `"hidden"` renders the
label for screen readers only.

#### Inherited from

[`FieldVariant`](FieldVariant.md).[`layout`](FieldVariant.md#layout)

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"md"`

Defined in: [packages/ui/src/crud/shared/types.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L13)

#### Inherited from

[`FieldVariant`](FieldVariant.md).[`size`](FieldVariant.md#size)
