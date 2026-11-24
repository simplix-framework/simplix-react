[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / CustomSchemeOptions

# Interface: CustomSchemeOptions

Defined in: [packages/auth/src/types.ts:266](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L266)

Options for [customScheme](../functions/customScheme.md).

## Properties

### clear()

> **clear**: () => `void`

Defined in: [packages/auth/src/types.ts:280](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L280)

Clears all stored credentials.

#### Returns

`void`

***

### getHeaders()

> **getHeaders**: () => `Promise`\<`Record`\<`string`, `string`\>\>

Defined in: [packages/auth/src/types.ts:271](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L271)

Returns headers to attach to each request.

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

***

### isAuthenticated()

> **isAuthenticated**: () => `boolean`

Defined in: [packages/auth/src/types.ts:277](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L277)

Returns whether credentials are currently valid.

#### Returns

`boolean`

***

### name

> **name**: `string`

Defined in: [packages/auth/src/types.ts:268](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L268)

Unique name for this custom scheme.

***

### refresh()?

> `optional` **refresh**: () => `Promise`\<`void`\>

Defined in: [packages/auth/src/types.ts:274](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L274)

Optional refresh logic.

#### Returns

`Promise`\<`void`\>
