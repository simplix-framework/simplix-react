# 설치

[English](/en/getting-started/installation.md) | **한국어**

## 사전 요구 사항

simplix-react를 설치하기 전에 다음을 준비하세요.

| 요구 사항 | 버전 | 확인 명령 |
| --- | --- | --- |
| Node.js | >= 20.0.0 | `node --version` |
| pnpm | 10(이 저장소가 쓰는 버전) | `pnpm --version` |

pnpm이 없으면 다음 명령으로 설치하세요.

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## 패키지 설치

### 메타 패키지 설치(권장)

메타 패키지를 설치하면 의존성 하나로 `@simplix-react/*` 패키지를 받습니다.

```bash
pnpm add simplix-react
```

메타 패키지가 의존하는 패키지는 access, api, auth, calendar, cli, contract, form, gantt, gantt-core, i18n, mock, process, process-core, react, testing, ui입니다. 코드에서는 개별 패키지에서 바로 가져오세요.

```ts
import { defineApi } from "@simplix-react/contract";
import { deriveEntityHooks } from "@simplix-react/react";
```

#### pnpm 호이스팅 설정

pnpm은 의존성을 엄격하게 해석하므로 전이 의존성을 기본으로 가져올 수 없습니다. 메타 패키지 `simplix-react`를 쓸 때는 `.npmrc`에서 `@simplix-react/*` 패키지를 호이스팅하세요.

```text
# .npmrc
public-hoist-pattern[]=@simplix-react/*
```

이렇게 설정하면 `package.json`에 `simplix-react`만 선언해도 `@simplix-react/contract`, `@simplix-react/react` 등을 가져올 수 있습니다.

> **참고:** `simplix init`으로 만든 프로젝트에는 이 `.npmrc`가 들어 있습니다.

### 선택 설치

필요한 패키지만 골라 설치할 수도 있습니다.

#### 핵심 패키지

계약(contract) 패키지와 React 훅(hook) 패키지는 모든 simplix-react 프로젝트의 기반입니다.

```bash
pnpm add @simplix-react/contract @simplix-react/react
```

### 목 데이터 계층(선택)

브라우저 안의 목(mock) 백엔드로 프론트엔드를 먼저 개발할 때 설치합니다.

```bash
pnpm add -D @simplix-react/mock
```

### 국제화(선택)

여러 언어를 지원할 때 설치합니다.

```bash
pnpm add @simplix-react/i18n
```

### 테스트 유틸리티(선택)

simplix-react 애플리케이션을 테스트할 때 설치합니다.

```bash
pnpm add -D @simplix-react/testing
```

### CLI(선택)

프로젝트 스캐폴딩과 검증에 씁니다.

```bash
pnpm add -D @simplix-react/cli
```

## 피어 의존성

패키지마다 요구하는 피어 의존성이 있습니다. simplix-react 패키지와 함께 설치하세요.

### @simplix-react/contract

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `zod` | >= 4.0.0 | 예 |

```bash
pnpm add zod
```

### @simplix-react/react

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `@simplix-react/contract` | (`@simplix-react` 패키지) | 예 |
| `@tanstack/react-query` | >= 5.0.0 | 예 |
| `@tanstack/react-query-persist-client` | >= 5.0.0 | 예 |
| `@tanstack/query-sync-storage-persister` | >= 5.0.0 | 예 |
| `react` | >= 18.0.0 | 예 |
| `zod` | >= 4.0.0 | 예 |

```bash
pnpm add @tanstack/react-query @tanstack/react-query-persist-client \
  @tanstack/query-sync-storage-persister react zod
```

### @simplix-react/form

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `@simplix-react/api` | (`@simplix-react` 패키지) | 예 |
| `@simplix-react/contract` | (`@simplix-react` 패키지) | 예 |
| `@simplix-react/react` | (`@simplix-react` 패키지) | 예 |
| `@tanstack/react-form` | >= 1.0.0 | 예 |
| `@tanstack/react-query` | >= 5.0.0 | 예 |
| `react` | >= 18.0.0 | 예 |
| `zod` | >= 4.0.0 | 예 |

```bash
pnpm add @simplix-react/api @tanstack/react-form
```

### @simplix-react/auth

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `@simplix-react/contract` | (`@simplix-react` 패키지) | 예 |
| `react` | >= 18.0.0 | 선택 |

`react`는 React 바인딩을 쓸 때만 필요합니다.

### @simplix-react/access

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `@casl/ability` | >= 6.0.0 | 예 |
| `@simplix-react/auth` | (`@simplix-react` 패키지) | 선택 |
| `react` | >= 18.0.0 | 선택 |

```bash
pnpm add @casl/ability
```

### @simplix-react/mock

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `@simplix-react/contract` | (`@simplix-react` 패키지) | 예 |
| `msw` | >= 2.0.0 | 선택 |
| `vite` | >= 5.0.0 | 선택 |
| `zod` | >= 4.0.0 | 예 |

```bash
pnpm add -D msw
```

### @simplix-react/i18n

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `i18next` | >= 25.0.0 | 선택 |
| `react` | >= 18.0.0 | 선택 |
| `react-i18next` | >= 16.0.0 | 선택 |

```bash
pnpm add i18next react-i18next
```

### @simplix-react/ui

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `@simplix-react/api` | (`@simplix-react` 패키지) | 예 |
| `@simplix-react/form` | (`@simplix-react` 패키지) | 예 |
| `@simplix-react/i18n` | (`@simplix-react` 패키지) | 예 |
| `@simplix-react/react` | (`@simplix-react` 패키지) | 예 |
| `@tanstack/react-query` | >= 5.0.0 | 예 |
| `react` | >= 18.0.0 | 예 |
| `react-router-dom` | >= 6.0.0 | 선택 |

라우터 연동을 쓸 때 `react-router-dom`을 설치하세요.

### @simplix-react/testing

| 피어 의존성 | 버전 | 필수 |
| --- | --- | --- |
| `@simplix-react/access` | (`@simplix-react` 패키지) | 선택 |
| `@simplix-react/contract` | (`@simplix-react` 패키지) | 예 |
| `@tanstack/react-query` | >= 5.0.0 | 예 |
| `react` | >= 18.0.0 | 예 |

`@simplix-react/react`가 이미 요구하는 것 외에 추가 피어 의존성은 없습니다.

## 한 번에 설치

핵심, 국제화, 목, 테스트, CLI 패키지를 피어 의존성과 함께 한 번에 설치합니다.

```bash
# Runtime dependencies
pnpm add @simplix-react/contract @simplix-react/react @simplix-react/i18n \
  zod @tanstack/react-query @tanstack/react-query-persist-client \
  @tanstack/query-sync-storage-persister react

# Dev dependencies
pnpm add -D @simplix-react/mock @simplix-react/testing @simplix-react/cli \
  msw
```

## CLI로 스캐폴딩

CLI로 새 프로젝트를 스캐폴딩합니다. `simplix` 명령에 프로젝트 이름을 전달하세요.

```bash
npx -p @simplix-react/cli simplix init my-app
```

프로젝트 디렉터리와 설정 파일을 생성합니다. `--yes`는 모든 기본값을 받아들이고, `--no-demo`, `--no-i18n`, `--no-auth`, `--no-access`는 해당 부분을 빼고 생성합니다.

## 설치 확인

설치를 마치면 타입 검사를 실행해 확인하세요.

```bash
npx tsc --noEmit
```

오류가 없으면 첫 계약을 정의할 준비가 된 것입니다.

## 다음 단계

- [빠른 시작](/ko/getting-started/quick-start.md): 계약 기반 기능을 처음 만들어 봅니다
- [TypeScript 설정](/ko/getting-started/typescript.md): 타입 추론에 맞게 TypeScript를 설정합니다

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/ko/getting-started/installation.md" target="_blank" rel="noopener noreferrer">GitHub에서 편집</a></p>
