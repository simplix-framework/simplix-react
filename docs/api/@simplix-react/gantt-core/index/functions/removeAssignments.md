[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / removeAssignments

# Function: removeAssignments()

> **removeAssignments**(`project`, `ids`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-links.ts:209](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/edit-links.ts#L209)

Removes assignments. On an effort-driven task the remaining work resources
take over the removed work and the task lengthens.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### ids

readonly `string`[]

## Returns

[`Project`](../interfaces/Project.md)
