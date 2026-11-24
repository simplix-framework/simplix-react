[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / runWithToast

# Function: runWithToast()

> **runWithToast**\<`T`\>(`action`, `options`): `Promise`\<[`CommandOutcome`](../type-aliases/CommandOutcome.md)\<`T`\>\>

Defined in: [packages/ui/src/crud/form/use-command.ts:162](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L162)

Runs an async verb that is not a single mutation (a download, two writes in a row, a call to a
provider) and toasts how it ended, with the same words rule as [useCommand](useCommand.md). Never rejects.

## Type Parameters

### T

`T`

## Parameters

### action

() => `Promise`\<`T`\>

The verb to run.

### options

[`RunWithToastOptions`](../interfaces/RunWithToastOptions.md)\<`T`\>

What to say on success and on failure.

## Returns

`Promise`\<[`CommandOutcome`](../type-aliases/CommandOutcome.md)\<`T`\>\>

How the run ended.
