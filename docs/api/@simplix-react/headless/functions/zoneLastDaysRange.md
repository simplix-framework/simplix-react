[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / zoneLastDaysRange

# Function: zoneLastDaysRange()

> **zoneLastDaysRange**(`zone`, `days`, `at?`): [`ZoneInstantRange`](../interfaces/ZoneInstantRange.md)

Defined in: [datetime/zone-bounds.ts:75](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-bounds.ts#L75)

`[from, to)` instants of the last `days` zone-local days ending after today
(i.e. from the start of day `today − days + 1` to the end of today).

## Parameters

### zone

`string`

### days

`number`

### at?

`Date` = `...`

## Returns

[`ZoneInstantRange`](../interfaces/ZoneInstantRange.md)
