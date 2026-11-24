<p align="center">
  <img src="../../docs/assets/simplix-logo.png" alt="simplix-react" width="200" />
</p>

# @simplix-react/testing

[English](./README.md) | **한국어**

simplix-react 애플리케이션용 테스트 도구입니다. 미리 설정한 QueryClient, 래퍼 컴포넌트, 쿼리 보조 함수, 인메모리 목(mock) 클라이언트, 접근 정책 보조 함수를 제공합니다.

## 설치

```bash
pnpm add -D @simplix-react/testing
```

### 피어 의존성

| 패키지 | 버전 |
| --- | --- |
| `@simplix-react/contract` | `workspace:*` |
| `@tanstack/react-query` | `>= 5.0.0` |
| `react` | `>= 18.0.0` |
| `@simplix-react/access` | `workspace:*` (선택, `createMockPolicy`와 `createAccessTestWrapper`에 필요) |

## 빠른 예제

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

## API 개요

| 내보내는 이름 | 설명 |
| --- | --- |
| `createTestQueryClient()` | 재시도를 끄고 gc 시간과 stale 시간을 0으로 둔 `QueryClient`를 만듭니다 |
| `createTestWrapper(options?)` | 필요한 프로바이더를 모두 갖춘 React 래퍼 컴포넌트를 만듭니다 |
| `waitForQuery(queryClient, queryKey, options?)` | 쿼리가 대기 상태를 벗어날 때까지 주기적으로 확인합니다 |
| `createMockClient(config, data)` | MSW나 네트워크 없이 동작하는 인메모리 CRUD 클라이언트를 만듭니다 |
| `createMockPolicy(options?)` | 고정 규칙으로 `AccessPolicy`를 만듭니다. 기본값은 모두 허용입니다 |
| `createAccessTestWrapper(options?)` | `QueryClientProvider`와 `AccessProvider`를 갖춘 래퍼를 만듭니다 |
| `MockPolicyOptions` | `createMockPolicy`의 옵션(`rules`, `user`, `allowAll`)입니다 |
| `AccessTestWrapperOptions` | `createAccessTestWrapper`의 옵션(`queryClient`, `policy`)입니다 |

## 핵심 개념

### 테스트용 QueryClient

`createTestQueryClient`는 테스트 환경에 맞춘 `QueryClient`를 반환합니다.

- **재시도 없음**: 쿼리와 뮤테이션이 오류가 나면 바로 실패합니다
- **gcTime 0**: 테스트 사이에 오래된 캐시가 남지 않습니다
- **staleTime 0**: 데이터를 항상 다시 가져옵니다

```ts
import { createTestQueryClient } from "@simplix-react/testing";

const queryClient = createTestQueryClient();

afterEach(() => {
  queryClient.clear();
});
```

### 테스트 래퍼

`createTestWrapper`는 자식 요소를 `QueryClientProvider`로 감싸는 React 컴포넌트를 만듭니다. 클라이언트를 전달하지 않으면 `createTestQueryClient`로 만든 클라이언트를 씁니다. `renderHook`이나 `render`의 `wrapper` 옵션으로 전달하세요.

```tsx
import { renderHook } from "@testing-library/react";
import { createTestWrapper } from "@simplix-react/testing";

const wrapper = createTestWrapper();
const { result } = renderHook(() => useMyHook(), { wrapper });
```

캐시를 확인하거나 미리 채워야 하면 `QueryClient`를 직접 전달하세요.

```tsx
import { QueryClient } from "@tanstack/react-query";
import { createTestWrapper } from "@simplix-react/testing";

const queryClient = new QueryClient();
const wrapper = createTestWrapper({ queryClient });
```

### 목 클라이언트

`createMockClient`는 실제 `ApiContract.client`처럼 엔티티 오퍼레이션마다 메서드가 하나씩 있는 인메모리 API 클라이언트를 만듭니다. 데이터는 엔티티 이름을 키로 하는 일반 배열에 담기며, MSW와 네트워크를 쓰지 않습니다. 메서드의 동작은 오퍼레이션의 역할로 정해집니다.

| 역할 | 목 동작 |
| --- | --- |
| `list` | 엔티티 배열을 반환합니다 |
| `get` | `id`가 인수와 같은 항목을 반환하고, 없으면 `Not found`로 거부합니다 |
| `create` | `crypto.randomUUID()`로 만든 `id`를 지정해 DTO를 추가합니다. `(dto)`와 `(parentId, dto)`를 모두 받습니다 |
| `update` | 해당 `id` 항목에 DTO를 병합합니다 |
| `delete` | 해당 `id` 항목을 삭제합니다 |
| `tree` | `[]`를 반환합니다 |
| 그 밖의 오퍼레이션 | `null`을 반환합니다 |

최상위 오퍼레이션에는 목 메서드가 생기지 않습니다.

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

데이터를 바꾸는 호출은 시드 배열을 직접 수정하므로 부수 효과를 바로 검증할 수 있습니다.

```ts
await mockClient.users.delete("1");
const remaining = await mockClient.users.list();
expect(remaining).toHaveLength(1);
```

### waitForQuery

`waitForQuery`는 지정한 쿼리 키가 `"pending"` 상태를 벗어날 때까지 `QueryClient`를 10ms마다 확인하고, `timeout`(기본값 5000ms)이 지나면 오류를 발생시킵니다. 렌더링 밖에서 서버 상태가 안정될 때까지 기다려야 할 때 쓰세요.

```ts
import { createTestQueryClient, waitForQuery } from "@simplix-react/testing";

const queryClient = createTestQueryClient();

// ... trigger a prefetch or background query ...

await waitForQuery(queryClient, ["users"], { timeout: 3000 });
const data = queryClient.getQueryData(["users"]);
expect(data).toBeDefined();
```

### 접근 정책

`createMockPolicy`는 정적 어댑터로 `@simplix-react/access`의 `AccessPolicy`를 만듭니다. 옵션이 없으면 `test-user` 사용자에게 `all`에 대한 `manage` 권한을 줍니다. 제한된 사용자를 테스트하려면 `rules`를 전달하고, 아무 권한도 주지 않으려면 `allowAll: false`를 전달하세요. `createAccessTestWrapper`는 그 정책(또는 직접 전달한 정책)을 `QueryClientProvider` 안의 `AccessProvider`에 넣습니다.

```tsx
import { render } from "@testing-library/react";
import { createAccessTestWrapper, createMockPolicy } from "@simplix-react/testing";

const policy = createMockPolicy({
  rules: [{ action: "view", subject: "Task" }],
});
const wrapper = createAccessTestWrapper({ policy });

render(<TaskToolbar />, { wrapper });
```

## Vitest와 함께 쓰기

simplix-react 테스트에 쓰는 일반적인 Vitest 설정 파일은 다음과 같습니다.

```ts
// vitest.setup.ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
```

테스트 파일에서는 다음과 같이 씁니다.

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

## 관련 패키지

| 패키지 | 설명 |
| --- | --- |
| `@simplix-react/contract` | Zod 기반의 타입이 안전한 API 계약(contract) 정의 |
| `@simplix-react/react` | 계약에서 파생한 React Query 훅 |
| `@simplix-react/mock` | 통합 테스트용 MSW 핸들러와 인메모리 목 저장소 |
| `@simplix-react/access` | `createMockPolicy`가 만드는 접근 정책 |

---

**다음 단계** → [`@simplix-react/mock`](../mock/README.ko.md): 같은 계약에서 MSW 목 핸들러를 파생해 응답합니다.
