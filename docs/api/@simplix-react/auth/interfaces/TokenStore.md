[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / TokenStore

# Interface: TokenStore

Defined in: [packages/auth/src/types.ts:78](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L78)

Abstraction over key-value storage for tokens.

## See

 - [memoryStore](../functions/memoryStore.md) for in-memory implementation.
 - [localStorageStore](../functions/localStorageStore.md) for localStorage-based storage.
 - [sessionStorageStore](../functions/sessionStorageStore.md) for sessionStorage-based storage.

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/auth/src/types.ts:82](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L82)

#### Returns

`void`

***

### get()

> **get**(`key`): `string` \| `null`

Defined in: [packages/auth/src/types.ts:79](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L79)

#### Parameters

##### key

`string`

#### Returns

`string` \| `null`

***

### remove()

> **remove**(`key`): `void`

Defined in: [packages/auth/src/types.ts:81](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L81)

#### Parameters

##### key

`string`

#### Returns

`void`

***

### set()

> **set**(`key`, `value`): `void`

Defined in: [packages/auth/src/types.ts:80](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L80)

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`void`
