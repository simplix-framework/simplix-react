[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / buildOutline

# Function: buildOutline()

> **buildOutline**(`tasks`): [`Outline`](../interfaces/Outline.md)

Defined in: [packages/gantt-core/src/outline.ts:25](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/outline.ts#L25)

Reads the tree out of a row list.

## Parameters

### tasks

readonly [`Task`](../interfaces/Task.md)[]

## Returns

[`Outline`](../interfaces/Outline.md)

## Throws

ScheduleError `duplicate-id` for a repeated id and `invalid-outline`
when the first row is not at level 1 or a row sits more than one level
under the row before it.
