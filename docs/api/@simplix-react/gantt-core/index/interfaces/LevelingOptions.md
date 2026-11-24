[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / LevelingOptions

# Interface: LevelingOptions

Defined in: [packages/gantt-core/src/leveling.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/leveling.ts#L23)

What leveling may do to resolve an overallocation.

## Properties

### split?

> `optional` **split**: `boolean`

Defined in: [packages/gantt-core/src/leveling.ts:27](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/leveling.ts#L27)

Pauses a task that has already begun when the conflict starts, instead of moving all of it.

***

### withinSlack?

> `optional` **withinSlack**: `boolean`

Defined in: [packages/gantt-core/src/leveling.ts:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/leveling.ts#L25)

Delays a task only as far as its total slack reaches, so the project's finish does not move.
