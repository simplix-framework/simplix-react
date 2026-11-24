[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / DateRangePickerProps

# Interface: DateRangePickerProps

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:91](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L91)

Props for the [DateRangePicker](../functions/DateRangePicker.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:114](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L114)

Additional class name for the trigger button.

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:112](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L112)

Disable the picker.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:96](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L96)

Id placed on the trigger button so an enclosing field label can point its
`htmlFor` at it — without it the label names nothing.

***

### locale?

> `optional` **locale**: `string`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:104](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L104)

Short locale code (e.g. `"ko"`, `"en"`, `"ja"`). Defaults to current i18n language.

***

### numberOfMonths?

> `optional` **numberOfMonths**: `1` \| `2`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:106](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L106)

Number of months to display.

#### Default Value

```ts
2
```

***

### onChange()

> **onChange**: (`range`) => `void`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:100](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L100)

Called when the range changes.

#### Parameters

##### range

[`DateRange`](DateRange.md)

#### Returns

`void`

***

### onReset()?

> `optional` **onReset**: () => `void`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:110](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L110)

Called when the field is cleared via the trigger's clear button. If not provided, onChange is called with an empty range.

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:102](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L102)

Placeholder text when no range is selected.

***

### value

> **value**: [`DateRange`](DateRange.md)

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:98](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L98)

Currently selected date range.

***

### yearsRange?

> `optional` **yearsRange**: `number`

Defined in: [packages/ui/src/base/inputs/date-range-picker.tsx:108](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/date-range-picker.tsx#L108)

Years range around current year for dropdowns.

#### Default Value

```ts
10
```
