# simplix-react 문서

[English](/en/README.md) | **한국어**

## 섹션별 문서

### 시작하기

- [시작하기](/ko/getting-started/README.md): 섹션 목차
- [개요](/ko/getting-started/overview.md): simplix-react의 정의와 계약 하나에서 모든 계층을 파생하는 방식
- [설치](/ko/getting-started/installation.md): 사전 요구 사항, 패키지, 피어 의존성
- [빠른 시작](/ko/getting-started/quick-start.md): 계약, 훅, 컴포넌트, 목 백엔드를 한 번에 따라 하는 실습
- [TypeScript 설정](/ko/getting-started/typescript.md): 권장 tsconfig와 Zod 타입 추론

### 핵심 개념

- [핵심 개념](/ko/core-concepts/README.md): 섹션 목차
- [API 계약](/ko/core-concepts/api-contracts.md): 엔티티, 오퍼레이션, 계약 구조
- [스키마 파생](/ko/core-concepts/schema-derivation.md): 계약 하나에서 클라이언트, 훅, 폼 훅, 목 핸들러를 파생하는 과정
- [인증](/ko/core-concepts/authentication.md): 인증 구조와 전략 패턴
- [인가](/ko/core-concepts/authorization.md): CASL 기반 RBAC · ABAC 접근 제어
- [폼 파생](/ko/core-concepts/form-derivation.md): 계약에서 파생하는 폼 훅
- [UI 컴포넌트](/ko/core-concepts/ui-components.md): CRUD UI 컴포넌트 구조
- [국제화](/ko/core-concepts/internationalization.md): 국제화 프레임워크 구조
- [확장](/ko/core-concepts/extensions.md): 백엔드별 어댑터를 담는 확장 구조
- [캐시 무효화](/ko/core-concepts/cache-invalidation.md): 쿼리 자동 무효화
- [목 데이터 계층](/ko/core-concepts/mock-data-layer.md): MSW와 인메모리 저장소 구조

### 가이드

- [가이드](/ko/guides/README.md): 섹션 목차
- [엔티티 정의](/ko/guides/defining-entities.md): Zod로 타입 안전한 CRUD 엔티티 정의
- [사용자 정의 오퍼레이션](/ko/guides/custom-operations.md): CRUD 역할 밖의 오퍼레이션
- [상위-하위 관계](/ko/guides/parent-child.md): 중첩 엔티티 계층
- [사용자 정의 fetch](/ko/guides/custom-fetch.md): HTTP 계층 맞춤 설정
- [React 훅 레퍼런스](/ko/guides/react-hooks-reference.md): 훅 API 레퍼런스
- [폼 훅](/ko/guides/form-hooks.md): TanStack Form 연동
- [목 핸들러](/ko/guides/mock-handlers.md): MSW 핸들러 설정
- [목으로 테스트하기](/ko/guides/testing-with-mocks.md): Vitest와 MSW 연동
- [인증](/ko/guides/authentication.md): Bearer, API Key, OAuth2, 사용자 정의 인증
- [인가](/ko/guides/authorization.md): CASL 기반 접근 제어 설정
- [국제화](/ko/guides/internationalization.md): 다국어 설정
- [UI 컴포넌트](/ko/guides/ui-components.md): CRUD 목록, 폼, 상세, 트리 컴포넌트 사용
- [디자인 선택과 추가](/ko/guides/designs.md): UI 디자인 선택과 추가
- [디자인 맞춤 설정](/ko/guides/consumer-design-customization.md): `@simplix-react/ui` 컴포넌트 맞춤 설정
- [스타일과 토큰 설정](/ko/guides/consumer-styling-setup.md): `@simplix-react/ui`의 스타일과 디자인 토큰 설정
- [확장](/ko/guides/extensions.md): 백엔드 확장 만들기와 사용
- [CLI 사용법](/ko/guides/cli-usage.md): 프로젝트 스캐폴딩과 검증
- [LLM 연동](/ko/guides/llm-integration.md): LLM 기능 연동

### 튜토리얼

- [튜토리얼](/ko/tutorials/README.md): 섹션 목차
- [프로젝트 앱](/ko/tutorials/project-app.md): 프로젝트 관리 앱을 처음부터 만들기
- [인증 보호 앱](/ko/tutorials/auth-protected-app.md): 로그인, 로그아웃, 토큰 갱신, 라우트 보호
- [풀스택 목](/ko/tutorials/full-stack-mock.md): 브라우저 안 목 계층으로 완성하는 프론트엔드
- [Petstore OpenAPI](/ko/tutorials/petstore-openapi.md): Swagger Petstore 명세에서 도메인 패키지 생성

## 패키지 README

- [`@simplix-react/contract`](/ko/packages/contract/README.md)
- [`@simplix-react/react`](/ko/packages/react/README.md)
- [`@simplix-react/form`](/ko/packages/form/README.md)
- [`@simplix-react/auth`](/ko/packages/auth/README.md)
- [`@simplix-react/access`](/ko/packages/access/README.md)
- [`@simplix-react/mock`](/ko/packages/mock/README.md)
- [`@simplix-react/i18n`](/ko/packages/i18n/README.md)
- [`@simplix-react/ui`](/ko/packages/ui/README.md)
- [`@simplix-react/calendar`](/ko/packages/calendar/README.md)
- [`@simplix-react/api`](/ko/packages/api/README.md)
- [`@simplix-react/headless`](/ko/packages/headless/README.md)
- [`@simplix-react/gantt-core`](/ko/packages/gantt-core/README.md)
- [`@simplix-react/gantt`](/ko/packages/gantt/README.md)
- [`@simplix-react/process-core`](/ko/packages/process-core/README.md)
- [`@simplix-react/process`](/ko/packages/process/README.md)
- [`@simplix-react/testing`](/ko/packages/testing/README.md)
- [`@simplix-react/cli`](/ko/packages/cli/README.md)
- [`simplix-react`](/ko/packages/simplix-react/README.md)
- [`simplix-react-ext`](/ko/packages/simplix-react-ext/README.md)
- [확장](/ko/extensions/README.md)
- [`simplix-boot`](/ko/extensions/simplix-boot/README.md)
- [`native`](/ko/extensions/native/README.md)

## API 레퍼런스

- [API 문서](https://github.com/simplix-framework/simplix-react/blob/main/docs/api/README.md): TypeDoc으로 생성한 API 레퍼런스(영어)

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/ko/README.md" target="_blank" rel="noopener noreferrer">GitHub에서 편집</a></p>
