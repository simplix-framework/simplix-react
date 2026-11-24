[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / diffDefinitions

# Function: diffDefinitions()

> **diffDefinitions**(`before`, `after`): [`DefinitionChange`](../interfaces/DefinitionChange.md)[]

Defined in: [packages/process-core/src/diff.ts:102](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/diff.ts#L102)

Lists what differs between two versions of a procedure, parts matched by id: the procedure's
own members first, then lanes, sections, steps, acts and jumps, each in the order of `after`
with the removed parts last. Members this package does not know are compared like any other.
Two equal definitions give an empty list.

## Parameters

### before

[`ProcessDefinition`](../interfaces/ProcessDefinition.md)

### after

[`ProcessDefinition`](../interfaces/ProcessDefinition.md)

## Returns

[`DefinitionChange`](../interfaces/DefinitionChange.md)[]

## Example

```ts
const changes = diffDefinitions(published, draft);
const touched = new Set(changes.filter((change) => change.subject === "step").map((change) => change.id));
```
