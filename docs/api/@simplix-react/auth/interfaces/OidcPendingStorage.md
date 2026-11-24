[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / OidcPendingStorage

# Interface: OidcPendingStorage

Defined in: [packages/auth/src/helpers/oidc-client.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L12)

Where the client keeps the state of a sign-in between the redirect out and the redirect back.

## Methods

### getItem()

> **getItem**(`key`): `string` \| `null`

Defined in: [packages/auth/src/helpers/oidc-client.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L13)

#### Parameters

##### key

`string`

#### Returns

`string` \| `null`

***

### removeItem()

> **removeItem**(`key`): `void`

Defined in: [packages/auth/src/helpers/oidc-client.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L15)

#### Parameters

##### key

`string`

#### Returns

`void`

***

### setItem()

> **setItem**(`key`, `value`): `void`

Defined in: [packages/auth/src/helpers/oidc-client.ts:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L14)

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`void`
