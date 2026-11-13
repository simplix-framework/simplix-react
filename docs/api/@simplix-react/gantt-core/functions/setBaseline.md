[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / setBaseline

# Function: setBaseline()

> **setBaseline**(`project`, `schedule`, `number?`, `taskIds?`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/baseline.ts:18](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/baseline.ts#L18)

Saves the scheduled dates as a baseline. With `taskIds` only those tasks
are saved and the other entries of the baseline stay.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

### number?

`number` = `0`

### taskIds?

readonly `string`[]

## Returns

[`Project`](../interfaces/Project.md)
