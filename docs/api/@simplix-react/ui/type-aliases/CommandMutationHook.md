[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CommandMutationHook

# Type Alias: CommandMutationHook()\<TVariables, TData\>

> **CommandMutationHook**\<`TVariables`, `TData`\> = (`options?`) => `object`

Defined in: [packages/ui/src/crud/form/use-command.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L15)

What a generated mutation hook is called with and answers: the options object Orval and SimpliX
Meta both emit (`{ mutation?: { meta?, ... } }`) and a result with `mutateAsync` and `isPending`.

## Type Parameters

### TVariables

`TVariables`

What the command is run with.

### TData

`TData`

What the server answers a successful run with.

## Parameters

### options?

#### mutation?

`object` & `Record`\<`string`, `any`\>

## Returns

`object`

### isPending

> **isPending**: `boolean`

### mutateAsync()

> **mutateAsync**: (`variables`) => `Promise`\<`TData`\>

#### Parameters

##### variables

`TVariables`

#### Returns

`Promise`\<`TData`\>
