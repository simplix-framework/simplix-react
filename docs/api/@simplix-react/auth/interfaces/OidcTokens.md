[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / OidcTokens

# Interface: OidcTokens

Defined in: [packages/auth/src/helpers/oidc-client.ts:57](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L57)

Tokens the issuer returned, with the ID token kept for sign-out.

## Extends

- [`TokenPair`](TokenPair.md)

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [packages/auth/src/types.ts:91](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L91)

#### Inherited from

[`TokenPair`](TokenPair.md).[`accessToken`](TokenPair.md#accesstoken)

***

### expiresAt?

> `optional` **expiresAt**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:96](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L96)

Absolute expiry time as ISO 8601 string or epoch milliseconds.

#### Inherited from

[`TokenPair`](TokenPair.md).[`expiresAt`](TokenPair.md#expiresat)

***

### expiresIn?

> `optional` **expiresIn**: `number`

Defined in: [packages/auth/src/types.ts:94](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L94)

Token validity duration in seconds.

#### Inherited from

[`TokenPair`](TokenPair.md).[`expiresIn`](TokenPair.md#expiresin)

***

### idToken?

> `optional` **idToken**: `string`

Defined in: [packages/auth/src/helpers/oidc-client.ts:58](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L58)

***

### refreshToken?

> `optional` **refreshToken**: `string`

Defined in: [packages/auth/src/types.ts:92](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L92)

#### Inherited from

[`TokenPair`](TokenPair.md).[`refreshToken`](TokenPair.md#refreshtoken)

***

### refreshTokenExpiresAt?

> `optional` **refreshTokenExpiresAt**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:98](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L98)

Absolute refresh token expiry as ISO 8601 string or epoch milliseconds.

#### Inherited from

[`TokenPair`](TokenPair.md).[`refreshTokenExpiresAt`](TokenPair.md#refreshtokenexpiresat)
