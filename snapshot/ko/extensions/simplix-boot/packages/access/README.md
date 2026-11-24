# @simplix-react-ext/simplix-boot-access

[English](/en/extensions/simplix-boot/packages/access/README.md) | **한국어**

`@simplix-react/access`용 Spring Security 인가(authorization) 어댑터(adapter)입니다. Spring Security 권한 응답을 CASL 규칙으로 변환하고, 바로 쓸 수 있는 `AccessAdapter`, 그 어댑터로 만든 Boot 접근 정책, 신원과 권한을 요청 하나로 읽는 본인 접근 정책을 제공합니다.

## 설치

```bash
pnpm add @simplix-react-ext/simplix-boot-access
```

> **사전 요구 사항:** 피어 의존성으로 `@simplix-react/access`, `@simplix-react/api`, `react`(>=18)가 필요합니다.

## 사용법

### 접근 어댑터 만들기

`createSpringAccessAdapter()`는 Spring Security 엔드포인트에서 권한을 가져와 CASL 규칙으로 변환하는 `AccessAdapter`를 반환합니다. `fetchFn`은 필수이며 응답 본문만 반환해야 합니다. Boot 응답 봉투(envelope)를 풀어 주는 `createBootAuth()`의 `bootMutator`를 사용하세요.

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

### Boot 접근 정책 만들기

`createBootAccessPolicy()`는 Spring 어댑터와 `AccessPolicy`를 한 번에 만듭니다. fetch 함수가 Boot 응답 봉투(`{ type, body }`)를 반환하면 봉투를 풀므로 `auth.fetchFn`을 그대로 전달할 수 있습니다. `enablePublicAccess`가 `false`가 아니면 로그아웃 상태의 공개 접근에도 같은 어댑터를 사용합니다.

```ts
import { createBootAccessPolicy } from "@simplix-react-ext/simplix-boot-access";

export const accessPolicy = createBootAccessPolicy({
  fetchFn: auth.fetchFn,
  adapterOptions: { systemAdminRole: "ROLE_SYSTEM_ADMIN" },
  persist: { key: "myapp-access" },
});
```

### 신원과 권한을 함께 읽기

`createSelfAccessPolicy()`는 로그인한 사용자와 그 사용자의 권한을 엔드포인트 하나에서 읽습니다. 그래서 권한이 도착하지 않은 신원으로 화면을 그리는 일이 없습니다. 역할 객체는 `roleCode`만 남깁니다. `useSelfAccessRefusal()`은 서버가 이 조회를 마지막으로 거부한 방식(상태 코드와 오류 코드)을 반환하고, 조회가 다시 성공하면 `null`을 반환합니다.

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

인증 계층의 fetch 함수를 전달하세요. 일반 `fetch`를 전달하면 인증되지 않은 요청으로 처리되어 빈 권한 맵을 받습니다.

### 권한 직접 변환하기

어댑터 전체가 필요 없고 Spring 권한 응답만 변환하려면 다음과 같이 호출하세요.

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

`isSuperAdmin`이 `true`(또는 `"true"`)이면 `{ action: "manage", subject: "all" }` 규칙을 맨 앞에 자동으로 추가합니다.

### 역할 정규화하기

Spring Security는 역할을 문자열로 반환하기도 하고 객체로 반환하기도 합니다. `normalizeRoles()`는 두 형태가 섞인 배열을 역할 코드 문자열 배열로 바꿉니다.

```ts
import { normalizeRoles } from "@simplix-react-ext/simplix-boot-access";

normalizeRoles(["ROLE_USER", { roleCode: "ROLE_ADMIN", roleName: "Admin" }]);
// → ["ROLE_USER", "ROLE_ADMIN"]
```

### 백오피스 접근 확인하기

현재 사용자에게 백오피스 접근 권한이 있는지 확인하는 유틸리티입니다.

```ts
import { hasBackofficeAccess } from "@simplix-react-ext/simplix-boot-access";

hasBackofficeAccess(rules, true);              // true (super admin bypasses)
hasBackofficeAccess(rules, false);             // checks for BACKOFFICE_ACCESS resource
hasBackofficeAccess(rules, false, "MY_PANEL"); // checks for custom resource
```

## API 레퍼런스

### `createSpringAccessAdapter(options?)`

Spring Security 권한 엔드포인트용 `AccessAdapter`를 만듭니다.

**옵션(`SpringAccessAdapterOptions`):**

| 속성 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `permissionsEndpoint` | `string` | `"/api/v1/user/me/permissions"` | 인증된 사용자의 권한 엔드포인트 |
| `publicPermissionsEndpoint` | `string` | `"/api/v1/public/user/permissions"` | 공개 권한 엔드포인트 |
| `systemAdminRole` | `string` | `"ROLE_SYSTEM_ADMIN"` | 시스템 관리자를 나타내는 역할 코드 |
| `fetchFn` | `OrvalMutator` | - | 응답 본문을 반환하는 fetch 함수. 필수이며, 없으면 어댑터가 오류를 발생시킵니다 |

**동작:**

- `authData`가 `null`이나 `undefined`이면 `publicPermissionsEndpoint`에서 가져옵니다
- 그 밖의 경우에는 `permissionsEndpoint`에서 가져옵니다
- 사용자 역할에 `systemAdminRole`이 있으면 `{ action: "manage", subject: "all" }` 규칙을 자동으로 추가합니다
- 응답에 없는 필드(`permissions`, `roles`, `isSuperAdmin`)는 빈 값(`{}`, `[]`, `false`)으로 채웁니다

**`extract()` 결과의 `user` 필드:**

권한 엔드포인트는 사용자 식별 정보를 주지 않으므로 `extract()`가 반환하는 `user` 객체의 `userId`와 `username`은 빈 문자열입니다. 사용자 정보가 필요하면 `createBootAuth()`의 `authClient.userInfoFn()`으로 따로 조회하거나 `createSelfAccessPolicy()`를 사용하세요.

```ts
// Fetch user info from the auth client
const user = await authClient.userInfoFn();

// The permissions adapter only provides rules/roles/isSuperAdmin
const { rules, roles, user: accessUser } = await adapter.extract(authData);
// accessUser.userId === ""  (not provided by the permissions endpoint)
```

### `createBootAccessPolicy(options)`

`createSpringAccessAdapter()`를 바탕으로 `AccessPolicy`를 만듭니다.

**옵션(`BootAccessPolicyOptions`):**

| 속성 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `fetchFn` | `OrvalMutator` | - | fetch 함수. 반환한 Boot 응답 봉투는 `body`만 꺼내 씁니다 |
| `adapterOptions` | `Omit<SpringAccessAdapterOptions, "fetchFn">` | - | 어댑터의 엔드포인트와 시스템 관리자 역할 |
| `isSuperAdmin` | `(user: AccessUser) => boolean` | `user.isSuperAdmin === true` | 정책에 전달하는 최고 관리자 판정 함수 |
| `persist` | `AccessPersistConfig` | - | 정책 스냅샷 저장 설정 |
| `enablePublicAccess` | `boolean` | `true` | 어댑터를 정책의 `publicAccess`로도 사용해 로그아웃 상태에서 공개 엔드포인트를 읽습니다 |

### `createSelfAccessPolicy(config)`

신원과 권한을 엔드포인트 하나에서 읽는 `AccessPolicy<DefaultActions>`를 만듭니다. 응답은 Boot 응답 봉투여도 되고 본문 `{ userId, username, displayName?, isSuperAdmin?, roles?: { roleCode }[], permissions? }` 자체여도 됩니다.

**설정(`SelfAccessConfig`):**

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `endpoint` | `string` | 로그인한 사용자와 그 권한을 응답하는 엔드포인트 |
| `fetchFn` | `createApiAdapter`의 fetch 함수 | Bearer 토큰을 포함하는 인증 계층의 fetch 함수 |

조회가 실패하면 `SelfAccessRefusal`(`{ status: number; errorCode?: string }`)을 기록하고, 다음 조회가 성공하면 지웁니다.

### `useSelfAccessRefusal()`과 `currentSelfAccessRefusal()`

`useSelfAccessRefusal()`은 본인 조회의 마지막 `SelfAccessRefusal` 또는 `null`을 반환하는 React 훅(hook)입니다. `currentSelfAccessRefusal()`은 같은 값을 React 밖에서 반환합니다.

### `convertSpringPermissionsToCasl(response)`

`SpringPermissionsResponse`를 CASL 규칙으로 변환합니다.

**매개변수:**

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| `response` | `SpringPermissionsResponse` | Spring Security 권한 응답 |

**반환값(`SpringConvertResult`):**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `rules` | `AccessRule<string, string>[]` | CASL 호환 규칙 |
| `roles` | `string[]` | 정규화한 역할 문자열 |
| `isSuperAdmin` | `boolean` | 최고 관리자 여부 |

### `normalizeRoles(roles)`

역할 문자열과 Spring Security 역할 객체가 섞인 배열을 역할 코드 문자열 배열로 정규화합니다.

**매개변수:**

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| `roles` | `RoleInput[]` | 역할 문자열 또는 역할 객체의 배열 |

문자열은 그대로 두고, 객체는 `roleCode ?? roleName ?? name` 값을 씁니다. 빈 값이 되는 항목은 걸러 냅니다. `string[]`을 반환합니다.

### `hasBackofficeAccess(rules, isSuperAdmin?, resource?)`

주어진 규칙이 백오피스 접근을 허용하는지 확인합니다.

**매개변수:**

| 매개변수 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `rules` | `AccessRule<string, string>[]` | - | 확인할 CASL 규칙 |
| `isSuperAdmin` | `boolean` | `false` | 최고 관리자이면 확인을 건너뜁니다 |
| `resource` | `string` | `"BACKOFFICE_ACCESS"` | 확인할 리소스 이름 |

`isSuperAdmin`이 `true`이거나, 지정한 리소스 또는 `"all"`을 대상으로 하는 규칙이 하나라도 있으면 `true`를 반환합니다.

### 타입

#### `SpringPermissionsResponse`

```ts
interface SpringPermissionsResponse {
  permissions: Record<string, string[]>;
  roles: Array<string | { roleCode: string; roleName: string }>;
  isSuperAdmin: boolean | string;
}
```

#### `SpringAccessAdapterOptions`

[createSpringAccessAdapter 옵션](#createspringaccessadapteroptions)을 참고하세요.

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

## 오류 처리

`fetchFn`을 전달하지 않으면 `createSpringAccessAdapter()`가 `fetchFn is required for createSpringAccessAdapter` 오류를 발생시킵니다. `fetchFn`이 발생시킨 오류는 호출한 쪽으로 그대로 전달됩니다. 재시도나 오류 변환 로직은 없습니다. 오류 인터셉터가 필요하면 사용자 지정 fetch 함수를 `fetchFn` 옵션으로 전달하세요.

> **사전 요구 사항:** 먼저 `@simplix-react-ext/simplix-boot-auth`의 `createBootAuth()`로 인증을 설정하고, 그 fetch 함수를 `fetchFn`으로 전달하세요.

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/extensions/simplix-boot/packages/access/README.ko.md" target="_blank" rel="noopener noreferrer">원본 보기</a></p>
