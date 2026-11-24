<p align="center">
  <img src="../../docs/assets/simplix-logo.png" alt="simplix-react" width="200" />
</p>

# @simplix-react/auth

[English](README.md) | **한국어**

`@simplix-react/contract`용 인증(authentication) 미들웨어입니다. 전략 패턴으로 구성했습니다. 인증 스킴을 하나 이상 연결하고 토큰 저장소를 고르면, `defineApi`에 바로 전달할 수 있는 인증된 `fetchFn`을 얻습니다.

## 설치

```bash
pnpm add @simplix-react/auth
```

### 피어 의존성

| 패키지 | 버전 | 필수 여부 |
| --- | --- | --- |
| `@simplix-react/contract` | workspace | 필수 |
| `react` | >= 18.0.0 | 선택 |

React 바인딩(`@simplix-react/auth/react`)을 사용하려면 React를 설치하세요.

```bash
pnpm add react
```

## 빠른 예제

```ts
import { defineApi } from "@simplix-react/contract";
import { createAuth, bearerScheme, localStorageStore } from "@simplix-react/auth";
import { z } from "zod";

// 1. Create a token store
const store = localStorageStore("myapp:");

// 2. Create an auth instance
const auth = createAuth({
  schemes: [
    bearerScheme({
      store,
      token: () => store.get("access_token"),
      refresh: {
        refreshFn: async () => {
          const res = await fetch("/auth/refresh", { method: "POST" });
          return res.json(); // { accessToken, refreshToken?, expiresIn? }
        },
      },
    }),
  ],
  store,
  onRefreshFailure: () => (location.href = "/login"),
});

// 3. Pass the authenticated fetchFn to defineApi
const api = defineApi(
  {
    domain: "project",
    basePath: "/api/v1",
    entities: {
      task: {
        schema: z.object({ id: z.string(), title: z.string() }),
        operations: {
          list: { method: "GET", path: "/tasks" },
          create: { method: "POST", path: "/tasks", input: z.object({ title: z.string() }) },
        },
      },
    },
  },
  { fetchFn: auth.fetchFn },
);

// Every request now carries Authorization: Bearer <token>
const tasks = await api.client.task.list();
```

## API 개요

| 내보내는 항목 | 종류 | 설명 |
| --- | --- | --- |
| `createAuth` | 함수 | 상태를 관리하는 반응형 인증 인스턴스를 생성 |
| `createAuthFetch` | 함수 | 401 응답 시 토큰 갱신과 재시도를 수행하는 인증된 `FetchFn`을 생성 |
| `bearerScheme` | 함수 | Bearer 토큰 인증 스킴 |
| `apiKeyScheme` | 함수 | API 키 인증 스킴(헤더 또는 쿼리) |
| `oauth2Scheme` | 함수 | OAuth2 `refresh_token` 그랜트 스킴 |
| `customScheme` | 함수 | 콜백으로 정의하는 사용자 인증 스킴 |
| `composeSchemes` | 함수 | 여러 스킴을 하나로 합침 |
| `memoryStore` | 함수 | 메모리 토큰 저장소 |
| `localStorageStore` | 함수 | `localStorage` 기반 토큰 저장소 |
| `sessionStorageStore` | 함수 | `sessionStorage` 기반 토큰 저장소 |
| `AuthError` | 클래스 | 인증 실패를 나타내는 타입이 지정된 오류 |
| `AutoRefreshScheduler` | 클래스 | 만료 전에 타이머로 토큰을 갱신하는 백그라운드 스케줄러, 최소 간격 보호 포함 |
| `createActivityTracker` | 함수 | 활동 기반 토큰 갱신을 위해 사용자의 마지막 조작 시각을 추적 |
| `createCrossTabSync` | 함수 | `storage` 이벤트로 브라우저 탭 사이의 인증 상태를 동기화 |
| `openOAuth2Popup` | 함수 | 팝업 창에서 OAuth2 인가 흐름을 실행하고 `postMessage`로 결과를 기다림 |
| `createOidcClient` | 함수 | 인가 코드 흐름과 PKCE(S256)를 사용하는 OIDC 로그인 |
| `createRememberMe` | 함수 | 앱별 로그인 유지 설정과 그 설정을 따르는 토큰 저장소 |

### 타입

| 내보내는 항목 | 설명 |
| --- | --- |
| `AuthScheme` | 인증 전략이 구현하는 계약 인터페이스 |
| `TokenStore` | 토큰을 저장하는 키-값 저장소 추상화 |
| `TokenPair` | 만료 정보를 선택적으로 포함하는 액세스 토큰과 리프레시 토큰 쌍 |
| `AuthConfig` | `createAuth` 설정 |
| `AuthInstance` | `createAuth`가 반환하는 반응형 인증 인스턴스 |
| `BearerSchemeOptions` | `bearerScheme` 옵션 |
| `ApiKeySchemeOptions` | `apiKeyScheme` 옵션 |
| `OAuth2SchemeOptions` | `oauth2Scheme` 옵션 |
| `CustomSchemeOptions` | `customScheme` 옵션 |
| `AuthErrorCode` | 인증 오류 코드의 구별 유니언 |
| `SignInFailure` | `SIGN_IN_FAILED` 오류의 원인 |
| `ActivitySource`, `RefreshLock` | Bearer 토큰 갱신에 쓰는 활동 소스와 탭 간 잠금 |
| `AutoRefreshSchedulerOptions`, `ActivityTrackerOptions`, `CrossTabSyncOptions`, `OAuth2PopupOptions`, `OAuth2PopupResult` | 도우미의 옵션과 결과 |
| `OidcClient`, `OidcClientOptions`, `OidcDiscovery`, `OidcPendingStorage`, `OidcTokens` | `createOidcClient`의 타입 |
| `RememberMe` | `createRememberMe`의 반환 타입 |

## 핵심 개념

### createAuth

인증 상태를 관리하는 반응형 `AuthInstance`를 생성합니다. 이 인스턴스는 인증된 `fetchFn`을 제공하고, 상태가 바뀌면 구독자에게 알립니다.

```ts
import { createAuth, bearerScheme, localStorageStore } from "@simplix-react/auth";

const store = localStorageStore("myapp:");
const auth = createAuth({
  schemes: [bearerScheme({ store, token: () => store.get("access_token") })],
  store,
  onRefreshFailure: (error) => console.error("Refresh failed:", error),
  maxRetries: 1, // retry count after 401 (default: 1)
});

auth.isAuthenticated();            // true if any scheme has valid credentials
auth.getAccessToken();             // current access token or null
auth.setTokens({ accessToken: "abc", refreshToken: "xyz", expiresIn: 3600 });
auth.clear();                      // clears all auth state

const unsub = auth.subscribe(() => {
  console.log("Auth changed:", auth.isAuthenticated());
});
```

`AuthConfig`에는 `is401`(401 판정 함수, 기본값은 `error.status === 401`), `onRehydrate`(복원할 때 저장된 액세스 토큰을 검증), `globalHeaders`(모든 요청에 합칠 헤더), `fetchFn`(감쌀 기본 fetch 함수)도 지정할 수 있습니다. `AuthInstance`에는 위 메서드 외에 저장소에서 인증 상태를 복원하는 `rehydrate()`와 현재 사용자 객체를 다루는 `getUser()` / `setUser()`가 있습니다.

### createAuthFetch

반응형 인스턴스 없이 인증된 `FetchFn`만 생성합니다. React 연동 없이 요청 가로채기만 필요할 때 사용하세요. 두 번째 인수로 감쌀 기본 fetch 함수를 전달할 수 있습니다.

```ts
import { createAuthFetch, bearerScheme, memoryStore } from "@simplix-react/auth";

const store = memoryStore();
const fetchFn = createAuthFetch({
  schemes: [bearerScheme({ store, token: () => store.get("access_token") })],
  maxRetries: 2,
  onRefreshFailure: () => redirectToLogin(),
});

const api = defineApi(config, { fetchFn });
```

이 fetch 래퍼는 다음 순서로 동작합니다.

1. 설정한 모든 스킴의 인증 헤더를 합칩니다
2. 401 응답을 받으면 토큰 갱신을 한 번만 실행합니다(동시에 들어온 갱신 요청은 하나로 합칩니다)
3. 새 자격 증명으로 원래 요청을 다시 보냅니다
4. 갱신 시도가 모두 실패하면 `onRefreshFailure`를 호출합니다

![401 응답을 받으면 래퍼가 공유 토큰 갱신을 한 번 실행하고 새 자격 증명으로 요청을 다시 보내며, 갱신이 실패할 때만 onRefreshFailure를 호출합니다](../../docs/assets/figures/pkg-auth-fetch-retry.ko.svg)

## 스킴

### bearerScheme

모든 요청에 `Authorization: Bearer <token>` 헤더를 추가합니다. 만료 전에 토큰을 미리 갱신할 수 있습니다.

```ts
import { bearerScheme, localStorageStore } from "@simplix-react/auth";

const store = localStorageStore("myapp:");

const scheme = bearerScheme({
  store,
  // Static token or getter function
  token: () => store.get("access_token"),
  // Optional: auto-refresh before expiry
  refresh: {
    refreshFn: async () => {
      const res = await fetch("/auth/refresh", { method: "POST" });
      return res.json(); // must return TokenPair
    },
    refreshBeforeExpiry: 60, // seconds before expiry to trigger proactive refresh
  },
});
```

`refresh`에는 `autoSchedule`(타이머 기반 백그라운드 갱신, 기본값 `false`), `minIntervalSeconds`(예약 갱신 사이의 최소 간격, 기본값 `30`), `onScheduledRefreshFailed`, `activity`(사용자가 활동한 뒤에만 예약 갱신을 실행, `createActivityTracker` 참고), `lock`(탭 사이의 갱신을 직렬화, 기본값은 지원되는 환경의 Web Locks API), `lockName`(토큰 저장소마다 고유한 이름, 지정하지 않으면 탭 안에서만 직렬화)도 지정할 수 있습니다.

### apiKeyScheme

API 키를 헤더나 쿼리 매개변수로 추가합니다.

```ts
import { apiKeyScheme } from "@simplix-react/auth";

// As a header
const headerScheme = apiKeyScheme({
  in: "header",
  name: "X-API-Key",
  key: "sk-abc123",
});

// As a query parameter
const queryScheme = apiKeyScheme({
  in: "query",
  name: "api_key",
  key: () => getApiKey(), // static string or getter function
});
```

### oauth2Scheme

OAuth2 `refresh_token` 그랜트를 구현합니다. 토큰을 자동으로 저장하고, 표준 토큰 엔드포인트로 갱신합니다.

```ts
import { oauth2Scheme, localStorageStore } from "@simplix-react/auth";

const store = localStorageStore("myapp:");

const scheme = oauth2Scheme({
  store,
  tokenEndpoint: "https://auth.example.com/oauth/token",
  clientId: "my-client-id",
  clientSecret: "my-client-secret", // omit for public clients
  scopes: ["read", "write"],
  tokenEndpointHeaders: { "X-Custom": "value" },
  tokenEndpointBody: { audience: "https://api.example.com" },
});
```

### customScheme

사용자가 정의한 콜백으로 스킴을 만듭니다. JWE, HMAC 서명, 폼 기반 인증처럼 표준이 아닌 인증 흐름에 사용하세요.

```ts
import { customScheme } from "@simplix-react/auth";

const jweAuth = customScheme({
  name: "jwe",
  getHeaders: async () => ({
    Authorization: `Bearer ${await decryptJwe(getStoredJwe())}`,
  }),
  refresh: async () => {
    const res = await fetch("/auth/token", { method: "POST" });
    storeTokens(await res.json());
  },
  isAuthenticated: () => !!getStoredJwe(),
  clear: () => clearStorage(),
});
```

### composeSchemes

여러 스킴을 `AuthScheme` 하나로 합칩니다. 모든 스킴의 헤더를 합치며, 이름이 겹치면 뒤의 스킴이 우선합니다. 토큰 갱신은 갱신을 지원하는 첫 번째 스킴이 수행합니다.

```ts
import { composeSchemes, bearerScheme, apiKeyScheme, localStorageStore } from "@simplix-react/auth";

const store = localStorageStore("myapp:");

const composed = composeSchemes(
  bearerScheme({ store, token: () => store.get("access_token") }),
  apiKeyScheme({ in: "header", name: "X-API-Key", key: "sk-abc" }),
);

// composed.name → "bearer+api-key"
```

## 토큰 저장소

### memoryStore

`Map`을 사용하는 메모리 토큰 저장소입니다. 프로세스가 끝나면 토큰이 사라집니다. 테스트와 짧은 세션에 적합합니다.

```ts
import { memoryStore } from "@simplix-react/auth";

const store = memoryStore();
```

### localStorageStore

`localStorage` 기반 저장소입니다. 충돌을 막기 위해 모든 키에 접두사를 추가합니다. 브라우저 세션이 끝나도 토큰이 유지됩니다.

```ts
import { localStorageStore } from "@simplix-react/auth";

const store = localStorageStore("myapp:"); // prefix defaults to "auth:"
// localStorage key: "myapp:access_token"
```

### sessionStorageStore

`sessionStorage` 기반 저장소입니다. API는 `localStorageStore`와 같지만, 토큰은 현재 브라우저 탭에서만 유지됩니다.

```ts
import { sessionStorageStore } from "@simplix-react/auth";

const store = sessionStorageStore("myapp:");
```

## React 바인딩

`@simplix-react/auth/react`에서 가져오세요. 피어 의존성으로 `react >= 18.0.0`이 필요합니다.

### AuthProvider

React 컴포넌트 트리에 `AuthInstance`를 제공합니다. `useAuth`나 `useAuthFetch`를 사용하는 컴포넌트는 반드시 이 컴포넌트 안에 있어야 합니다.

```tsx
import { createAuth, bearerScheme, localStorageStore } from "@simplix-react/auth";
import { AuthProvider } from "@simplix-react/auth/react";

const store = localStorageStore("myapp:");
const auth = createAuth({
  schemes: [bearerScheme({ store, token: () => store.get("access_token") })],
  store,
});

function App() {
  return (
    <AuthProvider auth={auth}>
      <MyApp />
    </AuthProvider>
  );
}
```

### useAuth

인증 상태를 다루는 React 훅입니다. `isAuthenticated`가 바뀌면 다시 렌더링합니다(`useSyncExternalStore` 기반).

```tsx
import { useAuth } from "@simplix-react/auth/react";

function UserMenu() {
  const { isAuthenticated, login, logout, getAccessToken } = useAuth();

  if (isAuthenticated) {
    return <button onClick={logout}>Logout</button>;
  }

  async function handleLogin() {
    const res = await fetch("/auth/login", { method: "POST", body: "..." });
    const tokens = await res.json();
    login(tokens); // { accessToken, refreshToken?, expiresIn? }
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

**반환값:**

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `isAuthenticated` | `boolean` | 유효한 자격 증명이 있는 스킴이 하나라도 있는지 여부 |
| `isLoading` | `boolean` | 인증 상태를 초기화하는 중인지 여부 |
| `user` | `unknown` | 현재 사용자 데이터(있는 경우) |
| `login` | `(tokens: TokenPair) => void` | 토큰을 저장하고 구독자에게 알림 |
| `logout` | `() => void` | 모든 인증 상태를 지움 |
| `getAccessToken` | `() => string \| null` | 현재 액세스 토큰을 반환 |

### useAuthContext

컨텍스트의 `AuthInstance`를 그대로 반환하는 훅입니다. `useAuth`가 제공하는 편의 래퍼 대신 인증 인스턴스에 직접 접근해야 할 때 사용하세요.

```tsx
import { useAuthContext } from "@simplix-react/auth/react";

function AuthDebug() {
  const auth = useAuthContext();
  // Access the full AuthInstance API directly
  return <pre>{JSON.stringify({ authenticated: auth.isAuthenticated() })}</pre>;
}
```

### useAuthFetch

가장 가까운 `AuthProvider`의 인증된 `FetchFn`을 반환합니다. 표준 훅 밖에서 개별 요청을 보낼 때 사용하세요.

```tsx
import { useAuthFetch } from "@simplix-react/auth/react";

function FileUploader() {
  const fetchFn = useAuthFetch();

  async function upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    await fetchFn("/api/upload", { method: "POST", body: formData });
  }

  return <input type="file" onChange={(e) => upload(e.target.files![0])} />;
}
```

### React 타입

| 내보내는 항목 | 설명 |
| --- | --- |
| `AuthProviderProps` | `AuthProvider`의 props(`auth`, `children`, `userLoader?`). `userLoader`를 지정하면 토큰을 복원하고 액세스 토큰으로 사용자를 불러오며, 끝날 때까지 `isLoading`을 참으로 둡니다 |
| `UseAuthReturn` | `useAuth`의 반환 타입(`isAuthenticated`, `isLoading`, `user`, `login`, `logout`, `getAccessToken`) |

## 고급 예제

### 복합 인증(Bearer + API 키)

모든 요청에 Bearer 토큰과 API 키를 함께 보냅니다.

```ts
import {
  createAuth,
  composeSchemes,
  bearerScheme,
  apiKeyScheme,
  localStorageStore,
} from "@simplix-react/auth";
import { defineApi } from "@simplix-react/contract";

const store = localStorageStore("myapp:");

const auth = createAuth({
  schemes: [
    composeSchemes(
      bearerScheme({
        store,
        token: () => store.get("access_token"),
        refresh: { refreshFn: myRefreshFn },
      }),
      apiKeyScheme({ in: "header", name: "X-API-Key", key: "sk-abc123" }),
    ),
  ],
  store,
});

const api = defineApi(config, { fetchFn: auth.fetchFn });
// Requests carry both Authorization and X-API-Key headers
```

### OAuth2 흐름

토큰을 자동으로 갱신하는 OAuth2 설정 전체입니다.

```ts
import { createAuth, oauth2Scheme, localStorageStore } from "@simplix-react/auth";
import { defineApi } from "@simplix-react/contract";

const store = localStorageStore("oauth:");

const auth = createAuth({
  schemes: [
    oauth2Scheme({
      store,
      tokenEndpoint: "https://auth.example.com/oauth/token",
      clientId: "my-spa-client",
      scopes: ["openid", "profile", "api"],
    }),
  ],
  store,
  onRefreshFailure: () => {
    auth.clear();
    location.href = "/login";
  },
});

// After the OAuth callback, store the initial tokens:
auth.setTokens({
  accessToken: tokenResponse.access_token,
  refreshToken: tokenResponse.refresh_token,
  expiresIn: tokenResponse.expires_in,
});

// All subsequent requests auto-refresh via the token endpoint
const api = defineApi(config, { fetchFn: auth.fetchFn });
```

### 사용자 정의 JWE 스킴

사용자 정의 스킴으로 암호화된 토큰 인증을 구현합니다.

```ts
import { createAuth, customScheme, localStorageStore } from "@simplix-react/auth";

const store = localStorageStore("jwe:");

const auth = createAuth({
  schemes: [
    customScheme({
      name: "jwe",
      getHeaders: async () => {
        const jwe = store.get("access_token");
        if (!jwe) return {};
        const decrypted = await decryptJwe(jwe, encryptionKey);
        return { Authorization: `Bearer ${decrypted}` };
      },
      refresh: async () => {
        const res = await fetch("/auth/jwe/refresh", {
          method: "POST",
          body: JSON.stringify({ token: store.get("refresh_token") }),
        });
        const { accessToken, refreshToken } = await res.json();
        store.set("access_token", accessToken);
        store.set("refresh_token", refreshToken);
      },
      isAuthenticated: () => store.get("access_token") !== null,
      clear: () => store.clear(),
    }),
  ],
  store,
});
```

## 오류 처리

모든 인증 오류는 `AuthError`로 발생하며, 코드에서 분기할 수 있도록 오류에 타입이 지정된 `code`가 들어 있습니다.

```ts
import { AuthError } from "@simplix-react/auth";

try {
  await auth.fetchFn("/api/protected");
} catch (error) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case "TOKEN_EXPIRED":
        // Token has expired
        break;
      case "REFRESH_FAILED":
        // All refresh attempts failed
        redirectToLogin();
        break;
      case "UNAUTHENTICATED":
        // No valid credentials
        break;
      case "SCHEME_ERROR":
        // Scheme-level failure
        break;
      case "SIGN_IN_FAILED":
        // OIDC sign-in failed; error.signInFailure tells why
        break;
    }
  }
}
```

**오류 코드:**

| 코드 | 설명 |
| --- | --- |
| `TOKEN_EXPIRED` | 토큰이 만료됨 |
| `REFRESH_FAILED` | 토큰 갱신 시도가 모두 실패함 |
| `UNAUTHENTICATED` | 유효한 자격 증명이 없음 |
| `SCHEME_ERROR` | 스킴 수준의 실패 |
| `SIGN_IN_FAILED` | 로그인 실패. `signInFailure`는 `issuer-error`, `not-pending`, `malformed-response`, `token-refused` 중 하나이고, `issuerError`에 발급자의 오류가 담깁니다 |

## 관련 패키지

| 패키지 | 설명 |
| --- | --- |
| `@simplix-react/contract` | Zod 기반의 타입 안전한 API 계약(contract) 정의 |
| `@simplix-react/react` | 계약에서 파생한 React Query 훅 |
| `@simplix-react/form` | 계약에서 파생한 TanStack Form 훅 |

---

다음 단계 → [`@simplix-react/react`](../react/README.ko.md)
