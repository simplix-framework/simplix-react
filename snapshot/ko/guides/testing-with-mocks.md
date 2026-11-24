# 목 유틸리티로 테스트 환경 구성하기

[English](/en/guides/testing-with-mocks.md) | **한국어**

> simplix-react의 테스트 도우미로 Vitest와 React Testing Library를 구성해, 결과가 매번 같고 테스트끼리 상태를 공유하지 않는 컴포넌트 · 훅 테스트를 작성하는 방법입니다.

## 시작하기 전에

- 도메인 패키지(domain package)가 하나 이상 있는 simplix-react 프로젝트가 필요합니다.
- 테스트 의존성을 설치하세요.

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
pnpm add -D @simplix-react/testing
```

- `jsdom` 환경을 사용하는 Vitest 설정이 필요합니다.

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```

## 해결 방법

### 1단계: 테스트용 QueryClient 만들기

`createTestQueryClient`는 테스트를 결정적으로 실행하도록 미리 설정한 `QueryClient`를 반환합니다. 재시도와 가비지 컬렉션을 꺼서 쿼리가 바로 끝나고 상태가 다음 테스트로 남지 않습니다.

```ts
import { createTestQueryClient } from "@simplix-react/testing";

const queryClient = createTestQueryClient();
```

적용되는 기본값은 다음과 같습니다.

| 옵션 | 값 | 이유 |
| --- | --- | --- |
| `queries.retry` | `false` | 오류가 나면 바로 실패 |
| `queries.gcTime` | `0` | 테스트 사이에 캐시를 보관하지 않음 |
| `queries.staleTime` | `0` | 항상 다시 요청 |
| `mutations.retry` | `false` | 오류가 나면 바로 실패 |

상태가 다음 테스트로 남지 않도록 테스트마다 클라이언트를 비우세요.

```ts
afterEach(() => {
  queryClient.clear();
});
```

### 2단계: 테스트 래퍼 만들기

`createTestWrapper`는 자식을 필요한 프로바이더(`QueryClientProvider`)로 감싸는 React 컴포넌트를 반환합니다. `renderHook`이나 `render`의 `wrapper` 옵션으로 전달하세요.

```tsx
import { renderHook } from "@testing-library/react";
import { createTestWrapper } from "@simplix-react/testing";

const wrapper = createTestWrapper();

const { result } = renderHook(() => useMyQuery(), { wrapper });
```

특정 `QueryClient`를 주입하려면 다음과 같이 작성합니다.

```tsx
import { createTestQueryClient, createTestWrapper } from "@simplix-react/testing";

const queryClient = createTestQueryClient();
const wrapper = createTestWrapper({ queryClient });
```

### 3단계: 단위 테스트용 목 클라이언트 만들기

`createMockClient(config, data)`는 MSW나 네트워크 계층 없이 실제 API 클라이언트와 형태가 같은 인메모리 클라이언트를 만듭니다. `data`의 키는 엔티티(entity) 이름이고, 엔티티마다 오퍼레이션(operation) 이름으로 함수가 하나씩 생깁니다. 함수는 전달한 배열을 직접 수정하므로, 테스트에서 생성 · 수정 · 삭제하면 시드 배열 자체가 바뀝니다.

```ts
import { createMockClient } from "@simplix-react/testing";
import { contract } from "@myapp/myapp-domain-inventory";

const mockClient = createMockClient(contract.config, {
  products: [
    { id: "1", name: "Widget", price: 100 },
    { id: "2", name: "Gadget", price: 200 },
  ],
});
```

오퍼레이션의 역할별 동작은 다음과 같습니다.

| 역할 | 시그니처 | 설명 |
| --- | --- | --- |
| `list` | `() => Promise<T[]>` | 시드 배열을 반환하고 매개변수는 무시합니다 |
| `get` | `(id) => Promise<T>` | `id`가 정확히 같은 항목을 찾고, 없으면 거부합니다 |
| `create` | `(dto)` 또는 `(parentId, dto) => Promise<T>` | `crypto.randomUUID()`로 만든 `id`를 지정해 추가합니다 |
| `update` | `(id, dto) => Promise<T>` | 필드를 병합하고, 없으면 거부합니다 |
| `delete` | `(id) => Promise<void>` | `id`로 삭제하고, 없으면 거부합니다 |
| `tree` | `() => Promise<[]>` | 빈 배열을 반환합니다 |
| 사용자 정의 | `() => Promise<null>` | `null`을 반환합니다 |

`get`, `update`, `delete`는 `===`로 비교합니다. 테스트에서 문자열 아이디를 전달한다면 시드에도 문자열 아이디를 넣으세요.

```ts
// List
const products = await mockClient.product.list();
expect(products).toHaveLength(2);

// Create
const created = await mockClient.product.create({ name: "Doohickey", price: 50 });
expect(created.id).toBeDefined();

// Update
const updated = await mockClient.product.update("1", { price: 150 });
expect(updated.price).toBe(150);

// Delete
await mockClient.product.delete("2");
const remaining = await mockClient.product.list();
expect(remaining).toHaveLength(2); // original 2 - 1 deleted + 1 created
```

### 4단계: 쿼리가 끝날 때까지 대기

`waitForQuery`는 특정 쿼리 키의 상태가 `"pending"`에서 벗어날 때까지 `QueryClient` 캐시를 반복해 확인합니다. 화면 수준의 `waitFor` 없이 서버 상태를 기다려야 할 때 사용하세요.

```ts
import { createTestQueryClient, waitForQuery } from "@simplix-react/testing";

const queryClient = createTestQueryClient();

// ... trigger a query fetch ...

await waitForQuery(queryClient, ["products"]);

const data = queryClient.getQueryData(["products"]);
expect(data).toBeDefined();
```

제한 시간이 지나도 쿼리가 대기 상태이면 `waitForQuery`는 오류를 발생시킵니다. 제한 시간(기본값 5000ms)은 다음과 같이 바꿉니다.

```ts
await waitForQuery(queryClient, ["products"], { timeout: 10000 });
```

### 5단계: 통합 테스트 전체 예제

목 클라이언트의 타입은 일반 레코드입니다. 파생 훅을 목 클라이언트로 실행하려면 실제 클라이언트 대신 목 클라이언트를 전달해 계약(contract)에서 훅을 파생하세요.

```tsx
import { describe, it, expect, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  createTestQueryClient,
  createTestWrapper,
  createMockClient,
} from "@simplix-react/testing";
import { deriveEntityHooks } from "@simplix-react/react";
import { contract } from "@myapp/myapp-domain-inventory";

describe("product.useList", () => {
  const queryClient = createTestQueryClient();
  const wrapper = createTestWrapper({ queryClient });

  const mockClient = createMockClient(contract.config, {
    product: [
      { id: "1", name: "Widget", price: 100 },
    ],
  });
  const hooks = deriveEntityHooks({ ...contract, client: mockClient });

  afterEach(() => {
    queryClient.clear();
  });

  it("returns product list", async () => {
    const { result } = renderHook(
      () => hooks.product.useList(),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].name).toBe("Widget");
  });
});
```

## 변형

### MSW로 HTTP 수준 모킹

실제 HTTP 계층까지 거치는 테스트라면 테스트 유틸리티와 함께 MSW(Mock Service Worker)를 사용하세요. `simplix add-domain`이나 `simplix openapi`로 생성한 도메인 패키지는 `/mock` 진입점에서 `create<Domain>Mock()` 팩토리를 내보냅니다. 팩토리가 반환하는 `handlers`는 파생된 목 핸들러이고, `seed`의 키는 저장소 이름입니다. Node에서는 `setupServer`로 핸들러를 시작하고 시드를 인메모리 저장소에 직접 적재하세요.

```ts
import { setupServer } from "msw/node";
import { resetStore, seedEntityStore } from "@simplix-react/mock";
import { createInventoryMock } from "@myapp/myapp-domain-inventory/mock";

const inventoryMock = createInventoryMock();
const server = setupServer(...inventoryMock.handlers);

beforeAll(() => server.listen());
beforeEach(() => {
  resetStore();
  for (const [storeName, records] of Object.entries(inventoryMock.seed ?? {})) {
    seedEntityStore(storeName, records);
  }
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

컴포넌트 테스트에서는 `createTestWrapper`와 함께 사용합니다.

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { createTestWrapper } from "@simplix-react/testing";
import { ProductList } from "./product-list.js";

const wrapper = createTestWrapper();

it("renders products from MSW", async () => {
  render(<ProductList />, { wrapper });

  await waitFor(() => {
    expect(screen.getByText("Widget")).toBeInTheDocument();
  });
});
```

### i18n을 사용하는 컴포넌트 테스트

`useTranslation`을 사용하는 컴포넌트를 테스트하려면 래퍼에 `I18nProvider`를 추가하세요.

```tsx
import { createElement } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@simplix-react/i18n/react";
import { createTestQueryClient } from "@simplix-react/testing";
import { adapter, i18nReady } from "./test-i18n-setup.js";

async function createI18nTestWrapper() {
  const queryClient = createTestQueryClient();
  await i18nReady;

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(I18nProvider, { adapter }, children),
    );
  };
}
```

### 특정 테스트용 QueryClient

특정 동작이 필요하면(예: 재시도 로직을 테스트하려고 재시도를 켜는 경우) 기본 테스트 클라이언트 대신 직접 만든 클라이언트를 사용하세요.

```ts
import { QueryClient } from "@tanstack/react-query";
import { createTestWrapper } from "@simplix-react/testing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 100,
    },
  },
});

const wrapper = createTestWrapper({ queryClient });
```

### 접근 제어 테스트

`@simplix-react/access`에 의존하는 컴포넌트나 훅(예: `useCan`, `Can`)을 테스트할 때는 `createMockPolicy`와 `createAccessTestWrapper`로 테스트 트리에 `AccessProvider`를 제공하세요.

#### `createMockPolicy`

정적 어댑터를 사용하는 `AccessPolicy`를 만듭니다. 기본값은 전체 권한(`all`에 대한 `manage`)이므로, 권한을 다루지 않는 테스트는 추가 설정 없이 통과합니다.

```ts
function createMockPolicy(options?: MockPolicyOptions): AccessPolicy
```

옵션은 다음과 같습니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `rules` | `AccessRule[]` | `[]` | 적용할 CASL 규칙 |
| `user` | `AccessUser` | `{ userId: "test-user", username: "testuser", roles: [] }` | 테스트 사용자 |
| `allowAll` | `boolean` | `true` | `true`이고 `rules`가 없으면 `all`에 `manage` 권한을 부여 |

```ts
import { createMockPolicy } from "@simplix-react/testing";

// Default: full access
const policy = createMockPolicy();
policy.can("edit", "Pet"); // true

// Restricted access
const restricted = createMockPolicy({
  rules: [{ action: "view", subject: "Pet" }],
  allowAll: false,
});
restricted.can("view", "Pet"); // true
restricted.can("edit", "Pet"); // false
```

#### `createAccessTestWrapper`

`QueryClientProvider`와 `AccessProvider`를 함께 제공하는 React 래퍼 컴포넌트를 만듭니다. 테스트 대상 코드가 `useCan`을 호출하거나 `Can`을 렌더링하면 `renderHook`이나 `render`의 `wrapper` 옵션으로 사용하세요.

```ts
function createAccessTestWrapper(
  options?: AccessTestWrapperOptions,
): FC<{ children: ReactNode }>
```

옵션은 다음과 같습니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `queryClient` | `QueryClient` | `createTestQueryClient()` | 직접 만든 QueryClient |
| `policy` | `AccessPolicy` | `createMockPolicy()`(전체 권한) | 직접 만든 AccessPolicy |

```tsx
import { renderHook } from "@testing-library/react";
import { createAccessTestWrapper } from "@simplix-react/testing";
import { useCan } from "@simplix-react/access/react";

const wrapper = createAccessTestWrapper();
const { result } = renderHook(() => useCan("view", "Pet"), { wrapper });

expect(result.current).toBe(true);
```

권한을 제한한 정책으로 테스트하려면 다음과 같이 작성합니다.

```tsx
import { createAccessTestWrapper, createMockPolicy } from "@simplix-react/testing";

const policy = createMockPolicy({
  rules: [{ action: "view", subject: "Pet" }],
  allowAll: false,
});
const wrapper = createAccessTestWrapper({ policy });
```

#### 전체 예제: 쿼리와 접근 제어

데이터를 조회하고 권한에 따라 다르게 렌더링하는 컴포넌트의 전체 테스트입니다.

```tsx
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import {
  createTestQueryClient,
  createAccessTestWrapper,
  createMockClient,
  createMockPolicy,
} from "@simplix-react/testing";
import { deriveEntityHooks } from "@simplix-react/react";
import { contract } from "@myapp/myapp-domain-inventory";
import { Can } from "@simplix-react/access/react";

const mockClient = createMockClient(contract.config, {
  product: [{ id: "1", name: "Widget", price: 100 }],
});
const hooks = deriveEntityHooks({ ...contract, client: mockClient });

function ProductManager() {
  const { data: products } = hooks.product.useList();

  if (!products) return <p>Loading...</p>;

  return (
    <div>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <Can I="create" a="Product">
        <button>Add Product</button>
      </Can>
    </div>
  );
}

describe("ProductManager", () => {
  const queryClient = createTestQueryClient();

  afterEach(() => {
    queryClient.clear();
  });

  it("shows add button when user has create permission", async () => {
    const policy = createMockPolicy({
      rules: [
        { action: "view", subject: "Product" },
        { action: "create", subject: "Product" },
      ],
      allowAll: false,
    });
    const wrapper = createAccessTestWrapper({ queryClient, policy });

    render(<ProductManager />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("Widget")).toBeInTheDocument();
    });

    expect(screen.getByText("Add Product")).toBeInTheDocument();
  });

  it("hides add button when user lacks create permission", async () => {
    const policy = createMockPolicy({
      rules: [{ action: "view", subject: "Product" }],
      allowAll: false,
    });
    const wrapper = createAccessTestWrapper({ queryClient, policy });

    render(<ProductManager />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("Widget")).toBeInTheDocument();
    });

    expect(screen.queryByText("Add Product")).not.toBeInTheDocument();
  });
});
```

## 관련 문서

- [국제화](/ko/guides/internationalization.md): i18n 설정(i18n 컴포넌트 테스트에 필요)
- [목 핸들러](/ko/guides/mock-handlers.md): 목 핸들러 파생과 인메모리 저장소 시드 적재
- [CLI 사용법](/ko/guides/cli-usage.md): `simplix add-domain`과 `simplix openapi`가 도메인 패키지의 `/mock` 진입점을 생성
- [@simplix-react/testing 소스](https://github.com/simplix-framework/simplix-react/tree/main/packages/testing/src)

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/ko/guides/testing-with-mocks.md" target="_blank" rel="noopener noreferrer">원본 보기</a></p>
