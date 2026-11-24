# 핵심 개념

[English](/en/core-concepts/README.md) | **한국어**

simplix-react가 내부에서 어떻게 동작하는지 구조 관점에서 설명합니다. 주요 하위 시스템마다 설계 결정, 데이터 흐름, 구조 패턴을 다룹니다. 각 기능이 _왜_ 그렇게 동작하는지 알고 싶을 때 읽으세요.

## 목차

| 문서 | 설명 |
| --- | --- |
| [API 계약](/ko/core-concepts/api-contracts.md) | `defineApi()`가 EntityDefinition과 OperationDefinition을 유일한 기준인 계약(contract)으로 조립하는 방법, 오퍼레이션의 역할, `customizeApi()`, 계약에서 시작하는 파생 과정 전체 |
| [스키마 파생](/ko/core-concepts/schema-derivation.md) | 계약 하나에서 클라이언트, 쿼리 키, React Query 훅, 폼 훅, MSW 목 핸들러를 얻는 파생 과정과, Zod 스키마로 모든 단계의 타입 안전성을 유지하는 방법 |
| [인증](/ko/core-concepts/authentication.md) | 전략 기반 인증 미들웨어 구조: `AuthScheme` 구현(Bearer, API 키, OAuth2, 사용자 정의)으로 401 자동 재시도와 단일 토큰 갱신을 지원하는 인증된 `fetchFn` 래퍼를 만드는 방법 |
| [인가](/ko/core-concepts/authorization.md) | CASL 기반 접근 제어: `AccessPolicy`가 CASL 능력을 감싸는 방법, JWT 토큰이나 API 엔드포인트에서 규칙을 추출하는 어댑터 패턴, 역할 정규화, React 연동 계층 |
| [캐시 무효화](/ko/core-concepts/cache-invalidation.md) | 쿼리 캐시 자동 무효화 전략: 계층형 쿼리 키 구조(`[domain, entity, scope, params]`), 뮤테이션이 관련 쿼리를 무효화하는 방법, 넓게 무효화하는 보수적 방식의 장단점 |
| [확장](/ko/core-concepts/extensions.md) | 확장 구조: 환경별 구현을 위한 제공자 패턴, 이름 규칙(`@simplix-react-ext/`), 확장이 Spring Boot 같은 특정 백엔드에 맞춰 핵심 추상 인터페이스를 구현하는 방법 |
| [폼 파생](/ko/core-concepts/form-derivation.md) | `deriveEntityFormHooks()`가 계약과 React Query 훅에서 TanStack Form 훅을 파생하는 방법: 변경된 필드 자동 추적, 서버 오류 매핑, Zod에서 폼 바인딩까지의 파생 과정 |
| [국제화](/ko/core-concepts/internationalization.md) | 어댑터 기반 i18n 구조: `II18nAdapter` 인터페이스, 도메인과 애플리케이션의 번역 소유 구분, 충돌을 막는 네임스페이스 범위, 지연 로딩하는 모듈 번역, `Intl` API 서식 |
| [목 데이터 계층](/ko/core-concepts/mock-data-layer.md) | MSW와 인메모리 `Map` 저장소 구조: `deriveMockHandlers()`가 실제 CRUD 오퍼레이션, 필터링, 정렬, 페이지네이션, 관계 데이터 로딩을 수행하는 핸들러를 파생하는 방법. 데이터는 모두 JavaScript `Map` 인스턴스에 저장 |
| [UI 컴포넌트](/ko/core-concepts/ui-components.md) | 계층형 컴포넌트 구조(primitives → base → layout → CRUD), `value`/`onChange` props를 명시하는 복합 컴포넌트 패턴, `CrudList`, `CrudForm`, `CrudDetail`, `CrudTree`를 하위 계층으로 조합하는 방법 |

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/ko/core-concepts/README.md" target="_blank" rel="noopener noreferrer">GitHub에서 편집</a></p>
