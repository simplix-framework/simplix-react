[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / parseProject

# Function: parseProject()

> **parseProject**(`stored`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/plan-format.ts:52](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/plan-format.ts#L52)

Reads a stored plan: the text `serializeProject` wrote, the value parsed
from it, or a bare project stored before plans carried a version.

## Parameters

### stored

`unknown`

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-plan` for text that is not JSON or a value
that is not a plan, and `unsupported-plan-version` for a plan saved by a
later version of this package than this one reads.
