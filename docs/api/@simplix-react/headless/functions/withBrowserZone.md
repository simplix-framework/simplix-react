[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / withBrowserZone

# Function: withBrowserZone()

> **withBrowserZone**(`text`, `at`): `string`

Defined in: [datetime/browser-zone-label.ts:81](https://github.com/simplix-framework/simplix-react/blob/main/datetime/browser-zone-label.ts#L81)

Writes a time with the zone it is drawn in.

## Parameters

### text

`string`

the time as it has already been written

### at

`Date`

the instant it came from

## Returns

`string`

the time followed by its zone in brackets, or the time alone when the runtime will
         not name the zone
