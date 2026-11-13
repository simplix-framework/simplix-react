[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / writeMspdi

# Function: writeMspdi()

> **writeMspdi**(`project`, `schedule`): `string`

Defined in: [packages/gantt-core/src/mspdi/write.ts:142](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/write.ts#L142)

Writes a project and its computed schedule as a Microsoft Project XML
(MSPDI) document. Elements follow the order of the MSPDI schema. The
computed dates, slack, flags and outline numbers come from `schedule`;
everything else comes from `project`. Raises
`ScheduleError("unknown-reference")` when `schedule` lacks a task.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

## Returns

`string`
