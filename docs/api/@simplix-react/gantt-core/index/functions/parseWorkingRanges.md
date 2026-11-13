[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / parseWorkingRanges

# Function: parseWorkingRanges()

> **parseWorkingRanges**(`text`): [`WorkingRange`](../interfaces/WorkingRange.md)[]

Defined in: [packages/gantt-core/src/edit-project.ts:35](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-project.ts#L35)

Reads the working time of a day as it is typed: `08:00-12:00, 13:00-17:00`.
Empty text is a non-working day.

## Parameters

### text

`string`

## Returns

[`WorkingRange`](../interfaces/WorkingRange.md)[]

## Throws

ScheduleError `invalid-calendar` when a range cannot be read, is
empty, or does not come after the one before it.
