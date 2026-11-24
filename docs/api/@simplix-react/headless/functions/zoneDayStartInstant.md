[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / zoneDayStartInstant

# Function: zoneDayStartInstant()

> **zoneDayStartInstant**(`zone`, `day`): `string` \| `undefined`

Defined in: [datetime/zone-bounds.ts:149](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-bounds.ts#L149)

The instant a zone-local calendar day begins, as an offset-bearing RFC 3339 string.

## Parameters

### zone

`string`

IANA zone the day was picked in

### day

the picked calendar day, as a Date or an ISO string

`string` | `Date` | `null` | `undefined`

## Returns

`string` \| `undefined`

the instant that day begins, or undefined when there is no day

## Remarks

A date picker hands back a calendar day; a field typed as an instant needs a moment. Anchoring
that day to midnight in the display zone is the only conversion that keeps the date the operator
picked — browser midnight and UTC midnight both land on the neighbouring day for somebody in
another zone, and the record then reads back a day out.
