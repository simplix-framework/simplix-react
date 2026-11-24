[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / createOidcClient

# Function: createOidcClient()

> **createOidcClient**(`options`): [`OidcClient`](../interfaces/OidcClient.md)

Defined in: [packages/auth/src/helpers/oidc-client.ts:159](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/oidc-client.ts#L159)

Creates a public OpenID Connect client for a browser application.

Signs in with the authorization code flow and PKCE (S256), so no client secret is held in the
browser. Pair it with a token store through `AuthInstance.setTokens` after
[OidcClient.completeSignIn](../interfaces/OidcClient.md#completesignin), and use [OidcClient.refresh](../interfaces/OidcClient.md#refresh) as the refresh function.

## Parameters

### options

[`OidcClientOptions`](../interfaces/OidcClientOptions.md)

## Returns

[`OidcClient`](../interfaces/OidcClient.md)

## Example

```ts
const oidc = createOidcClient({
  issuer: "https://id.example.com/realms/staff",
  clientId: "backoffice",
  redirectUri: `${location.origin}/login/complete`,
});
await oidc.signIn({ returnTo: "/users" });
```
