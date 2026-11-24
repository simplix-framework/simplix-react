[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / useCommand

# Function: useCommand()

> **useCommand**\<`TVariables`, `TData`\>(`useMutationHook`, `options`): [`UseCommandResult`](../interfaces/UseCommandResult.md)\<`TVariables`, `TData`\>

Defined in: [packages/ui/src/crud/form/use-command.ts:106](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L106)

Runs a user's command the one way every screen runs one: it writes, toasts the outcome in the
reader's words, puts the server's own reason in the failure, refreshes what it changed, and
keeps the app's error dialog out of it, so a refusal is said once.

Pass the generated mutation hook itself, not its result: the error-dialog flag is part of the
mutation's options, which only the hook call can set.

## Type Parameters

### TVariables

`TVariables` = `void`

### TData

`TData` = `unknown`

## Parameters

### useMutationHook

[`CommandMutationHook`](../type-aliases/CommandMutationHook.md)\<`TVariables`, `TData`\>

The generated mutation hook the command calls.

### options

[`UseCommandOptions`](../interfaces/UseCommandOptions.md)\<`TVariables`, `TData`\>

Its words, what it refreshes, and whether the error dialog stays on.

## Returns

[`UseCommandResult`](../interfaces/UseCommandResult.md)\<`TVariables`, `TData`\>

`run(variables)` and whether a run is pending.

## Example

```tsx
const revoke = useCommand(useDeleteMyDevice, {
  done: (_, { deviceId }) => t("signedOut", { device: nameOf(deviceId) }),
  failed: (reason) => t("signOutFailed", { reason }),
  invalidate: [getGetAllMyDevicesQueryKey()],
});
<Button disabled={revoke.pending} onClick={() => void revoke.run({ deviceId })} />
```
