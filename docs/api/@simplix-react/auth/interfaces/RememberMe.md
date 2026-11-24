[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / RememberMe

# Interface: RememberMe

Defined in: [packages/auth/src/remember-me.ts:6](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/remember-me.ts#L6)

What one app's stay-signed-in preference offers.

## Properties

### isRemembered()

> `readonly` **isRemembered**: () => `boolean`

Defined in: [packages/auth/src/remember-me.ts:10](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/remember-me.ts#L10)

Whether this machine is currently set to stay signed in.

#### Returns

`boolean`

***

### rememberMeStore()

> `readonly` **rememberMeStore**: (`prefix`) => [`TokenStore`](TokenStore.md)

Defined in: [packages/auth/src/remember-me.ts:8](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/remember-me.ts#L8)

A token store that keeps the session only as long as the operator asked for.

#### Parameters

##### prefix

`string`

#### Returns

[`TokenStore`](TokenStore.md)

***

### setRemembered()

> `readonly` **setRemembered**: (`remember`) => `void`

Defined in: [packages/auth/src/remember-me.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/remember-me.ts#L12)

Records the choice. Called before the credential exchange.

#### Parameters

##### remember

`boolean`

#### Returns

`void`
