[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / OidcClientOptions

# Interface: OidcClientOptions

Defined in: [packages/auth/src/helpers/oidc-client.ts:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L21)

Options for [createOidcClient](../functions/createOidcClient.md).

## Properties

### clientId

> **clientId**: `string`

Defined in: [packages/auth/src/helpers/oidc-client.ts:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L25)

The public client registered at the issuer.

***

### fetchFn()?

> `optional` **fetchFn**: (`input`, `init?`) => `Promise`\<`Response`\>

Defined in: [packages/auth/src/helpers/oidc-client.ts:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L51)

Fetch used for discovery and the token endpoint. Defaults to the global `fetch`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

#### Parameters

##### input

`RequestInfo` | `URL`

##### init?

`RequestInit`

#### Returns

`Promise`\<`Response`\>

***

### idTokenStorage?

> `optional` **idTokenStorage**: [`OidcPendingStorage`](OidcPendingStorage.md)

Defined in: [packages/auth/src/helpers/oidc-client.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L49)

Where the ID token of the last exchange or refresh is kept, under `<storageKey>:id-token`.
Defaults to [storage](#storage). A pending sign-in belongs to the tab that started it, so the
default per-tab storage is right for it; the ID token belongs to the session, which every tab
shares, so an app whose sign-out may start in any tab passes a storage the tabs share
(`localStorage`). Kept per tab, a sign-out from another tab names no ID token and the issuer
stops at its logout confirmation, keeping the session.

***

### issuer

> **issuer**: `string`

Defined in: [packages/auth/src/helpers/oidc-client.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L23)

The issuer URL; its discovery document is read from `<issuer>/.well-known/openid-configuration`.

***

### navigate()?

> `optional` **navigate**: (`url`) => `void`

Defined in: [packages/auth/src/helpers/oidc-client.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L53)

Sends the browser to a URL. Defaults to `window.location.assign`.

#### Parameters

##### url

`string`

#### Returns

`void`

***

### postLogoutRedirectUri?

> `optional` **postLogoutRedirectUri**: `string`

Defined in: [packages/auth/src/helpers/oidc-client.ts:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L29)

Where the issuer sends the browser after sign-out.

***

### redirectUri

> **redirectUri**: `string`

Defined in: [packages/auth/src/helpers/oidc-client.ts:27](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L27)

Where the issuer sends the browser back with the code; must be registered for the client.

***

### scopes?

> `optional` **scopes**: `string`[]

Defined in: [packages/auth/src/helpers/oidc-client.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L31)

Requested scopes. Defaults to `["openid"]`.

***

### storage?

> `optional` **storage**: [`OidcPendingStorage`](OidcPendingStorage.md)

Defined in: [packages/auth/src/helpers/oidc-client.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L33)

Holds the verifier and state across the redirect. Defaults to `sessionStorage`.

***

### storageKey?

> `optional` **storageKey**: `string`

Defined in: [packages/auth/src/helpers/oidc-client.ts:40](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L40)

Key the pending sign-in is kept under. Defaults to `"simplix:oidc:pending"`. The ID token of
the last exchange or refresh is kept beside it, under `<storageKey>:id-token`, in the same
storage: outside the token store, whose `clear()` a failed refresh runs before the sign-out
address is built.
