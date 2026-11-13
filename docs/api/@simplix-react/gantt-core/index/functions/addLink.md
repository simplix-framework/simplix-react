[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / addLink

# Function: addLink()

> **addLink**(`project`, `link`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-links.ts:14](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-links.ts#L14)

Adds a dependency. Omitted fields default to finish-to-start with no lag.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### link

`Pick`\<[`Link`](../interfaces/Link.md), `"predecessorId"` \| `"successorId"`\> & `Partial`\<`Omit`\<[`Link`](../interfaces/Link.md), `"predecessorId"` \| `"successorId"`\>\>

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `invalid-operation` for a second link between the
same two tasks or a link between a summary task and a task under it, and
`cycle` when the link would close a loop.
