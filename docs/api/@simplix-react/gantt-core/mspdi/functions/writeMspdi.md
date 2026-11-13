[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [mspdi](../README.md) / writeMspdi

# Function: writeMspdi()

> **writeMspdi**(`project`, `schedule`): `string`

Defined in: [packages/gantt-core/src/mspdi/write.ts:160](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/write.ts#L160)

Writes a project and its computed schedule as a Microsoft Project XML
(MSPDI) document. Elements follow the order of the MSPDI schema. The
computed dates, slack, flags and outline numbers come from `schedule`;
everything else comes from `project`. `mspdiExportLosses` lists what of a
plan the document has no place for. Raises
`ScheduleError("unknown-reference")` when `schedule` lacks a task.

## Parameters

### project

[`Project`](../../index/interfaces/Project.md)

### schedule

[`Schedule`](../../index/interfaces/Schedule.md)

## Returns

`string`
