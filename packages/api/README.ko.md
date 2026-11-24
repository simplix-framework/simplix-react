<p align="center">
  <img src="../../docs/assets/simplix-logo.png" alt="simplix-react" width="200" />
</p>

# @simplix-react/api

[English](./README.md) | **한국어**

simplix-react 도메인 패키지(domain package)용 Orval mutator 싱글턴입니다. 중앙 HTTP 클라이언트 레지스트리, 타입이 지정된 `HttpError` 클래스, 생성된 도메인 패키지 전체에서 오류를 같은 방식으로 처리하는 오류 분류 유틸리티, 그리고 도메인 패키지가 선언하는 `StatusTone` 어휘를 제공합니다.

## 설치

```bash
pnpm add @simplix-react/api
```

> **참고:** `simplix openapi`로 생성한 도메인 패키지에는 이 의존성이 자동으로 포함됩니다.

## API 개요

| 내보내는 이름 | 종류 | 설명 |
| --- | --- | --- |
| `configureMutator` | 함수 | `OrvalMutator` fetch 함수를 등록합니다(기본 전략 또는 이름을 지정한 전략) |
| `getMutator` | 함수 | 전략 이름으로 등록된 mutator를 가져옵니다 |
| `setRequestLocale` | 함수 | `Accept-Language` 헤더에 자동으로 넣을 로케일을 설정합니다 |
| `getRequestLocale` | 함수 | 현재 설정된 요청 로케일을 반환합니다 |
| `getRequestTimezone` | 함수 | 브라우저의 IANA 시간대(`Intl.DateTimeFormat().resolvedOptions().timeZone`)를 반환합니다 |
| `HttpError` | 클래스 | `status`, `message`, 선택 항목인 `data`를 담는 HTTP 오류입니다 |
| `getValidationErrors` | 함수 | 어떤 형태의 오류에서든 필드 검증 오류를 추출합니다 |
| `getErrorMessage` | 함수 | 어떤 오류에서든 사람이 읽을 메시지를 추출합니다 |
| `serverMessage` | 함수 | 서버가 오류와 함께 보낸 문장을 반환하고, 없으면 `undefined`를 반환합니다 |
| `statusOnlyMessage` | 함수 | 응답에 문장이 없는 오류의 메시지인 `HTTP <status>`를 반환합니다 |
| `getErrorCode` | 함수 | 어떤 오류에서든 애플리케이션 오류 코드를 추출합니다 |
| `getHttpStatus` | 함수 | 어떤 오류에서든 HTTP 상태 코드를 추출합니다 |
| `classifyError` | 함수 | 오류를 범주로 분류합니다(`ServerErrorEvent`) |
| `createMutationErrorHandler` | 함수 | 범주별 콜백을 받는 React Query `onError` 핸들러를 만듭니다 |
| `recordIsAbsent` | 함수 | 조회가 404로 실패했는지(레코드가 없음) 판별합니다 |
| `recordIsOutOfScope` | 함수 | 조회가 403으로 실패했는지(조회 권한 범위 밖) 판별합니다 |

### 타입

| 내보내는 이름 | 설명 |
| --- | --- |
| `OrvalMutator` | mutator 함수 시그니처: `(url: string, options?: RequestInit) => Promise<T>` |
| `ErrorType` | Orval 오류 타입 별칭: `Error & { data?: T }` |
| `BodyType` | Orval 본문 타입 별칭: `T` |
| `ValidationFieldError` | 필드 단위 검증 오류(`field`, `message`, 선택 항목인 `label`) |
| `ErrorCategory` | 오류 범주 유니언: `"validation" \| "auth" \| "client" \| "server" \| "network" \| "unknown"` |
| `ServerErrorEvent` | 범주, 상태 코드, errorCode, 메시지, validationErrors, raw를 담은 분류 결과 |
| `StatusTone` | 상태 값의 톤: `"success" \| "warning" \| "danger" \| "info" \| "neutral" \| "pending" \| "processing"` |

## 핵심 개념

### HttpError

2xx가 아닌 HTTP 응답을 나타내는 오류 클래스입니다. HTTP `status`, 오류 `message`, 선택 항목인 응답 `data`를 담습니다.

```ts
import { HttpError } from "@simplix-react/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const data = await res.json().catch(() => undefined);
    throw new HttpError(res.status, res.statusText, data);
  }
  return res.json() as Promise<T>;
}
```

### configureMutator / getMutator

Orval mutator 함수의 전역 레지스트리입니다. 도메인 패키지가 생성된 클라이언트 코드에서 `getMutator()`를 호출하고, 애플리케이션은 시작할 때 mutator를 한 번 설정합니다. 요청한 전략에 등록된 mutator가 없으면 `getMutator`가 오류를 발생시킵니다.

![생성된 도메인 패키지는 전략 이름으로 레지스트리에 mutator를 요청하고, 레지스트리는 설정된 fetch 함수에 요청 로케일을 더해 돌려줍니다](../../docs/assets/figures/pkg-api-mutator-registry.ko.svg)

```ts
import { configureMutator, getMutator, HttpError } from "@simplix-react/api";

// Register the default mutator
configureMutator(async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new HttpError(res.status, res.statusText);
  return res.json();
});

// Register a named strategy (for multi-backend setups)
configureMutator("admin-api", async (url, options) => {
  const res = await fetch(`/admin${url}`, options);
  if (!res.ok) throw new HttpError(res.status, res.statusText);
  return res.json();
});

// Retrieve (used internally by generated code)
const mutator = getMutator();            // default strategy
const adminMutator = getMutator("admin-api"); // named strategy
```

### 요청 로케일(Accept-Language 헤더)

`setRequestLocale`로 로케일을 설정하면 `getMutator`가 모든 요청에 `Accept-Language` 헤더를 자동으로 넣습니다. 그래서 서버는 브라우저의 운영 체제 언어 설정이 아니라 애플리케이션에서 선택한 언어를 받습니다.

```ts
import { setRequestLocale, getRequestLocale, getMutator } from "@simplix-react/api";

// Set the locale (typically wired to i18n adapter)
setRequestLocale("en");

// All subsequent API requests include: Accept-Language: en
const mutator = getMutator();
await mutator("/api/pets"); // → Accept-Language: en

// Check current locale
getRequestLocale(); // "en"
```

#### 동작 방식

1. `setRequestLocale(locale)`은 로케일을 모듈 범위 변수에 저장합니다(탭마다 따로 유지되며 탭끼리 공유하지 않습니다)
2. `getMutator()`는 `Accept-Language`를 일반 객체 형태의 요청 헤더에 병합하는 래퍼를 반환합니다(`options.headers`로 전달한 `Headers` 인스턴스는 읽지 않습니다)
3. 호출하는 쪽에서 `Accept-Language` 헤더를 직접 지정했으면 덮어쓰지 **않습니다**
4. 로케일을 설정하지 않았으면 `getMutator()`는 mutator를 그대로 반환합니다

#### 필요한 이유

브라우저는 모든 HTTP 요청에 `Accept-Language` 헤더를 자동으로 추가하지만, 그 값은 애플리케이션의 i18n 선택이 아니라 **운영 체제와 브라우저의 언어 설정**을 따릅니다. 예를 들어 운영 체제가 한국어인 사용자가 앱에서 영어를 선택해도 이 기능이 없으면 `Accept-Language: ko`가 전송됩니다. `setRequestLocale`을 쓰면 서버가 올바른 언어를 받습니다.

#### @simplix-react/i18n 연동

앱의 i18n 설정에서 i18n 어댑터의 로케일 변경을 `setRequestLocale`에 연결하세요.

```ts
import { setRequestLocale } from "@simplix-react/api";
import { createI18nConfig } from "@simplix-react/i18n";

export const { adapter: i18nAdapter, i18nReady } = createI18nConfig({ ... });

// Sync locale changes to API request headers
i18nAdapter.onLocaleChange(setRequestLocale);
i18nReady.then(() => setRequestLocale(i18nAdapter.locale));
```

이렇게 설정하면 모든 API 요청에 앱의 현재 로케일과 같은 `Accept-Language`가 자동으로 포함됩니다. 사용자가 언어를 바꾸면 다음 요청부터 바로 새 로케일을 씁니다.

> **참고:** `@simplix-react/api`와 `@simplix-react/i18n`은 서로 직접 의존하지 않습니다. 연결은 애플리케이션 수준에서 하므로 두 패키지는 분리된 상태를 유지합니다.

### 상태 톤

`StatusTone`은 생성된 도메인 패키지가 열거형 값마다 톤을 선언할 때(`<Enum>Tones`) 쓰는 어휘이며, `@simplix-react/ui`의 상태 배지도 이 어휘로 그립니다. 도메인 패키지는 `@simplix-react/api`에만 의존하고 UI에는 의존하지 않으므로 이 타입을 이 패키지에 둡니다.

```ts
import type { StatusTone } from "@simplix-react/api";

const tone: StatusTone = EmailStatusTones[status] ?? "neutral";
```

### 오류 유틸리티

어떤 형태의 오류에서든 구조화된 정보를 추출하는 덕 타이핑 유틸리티입니다. `HttpError`, `@simplix-react/contract`의 `ApiError`, Spring Boot 오류 응답, Rails 형식 오류, 일반 객체에 모두 사용할 수 있습니다.

#### getValidationErrors

어떤 오류에서든 필드 단위 검증 오류를 추출합니다. 지원하는 형태는 다음과 같습니다.

- `{ errorDetail: [{ field, message }] }` (Spring Boot / ApiResponseError)
- `{ errors: [{ field, message }] }` (일반 배열)
- `{ errors: { [field]: string[] } }` (Rails 형식)
- 위 형태 중 하나를 담은 `error.data` (`HttpError`처럼)
- `JSON.parse(error.body)` 대체 경로 (`@simplix-react/contract`의 `ApiError`처럼)

```ts
import { getValidationErrors } from "@simplix-react/api";

const errors = getValidationErrors(error);
if (errors) {
  errors.forEach(({ field, message }) => {
    form.setFieldError(field, message);
  });
}
```

#### getErrorMessage / getErrorCode / getHttpStatus

```ts
import { getErrorMessage, getErrorCode, getHttpStatus } from "@simplix-react/api";

const message = getErrorMessage(error);  // "Not Found" or "An unknown error occurred"
const code = getErrorCode(error);        // "USER_NOT_FOUND" (from errorCode or data.errorCode) or null
const status = getHttpStatus(error);     // 404 or null
```

#### serverMessage / statusOnlyMessage

`serverMessage`는 응답이 직접 보낸 문장일 때만 오류의 `message`를 반환합니다. 오류에 숫자 `status`가 있고(또는 `type`이 있는 응답 봉투 자체이고) 메시지가 `statusOnlyMessage(status)`로 만든 대체 문구가 아니어야 합니다. 그 밖에는 `undefined`를 반환하므로, 호출하는 쪽에서 자체 문구로 대신할 수 있습니다.

```ts
import { HttpError, serverMessage, statusOnlyMessage } from "@simplix-react/api";

const text = serverMessage(error) ?? t("common.loadFailed");

// A client that turns a body-less response into an error writes the stand-in:
throw new HttpError(res.status, statusOnlyMessage(res.status));
```

#### recordIsAbsent / recordIsOutOfScope

조회가 실패한 이유를 상태 코드로 구분합니다. 404는 레코드가 없다는 뜻이고, 403은 조회 권한 범위 밖이라는 뜻이며, 그 밖의 상태 코드는 조회 자체가 실패했다는 뜻입니다.

```ts
import { recordIsAbsent, recordIsOutOfScope } from "@simplix-react/api";

if (recordIsAbsent(query.error)) return <NotFound />;
if (recordIsOutOfScope(query.error)) return <OutOfScope />;
```

#### classifyError

어떤 오류든 범주가 지정된 `ServerErrorEvent`로 분류합니다.

| 범주 | 조건 |
| --- | --- |
| `network` | HTTP 상태 코드가 없는 `TypeError` |
| `auth` | 상태 코드 401 또는 403 |
| `server` | 상태 코드 >= 500 |
| `validation` | 검증 오류가 있는 상태 코드 400-499 |
| `client` | 검증 오류가 없는 상태 코드 400-499 |
| `unknown` | 그 밖의 모든 경우 |

`validationErrors`는 `validation` 이벤트와 `unknown` 이벤트에 설정됩니다.

```ts
import { classifyError } from "@simplix-react/api";

const event = classifyError(error);
// event.category  → "validation"
// event.status    → 422
// event.message   → "Validation failed"
// event.validationErrors → [{ field: "email", message: "is required" }]
```

#### createMutationErrorHandler

범주별 핸들러(`onValidationError`, `onAuthError`, `onClientError`, `onServerError`, `onNetworkError`, `onUnknownError`)를 받는 React Query `onError` 콜백을 만듭니다. `useMutation`의 `onError` 옵션에 쓰기 좋습니다.

```ts
import { createMutationErrorHandler } from "@simplix-react/api";

const onError = createMutationErrorHandler({
  onValidationError: (event) => {
    event.validationErrors?.forEach(({ field, message }) => {
      form.setFieldError(field, message);
    });
  },
  onAuthError: () => {
    redirect("/login");
  },
  onServerError: (event) => {
    toast.error(event.message);
  },
  onNetworkError: () => {
    toast.error("Network error. Please check your connection.");
  },
  onUnknownError: (event) => {
    toast.error(event.message);
  },
});

// Use with React Query
useMutation({
  mutationFn: createUser,
  onError,
});
```

## 관련 패키지

| 패키지 | 설명 |
| --- | --- |
| `@simplix-react/contract` | Zod 기반의 타입이 안전한 API 계약(contract) 정의 |
| `@simplix-react/react` | 계약에서 파생한 React Query 훅 |
| `@simplix-react/auth` | 인증 미들웨어(Bearer, API Key, OAuth2) |
| `@simplix-react/form` | `getValidationErrors`로 읽은 검증 오류를 폼 필드에 표시합니다 |

---

**다음 단계** → [`@simplix-react/auth`](../auth/README.ko.md): 요청에 인증을 추가합니다.
