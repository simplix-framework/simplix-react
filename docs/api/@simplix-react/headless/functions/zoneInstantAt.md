[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / zoneInstantAt

# Function: zoneInstantAt()

> **zoneInstantAt**(`zone`, `day`, `time`): `string` \| `null`

Defined in: [datetime/zone-time.ts:68](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-time.ts#L68)

The instant at `time` on the zone-local calendar day `day` (`yyyy-MM-dd`),
serialized RFC 3339 with the zone's offset. Null when either input is unset.

This is how a single-day window is assembled: the operator picks the day once
and each end's time separately, so no pair of ends can straddle midnight.

## Parameters

### zone

`string`

### day

`string` | `null` | `undefined`

### time

[`TimeValue`](../interfaces/TimeValue.md) | `null` | `undefined`

## Returns

`string` \| `null`
