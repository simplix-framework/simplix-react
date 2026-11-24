[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / TokenPair

# Interface: TokenPair

Defined in: [packages/auth/src/types.ts:90](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L90)

Represents an access/refresh token pair returned from an auth endpoint.

## Extended by

- [`OidcTokens`](OidcTokens.md)

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [packages/auth/src/types.ts:91](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L91)

***

### expiresAt?

> `optional` **expiresAt**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:96](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L96)

Absolute expiry time as ISO 8601 string or epoch milliseconds.

***

### expiresIn?

> `optional` **expiresIn**: `number`

Defined in: [packages/auth/src/types.ts:94](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L94)

Token validity duration in seconds.

***

### refreshToken?

> `optional` **refreshToken**: `string`

Defined in: [packages/auth/src/types.ts:92](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L92)

***

### refreshTokenExpiresAt?

> `optional` **refreshTokenExpiresAt**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:98](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L98)

Absolute refresh token expiry as ISO 8601 string or epoch milliseconds.
