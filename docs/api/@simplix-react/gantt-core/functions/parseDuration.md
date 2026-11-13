[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / parseDuration

# Function: parseDuration()

> **parseDuration**(`text`, `sizes`, `defaultUnit?`): [`DurationValue`](../interfaces/DurationValue.md)

Defined in: [packages/gantt-core/src/duration.ts:66](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/duration.ts#L66)

Reads a duration such as `3d`, `1.5w`, `4 hours`, `2ed` (elapsed) or `5d?`
(estimated). A bare number is taken in `defaultUnit`.

## Parameters

### text

`string`

### sizes

[`UnitSizes`](../type-aliases/UnitSizes.md)

### defaultUnit?

[`DurationUnit`](../type-aliases/DurationUnit.md) = `"d"`

## Returns

[`DurationValue`](../interfaces/DurationValue.md)

## Throws

ScheduleError `invalid-duration` when the text is not a duration.
