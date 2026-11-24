[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / zoneDateTimeText

# Function: zoneDateTimeText()

> **zoneDateTimeText**(`zone`, `instant`, `locale`): `string` \| `null`

Defined in: [datetime/zone-time.ts:144](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-time.ts#L144)

An instant as the date and the time of day, in `zone`, as one string.

## Parameters

### zone

`string`

the IANA zone to read the instant in — the workplace's, never the browser's

### instant

the absolute instant

`string` | `Date` | `null` | `undefined`

### locale

`string`

the reader's locale

## Returns

`string` \| `null`

the date and time in that zone, or null when the instant is unset or malformed

## Remarks

For a value that shares its line with something else — a name, a verb — where `InstantText` would
draw a second element into a row that holds one. A row with its own line uses that component
instead.

<p>The locale is the reader's rather than a fixed one: the same screen renders this beside
translated labels, and a date that stays Korean while everything around it turns English is the
one value on the row nobody can read.
