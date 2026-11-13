[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / diffProjects

# Function: diffProjects()

> **diffProjects**(`before`, `after`): [`ProjectChange`](../type-aliases/ProjectChange.md)[]

Defined in: [packages/gantt-core/src/diff.ts:43](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/diff.ts#L43)

Lists what changed between two versions of a project, record by record:
the form a server needs to store an edit without rewriting the plan.
Removals come last within each collection, and a change of row order or of
an outline position is reported once, as the new order.

## Parameters

### before

[`Project`](../interfaces/Project.md)

### after

[`Project`](../interfaces/Project.md)

## Returns

[`ProjectChange`](../type-aliases/ProjectChange.md)[]
