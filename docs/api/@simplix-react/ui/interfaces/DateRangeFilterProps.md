[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / DateRangeFilterProps

# Interface: DateRangeFilterProps

Defined in: [packages/ui/src/crud/filters/date-range-filter.tsx:19](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/date-range-filter.tsx#L19)

Props for the [DateRangeFilter](../functions/DateRangeFilter.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/filters/date-range-filter.tsx:28](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/date-range-filter.tsx#L28)

***

### from

> **from**: `Date` \| `undefined`

Defined in: [packages/ui/src/crud/filters/date-range-filter.tsx:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/date-range-filter.tsx#L23)

Start date of the range, or `undefined` if unset.

***

### label

> **label**: `string`

Defined in: [packages/ui/src/crud/filters/date-range-filter.tsx:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/date-range-filter.tsx#L21)

Button label (e.g. `"Created"`, `"Updated"`).

***

### onChange()

> **onChange**: (`from?`, `to?`) => `void`

Defined in: [packages/ui/src/crud/filters/date-range-filter.tsx:27](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/date-range-filter.tsx#L27)

Called when the user selects or clears a date range.

#### Parameters

##### from?

`Date`

##### to?

`Date`

#### Returns

`void`

***

### to

> **to**: `Date` \| `undefined`

Defined in: [packages/ui/src/crud/filters/date-range-filter.tsx:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/date-range-filter.tsx#L25)

End date of the range, or `undefined` if unset.
