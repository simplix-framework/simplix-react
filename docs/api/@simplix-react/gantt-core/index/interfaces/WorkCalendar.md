[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / WorkCalendar

# Interface: WorkCalendar

Defined in: [packages/gantt-core/src/types.ts:40](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L40)

Working time of a project, a task or a resource. A day resolves through its
exceptions, then its work weeks, then its week pattern, then the base
calendar.

## Properties

### baseCalendarId?

> `optional` **baseCalendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:43](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L43)

***

### exceptions?

> `optional` **exceptions**: readonly [`CalendarException`](CalendarException.md)[]

Defined in: [packages/gantt-core/src/types.ts:46](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L46)

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:41](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L41)

***

### name

> **name**: `string`

Defined in: [packages/gantt-core/src/types.ts:42](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L42)

***

### weekDays

> **weekDays**: [`WeekPattern`](../type-aliases/WeekPattern.md)

Defined in: [packages/gantt-core/src/types.ts:44](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L44)

***

### workWeeks?

> `optional` **workWeeks**: readonly [`CalendarWorkWeek`](CalendarWorkWeek.md)[]

Defined in: [packages/gantt-core/src/types.ts:45](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L45)
