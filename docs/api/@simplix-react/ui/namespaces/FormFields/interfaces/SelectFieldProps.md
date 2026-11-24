[**Documentation**](../../../../../README.md)

***

[Documentation](../../../../../README.md) / [@simplix-react/ui](../../../README.md) / [FormFields](../README.md) / SelectFieldProps

# Interface: SelectFieldProps\<T\>

Defined in: [packages/ui/src/fields/form/select-field.tsx:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L21)

Props for the [SelectField](../functions/SelectField.md) form component.

## Extends

- [`CommonFieldProps`](../../../interfaces/CommonFieldProps.md)

## Type Parameters

### T

`T` *extends* `string` = `string`

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/shared/types.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L49)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`className`](../../../interfaces/CommonFieldProps.md#classname)

***

### clearable?

> `optional` **clearable**: `boolean`

Defined in: [packages/ui/src/fields/form/select-field.tsx:62](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L62)

Offer an entry that returns the field to unset.

#### Remarks

A select can only ever move from one option to another, so a field the form declares optional
becomes permanent the moment somebody picks a value — the rank they set by mistake cannot be
taken off again, and the only way back is a column the screen does not offer. Pass this on
every select whose value the DTO accepts as absent.

The entry sits at the top of the list, labelled with [clearLabel](#clearlabel) or the framework's own
word for an empty choice, and hands `""` to `onChange`. Radix refuses an item whose value is
the empty string, so a sentinel carries it and is translated back before the caller sees it.

***

### clearLabel?

> `optional` **clearLabel**: `string`

Defined in: [packages/ui/src/fields/form/select-field.tsx:72](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L72)

What the clearing entry reads as.

#### Remarks

Defaults to `placeholder` — the field has already had to name its own empty state for the
trigger, and reading 「선택 안 함」 in the list and 「직위 없음」 on the trigger a moment later
is two words for one state on one control. Only where neither is given does the framework's
generic word stand in.

***

### compact?

> `optional` **compact**: `boolean`

Defined in: [packages/ui/src/fields/form/select-field.tsx:41](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L41)

Compact mode: renders without FieldWrapper, and sizes itself to its longest option label
using a hidden native `<select>`. That measurement also means `className` never reaches the
rendered element — pass `fill` when the parent has to own the width.

`error` and `description` still render, below the trigger, so a compact field placed in a
table cell reports why a save was refused. `label` becomes the trigger's accessible name;
`required` draws no visible marker here, because compact mode has no label row to draw one
in. A compact field that has to show a required marker gets it from whatever names the
column (`List.Column`'s `required`).

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

### fill?

> `optional` **fill**: `boolean`

Defined in: [packages/ui/src/fields/form/select-field.tsx:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L48)

Compact mode only: give the width back to the parent. The hidden measuring `<select>` is
dropped, the field fills its container, and `className` lands on the wrapper — so a grid or
flex cell can size the field instead of the option list doing it. No effect without `compact`;
the non-compact path already passes `className` to the wrapper.

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

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [packages/ui/src/fields/form/select-field.tsx:26](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L26)

Called when the selection changes.

#### Parameters

##### value

`T`

#### Returns

`void`

***

### options

> **options**: `object`[]

Defined in: [packages/ui/src/fields/form/select-field.tsx:28](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L28)

Available options with label/value pairs.

#### disabled?

> `optional` **disabled**: `boolean`

#### icon?

> `optional` **icon**: `ReactNode`

#### label

> **label**: `string`

#### tag?

> `optional` **tag**: `string`

#### value

> **value**: `T`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [packages/ui/src/fields/form/select-field.tsx:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L29)

***

### prefixControl?

> `optional` **prefixControl**: `ReactNode`

Defined in: [packages/ui/src/fields/form/select-field.tsx:90](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L90)

A control rendered to the LEFT of the trigger, on the trigger's own row.

#### Remarks

`TextField` has carried this pair since it needed an icon picker beside its input; a select
needs it for the same reason and could not have it, so every screen that wanted a button
beside a select built the row by hand — a grid for the width and a measured offset to put the
button level with the trigger rather than with the field's outer box, which is where a plain
flex row leaves it once an error line appears underneath.

`FieldWrapper` owns that geometry: the control takes `flex-1 min-w-0` and the adornment sits
beside it, so the trigger fills whatever the field is given instead of sizing to the option
that happens to be selected.

Non-compact only. `compact` measures itself against its longest option label and has no
wrapper to hang an adornment on.

#### Overrides

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`prefixControl`](../../../interfaces/CommonFieldProps.md#prefixcontrol)

***

### required?

> `optional` **required**: `boolean`

Defined in: [packages/ui/src/crud/shared/types.ts:35](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L35)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`required`](../../../interfaces/CommonFieldProps.md#required)

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"md"`

Defined in: [packages/ui/src/crud/shared/types.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L13)

#### Inherited from

[`FieldVariant`](../../../interfaces/FieldVariant.md).[`size`](../../../interfaces/FieldVariant.md#size)

***

### suffixControl?

> `optional` **suffixControl**: `ReactNode`

Defined in: [packages/ui/src/fields/form/select-field.tsx:92](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L92)

A control rendered to the RIGHT of the trigger, on the trigger's own row. See [SelectFieldProps.prefixControl](#prefixcontrol).

#### Overrides

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`suffixControl`](../../../interfaces/CommonFieldProps.md#suffixcontrol)

***

### value

> **value**: `T`

Defined in: [packages/ui/src/fields/form/select-field.tsx:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/form/select-field.tsx#L24)

Currently selected value.

***

### warning?

> `optional` **warning**: `string`

Defined in: [packages/ui/src/crud/shared/types.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/types.ts#L33)

#### Inherited from

[`CommonFieldProps`](../../../interfaces/CommonFieldProps.md).[`warning`](../../../interfaces/CommonFieldProps.md#warning)
