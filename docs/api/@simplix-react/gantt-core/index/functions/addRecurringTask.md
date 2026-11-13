[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / addRecurringTask

# Function: addRecurringTask()

> **addRecurringTask**(`project`, `options`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-extras.ts:187](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L187)

Adds a recurring task: a summary task named `name` with one task of
`duration` under it for every occurrence, each held to its day by a
start-no-earlier-than constraint. The rows go in before `beforeIndex`, or
at the end.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### options

#### beforeIndex?

`number`

#### duration

`number`

#### durationUnit?

[`DurationUnit`](../type-aliases/DurationUnit.md)

Unit the occurrences show their duration in.

#### name

`string`

#### outlineLevel?

`number`

#### recurrence

[`Recurrence`](../type-aliases/Recurrence.md)

## Returns

[`Project`](../interfaces/Project.md)
