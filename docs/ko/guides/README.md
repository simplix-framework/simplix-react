# 가이드

[English](../../en/guides/README.md) | **한국어**

simplix-react로 특정 작업을 처리하는 방법을 설명하는 실무 가이드입니다. 가이드마다 목표 하나를 다루고, 단계별 절차와 동작하는 코드 예제를 제공합니다.

## 목차

### 계약과 엔티티 정의

| 문서 | 설명 |
| --- | --- |
| [엔티티 정의](./defining-entities.md) | Zod 스키마와 오퍼레이션 맵(`{ method, path, input? }`)으로 타입이 안전한 CRUD 엔티티를 정의하고, `defineApi()`로 계약에 등록한 뒤 파생된 클라이언트와 쿼리 키를 사용합니다 |
| [사용자 정의 오퍼레이션](./custom-operations.md) | 일괄 작업, RPC 호출, 파일 업로드처럼 CRUD 밖의 엔드포인트를 엔티티 안이나 최상위 `OperationDefinition`으로 추가하고, 경로 매개변수, 입출력 스키마, multipart · blob 처리, 캐시 무효화를 설정합니다 |
| [상위-하위 엔티티](./parent-child.md) | 하위 엔티티의 목록 조회와 생성을 상위 엔티티의 URL 경로(예: `/projects/:projectId/tasks`) 아래에서 처리하도록 중첩 관계를 설정하고, 상위 엔티티별로 목록 쿼리 키를 나눕니다 |

### React 연동

| 문서 | 설명 |
| --- | --- |
| [React 훅 레퍼런스](./react-hooks-reference.md) | 타입이 안전한 React Query 훅(`useList`, `useGet`, `useCreate`, `useUpdate`, `useDelete`, `useInfiniteList`)을 파생해 사용하고, 자동 캐시 무효화, 낙관적 업데이트, 쿼리 키 팩토리를 활용합니다 |
| [폼 훅](./form-hooks.md) | `deriveEntityFormHooks()`로 계약에서 TanStack Form 훅을 파생하고, 변경 필드 추적, 기본값 처리, 서버 검증 오류 매핑을 갖춘 생성 · 수정 폼을 만듭니다 |
| [UI 컴포넌트](./ui-components.md) | `CrudList`, `CrudForm`, `CrudDetail`, `CrudTree` 복합 컴포넌트로 CRUD 화면을 만들고, 필드 설정, 열 렌더링, 레이아웃 조합을 지정합니다 |
| [디자인](./designs.md) | 루트 `UIProvider`에서 모든 컴포넌트에 적용할 디자인(`classic`, `clarity`)을 선택하고, 슬롯과 파트 선언으로 컴포넌트가 그리는 요소를 표시하며, 클래스 교체와 슬롯별 재정의 명세로 디자인을 추가합니다 |
| [사용 프로젝트 스타일 설정](./consumer-styling-setup.md) | `@simplix-react/ui`를 의존성으로 추가한 프로젝트가 정의해야 하는 항목(Tailwind 연결, `@source` 글로브, 스타일시트 가져오기, 디자인 토큰)을 정리한 레퍼런스입니다 |
| [사용 프로젝트 디자인 사용자 정의](./consumer-design-customization.md) | 스타일 설정을 마친 뒤 프로젝트에서 `@simplix-react/ui` 컴포넌트의 모양을 바꿉니다 |

### HTTP와 인증

| 문서 | 설명 |
| --- | --- |
| [사용자 정의 fetch](./custom-fetch.md) | `createFetch`, `configureDefaultFetch`, `defaultFetch`를 감싼 함수, 완전히 새로 구현한 `FetchFn`으로 HTTP 계층의 헤더, 인터셉터, 로깅, 오류 변환을 바꿉니다 |
| [인증](./authentication.md) | `@simplix-react/auth`로 Bearer 토큰, API 키, OAuth2 인증 요청을 설정하고, 자동 토큰 갱신, 401 재시도, `AuthProvider` React 연동을 사용합니다 |
| [인가](./authorization.md) | `@simplix-react/access`로 역할 기반 접근 제어를 구현하고, CASL 규칙, JWT · API · 정적 어댑터, `AccessProvider` 컨텍스트, 조건부 UI 렌더링용 `useCan()` 훅을 사용합니다 |

### 국제화와 테스트

| 문서 | 설명 |
| --- | --- |
| [국제화](./internationalization.md) | `@simplix-react/i18n`으로 다국어를 지원합니다. `createI18nConfig`를 설정하고, 번역 파일을 네임스페이스와 로케일별로 구성하고, 도메인 번역을 등록하고, `useTranslation` 훅을 사용합니다 |
| [목으로 테스트하기](./testing-with-mocks.md) | `@simplix-react/testing` 도우미로 Vitest와 React Testing Library를 설정합니다. 결정적 데이터에는 `createMockClient`를, 프로바이더 설정에는 `createTestWrapper`를 사용하고 목 접근 제어를 테스트합니다 |
| [목 핸들러](./mock-handlers.md) | 계약에서 파생한 MSW 목 핸들러를 설정하고 바꿉니다. 시드 데이터를 넣고, 핸들러를 개별로 재정의하고, 관계 로딩 동작을 설정합니다 |

### 도구와 확장

| 문서 | 설명 |
| --- | --- |
| [CLI 사용법](./cli-usage.md) | `simplix` CLI로 프로젝트를 스캐폴딩(`init`)하고, 도메인과 모듈을 추가(`add-domain`, `add-module`)하고, OpenAPI 명세를 가져오고(`openapi`), 프로젝트 구조를 검증(`validate`)하고, i18n 타입을 생성합니다 |
| [확장](./extensions.md) | `@simplix-react-ext/simplix-boot-*` 확장 패키지로 Spring Boot 인증, 인가, CLI 코드 생성을 설정하고, Boot 전용 어댑터와 명명 규칙을 사용합니다 |
| [LLM 연동](./llm-integration.md) | `llms.txt`, Claude Code 스킬, CLAUDE.md 참조로 LLM 코딩 에이전트(Claude Code, Cursor, Copilot)에 맥락을 제공해 simplix-react 코드를 정확하게 생성하게 합니다 |
