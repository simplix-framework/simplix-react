[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / compileCalendars

# Function: compileCalendars()

> **compileCalendars**(`calendars`): `Map`\<`string`, [`WorkingTime`](../interfaces/WorkingTime.md)\>

Defined in: [packages/gantt-core/src/calendar.ts:192](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L192)

Builds the working-time arithmetic of every calendar of a project.

## Parameters

### calendars

readonly [`WorkCalendar`](../interfaces/WorkCalendar.md)[]

## Returns

`Map`\<`string`, [`WorkingTime`](../interfaces/WorkingTime.md)\>

## Throws

ScheduleError `duplicate-id`, `unknown-reference` or `cycle` for a
broken base-calendar chain, `invalid-calendar` for a malformed range, and
`no-working-time` for a week pattern without a working day.
