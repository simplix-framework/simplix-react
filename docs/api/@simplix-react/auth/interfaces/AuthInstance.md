[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / AuthInstance

# Interface: AuthInstance

Defined in: [packages/auth/src/types.ts:140](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L140)

Reactive auth instance returned by [createAuth](../functions/createAuth.md).

Provides a `fetchFn` compatible with `defineApi` that automatically
injects auth headers, handles 401 retries, and manages token refresh.

## Properties

### fetchFn

> **fetchFn**: [`FetchFn`](../@simplix-react/contract/type-aliases/FetchFn.md)

Defined in: [packages/auth/src/types.ts:142](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L142)

Authenticated fetch function for use with `defineApi`.

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/auth/src/types.ts:154](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L154)

Clears all auth state and notifies subscribers.

#### Returns

`void`

***

### getAccessToken()

> **getAccessToken**(): `string` \| `null`

Defined in: [packages/auth/src/types.ts:148](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L148)

Returns the current access token from the store, or `null`.

#### Returns

`string` \| `null`

***

### getUser()

> **getUser**\<`TUser`\>(): `TUser` \| `null`

Defined in: [packages/auth/src/types.ts:166](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L166)

Returns the current user object, or `null` if not set.

#### Type Parameters

##### TUser

`TUser` = `unknown`

#### Returns

`TUser` \| `null`

***

### isAuthenticated()

> **isAuthenticated**(): `boolean`

Defined in: [packages/auth/src/types.ts:145](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L145)

Returns true if any scheme reports valid credentials.

#### Returns

`boolean`

***

### rehydrate()

> **rehydrate**(): `Promise`\<`void`\>

Defined in: [packages/auth/src/types.ts:163](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L163)

Rehydrates auth state from storage, optionally validating with the server.

#### Returns

`Promise`\<`void`\>

***

### setTokens()

> **setTokens**(`tokens`): `void`

Defined in: [packages/auth/src/types.ts:151](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L151)

Stores a token pair and notifies subscribers.

#### Parameters

##### tokens

[`TokenPair`](TokenPair.md)

#### Returns

`void`

***

### setUser()

> **setUser**\<`TUser`\>(`user`): `void`

Defined in: [packages/auth/src/types.ts:169](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L169)

Sets the current user object and notifies subscribers.

#### Type Parameters

##### TUser

`TUser` = `unknown`

#### Parameters

##### user

`TUser` | `null`

#### Returns

`void`

***

### subscribe()

> **subscribe**(`listener`): () => `void`

Defined in: [packages/auth/src/types.ts:160](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L160)

Subscribes to auth state changes.

#### Parameters

##### listener

() => `void`

#### Returns

An unsubscribe function.

> (): `void`

##### Returns

`void`
