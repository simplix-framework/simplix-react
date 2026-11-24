[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / encodeAddressedFilters

# Function: encodeAddressedFilters()

> **encodeAddressedFilters**(`values`): [`CrudSearchFilters`](../type-aliases/CrudSearchFilters.md) \| `undefined`

Defined in: [packages/ui/src/crud/list/addressed-filters.ts:172](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/addressed-filters.ts#L172)

Writes the committed values a list holds as the filters a link carries.

<p>Strings stay as they are, numbers and booleans become their text, a date its ISO instant, and
an array its members. Empty values, empty arrays, objects and anything else a link cannot carry
are left out, so what is written is what a request would send.

## Parameters

### values

`Readonly`\<`Record`\<`string`, `unknown`\>\>

The list's committed filter values.

## Returns

[`CrudSearchFilters`](../type-aliases/CrudSearchFilters.md) \| `undefined`

The filters to write into the address, or `undefined` when none applies.
