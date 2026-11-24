[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / recurrenceDays

# Function: recurrenceDays()

> **recurrenceDays**(`project`, `recurrence`): `number`[]

Defined in: [packages/gantt-core/src/edit-extras.ts:126](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L126)

The days a recurrence falls on, as day indexes. A daily recurrence skips
days the project calendar does not work.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### recurrence

[`Recurrence`](../type-aliases/Recurrence.md)

## Returns

`number`[]

## Throws

ScheduleError `invalid-operation` for an interval under one, a
recurrence with no end, a weekly one without weekdays, a monthly one
without a day, or one with more than 500 occurrences.
