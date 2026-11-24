[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / timePlusHours

# Function: timePlusHours()

> **timePlusHours**(`time`, `hours`): [`TimeValue`](../interfaces/TimeValue.md)

Defined in: [datetime/zone-time.ts:89](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-time.ts#L89)

`time` moved forward by `hours`, clamped to the last minute of the day — a
default end never rolls the window onto the next date.

## Parameters

### time

[`TimeValue`](../interfaces/TimeValue.md)

### hours

`number`

## Returns

[`TimeValue`](../interfaces/TimeValue.md)
