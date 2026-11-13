[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / Outline

# Interface: Outline

Defined in: [packages/gantt-core/src/outline.ts:5](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/outline.ts#L5)

The tree the outline levels of a row list describe, by row index.

## Properties

### active

> **active**: readonly `boolean`[]

Defined in: [packages/gantt-core/src/outline.ts:15](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/outline.ts#L15)

False for an inactive row and every row under one.

***

### children

> **children**: readonly readonly `number`[][]

Defined in: [packages/gantt-core/src/outline.ts:9](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/outline.ts#L9)

***

### indexById

> **indexById**: `ReadonlyMap`\<`string`, `number`\>

Defined in: [packages/gantt-core/src/outline.ts:6](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/outline.ts#L6)

***

### parent

> **parent**: readonly `number`[]

Defined in: [packages/gantt-core/src/outline.ts:8](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/outline.ts#L8)

Row index of the parent, or -1 at the top level.

***

### summary

> **summary**: readonly `boolean`[]

Defined in: [packages/gantt-core/src/outline.ts:11](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/outline.ts#L11)

True for a row with rows under it.

***

### wbs

> **wbs**: readonly `string`[]

Defined in: [packages/gantt-core/src/outline.ts:13](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/outline.ts#L13)

Outline number, such as `1.2.3`.
