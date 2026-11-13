[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / insertSubproject

# Function: insertSubproject()

> **insertSubproject**(`project`, `sub`, `beforeIndex?`, `name?`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-extras.ts:259](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L259)

Inserts another plan as a summary task with its tasks under it, before the
row at `beforeIndex` (the end when omitted). Every inserted record gets a
new id; resources are matched to the plan's own by name and added when
there is none; calendars, baselines and custom fields of the inserted plan
are not carried over. A task that started at the inserted plan's start
keeps that date through a start-no-earlier-than constraint.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### sub

[`Project`](../interfaces/Project.md)

### beforeIndex?

`number` = `project.tasks.length`

### name?

`string` = `sub.name`

## Returns

[`Project`](../interfaces/Project.md)
