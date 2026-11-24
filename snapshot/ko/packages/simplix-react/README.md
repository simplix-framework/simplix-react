<p align="center">
  <img src="assets/simplix-logo.png" alt="simplix-react" width="200" />
</p>

# SimpliX React

[English](/en/packages/simplix-react/README.md) | **한국어**

[![npm version](https://img.shields.io/npm/v/simplix-react.svg)](https://www.npmjs.com/package/simplix-react)
[![license](https://img.shields.io/npm/l/simplix-react.svg)](https://github.com/simplix-framework/simplix-react/blob/main/LICENSE)

`@simplix-react/*` 패키지 전체를 의존성 하나로 설치하는 메타 패키지입니다.

## 설치

```bash
pnpm add simplix-react
```

### pnpm 설정

pnpm은 의존성을 엄격하게 해석합니다. `@simplix-react/*` 하위 패키지에서 가져오려면 `.npmrc`에 다음 설정을 추가하세요.

```ini
public-hoist-pattern[]=@simplix-react/*
```

> `simplix init`으로 만든 프로젝트에는 이 설정이 이미 들어 있습니다.

이 패키지 하나로 다음 패키지를 설치합니다.

| 패키지 | 설명 |
| --- | --- |
| `@simplix-react/contract` | Zod 기반의 타입 안전한 API 계약(contract) 정의 |
| `@simplix-react/api` | 도메인 패키지용 Orval mutator 싱글턴 |
| `@simplix-react/react` | 계약에서 파생한 React Query 훅 |
| `@simplix-react/form` | 계약에서 파생한 TanStack Form 훅 |
| `@simplix-react/ui` | CRUD 화면을 구성하는 UI 컴포넌트와 컴파운드 패턴 |
| `@simplix-react/auth` | 인증 미들웨어(Bearer, API Key, OAuth2) |
| `@simplix-react/access` | CASL 기반 인가와 접근 제어 |
| `@simplix-react/mock` | MSW 핸들러와 인메모리 저장소 |
| `@simplix-react/i18n` | i18next 기반 국제화 |
| `@simplix-react/calendar` | 달력 컴포넌트(월간, 주간, 일간, 연간, 일정 목록, 간트, 타임라인, 히트맵 보기) |
| `@simplix-react/gantt-core` | 프레임워크에 의존하지 않는 프로젝트 일정 계산 엔진 |
| `@simplix-react/gantt` | 일정 계산 엔진 위에 구성한 React 간트 차트 |
| `@simplix-react/process-core` | 프레임워크에 의존하지 않는 절차 모델 |
| `@simplix-react/process` | 절차 모델 위에 구성한 React 절차 레인 |
| `@simplix-react/cli` | 프로젝트 스캐폴딩과 검증 CLI |
| `@simplix-react/testing` | 테스트 도구(목 클라이언트, 쿼리 래퍼) |

## 사용 방법

각 패키지에서 직접 가져오세요.

```ts
import { defineApi, simpleQueryBuilder } from "@simplix-react/contract";
import { deriveEntityHooks } from "@simplix-react/react";
import { deriveEntityFormHooks } from "@simplix-react/form";
import { createAuth, bearerScheme } from "@simplix-react/auth";
import { deriveMockHandlers } from "@simplix-react/mock";
import { I18nextAdapter } from "@simplix-react/i18n";
```

## 선택 설치

일부 패키지만 필요하면 그 패키지만 설치하세요.

```bash
pnpm add @simplix-react/contract @simplix-react/react
```

## 문서

- [시작하기](https://github.com/simplix-framework/simplix-react/blob/main/docs/ko/getting-started/overview.md)
- [API 레퍼런스](https://github.com/simplix-framework/simplix-react/tree/main/docs/api)

## 라이선스

MIT

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/packages/simplix-react/README.ko.md" target="_blank" rel="noopener noreferrer">원본 보기</a></p>
