[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / zoneInstantOnDayOf

# Function: zoneInstantOnDayOf()

> **zoneInstantOnDayOf**(`zone`, `anchor`, `time`): `string` \| `null`

Defined in: [datetime/zone-time.ts:104](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-time.ts#L104)

The instant at `time` on the SAME zone-local calendar day as `anchor`,
serialized RFC 3339 with the zone's offset. Null when either input is unset.

## Parameters

### zone

`string`

### anchor

`string` | `Date` | `null` | `undefined`

### time

[`TimeValue`](../interfaces/TimeValue.md) | `null` | `undefined`

## Returns

`string` \| `null`
