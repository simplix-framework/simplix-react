[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / setPercentComplete

# Function: setPercentComplete()

> **setPercentComplete**(`project`, `schedule`, `id`, `percent`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-tasks.ts:221](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-tasks.ts#L221)

Records progress. Above zero the scheduled start becomes the actual start,
and at 100 the scheduled finish becomes the actual finish; zero clears
both. On a summary task the value goes to every task under it.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

### id

`string`

### percent

`number`

## Returns

[`Project`](../interfaces/Project.md)
