[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / updateProject

# Function: updateProject()

> **updateProject**(`project`, `patch`): [`Project`](../interfaces/Project.md)

Defined in: [packages/gantt-core/src/edit-project.ts:15](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-project.ts#L15)

Changes plan-level settings.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### patch

`Partial`\<[`ProjectSettings`](../type-aliases/ProjectSettings.md)\>

## Returns

[`Project`](../interfaces/Project.md)

## Throws

ScheduleError `unknown-reference` for a calendar the project does
not hold, and `invalid-date` for a project scheduled from a finish it does
not have.
