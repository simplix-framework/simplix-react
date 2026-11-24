[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / OAuth2SchemeOptions

# Interface: OAuth2SchemeOptions

Defined in: [packages/auth/src/types.ts:240](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L240)

Options for [oauth2Scheme](../functions/oauth2Scheme.md).

## Properties

### clientId

> **clientId**: `string`

Defined in: [packages/auth/src/types.ts:248](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L248)

OAuth2 client ID.

***

### clientSecret?

> `optional` **clientSecret**: `string`

Defined in: [packages/auth/src/types.ts:251](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L251)

OAuth2 client secret (optional for public clients).

***

### scopes?

> `optional` **scopes**: `string`[]

Defined in: [packages/auth/src/types.ts:254](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L254)

Requested scopes.

***

### store

> **store**: [`TokenStore`](TokenStore.md)

Defined in: [packages/auth/src/types.ts:242](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L242)

Token store for persisting OAuth2 tokens.

***

### tokenEndpoint

> **tokenEndpoint**: `string`

Defined in: [packages/auth/src/types.ts:245](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L245)

URL of the token endpoint.

***

### tokenEndpointBody?

> `optional` **tokenEndpointBody**: `Record`\<`string`, `string`\>

Defined in: [packages/auth/src/types.ts:260](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L260)

Additional body parameters for the token endpoint request.

***

### tokenEndpointHeaders?

> `optional` **tokenEndpointHeaders**: `Record`\<`string`, `string`\>

Defined in: [packages/auth/src/types.ts:257](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L257)

Additional headers for the token endpoint request.
