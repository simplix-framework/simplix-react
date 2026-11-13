[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / readMspdi

# Function: readMspdi()

> **readMspdi**(`xml`): [`MspdiReadResult`](../interfaces/MspdiReadResult.md)

Defined in: [packages/gantt-core/src/mspdi/read.ts:95](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/read.ts#L95)

Reads a Microsoft Project XML (MSPDI) document into a project. Data the
model has no field for is dropped; whatever of it would change the computed
dates is listed in `warnings`. Raises `ScheduleError("invalid-xml")` for a
document that is not MSPDI.

## Parameters

### xml

`string`

## Returns

[`MspdiReadResult`](../interfaces/MspdiReadResult.md)
