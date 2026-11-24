<p align="center">
  <img src="../../docs/assets/simplix-logo.png" alt="simplix-react" width="200" />
</p>

# @simplix-react/testing

**English** | [한국어](./README.ko.md)

Testing utilities for simplix-react applications: a pre-configured QueryClient, wrapper components, query helpers, in-memory mock clients, and access-policy helpers.

## Installation

```bash
pnpm add -D @simplix-react/testing
```

### Peer Dependencies

| Package | Version |
| --- | --- |
| `@simplix-react/contract` | `workspace:*` |
| `@tanstack/react-query` | `>= 5.0.0` |
| `react` | `>= 18.0.0` |
| `@simplix-react/access` | `workspace:*` (optional, for `createMockPolicy` and `createAccessTestWrapper`) |

## Quick Example

```tsx
import { describe, it, expect, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createTestWrapper, createMockClient } from "@simplix-react/testing";
import { contract } from "./my-contract";
import { useUsers } from "./use-users";

const mockClient = createMockClient(contract.config, {
  users: [{ id: "1", name: "Alice" }],
});

describe("useUsers", () => {
  const wrapper = createTestWrapper();

  it("returns user list", async () => {
    const { result } = renderHook(() => useUsers(mockClient), { wrapper });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toHaveLength(1);
  });
});
```

## API Overview

| Export | Description |
| --- | --- |
| `createTestQueryClient()` | Creates a `QueryClient` with retries disabled and zero gc/stale time |
| `createTestWrapper(options?)` | Creates a React wrapper component with all required providers |
| `waitForQuery(queryClient, queryKey, options?)` | Polls until a query resolves to a non-pending status |
| `createMockClient(config, data)` | Creates an in-memory CRUD client without MSW or network |
| `createMockPolicy(options?)` | Creates an `AccessPolicy` from static rules; allows everything by default |
| `createAccessTestWrapper(options?)` | Creates a wrapper with `QueryClientProvider` and `AccessProvider` |
| `MockPolicyOptions` | Options of `createMockPolicy` (`rules`, `user`, `allowAll`) |
| `AccessTestWrapperOptions` | Options of `createAccessTestWrapper` (`queryClient`, `policy`) |

## Key Concepts

### Test Query Client

`createTestQueryClient` returns a `QueryClient` tuned for test environments:

- **No retries**: queries and mutations fail immediately on error
- **Zero gcTime**: prevents stale cache from leaking between tests
- **Zero staleTime**: ensures data is always re-fetched

```ts
import { createTestQueryClient } from "@simplix-react/testing";

const queryClient = createTestQueryClient();

afterEach(() => {
  queryClient.clear();
});
```

### Test Wrapper

`createTestWrapper` produces a React component that wraps children with `QueryClientProvider`, using a client from `createTestQueryClient` unless you pass one. Pass it as the `wrapper` option to `renderHook` or `render`.

```tsx
import { renderHook } from "@testing-library/react";
import { createTestWrapper } from "@simplix-react/testing";

const wrapper = createTestWrapper();
const { result } = renderHook(() => useMyHook(), { wrapper });
```

You can supply a custom `QueryClient` when you need to inspect or pre-populate the cache:

```tsx
import { QueryClient } from "@tanstack/react-query";
import { createTestWrapper } from "@simplix-react/testing";

const queryClient = new QueryClient();
const wrapper = createTestWrapper({ queryClient });
```

### Mock Client

`createMockClient` builds an in-memory API client with one method per entity operation, like a real `ApiContract.client`. The data is keyed by entity name and backed by plain arrays, with no MSW and no network. The operation's role decides the method:

| Role | Mock behaviour |
| --- | --- |
| `list` | Resolves the entity's array |
| `get` | Resolves the item whose `id` equals the argument; rejects with `Not found` otherwise |
| `create` | Appends the DTO with an `id` from `crypto.randomUUID()`; accepts `(dto)` or `(parentId, dto)` |
| `update` | Merges the DTO into the item with that `id` |
| `delete` | Removes the item with that `id` |
| `tree` | Resolves `[]` |
| any other operation | Resolves `null` |

Top-level operations get no mock method.

```ts
import { createMockClient } from "@simplix-react/testing";
import { contract } from "./my-contract";

const mockClient = createMockClient(contract.config, {
  users: [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
  ],
});

const users = await mockClient.users.list();
// [{ id: "1", name: "Alice" }, { id: "2", name: "Bob" }]

await mockClient.users.create({ name: "Charlie" });
// users array now contains three items
```

Data mutations modify the seed arrays in place, so you can assert side effects directly:

```ts
await mockClient.users.delete("1");
const remaining = await mockClient.users.list();
expect(remaining).toHaveLength(1);
```

### waitForQuery

`waitForQuery` polls a `QueryClient` every 10 ms until a given query key leaves the `"pending"` status, and throws after `timeout` (default 5000 ms). It is useful when you need to wait for server state to settle outside of a rendering context.

```ts
import { createTestQueryClient, waitForQuery } from "@simplix-react/testing";

const queryClient = createTestQueryClient();

// ... trigger a prefetch or background query ...

await waitForQuery(queryClient, ["users"], { timeout: 3000 });
const data = queryClient.getQueryData(["users"]);
expect(data).toBeDefined();
```

### Access Policy

`createMockPolicy` builds an `AccessPolicy` from `@simplix-react/access` with a static adapter. Without options it grants `manage` on `all` to a user `test-user`; pass `rules` to test a restricted user, or `allowAll: false` to grant nothing. `createAccessTestWrapper` puts that policy (or yours) in an `AccessProvider` inside `QueryClientProvider`:

```tsx
import { render } from "@testing-library/react";
import { createAccessTestWrapper, createMockPolicy } from "@simplix-react/testing";

const policy = createMockPolicy({
  rules: [{ action: "view", subject: "Task" }],
});
const wrapper = createAccessTestWrapper({ policy });

render(<TaskToolbar />, { wrapper });
```

## Usage with Vitest

A typical Vitest setup file for simplix-react tests:

```ts
// vitest.setup.ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
```

In your test files:

```tsx
import { describe, it, expect, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  createTestQueryClient,
  createTestWrapper,
  createMockClient,
} from "@simplix-react/testing";

const queryClient = createTestQueryClient();
const wrapper = createTestWrapper({ queryClient });

afterEach(() => {
  queryClient.clear();
});

describe("my hook", () => {
  it("fetches data", async () => {
    const { result } = renderHook(() => useMyHook(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

## Related Packages

| Package | Description |
| --- | --- |
| `@simplix-react/contract` | Zod-based type-safe API contract definitions |
| `@simplix-react/react` | React Query hooks derived from contracts |
| `@simplix-react/mock` | MSW handlers + in-memory mock stores for integration testing |
| `@simplix-react/access` | Access policies that `createMockPolicy` builds |

---

**Next Step** → [`@simplix-react/mock`](../mock/README.md): serve the same contract from MSW mock handlers.
