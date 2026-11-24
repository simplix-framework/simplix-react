[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / AuthError

# Class: AuthError

Defined in: [packages/auth/src/errors.ts:40](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/errors.ts#L40)

Error thrown by auth operations.

Extends the native `Error` with a typed [AuthErrorCode](../type-aliases/AuthErrorCode.md) for
programmatic error handling.

## Example

```ts
try {
  await auth.fetchFn("/api/data");
} catch (error) {
  if (error instanceof AuthError && error.code === "REFRESH_FAILED") {
    redirectToLogin();
  }
}
```

## Extends

- `Error`

## Constructors

### Constructor

> **new AuthError**(`code`, `message`, `options?`): `AuthError`

Defined in: [packages/auth/src/errors.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/errors.ts#L53)

#### Parameters

##### code

[`AuthErrorCode`](../type-aliases/AuthErrorCode.md)

Typed error code for programmatic handling.

##### message

`string`

##### options?

Original error that caused this failure, the issuer's refusal when there was one, and why a sign-in failed.

###### cause?

`unknown`

###### issuerError?

\{ `description?`: `string`; `error`: `string`; \}

###### issuerError.description?

`string`

###### issuerError.error

`string`

###### signInFailure?

[`SignInFailure`](../type-aliases/SignInFailure.md)

#### Returns

`AuthError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26](https://github.com/simplix-framework/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2022.error.d.ts#L26)

#### Inherited from

`Error.cause`

***

### code

> `readonly` **code**: [`AuthErrorCode`](../type-aliases/AuthErrorCode.md)

Defined in: [packages/auth/src/errors.ts:55](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/errors.ts#L55)

Typed error code for programmatic handling.

***

### issuerError?

> `readonly` `optional` **issuerError**: `object`

Defined in: [packages/auth/src/errors.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/errors.ts#L48)

What the issuer said when it refused a token request, as RFC 6749 § 5.2 spells it: `error`
(`invalid_grant`) and `error_description`, the issuer's own words for why. Absent when the
failure was not an issuer's answer, or the answer carried no error body.

#### description?

> `readonly` `optional` **description**: `string`

#### error

> `readonly` **error**: `string`

***

### message

> **message**: `string`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1077](https://github.com/simplix-framework/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1077)

#### Inherited from

`Error.message`

***

### name

> `readonly` **name**: `"AuthError"` = `"AuthError"`

Defined in: [packages/auth/src/errors.ts:41](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/errors.ts#L41)

#### Overrides

`Error.name`

***

### signInFailure?

> `readonly` `optional` **signInFailure**: [`SignInFailure`](../type-aliases/SignInFailure.md)

Defined in: [packages/auth/src/errors.ts:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/errors.ts#L51)

Why a sign-in could not be finished; set on `SIGN_IN_FAILED` from the OIDC client only.

***

### stack?

> `optional` **stack**: `string`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1078](https://github.com/simplix-framework/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1078)

#### Inherited from

`Error.stack`
