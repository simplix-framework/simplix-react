[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / computeCosts

# Function: computeCosts()

> **computeCosts**(`project`): `Map`\<`string`, [`TaskCost`](../interfaces/TaskCost.md)\>

Defined in: [packages/gantt-core/src/costs.ts:19](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/costs.ts#L19)

Totals the work and the cost of every task.

A work resource costs its hourly rate for the hours of its assignment; a
material resource costs its rate for the assignment's units; either adds
its cost per use once per task. A task's own fixed cost is added on top,
and a summary task adds up the tasks under it.

## Parameters

### project

[`Project`](../interfaces/Project.md)

## Returns

`Map`\<`string`, [`TaskCost`](../interfaces/TaskCost.md)\>
