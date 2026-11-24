# @simplix-react-ext/simplix-boot-access

**English** | [한국어](/ko/extensions/simplix-boot/packages/access/README.md)

Spring Security authorization adapter for `@simplix-react/access`. Converts Spring Security permission responses into CASL rules and provides a ready-to-use `AccessAdapter`, a Boot access policy built on it, and a self access policy that reads identity and grants in one request.

## Installation

```bash
pnpm add @simplix-react-ext/simplix-boot-access
```

> **Prerequisites:** Requires `@simplix-react/access`, `@simplix-react/api` and `react` (>=18) as peer dependencies.

## Usage

### Create Access Adapter

`createSpringAccessAdapter()` returns an `AccessAdapter` that fetches permissions from Spring Security endpoints and converts them to CASL rules. `fetchFn` is required, and it must return the bare response body (use `bootMutator` from `createBootAuth()`, which unwraps the Boot envelope):

```ts
import { createAccessPolicy } from "@simplix-react/access";
import { createSpringAccessAdapter } from "@simplix-react-ext/simplix-boot-access";

const adapter = createSpringAccessAdapter({
  permissionsEndpoint: "/api/v1/user/me/permissions",
  publicPermissionsEndpoint: "/api/v1/public/user/permissions",
  systemAdminRole: "ROLE_SYSTEM_ADMIN",
  fetchFn: bootMutator,
});

const accessPolicy = createAccessPolicy({ adapter });
```

### Create a Boot Access Policy

`createBootAccessPolicy()` builds the Spring adapter and the `AccessPolicy` in one call. It unwraps a Boot envelope (`{ type, body }`) when the fetch function returns one, so `auth.fetchFn` can be passed directly, and it uses the same adapter for public (signed-out) access unless `enablePublicAccess` is `false`:

```ts
import { createBootAccessPolicy } from "@simplix-react-ext/simplix-boot-access";

export const accessPolicy = createBootAccessPolicy({
  fetchFn: auth.fetchFn,
  adapterOptions: { systemAdminRole: "ROLE_SYSTEM_ADMIN" },
  persist: { key: "myapp-access" },
});
```

### Read Identity and Grants Together

`createSelfAccessPolicy()` reads the signed-in user and their grants from one endpoint, so a screen never renders against an identity whose grants have not arrived. Role objects are reduced to their `roleCode`. `useSelfAccessRefusal()` returns how the server last refused that read (its status and error code), or `null` once it answers again:

```tsx
import {
  createSelfAccessPolicy,
  useSelfAccessRefusal,
} from "@simplix-react-ext/simplix-boot-access";

export const accessPolicy = createSelfAccessPolicy({
  endpoint: "/api/v1/user/me/permissions",
  fetchFn: auth.fetchFn,
});

function Shell({ children }: { children: React.ReactNode }) {
  const refusal = useSelfAccessRefusal();
  if (refusal) return <p>Access refused ({refusal.errorCode ?? refusal.status})</p>;
  return <>{children}</>;
}
```

Pass the auth stack's own fetch: a bare `fetch` reads as unauthenticated and answers with an empty grant map.

### Convert Permissions Directly

If you need to convert a Spring permissions response without the full adapter:

```ts
import { convertSpringPermissionsToCasl } from "@simplix-react-ext/simplix-boot-access";

const result = convertSpringPermissionsToCasl({
  permissions: { Pet: ["list", "view"], Order: ["list", "create"] },
  roles: ["ROLE_USER", { roleCode: "ROLE_ADMIN", roleName: "Admin" }],
  isSuperAdmin: false,
});

// result.rules:
// [
//   { action: "list", subject: "Pet" },
//   { action: "view", subject: "Pet" },
//   { action: "list", subject: "Order" },
//   { action: "create", subject: "Order" },
// ]
// result.roles: ["ROLE_USER", "ROLE_ADMIN"]
// result.isSuperAdmin: false
```

When `isSuperAdmin` is `true` (or `"true"`), a `{ action: "manage", subject: "all" }` rule is prepended automatically.

### Normalize Roles

Spring Security may return roles as plain strings or as objects. `normalizeRoles()` flattens a mixed array into plain role-code strings:

```ts
import { normalizeRoles } from "@simplix-react-ext/simplix-boot-access";

normalizeRoles(["ROLE_USER", { roleCode: "ROLE_ADMIN", roleName: "Admin" }]);
// → ["ROLE_USER", "ROLE_ADMIN"]
```

### Check Backoffice Access

A utility to check if the current user has backoffice access:

```ts
import { hasBackofficeAccess } from "@simplix-react-ext/simplix-boot-access";

hasBackofficeAccess(rules, true);              // true (super admin bypasses)
hasBackofficeAccess(rules, false);             // checks for BACKOFFICE_ACCESS resource
hasBackofficeAccess(rules, false, "MY_PANEL"); // checks for custom resource
```

## API Reference

### `createSpringAccessAdapter(options?)`

Creates an `AccessAdapter` for Spring Security permission endpoints.

**Options (`SpringAccessAdapterOptions`):**

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `permissionsEndpoint` | `string` | `"/api/v1/user/me/permissions"` | Authenticated permissions endpoint |
| `publicPermissionsEndpoint` | `string` | `"/api/v1/public/user/permissions"` | Public permissions endpoint |
| `systemAdminRole` | `string` | `"ROLE_SYSTEM_ADMIN"` | Role code that identifies a system admin |
| `fetchFn` | `OrvalMutator` | - | Fetch function that returns the response body. Required: the adapter throws when it is missing |

**Behavior:**

- When `authData` is `null` or `undefined`, fetches from `publicPermissionsEndpoint`
- Otherwise fetches from `permissionsEndpoint`
- If `systemAdminRole` is found in the user's roles, a `{ action: "manage", subject: "all" }` rule is added automatically
- Missing fields in the response (`permissions`, `roles`, `isSuperAdmin`) are safely defaulted to empty values (`{}`, `[]`, `false`)

**Note on the `user` field in `extract()` result:**

The `user` object returned by `extract()` has empty strings for `userId` and `username`, because the permissions endpoint does not include user identification data. If you need user info, fetch it separately with `authClient.userInfoFn()` from `createBootAuth()`, or use `createSelfAccessPolicy()`.

```ts
// Fetch user info from the auth client
const user = await authClient.userInfoFn();

// The permissions adapter only provides rules/roles/isSuperAdmin
const { rules, roles, user: accessUser } = await adapter.extract(authData);
// accessUser.userId === ""  (not provided by the permissions endpoint)
```

### `createBootAccessPolicy(options)`

Creates an `AccessPolicy` backed by `createSpringAccessAdapter()`.

**Options (`BootAccessPolicyOptions`):**

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `fetchFn` | `OrvalMutator` | - | Fetch function; a Boot envelope it returns is unwrapped to its `body` |
| `adapterOptions` | `Omit<SpringAccessAdapterOptions, "fetchFn">` | - | Endpoints and system admin role for the adapter |
| `isSuperAdmin` | `(user: AccessUser) => boolean` | `user.isSuperAdmin === true` | Super admin check passed to the policy |
| `persist` | `AccessPersistConfig` | - | Persistence of the policy snapshot |
| `enablePublicAccess` | `boolean` | `true` | Uses the adapter as the policy's `publicAccess`, reading the public endpoint while signed out |

### `createSelfAccessPolicy(config)`

Creates an `AccessPolicy<DefaultActions>` that reads identity and grants from one endpoint. The response may be a Boot envelope or the bare body `{ userId, username, displayName?, isSuperAdmin?, roles?: { roleCode }[], permissions? }`.

**Config (`SelfAccessConfig`):**

| Property | Type | Description |
| --- | --- | --- |
| `endpoint` | `string` | Endpoint that answers who is signed in and what they are granted |
| `fetchFn` | fetch function of `createApiAdapter` | The auth stack's fetch, which carries the bearer token |

A failed read records a `SelfAccessRefusal` (`{ status: number; errorCode?: string }`); the next successful read clears it.

### `useSelfAccessRefusal()` and `currentSelfAccessRefusal()`

`useSelfAccessRefusal()` is a React hook that returns the last `SelfAccessRefusal` of the self read, or `null`. `currentSelfAccessRefusal()` returns the same value outside React.

### `convertSpringPermissionsToCasl(response)`

Converts a `SpringPermissionsResponse` into CASL rules.

**Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `response` | `SpringPermissionsResponse` | Spring Security permissions response |

**Returns (`SpringConvertResult`):**

| Field | Type | Description |
| --- | --- | --- |
| `rules` | `AccessRule<string, string>[]` | CASL-compatible rules |
| `roles` | `string[]` | Normalized role strings |
| `isSuperAdmin` | `boolean` | Whether the user is a super admin |

### `normalizeRoles(roles)`

Normalizes a mixed array of role strings and Spring Security role objects into plain role-code strings.

**Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `roles` | `RoleInput[]` | Array of role strings or role objects |

For each entry, a string is kept as-is and an object resolves to `roleCode ?? roleName ?? name`. Entries that resolve to an empty value are filtered out. Returns `string[]`.

### `hasBackofficeAccess(rules, isSuperAdmin?, resource?)`

Checks whether the given rules grant backoffice access.

**Parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `rules` | `AccessRule<string, string>[]` | - | CASL rules to check |
| `isSuperAdmin` | `boolean` | `false` | Super admin bypass |
| `resource` | `string` | `"BACKOFFICE_ACCESS"` | Resource name to check |

Returns `true` if `isSuperAdmin` is `true`, or if any rule targets the specified resource or `"all"`.

### Types

#### `SpringPermissionsResponse`

```ts
interface SpringPermissionsResponse {
  permissions: Record<string, string[]>;
  roles: Array<string | { roleCode: string; roleName: string }>;
  isSuperAdmin: boolean | string;
}
```

#### `SpringAccessAdapterOptions`

See [createSpringAccessAdapter options](#createspringaccessadapteroptions) above.

#### `SpringConvertResult`

```ts
interface SpringConvertResult {
  rules: AccessRule<string, string>[];
  roles: string[];
  isSuperAdmin: boolean;
}
```

#### `RoleInput`

```ts
type RoleInput = string | { roleCode?: string; roleName?: string; name?: string };
```

## Error Handling

`createSpringAccessAdapter()` throws `fetchFn is required for createSpringAccessAdapter` when no `fetchFn` is given. Errors thrown by `fetchFn` propagate directly to the caller. There is no built-in retry or error transformation logic. If you need error interceptors, pass a custom fetch function via the `fetchFn` option.

> **Prerequisites:** Set up authentication first with `createBootAuth()` from `@simplix-react-ext/simplix-boot-auth`, and pass its fetch function as `fetchFn`.

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/extensions/simplix-boot/packages/access/README.md" target="_blank" rel="noopener noreferrer">View source</a></p>
