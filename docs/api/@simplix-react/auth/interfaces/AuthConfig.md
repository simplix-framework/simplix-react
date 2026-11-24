[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / AuthConfig

# Interface: AuthConfig

Defined in: [packages/auth/src/types.ts:106](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L106)

Configuration for creating an auth instance via [createAuth](../functions/createAuth.md).

## Properties

### fetchFn?

> `optional` **fetchFn**: [`FetchFn`](../@simplix-react/contract/type-aliases/FetchFn.md)

Defined in: [packages/auth/src/types.ts:129](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L129)

Base fetch function to wrap with auth headers. Defaults to defaultFetch.

***

### globalHeaders()?

> `optional` **globalHeaders**: () => `Record`\<`string`, `string`\> \| `Promise`\<`Record`\<`string`, `string`\>\>

Defined in: [packages/auth/src/types.ts:126](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L126)

Returns additional headers to merge into every authenticated request.

#### Returns

`Record`\<`string`, `string`\> \| `Promise`\<`Record`\<`string`, `string`\>\>

***

### is401()?

> `optional` **is401**: (`error`) => `boolean`

Defined in: [packages/auth/src/types.ts:120](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L120)

Custom 401 detection predicate. Defaults to duck-typing `error.status === 401`.

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/auth/src/types.ts:117](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L117)

Maximum retry attempts after 401. Defaults to `1`.

***

### onRefreshFailure()?

> `optional` **onRefreshFailure**: (`error`) => `void`

Defined in: [packages/auth/src/types.ts:114](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L114)

Called when all refresh attempts fail.

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onRehydrate()?

> `optional` **onRehydrate**: (`accessToken`) => `Promise`\<`boolean`\>

Defined in: [packages/auth/src/types.ts:123](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L123)

Validates a stored access token on rehydration. Return `true` if valid.

#### Parameters

##### accessToken

`string`

#### Returns

`Promise`\<`boolean`\>

***

### schemes

> **schemes**: [`AuthScheme`](AuthScheme.md)[]

Defined in: [packages/auth/src/types.ts:108](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L108)

One or more authentication schemes to compose.

***

### store?

> `optional` **store**: [`TokenStore`](TokenStore.md)

Defined in: [packages/auth/src/types.ts:111](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L111)

Token store shared across schemes.
