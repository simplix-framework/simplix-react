[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / SignInFailure

# Type Alias: SignInFailure

> **SignInFailure** = `"issuer-error"` \| `"not-pending"` \| `"malformed-response"` \| `"token-refused"`

Defined in: [packages/auth/src/errors.ts:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/errors.ts#L21)

Why a sign-in could not be finished, carried by a `SIGN_IN_FAILED` [AuthError](../classes/AuthError.md).

- `issuer-error` - the issuer sent the browser back with an `error` parameter; `issuerError` says which.
- `not-pending` - the response answers no sign-in this storage started: another tab's (a mailed link
  opened in a new tab), or one already finished. The issuer may still hold a session, so starting
  a sign-in again here usually succeeds without a prompt.
- `malformed-response` - the response answers the pending sign-in but carries no code.
- `token-refused` - the issuer refused the code exchange; `issuerError` says why when it answered.
