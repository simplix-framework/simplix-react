[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / levelResources

# Function: levelResources()

> **levelResources**(`project`): [`LevelingResult`](../interfaces/LevelingResult.md)

Defined in: [packages/gantt-core/src/leveling.ts:147](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/leveling.ts#L147)

Resolves overallocated work resources by delaying tasks.

Earlier delays are cleared first. Tasks are then placed one at a time, each
after the tasks it depends on; among the tasks ready to be placed the
highest priority goes first, then the earliest start, then the least total
slack, then the highest row. A task that does not fit beside the tasks
already placed on one of its resources waits until it does.

Only an automatic as-soon-as-possible task that has not started and whose
priority is under 1000 is delayed. Links and constraints keep holding,
since a delay only ever moves a task later.

## Parameters

### project

[`Project`](../interfaces/Project.md)

## Returns

[`LevelingResult`](../interfaces/LevelingResult.md)
