[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / takeTheirs

# Function: takeTheirs()

> **takeTheirs**(`project`, `theirs`, `conflicts`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/diff.ts:203](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/diff.ts#L203)

Settles conflicts of a merge the other way: for each listed record the
plan takes the other side's version, and loses the record where the other
side removed it. A link of theirs that would close a loop is left out.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### theirs

[`Project`](../interfaces/Project.md)

### conflicts

readonly [`MergeConflict`](../interfaces/MergeConflict.md)[]

## Returns

[`Project`](../interfaces/Project.md)
