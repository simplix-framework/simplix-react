[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / updateRecurringTask

# Function: updateRecurringTask()

> **updateRecurringTask**(`project`, `id`, `change`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-extras.ts:229](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L229)

Changes a recurring task: its name, the length of an occurrence or its
rule. The occurrences are made again from the changed rule, in the place
of the old ones; progress and links on the old occurrences are not kept.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

### change

#### duration?

`number`

#### durationUnit?

[`DurationUnit`](../type-aliases/DurationUnit.md)

#### name?

`string`

#### recurrence?

[`Recurrence`](../type-aliases/Recurrence.md)

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-operation` when the task is not the summary
task of a recurring task.
