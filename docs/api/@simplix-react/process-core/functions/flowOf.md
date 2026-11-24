[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / flowOf

# Function: flowOf()

> **flowOf**(`definition`): `string`

Defined in: [packages/process-core/src/flow.ts:10](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/flow.ts#L10)

What a procedure does, apart from how it is worded and who is named for it: the steps in their
order, the acts of each step with their kind and condition, which steps proceed together, what
repeats until what, where a step may be sent back, and where every jump leaves and arrives.
Names, notes, sections, lanes and members this package does not know are left out, and a
parallel run is told by the steps it holds, never by its key.

## Parameters

### definition

[`ProcessDefinition`](../interfaces/ProcessDefinition.md)

## Returns

`string`
