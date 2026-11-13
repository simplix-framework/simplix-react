[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / updateLink

# Function: updateLink()

> **updateLink**(`project`, `id`, `patch`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-links.ts:48](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-links.ts#L48)

Changes the type or lag of a link.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### id

`string`

### patch

`Partial`\<`Pick`\<[`Link`](../interfaces/Link.md), `"type"` \| `"lag"` \| `"lagMode"` \| `"lagUnit"`\>\>

## Returns

[`Project`](../interfaces/Project.md)
