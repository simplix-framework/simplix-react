# simplix-react 문서

[English](../en/README.md) | **한국어**

## 섹션별 문서

### 시작하기

- [시작하기](./getting-started/README.md): 섹션 목차
- [개요](./getting-started/overview.md): simplix-react의 정의와 계약 하나에서 모든 계층을 파생하는 방식
- [설치](./getting-started/installation.md): 사전 요구 사항, 패키지, 피어 의존성
- [빠른 시작](./getting-started/quick-start.md): 계약, 훅, 컴포넌트, 목 백엔드를 한 번에 따라 하는 실습
- [TypeScript 설정](./getting-started/typescript.md): 권장 tsconfig와 Zod 타입 추론

### 핵심 개념

- [핵심 개념](./core-concepts/README.md): 섹션 목차
- [API 계약](./core-concepts/api-contracts.md): 엔티티, 오퍼레이션, 계약 구조
- [스키마 파생](./core-concepts/schema-derivation.md): 계약 하나에서 클라이언트, 훅, 폼 훅, 목 핸들러를 파생하는 과정
- [인증](./core-concepts/authentication.md): 인증 구조와 전략 패턴
- [인가](./core-concepts/authorization.md): CASL 기반 RBAC · ABAC 접근 제어
- [폼 파생](./core-concepts/form-derivation.md): 계약에서 파생하는 폼 훅
- [UI 컴포넌트](./core-concepts/ui-components.md): CRUD UI 컴포넌트 구조
- [국제화](./core-concepts/internationalization.md): 국제화 프레임워크 구조
- [확장](./core-concepts/extensions.md): 백엔드별 어댑터를 담는 확장 구조
- [캐시 무효화](./core-concepts/cache-invalidation.md): 쿼리 자동 무효화
- [목 데이터 계층](./core-concepts/mock-data-layer.md): MSW와 인메모리 저장소 구조

### 가이드

- [가이드](./guides/README.md): 섹션 목차
- [엔티티 정의](./guides/defining-entities.md): Zod로 타입 안전한 CRUD 엔티티 정의
- [사용자 정의 오퍼레이션](./guides/custom-operations.md): CRUD 역할 밖의 오퍼레이션
- [상위-하위 관계](./guides/parent-child.md): 중첩 엔티티 계층
- [사용자 정의 fetch](./guides/custom-fetch.md): HTTP 계층 맞춤 설정
- [React 훅 레퍼런스](./guides/react-hooks-reference.md): 훅 API 레퍼런스
- [폼 훅](./guides/form-hooks.md): TanStack Form 연동
- [목 핸들러](./guides/mock-handlers.md): MSW 핸들러 설정
- [목으로 테스트하기](./guides/testing-with-mocks.md): Vitest와 MSW 연동
- [인증](./guides/authentication.md): Bearer, API Key, OAuth2, 사용자 정의 인증
- [인가](./guides/authorization.md): CASL 기반 접근 제어 설정
- [국제화](./guides/internationalization.md): 다국어 설정
- [UI 컴포넌트](./guides/ui-components.md): CRUD 목록, 폼, 상세, 트리 컴포넌트 사용
- [디자인 선택과 추가](./guides/designs.md): UI 디자인 선택과 추가
- [디자인 맞춤 설정](./guides/consumer-design-customization.md): `@simplix-react/ui` 컴포넌트 맞춤 설정
- [스타일과 토큰 설정](./guides/consumer-styling-setup.md): `@simplix-react/ui`의 스타일과 디자인 토큰 설정
- [확장](./guides/extensions.md): 백엔드 확장 만들기와 사용
- [CLI 사용법](./guides/cli-usage.md): 프로젝트 스캐폴딩과 검증
- [LLM 연동](./guides/llm-integration.md): LLM 기능 연동

### 튜토리얼

- [튜토리얼](./tutorials/README.md): 섹션 목차
- [프로젝트 앱](./tutorials/project-app.md): 프로젝트 관리 앱을 처음부터 만들기
- [인증 보호 앱](./tutorials/auth-protected-app.md): 로그인, 로그아웃, 토큰 갱신, 라우트 보호
- [풀스택 목](./tutorials/full-stack-mock.md): 브라우저 안 목 계층으로 완성하는 프론트엔드
- [Petstore OpenAPI](./tutorials/petstore-openapi.md): Swagger Petstore 명세에서 도메인 패키지 생성

## 패키지 README

- [`@simplix-react/contract`](../../packages/contract/README.ko.md)
- [`@simplix-react/react`](../../packages/react/README.ko.md)
- [`@simplix-react/form`](../../packages/form/README.ko.md)
- [`@simplix-react/auth`](../../packages/auth/README.ko.md)
- [`@simplix-react/access`](../../packages/access/README.ko.md)
- [`@simplix-react/mock`](../../packages/mock/README.ko.md)
- [`@simplix-react/i18n`](../../packages/i18n/README.ko.md)
- [`@simplix-react/ui`](../../packages/ui/README.ko.md)
- [`@simplix-react/calendar`](../../packages/calendar/README.ko.md)
- [`@simplix-react/api`](../../packages/api/README.ko.md)
- [`@simplix-react/headless`](../../packages/headless/README.ko.md)
- [`@simplix-react/gantt-core`](../../packages/gantt-core/README.ko.md)
- [`@simplix-react/gantt`](../../packages/gantt/README.ko.md)
- [`@simplix-react/process-core`](../../packages/process-core/README.ko.md)
- [`@simplix-react/process`](../../packages/process/README.ko.md)
- [`@simplix-react/testing`](../../packages/testing/README.ko.md)
- [`@simplix-react/cli`](../../packages/cli/README.ko.md)
- [`simplix-react`](../../packages/simplix-react/README.ko.md)
- [`simplix-react-ext`](../../packages/simplix-react-ext/README.ko.md)
- [확장](../../extensions/README.ko.md)
- [`simplix-boot`](../../extensions/simplix-boot/README.ko.md)
- [`native`](../../extensions/native/README.ko.md)

## API 레퍼런스

- [API 문서](../api/README.md): TypeDoc으로 생성한 API 레퍼런스(영어)
