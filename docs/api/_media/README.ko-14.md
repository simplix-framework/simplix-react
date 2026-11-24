<p align="center">
  <img src="../../docs/assets/simplix-logo.png" alt="simplix-react" width="200" />
</p>

# @simplix-react/react

[English](./README.md) | **한국어**

`@simplix-react/contract` API 계약(contract)에서 타입이 안전한 React Query 훅을 자동으로 파생합니다.

> **사전 준비:** `@simplix-react/contract`로 정의한 계약이 필요합니다. 먼저 [`@simplix-react/contract`](../contract/README.ko.md)를 읽으세요.

## 설치

```bash
pnpm add @simplix-react/react
```

**피어 의존성:**

| 패키지 | 버전 |
| --- | --- |
| `@simplix-react/contract` | workspace |
| `@tanstack/react-query` | >= 5.0.0 |
| `@tanstack/react-query-persist-client` | >= 5.0.0 |
| `@tanstack/query-sync-storage-persister` | >= 5.0.0 |
| `react` | >= 18.0.0 |
| `zod` | >= 4.0.0 |

## 빠른 예제

```tsx
import { defineApi, simpleQueryBuilder } from "@simplix-react/contract";
import { deriveEntityHooks } from "@simplix-react/react";
import { z } from "zod";

// 1. Define the contract
const projectContract = defineApi({
  domain: "project",
  basePath: "/api",
  entities: {
    task: {
      schema: z.object({ id: z.string(), title: z.string(), status: z.string() }),
      operations: {
        list: { method: "GET", path: "/tasks" },
        get: { method: "GET", path: "/tasks/:id" },
        create: {
          method: "POST",
          path: "/tasks",
          input: z.object({ title: z.string(), status: z.string() }),
        },
        update: {
          method: "PATCH",
          path: "/tasks/:id",
          input: z.object({ title: z.string().optional(), status: z.string().optional() }),
        },
        delete: { method: "DELETE", path: "/tasks/:id" },
      },
    },
  },
  queryBuilder: simpleQueryBuilder,
});

// 2. Derive hooks: one call covers every entity and operation
const hooks = deriveEntityHooks(projectContract);

// 3. Use in components
function TaskList() {
  const { data: tasks, isLoading } = hooks.task.useList();
  const createTask = hooks.task.useCreate();

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {tasks?.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

## API 개요

이 패키지는 훅 파생 함수, 쿼리 실행 보조 함수, 타입 정의를 내보냅니다.

| 내보내는 이름 | 종류 | 설명 |
| --- | --- | --- |
| `deriveEntityHooks` | 함수 | 계약에서 모든 훅을 파생합니다 |
| `useBatchDetails` | 훅 | 목록의 항목마다 상세 쿼리를 하나씩 실행하고 결과를 합칩니다 |
| `createLocalQueryStore` | 함수 | 캐시를 `localStorage`에 저장할 쿼리 키를 등록합니다 |
| `startOnlineStatusSync` | 함수 | React Query의 연결 상태 플래그를 `navigator.onLine`과 계속 맞춥니다 |
| `resyncOnlineStatus` | 함수 | 호출할 때 연결 상태 플래그를 한 번 바로잡습니다 |
| `DerivedEntityHooksResult` | 타입 | `deriveEntityHooks`의 반환 타입입니다 |
| `EntityHooks` | 타입 | 엔티티 하나의 훅 인터페이스입니다 |
| `EntityHookFor` | 타입 | 엔티티 오퍼레이션 하나의 훅 타입이며 역할에 따라 정해집니다 |
| `OperationHooks` | 타입 | 최상위 오퍼레이션의 훅 인터페이스입니다 |
| `DerivedListHook` | 타입 | 목록 쿼리 훅의 시그니처입니다 |
| `DerivedGetHook` | 타입 | 상세 쿼리 훅의 시그니처입니다 |
| `DerivedCreateHook` | 타입 | 생성 뮤테이션 훅의 시그니처입니다 |
| `DerivedUpdateHook` | 타입 | 수정 뮤테이션 훅의 시그니처입니다 |
| `DerivedDeleteHook` | 타입 | 삭제 뮤테이션 훅의 시그니처입니다 |
| `DerivedInfiniteListHook` | 타입 | 무한 목록 쿼리 훅의 시그니처입니다 |
| `DerivedTreeHook` | 타입 | 트리 쿼리 훅의 시그니처입니다 |
| `DerivedQueryHook` | 타입 | 사용자 정의 GET 오퍼레이션의 쿼리 훅 시그니처입니다 |
| `OperationMutationHook` | 타입 | 사용자 정의 오퍼레이션의 뮤테이션 훅 시그니처입니다 |
| `LocalQueryStoreOptions`, `LocalQueryDef` | 타입 | `createLocalQueryStore`의 옵션과 로컬 쿼리 하나의 정의입니다 |

## 핵심 개념

### 훅 파생

`deriveEntityHooks()`는 계약의 엔티티(entity) 정의와 오퍼레이션(operation) 정의를 읽어 타입이 지정된 훅 객체를 파생합니다. 엔티티 키마다 `EntityHooks` 객체가, 최상위 오퍼레이션 키마다 `OperationHooks` 객체가 생깁니다.

```ts
const hooks = deriveEntityHooks(projectContract);
// hooks.task           → EntityHooks<TaskSchema, TaskOperations>
// hooks.archiveProject → OperationHooks<ArchiveInput, ArchiveOutput>
```

엔티티 훅의 이름은 `use`에 오퍼레이션 이름을 이은 것입니다(`list` → `useList`, `archive` → `useArchive`). 어떤 훅이 생기는지는 오퍼레이션의 역할로 정해집니다.

| 역할 | 훅 |
| --- | --- |
| `list` | `useList`, `useInfiniteList` |
| `get` | `useGet` |
| `create` | `useCreate` |
| `update` | `useUpdate` |
| `delete` | `useDelete` |
| `tree` | `useTree` |
| `GET` 사용자 정의 오퍼레이션 | 쿼리 훅 `use<Name>(params?, options?)` |
| 그 밖의 메서드를 쓰는 사용자 정의 오퍼레이션 | 뮤테이션 훅 `use<Name>(options?)` |

최상위 오퍼레이션에는 `hooks.<operation>.useMutation()`이 생깁니다.

### 자동 캐시 무효화

뮤테이션 훅은 관련 쿼리를 자동으로 무효화합니다.

![뮤테이션이 성공하면 엔티티의 쿼리 키가 무효화되고, 그 아래 목록 쿼리와 상세 쿼리를 다시 가져옵니다](../../docs/assets/figures/pkg-react-mutation-invalidation.ko.svg)

- **엔티티 뮤테이션**(`useCreate`, `useUpdate`, `useDelete`)은 엔티티의 `all` 키 아래 모든 쿼리를 무효화합니다. `useUpdate`는 성공과 실패에 관계없이 뮤테이션이 끝날 때 무효화합니다.
- **사용자 정의 엔티티 뮤테이션**은 오퍼레이션의 `invalidates` 함수가 반환한 키를 무효화하고, 이 함수가 없으면 엔티티의 `all` 키를 무효화합니다.
- **최상위 오퍼레이션 뮤테이션**은 오퍼레이션의 `invalidates` 함수가 반환한 키만 무효화합니다.

`queryClient.invalidateQueries()`를 직접 호출할 필요가 없습니다.

### TanStack Query 옵션 전달

모든 훅은 마지막 인수로 TanStack Query 옵션을 받습니다. 쿼리 훅은 `queryKey`와 `queryFn`을 뺀 모든 `UseQueryOptions`를, 뮤테이션 훅은 `mutationFn`을 뺀 모든 `UseMutationOptions`를 받습니다.

```ts
// Pass query options
const { data } = hooks.task.useList({ enabled: false });

// Pass mutation options
const createTask = hooks.task.useCreate(undefined, {
  onSuccess: (data) => console.log("Created:", data),
});
```

### 연결 상태 플래그 복구

React Query는 브라우저가 오프라인이라고 판단하는 동안 요청을 멈춥니다. 이 판단은 window의 `online` / `offline` 이벤트로만 기록되는 캐시된 플래그를 따릅니다. 구독자가 없으면 관리자가 이 이벤트 리스너를 해제하므로, `online` 이벤트를 한 번 놓치면 플래그가 그대로 남고 페이지가 열려 있는 동안 모든 쿼리가 멈춥니다. 그러면 목록에 「불러올 수 없음」이 표시되고 새로 고치기 전까지 복구되지 않습니다.

`startOnlineStatusSync()`는 항상 최신 값인 `navigator.onLine`으로 플래그를 바로잡습니다. 앱을 시작할 때 한 번, 문서가 다시 보일 때마다 한 번씩 실행합니다. 플래그만 되돌리면 복구됩니다. `QueryClient`가 관리자를 직접 구독하고 있다가 플래그가 온라인으로 바뀌면 멈춘 요청을 다시 실행하기 때문입니다.

앱이 `QueryClient`를 만드는 곳에서 한 번 호출하세요.

```ts
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { startOnlineStatusSync } from "@simplix-react/react";

const queryClient = new QueryClient();

startOnlineStatusSync();
```

`resyncOnlineStatus()`는 같은 복구를 한 번만 수행하며, 연결 상태를 직접 확인하는 앱에서 씁니다. `navigator.onLine`이 없는 환경(서버 렌더링, React Native)에서는 두 함수 모두 아무 일도 하지 않으므로 플랫폼별 연결 상태 연동을 덮어쓰지 않습니다.

`focusManager`에는 같은 장치가 필요 없습니다. `isFocused()`가 값을 캐시하지 않고 호출할 때마다 `document.visibilityState`를 읽으므로 오래된 값이 남지 않습니다.

## 훅 레퍼런스

### `useList`

엔티티 목록을 가져옵니다. 상위 엔티티 아이디, 목록 매개변수, 쿼리 옵션을 다음 조합으로 받습니다.

```ts
// Top-level entity
hooks.task.useList();
hooks.task.useList({ enabled: isReady });

// With filters/sort
hooks.task.useList({
  filters: { status: "open" },
  sort: { field: "createdAt", direction: "desc" },
});

// Child entity with parent ID
hooks.task.useList(projectId);
hooks.task.useList(projectId, { filters: { status: "open" } });
hooks.task.useList(projectId, { filters: { status: "open" } }, { enabled: isReady });
```

하위 엔티티는 `parentId`가 falsy이면 쿼리가 자동으로 비활성화됩니다. `{ data: [...] }` 형태의 응답은 배열만 꺼내 반환합니다.

### `useGet`

아이디로 엔티티 하나를 가져옵니다.

```ts
const { data: task } = hooks.task.useGet(taskId);
const { data: task } = hooks.task.useGet(taskId, { staleTime: 5000 });
```

`id`가 falsy이면 쿼리가 자동으로 비활성화됩니다.

### `useCreate`

새 엔티티를 생성합니다. 하위 엔티티는 상위 엔티티의 아이디를 전달하세요.

```ts
// Top-level entity
const createTask = hooks.task.useCreate();
createTask.mutate({ title: "New task", status: "open" });

// Child entity
const createTask = hooks.task.useCreate(projectId);
createTask.mutate({ title: "New task", status: "open" });
```

### `useUpdate`

기존 엔티티를 수정합니다.

```ts
// Standard update
const updateTask = hooks.task.useUpdate();
updateTask.mutate({ id: taskId, dto: { status: "done" } });
```

`optimistic: true`이면 캐시된 모든 목록에서 일치하는 항목에 `dto`를 병합하고, 요청이 실패하면 목록을 원래대로 되돌립니다. 이 옵션은 훅의 타입에 없으므로 타입 검사를 거치는 호출에서는 전달할 수 없습니다.

### `useDelete`

아이디로 엔티티를 삭제합니다.

```ts
const deleteTask = hooks.task.useDelete();
deleteTask.mutate(taskId);
```

### `useInfiniteList`

커서 방식이나 오프셋 방식으로 페이지 단위 데이터를 가져옵니다. 응답의 `meta` 필드를 보고 페이지네이션을 자동으로 처리합니다.

```ts
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = hooks.task.useInfiniteList(projectId, {
  limit: 10,
  filters: { status: "open" },
  sort: { field: "createdAt", direction: "desc" },
});

// Access flattened data
const allTasks = data?.pages.flatMap((page) => page.data) ?? [];
```

첫 번째 인수는 상위 엔티티의 아이디이며, 최상위 엔티티에는 `undefined`를 전달하세요. `limit`의 기본값은 20입니다. `meta.hasNextPage`가 true인 동안 다음 페이지를 요청하며, `meta.nextCursor`가 있으면 그 커서를, 없으면 다음 페이지 번호를 씁니다.

### `useTree`

`tree` 오퍼레이션의 응답을 가져옵니다. `params`는 쿼리 문자열 매개변수가 됩니다.

```ts
const { data: tree } = hooks.category.useTree({ rootId: "c1" });
```

### 사용자 정의 엔티티 오퍼레이션 훅

`GET`을 쓰는 사용자 정의 엔티티 오퍼레이션에서는 쿼리 훅을, 그 밖의 메서드를 쓰는 오퍼레이션에서는 뮤테이션 훅을 파생합니다. 쿼리 훅이나 `mutate`에 전달한 값이 클라이언트 함수의 인수가 되므로, 그 값으로 오퍼레이션의 첫 번째 경로 매개변수를 채우며, 뮤테이션 훅은 그와 함께 입력을 보낼 수 없습니다. 엔티티의 사용자 정의 오퍼레이션이면 훅은 오퍼레이션 이름을 키로 하고 그 엔티티의 쿼리 키 팩토리를 값으로 하는 항목 하나만 든 맵과 빈 매개변수 객체로 `invalidates`를 호출합니다. 예를 들어 `archive` 오퍼레이션 안에서 `queryKeys.archive.all`은 그 엔티티의 `all` 키이며, 다른 엔티티의 키는 이 맵에 없습니다.

```ts
// archive: { method: "POST", path: "/tasks/:id/archive" }
const archiveTask = hooks.task.useArchive();
archiveTask.mutate("task-1");
```

### 오퍼레이션 `useMutation`

계약에 정의한 최상위 오퍼레이션마다 `useMutation` 훅을 파생합니다. `mutate`에 전달한 값이 클라이언트 함수의 유일한 인수가 됩니다.

```ts
// archiveProject: { method: "POST", path: "/projects/:projectId/archive", ... }
const archiveProject = hooks.archiveProject.useMutation({
  onSuccess: () => {
    // Cache invalidation is already handled via the contract's `invalidates`
    console.log("Project archived");
  },
});

archiveProject.mutate("abc");
```

## 쿼리 도구

### `useBatchDetails`

목록의 항목마다 상세 쿼리를 하나씩 실행하고, 가져온 상세 데이터와 전체 대기 상태를 반환합니다.

```ts
import { useBatchDetails } from "@simplix-react/react";

const { data: details, isPending } = useBatchDetails(
  tasks,
  (task) => task.id,
  (id) => ({
    queryKey: projectContract.queryKeys.task.detail(id),
    queryFn: () => projectContract.client.task.get(id),
  }),
);
```

`extractId`가 `undefined`를 반환한 항목은 건너뛰며, `data`에는 성공한 쿼리의 결과만 담깁니다.

### `createLocalQueryStore`

선택한 쿼리를 `localStorage`에 저장하고, 무효화하기 전까지 최신 상태로 취급합니다. 등록한 키 가운데 성공적으로 불러온 쿼리만 저장합니다.

```tsx
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createLocalQueryStore } from "@simplix-react/react";

const queryClient = new QueryClient();
const store = createLocalQueryStore({ version: "1", storageKey: "app:cache" });

// Persist a query owned by a framework provider
store.localQueryKey(["menu", "tree"]);

// Define and persist an app-owned query; pass the result to useQuery
const policyQuery = store.localQuery({ key: ["policy"], queryFn: fetchPolicy });

function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={store.persistOptions}>
      {/* ... */}
    </PersistQueryClientProvider>
  );
}
```

`version`이 바뀌면 저장된 캐시를 모두 버립니다. `maxAge`의 기본값은 24시간입니다. `localQuery`로 만든 쿼리는 정의에서 따로 지정하지 않으면 `staleTime: Infinity`, `gcTime`은 `maxAge`와 같은 값을 씁니다.

## 관련 패키지

| 패키지 | 설명 |
| --- | --- |
| `@simplix-react/contract` | 타입이 안전한 API 계약을 정의합니다 |
| `@simplix-react/form` | 계약과 이 패키지의 훅에서 TanStack Form 훅을 파생합니다 |
| `@simplix-react/mock` | 테스트용으로 계약에서 MSW 목(mock) 핸들러를 파생합니다 |
| `@simplix-react/i18n` | i18next 기반 국제화 프레임워크입니다 |

---

**다음 단계** → [`@simplix-react/form`](../form/README.ko.md): 계약과 이 패키지의 훅에서 폼 훅을 파생합니다.
