[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / LevelingResult

# Interface: LevelingResult

Defined in: [packages/gantt-core/src/leveling.ts:15](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/leveling.ts#L15)

Outcome of leveling: the delayed project and what could not be resolved.

## Properties

### project

> **project**: [`Project`](Project.md)

Defined in: [packages/gantt-core/src/leveling.ts:16](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/leveling.ts#L16)

***

### unresolved

> **unresolved**: [`Overallocation`](Overallocation.md)[]

Defined in: [packages/gantt-core/src/leveling.ts:18](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/leveling.ts#L18)

Overallocations left because no task in them may be delayed.
