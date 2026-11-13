[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / levelResources

# Function: levelResources()

> **levelResources**(`project`, `options?`): [`LevelingResult`](../interfaces/LevelingResult.md)

Defined in: [packages/gantt-core/src/leveling.ts:154](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/leveling.ts#L154)

Resolves overallocated work resources by delaying tasks.

Earlier leveling is cleared first. Tasks are then placed one at a time,
each after the tasks it depends on; among the tasks ready to be placed the
highest priority goes first, then the earliest start, then the least total
slack, then the highest row. A task that does not fit beside the tasks
already placed on one of its resources waits until it does, or with the
`split` option pauses where the conflict begins and resumes after it.

Only an automatic as-soon-as-possible task that has not started and whose
priority is under 1000 is moved. Links and constraints keep holding, since
leveling only ever moves work later. A project scheduled from its finish is
returned as it is, with its overallocations reported.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### options?

[`LevelingOptions`](../interfaces/LevelingOptions.md) = `{}`

## Returns

[`LevelingResult`](../interfaces/LevelingResult.md)
