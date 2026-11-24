[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / OidcClient

# Interface: OidcClient

Defined in: [packages/auth/src/helpers/oidc-client.ts:64](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L64)

A public OpenID Connect client using the authorization code flow with PKCE.

## Methods

### completeSignIn()

> **completeSignIn**(`callbackUrl`): `Promise`\<\{ `returnTo?`: `string`; `tokens`: [`OidcTokens`](OidcTokens.md); \}\>

Defined in: [packages/auth/src/helpers/oidc-client.ts:80](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L80)

Finishes a sign-in from the URL the issuer redirected back to: checks the state, exchanges
the code with the verifier, and forgets the pending sign-in either way.

#### Parameters

##### callbackUrl

`string`

#### Returns

`Promise`\<\{ `returnTo?`: `string`; `tokens`: [`OidcTokens`](OidcTokens.md); \}\>

#### Throws

`SIGN_IN_FAILED` when the issuer reported an error, the state does not
  match the pending sign-in, or the code exchange is refused; its `signInFailure` says which,
  and `issuerError` carries the issuer's `error` and `error_description`

***

### discovery()

> **discovery**(): `Promise`\<[`OidcDiscovery`](OidcDiscovery.md)\>

Defined in: [packages/auth/src/helpers/oidc-client.ts:95](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L95)

The issuer's discovery document, read once.

#### Returns

`Promise`\<[`OidcDiscovery`](OidcDiscovery.md)\>

***

### refresh()

> **refresh**(`refreshToken`): `Promise`\<[`OidcTokens`](OidcTokens.md)\>

Defined in: [packages/auth/src/helpers/oidc-client.ts:86](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L86)

Exchanges a refresh token for new tokens.

#### Parameters

##### refreshToken

`string`

#### Returns

`Promise`\<[`OidcTokens`](OidcTokens.md)\>

#### Throws

`REFRESH_FAILED` when the issuer refuses it

***

### signIn()

> **signIn**(`options?`): `Promise`\<`void`\>

Defined in: [packages/auth/src/helpers/oidc-client.ts:71](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L71)

Sends the browser to the issuer's sign-in page.

#### Parameters

##### options?

###### params?

`Record`\<`string`, `string`\>

extra authorization parameters, such as `ui_locales` or `prompt`

###### returnTo?

`string`

an app path handed back by [OidcClient.completeSignIn](#completesignin)

#### Returns

`Promise`\<`void`\>

***

### signOutUrl()

> **signOutUrl**(`idTokenHint?`): `Promise`\<`string` \| `null`\>

Defined in: [packages/auth/src/helpers/oidc-client.ts:93](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L93)

The issuer's sign-out URL, or `null` when it publishes none.

#### Parameters

##### idTokenHint?

`string`

The ID token to name. Left out, the one kept from the last sign-in or
  refresh is named and forgotten, so the issuer ends the session without asking to confirm.

#### Returns

`Promise`\<`string` \| `null`\>
