[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / decodeAddressedFilters

# Function: decodeAddressedFilters()

> **decodeAddressedFilters**(`filters`, `options?`): `Record`\<`string`, `unknown`\>

Defined in: [packages/ui/src/crud/list/addressed-filters.ts:122](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/addressed-filters.ts#L122)

Reads the filters a link carries as the committed values a list holds.

<p>The membership operators (`in`, `notIn`) always read as an array, a lone string included,
because the facet, country and timezone filters and the chip rows commit arrays and only draw a
badge for one. A toggle's `true` and `false` read as booleans and a number filter's value as a
number. Anything a control could not have committed is dropped rather than sent: a toggle holding
another word, a number holding text.

<p>A filter over a field the forced parameters pin with `equals` is dropped, and so is a key the
forced parameters set themselves. The request would carry the forced value over it, and the
control is hidden, so applying it would narrow the list with nothing on the screen to say so.

<p>The result is a new object every call. It never contains an empty string or an empty array.

## Parameters

### filters

What the address carries, usually `search.filters`.

`Readonly`\<`Record`\<`string`, `string` \| readonly `string`[]\>\> | `undefined`

### options?

[`DecodeAddressedFiltersOptions`](../interfaces/DecodeAddressedFiltersOptions.md) = `{}`

The controls the list draws and the parameters the page forces.

## Returns

`Record`\<`string`, `unknown`\>

The committed filter values, keyed by filter key.
