[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / parseDefinition

# Function: parseDefinition()

> **parseDefinition**(`input`): [`ProcessDefinition`](../interfaces/ProcessDefinition.md)

Defined in: [packages/process-core/src/format.ts:47](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/format.ts#L47)

Reads a stored definition, as text or as the value parsed from it.

Only the members this package reads are checked for their type; a member it does not know is
kept as it stands, so a definition written with more fields than this version reads comes back
out of [serializeDefinition](serializeDefinition.md) with them. A `version` above [PROCESS\_VERSION](../variables/PROCESS_VERSION.md) is
refused rather than read as far as it happens to parse.

## Parameters

### input

`unknown`

## Returns

[`ProcessDefinition`](../interfaces/ProcessDefinition.md)

## Throws

ProcessFormatError when the input is not a definition this package reads.
