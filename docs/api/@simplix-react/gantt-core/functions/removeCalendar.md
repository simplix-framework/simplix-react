[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / removeCalendar

# Function: removeCalendar()

> **removeCalendar**(`project`, `id`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-links.ts:248](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-links.ts#L248)

Removes a calendar.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-operation` while the project, a task, a
resource or another calendar still uses it.
