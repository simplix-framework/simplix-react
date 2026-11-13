[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / computeCosts

# Function: computeCosts()

> **computeCosts**(`project`, `schedule?`): `Map`\<`string`, [`TaskCost`](../interfaces/TaskCost.md)\>

Defined in: [packages/gantt-core/src/costs.ts:35](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/costs.ts#L35)

Totals the work and the cost of every task.

A work resource costs its hourly rate for the hours of its assignment; a
material resource costs its rate for the assignment's units; either adds
its cost per use once per task. A task's own fixed cost is added on top,
and a summary task adds up the tasks under it. Overtime work costs the
overtime rate. With a schedule, a resource whose rate changes by date is
costed at the rate in effect when the task starts.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule?

[`Schedule`](../interfaces/Schedule.md)

## Returns

`Map`\<`string`, [`TaskCost`](../interfaces/TaskCost.md)\>
