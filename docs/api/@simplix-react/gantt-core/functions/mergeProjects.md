[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / mergeProjects

# Function: mergeProjects()

> **mergeProjects**(`base`, `mine`, `theirs`): `object`

Defined in: [packages/gantt-core/src/diff.ts:102](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/diff.ts#L102)

Brings changes made elsewhere into a plan that was also edited here.

`base` is the version both sides started from, `mine` the plan here and
`theirs` the plan from elsewhere. Every record they changed and this side
did not is taken from them; a record both changed keeps this side's version
and is reported as a conflict. A record this side removed stays removed.
Their row order is taken when this side did not reorder, and their plan
settings and baselines where this side left them alone.

## Parameters

### base

[`Project`](../interfaces/Project.md)

### mine

[`Project`](../interfaces/Project.md)

### theirs

[`Project`](../interfaces/Project.md)

## Returns

`object`

### conflicts

> **conflicts**: [`MergeConflict`](../interfaces/MergeConflict.md)[]

### project

> **project**: [`Project`](../interfaces/Project.md)
