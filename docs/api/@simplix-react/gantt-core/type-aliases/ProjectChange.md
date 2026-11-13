[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / ProjectChange

# Type Alias: ProjectChange

> **ProjectChange** = \{ `entity`: [`ChangeEntity`](ChangeEntity.md); `id`: [`Id`](Id.md); `kind`: `"added"` \| `"updated"`; `value`: `unknown`; \} \| \{ `entity`: [`ChangeEntity`](ChangeEntity.md); `id`: [`Id`](Id.md); `kind`: `"removed"`; \} \| \{ `entity`: `"task-order"`; `kind`: `"updated"`; `order`: readonly [`Id`](Id.md)[]; \} \| \{ `entity`: `"project"`; `kind`: `"updated"`; `value`: `Readonly`\<`Record`\<`string`, `unknown`\>\>; \} \| \{ `entity`: `"baseline"`; `kind`: `"updated"`; `number`: `number`; `value`: `unknown`; \}

Defined in: [packages/gantt-core/src/diff.ts:10](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/diff.ts#L10)

One difference between two versions of a project.

## Type Declaration

\{ `entity`: [`ChangeEntity`](ChangeEntity.md); `id`: [`Id`](Id.md); `kind`: `"added"` \| `"updated"`; `value`: `unknown`; \}

### entity

> **entity**: [`ChangeEntity`](ChangeEntity.md)

### id

> **id**: [`Id`](Id.md)

### kind

> **kind**: `"added"` \| `"updated"`

### value

> **value**: `unknown`

\{ `entity`: [`ChangeEntity`](ChangeEntity.md); `id`: [`Id`](Id.md); `kind`: `"removed"`; \}

### entity

> **entity**: [`ChangeEntity`](ChangeEntity.md)

### id

> **id**: [`Id`](Id.md)

### kind

> **kind**: `"removed"`

\{ `entity`: `"task-order"`; `kind`: `"updated"`; `order`: readonly [`Id`](Id.md)[]; \}

### entity

> **entity**: `"task-order"`

### kind

> **kind**: `"updated"`

### order

> **order**: readonly [`Id`](Id.md)[]

The row order or an outline level changed; `order` lists every task id in its new position.

\{ `entity`: `"project"`; `kind`: `"updated"`; `value`: `Readonly`\<`Record`\<`string`, `unknown`\>\>; \}

### entity

> **entity**: `"project"`

### kind

> **kind**: `"updated"`

### value

> **value**: `Readonly`\<`Record`\<`string`, `unknown`\>\>

Plan-level settings changed; `value` holds the fields that differ.

\{ `entity`: `"baseline"`; `kind`: `"updated"`; `number`: `number`; `value`: `unknown`; \}

### entity

> **entity**: `"baseline"`

### kind

> **kind**: `"updated"`

### number

> **number**: `number`

### value

> **value**: `unknown`

A baseline was saved, changed or cleared; `value` is `undefined` for a cleared one.
