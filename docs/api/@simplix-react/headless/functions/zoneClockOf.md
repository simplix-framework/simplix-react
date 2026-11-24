[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / zoneClockOf

# Function: zoneClockOf()

> **zoneClockOf**(`zone`, `instant`): `string` \| `null`

Defined in: [datetime/zone-time.ts:52](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-time.ts#L52)

The zone-local `HH:mm` of an instant, or null when it is unset or malformed.

<p><b>For a row that already says which day it is on.</b> A change history bands its rows by
calendar day and then says the time on each — repeating the date twenty times is the noise the
bands exist to remove. `InstantText` draws a whole datetime or a whole date and nothing between,
so the clock is assembled here rather than at the screen: the browser's own zone is one
`getHours()` away at every call site, and a history that silently reads eight hours off is
indistinguishable from one that is right.

## Parameters

### zone

`string`

the IANA zone the reader is reading in — the site's, never the browser's

### instant

the absolute instant

`string` | `Date` | `null` | `undefined`

## Returns

`string` \| `null`

`HH:mm` in that zone, or null
