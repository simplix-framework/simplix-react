[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / DefinitionChange

# Interface: DefinitionChange

Defined in: [packages/process-core/src/diff.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/diff.ts#L7)

One difference between two versions of a procedure.

## Properties

### fields?

> `optional` **fields**: `string`[]

Defined in: [packages/process-core/src/diff.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/diff.ts#L16)

The members that differ, for `changed`.

***

### id

> **id**: `string`

Defined in: [packages/process-core/src/diff.ts:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/diff.ts#L14)

***

### kind

> **kind**: `"added"` \| `"removed"` \| `"changed"` \| `"moved"`

Defined in: [packages/process-core/src/diff.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/diff.ts#L12)

`added` and `removed`: the part is in one version only. `changed`: members of the part differ.
`moved`: the part stands under another parent, or in another order among the parts both versions hold.

***

### subject

> **subject**: [`DiffSubject`](../type-aliases/DiffSubject.md)

Defined in: [packages/process-core/src/diff.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/diff.ts#L13)
