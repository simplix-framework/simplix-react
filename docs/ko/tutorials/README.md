# 튜토리얼

[English](../../en/tutorials/README.md) | **한국어**

애플리케이션을 처음부터 끝까지 단계별로 만드는 튜토리얼입니다. 각 튜토리얼은 빈 상태에서 시작해 동작하는 결과물을 완성하며, 개념을 차례로 소개합니다.

## 목차

| 문서 | 설명 |
| --- | --- |
| [Petstore OpenAPI](./petstore-openapi.md) | Swagger Petstore OpenAPI 명세로 타입이 지정된 다중 도메인 모노레포를 생성합니다. `simplix init`으로 프로젝트를 스캐폴딩하고 `simplix openapi`로 명세를 가져오면 Zod 스키마, React Query 훅, MSW 목 핸들러를 자동으로 파생합니다 |
| [프로젝트 관리 앱](./project-app.md) | 프로젝트 관리 앱을 처음부터 만듭니다. Zod 스키마로 프로젝트와 작업 엔티티를 담은 계약을 정의하고, React Query 훅을 파생하고, 목록과 상세 화면을 만들고, 자동 캐시 무효화와 함께 생성 · 수정 뮤테이션을 연결합니다 |
| [인증 보호 앱](./auth-protected-app.md) | 기존 앱에 인증을 추가합니다. Bearer 토큰 방식으로 `createAuth`를 구성하고, 자동 토큰 갱신과 401 재시도를 설정하고, `AuthProvider`로 라우트를 보호하고, `useAuth`로 로그인과 로그아웃 흐름을 구현합니다 |
| [풀스택 목](./full-stack-mock.md) | 인메모리 목 저장소와 MSW 서비스 워커로 동작하는 프론트엔드 애플리케이션을 백엔드 없이 만듭니다. `deriveMockHandlers`를 설정하고, 초기 데이터를 시드로 넣고, CRUD를 모두 지원하는 API 시뮬레이션으로 개발합니다 |
