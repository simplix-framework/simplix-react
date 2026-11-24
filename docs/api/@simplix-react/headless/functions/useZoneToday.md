[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / useZoneToday

# Function: useZoneToday()

> **useZoneToday**(`zone?`): [`ZoneToday`](../interfaces/ZoneToday.md)

Defined in: [datetime/zone-clock.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-clock.ts#L33)

Today in the app's zone (or the one named), moving on at that zone's midnight.

## Parameters

### zone?

`string`

The IANA zone; defaults to the app's zone.

## Returns

[`ZoneToday`](../interfaces/ZoneToday.md)

The zone's day and its `[from, to)` instants.

## Remarks

A count of "today" and the rows it names are one window, so a screen reads the window from here
rather than computing it per render. It moves at the zone's own midnight, never the browser's,
and on one timer armed for that instant (re-armed at most an hour ahead, so a laptop that slept
past midnight still moves on when it wakes). Until then every render gets the same strings, so a
query keyed on them is not re-read.
