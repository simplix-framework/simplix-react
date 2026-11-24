[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / ApiKeySchemeOptions

# Interface: ApiKeySchemeOptions

Defined in: [packages/auth/src/types.ts:226](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L226)

Options for [apiKeyScheme](../functions/apiKeyScheme.md).

## Properties

### in

> **in**: `"header"` \| `"query"`

Defined in: [packages/auth/src/types.ts:228](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L228)

Where to place the API key.

***

### key

> **key**: `string` \| () => `string` \| `null`

Defined in: [packages/auth/src/types.ts:234](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L234)

Static key string or function returning the current key.

***

### name

> **name**: `string`

Defined in: [packages/auth/src/types.ts:231](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L231)

Header name or query parameter name (e.g., `"X-API-Key"`).
