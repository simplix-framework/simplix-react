[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UseCommandOptions

# Interface: UseCommandOptions\<TVariables, TData\>

Defined in: [packages/ui/src/crud/form/use-command.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L49)

Options for [useCommand](../functions/useCommand.md).

## Type Parameters

### TVariables

`TVariables`

### TData

`TData`

## Properties

### done

> **done**: [`CommandDone`](../type-aliases/CommandDone.md)\<`TVariables`, `TData`\>

Defined in: [packages/ui/src/crud/form/use-command.ts:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L51)

Toasted as success once the write is accepted.

***

### failed

> **failed**: [`CommandFailed`](../type-aliases/CommandFailed.md)\<`TVariables`\>

Defined in: [packages/ui/src/crud/form/use-command.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L53)

Toasted as an error when the write is refused or fails.

***

### invalidate?

> `optional` **invalidate**: readonly [`CommandInvalidation`](../type-aliases/CommandInvalidation.md)[] \| (`variables`) => readonly [`CommandInvalidation`](../type-aliases/CommandInvalidation.md)[]

Defined in: [packages/ui/src/crud/form/use-command.ts:55](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L55)

Refreshed once the server has answered, accepted or refused, before `run` resolves.

***

### keepDialog?

> `optional` **keepDialog**: `boolean`

Defined in: [packages/ui/src/crud/form/use-command.ts:60](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L60)

Leaves the app's error dialog on for this mutation as well as the toast. Off by default: a
command that toasts its own failure and also raises the dialog tells the reader twice.
