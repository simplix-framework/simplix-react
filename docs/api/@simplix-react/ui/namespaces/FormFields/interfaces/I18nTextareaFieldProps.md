[**Documentation**](../../../../../README.md)

***

[Documentation](../../../../../README.md) / [@simplix-react/ui](../../../README.md) / [FormFields](../README.md) / I18nTextareaFieldProps

# Interface: I18nTextareaFieldProps

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L14)

Shared props for all form field components.

## Extends

- [`CommonFieldProps`](../../../interfaces/CommonFieldProps.md)

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/shared/types.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L49)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`className`](../../../interfaces/CommonFieldProps.md#classname)

***

### description?

> `optional` **description**: `string`

Defined in: [packages/ui/src/crud/shared/types.ts:34](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L34)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`description`](../../../interfaces/CommonFieldProps.md#description)

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [packages/ui/src/crud/shared/types.ts:36](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L36)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`disabled`](../../../interfaces/CommonFieldProps.md#disabled)

***

### error?

> `optional` **error**: `string`

Defined in: [packages/ui/src/crud/shared/types.ts:32](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L32)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`error`](../../../interfaces/CommonFieldProps.md#error)

***

### label?

> `optional` **label**: `string`

Defined in: [packages/ui/src/crud/shared/types.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L30)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`label`](../../../interfaces/CommonFieldProps.md#label)

***

### labelKey?

> `optional` **labelKey**: `string`

Defined in: [packages/ui/src/crud/shared/types.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L31)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`labelKey`](../../../interfaces/CommonFieldProps.md#labelkey)

***

### languages

> **languages**: `LocaleConfig`[]

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:17](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L17)

***

### languageSelectorPlacement?

> `optional` **languageSelectorPlacement**: [`LanguageSelectorPlacement`](../../../type-aliases/LanguageSelectorPlacement.md)

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L24)

Where the language selector is drawn. Omitted, the installation's choice applies
(`UIProvider` `defaults.languageSelectorPlacement`, `"label"` unless set).

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

[`FieldVariant`](../../../interfaces/FieldVariant.md).[`layout`](../../../interfaces/FieldVariant.md#layout)

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:26](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L26)

***

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L16)

#### Parameters

##### value

[`I18nValue`](../type-aliases/I18nValue.md)

#### Returns

`void`

***

### onLanguageChange()?

> `optional` **onLanguageChange**: (`language`) => `void`

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:19](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L19)

#### Parameters

##### language

`string`

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string` \| [`I18nValue`](../type-aliases/I18nValue.md)

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L25)

***

### prefixControl?

> `optional` **prefixControl**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/types.ts:41](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L41)

Control rendered on the leading (left in LTR) side of the input, on the
same row. Use for IconPicker, ColorPicker, or similar adornments.

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`prefixControl`](../../../interfaces/CommonFieldProps.md#prefixcontrol)

***

### required?

> `optional` **required**: `boolean`

Defined in: [packages/ui/src/crud/shared/types.ts:35](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L35)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`required`](../../../interfaces/CommonFieldProps.md#required)

***

### resize?

> `optional` **resize**: `"none"` \| `"both"` \| `"vertical"`

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L29)

How the textarea resizes. Under the `inset` placement it does not, as the column takes its corner.

***

### rows?

> `optional` **rows**: `number`

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:27](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L27)

***

### selectedLanguage?

> `optional` **selectedLanguage**: `string`

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L18)

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"md"`

Defined in: [packages/ui/src/crud/shared/types.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L13)

#### Inherited from

[`FieldVariant`](../../../interfaces/FieldVariant.md).[`size`](../../../interfaces/FieldVariant.md#size)

***

### suffixControl?

> `optional` **suffixControl**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/types.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L48)

Control rendered on the trailing (right in LTR) side of the input, on the
same row. Use instead of composing a button next to the field — the
control stays aligned with the input while description and error render
below at full width.

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`suffixControl`](../../../interfaces/CommonFieldProps.md#suffixcontrol)

***

### textareaProps?

> `optional` **textareaProps**: `DetailedHTMLProps`\<`TextareaHTMLAttributes`\<`HTMLTextAreaElement`\>, `HTMLTextAreaElement`\>

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L30)

***

### value

> **value**: [`I18nValue`](../type-aliases/I18nValue.md)

Defined in: [packages/ui/src/fields/form/i18n-textarea-field.tsx:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/i18n-textarea-field.tsx#L15)

***

### warning?

> `optional` **warning**: `string`

Defined in: [packages/ui/src/crud/shared/types.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L33)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`warning`](../../../interfaces/CommonFieldProps.md#warning)
