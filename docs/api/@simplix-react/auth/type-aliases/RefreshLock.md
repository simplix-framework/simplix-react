[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / RefreshLock

# Type Alias: RefreshLock()

> **RefreshLock** = \<`T`\>(`name`, `run`) => `Promise`\<`T`\>

Defined in: [packages/auth/src/types.ts:67](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L67)

Runs `run` while holding the named lock, so one refresh happens at a time across every tab
that shares the token store. The browser default is the Web Locks API.

## Type Parameters

### T

`T`

## Parameters

### name

`string`

### run

() => `Promise`\<`T`\>

## Returns

`Promise`\<`T`\>
