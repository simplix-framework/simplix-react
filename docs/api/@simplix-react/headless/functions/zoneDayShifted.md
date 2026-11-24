[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / zoneDayShifted

# Function: zoneDayShifted()

> **zoneDayShifted**(`zone`, `days`, `at?`): `string`

Defined in: [datetime/zone-bounds.ts:175](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-bounds.ts#L175)

The zone's calendar day `days` away from `at`, as `yyyy-MM-dd`.

## Parameters

### zone

`string`

the IANA zone the day is reckoned in — the workplace's, never the browser's

### days

`number`

how many days on, negative for days back

### at?

`Date` = `...`

the instant to count from, defaulting to now

## Returns

`string`

that day as `yyyy-MM-dd`

## Remarks

The shift happens in the zone's own wall clock, which is the half that gets written by hand and
got wrong: taking today's day out of the zone and then stepping it with a browser-local `Date`
lands on the browser's calendar, and the two disagree for the hours the zones do. Anchored at
noon so a daylight-saving step cannot roll the date under the arithmetic.
