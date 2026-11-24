[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UseCommandResult

# Interface: UseCommandResult\<TVariables, TData\>

Defined in: [packages/ui/src/crud/form/use-command.ts:67](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L67)

What [useCommand](../functions/useCommand.md) returns.

## Type Parameters

### TVariables

`TVariables`

### TData

`TData`

## Properties

### pending

> **pending**: `boolean`

Defined in: [packages/ui/src/crud/form/use-command.ts:74](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L74)

Whether a run is waiting for the server.

***

### run()

> **run**: (`variables`) => `Promise`\<[`CommandOutcome`](../type-aliases/CommandOutcome.md)\<`TData`\>\>

Defined in: [packages/ui/src/crud/form/use-command.ts:72](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L72)

Runs the command: writes, toasts the outcome, and refreshes what it changed. Never rejects;
the outcome says whether the write was accepted, so a caller closes a dialog only on success.

#### Parameters

##### variables

`TVariables`

#### Returns

`Promise`\<[`CommandOutcome`](../type-aliases/CommandOutcome.md)\<`TData`\>\>
