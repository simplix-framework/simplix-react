[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / parseMspdiDuration

# Function: parseMspdiDuration()

> **parseMspdiDuration**(`text`): `number`

Defined in: [packages/gantt-core/src/mspdi/codes.ts:120](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/codes.ts#L120)

Reads an xsd:duration such as `PT8H30M0S` as minutes. Days count 24 hours;
a year or month part raises `ScheduleError("invalid-duration")` because it
has no fixed length.

## Parameters

### text

`string`

## Returns

`number`
