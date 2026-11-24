# @simplix-react-ext/simplix-boot-cli-plugin

[English](README.md) | **한국어**

`simplix-boot` 명세 프로필, `boot` 응답 어댑터(adapter), Boot 응답 봉투(envelope) 스키마 어댑터를 `@simplix-react/cli` 전역 레지스트리에 등록하는 CLI 플러그인입니다.

## 설치

```bash
pnpm add -D @simplix-react-ext/simplix-boot-cli-plugin
```

> **사전 요구 사항:** 피어 의존성으로 `@simplix-react/cli`가 필요합니다.

이 패키지는 부수 효과만 있습니다. 가져오면 진입점이 `@simplix-react/cli`의 `registerPlugin()`과 `registerSchemaAdapter()`를 호출하며, 런타임에 내보내는 이름은 없습니다.

## 사용법

### 플러그인 켜기

CLI는 설정 파일을 기준으로 동작하며 이 패키지를 자동으로 불러오지 않습니다. `simplix.config.ts`의 `plugins` 배열에 패키지를 추가해 켜세요.

```ts
// simplix.config.ts
import { defineConfig } from "@simplix-react/cli";

export default defineConfig({
  plugins: ["@simplix-react-ext/simplix-boot-cli-plugin"],
  // ...
});
```

CLI는 시작할 때 `plugins`의 각 항목을 가져옵니다. 이때 이 패키지의 등록 코드가 실행되어 `simplix-boot` 프로필을 쓸 수 있게 됩니다.

### 프로필 사용하기

`openapi` 설정에서 명세마다 `simplix-boot` 프로필을 지정한 뒤 코드 생성을 실행하면 계약(contract), 엔티티(entity), 오퍼레이션(operation) 훅을 생성합니다.

```ts
// simplix.config.ts
import { defineConfig } from "@simplix-react/cli";

export default defineConfig({
  plugins: ["@simplix-react-ext/simplix-boot-cli-plugin"],
  openapi: [
    {
      spec: "my-api-spec.json",
      profile: "simplix-boot",
      domains: {
        // domainName: [tagPatterns]
      },
    },
  ],
});
```

```bash
simplix openapi my-api-spec.json
```

## 플러그인이 등록하는 항목

`registerPlugin()`은 id가 `simplix-boot`인 플러그인을 등록하며, 이 플러그인은 `simplix-boot` 명세 프로필과 `boot` 응답 어댑터를 제공합니다. Boot 스키마 어댑터는 `registerSchemaAdapter()`가 따로 등록합니다.

| 등록 항목 | 이름 | 설명 |
| --- | --- | --- |
| 이름 규칙 | `simplixBootNaming` | Boot 태그 형식 `scope.crud.EntityName`에서 엔티티 이름을 정하고(PascalCase 엔티티 부분을 camelCase로 변환), CRUD 경로 패턴을 오퍼레이션 역할과 훅 이름에 대응시킵니다. |
| 응답 어댑터 | `boot` | 생성 코드의 Boot 응답 봉투 처리를 설정합니다. 오류 변환에는 `bootResponseAdapter`를, 목(mock) 응답에는 `wrapEnvelope`를 쓰며 둘 다 `@simplix-react-ext/simplix-boot-auth`에서 가져옵니다. |
| 스키마 어댑터 | `bootSchemaAdapter` | Boot 응답 봉투(`type`, `message`, `body`, `timestamp`, `errorCode`, `errorDetail`)를 벗겨 생성 타입이 봉투가 아닌 내부 `body` 데이터를 나타내게 합니다. |
| i18n 내려받기 | `/api/v1/dev/i18n/messages` | 실행 중인 서버에서 엔티티 필드와 열거형 메시지 번역을 내려받아 로케일별 도메인 데이터로 변환합니다. |
| SimpliX Meta 엔드포인트 | `/api/v1/dev/meta/dto` | CLI가 백엔드의 DTO 메타데이터를 읽는 엔드포인트입니다. |
| 컨테이너 타입 | `bootContainerTypes` | Java 컨테이너를 생성 TypeScript에 대응시킵니다. `SimpliXApiResponse`는 벗기고, `Page`는 `@simplix-react-ext/simplix-boot-auth`의 `SpringPage` / `pageOf`로, `List`는 `Array` / `z.array`로, `Map`은 문자열 키의 `Record` / `z.record`로 바꿉니다. |
| 레이블 열거형 | `LabeledEnumValue` | Boot `LabeledEnum`을 담은 응답 필드의 타입을 값 유니언 대신 `@simplix-react-ext/simplix-boot-utils`의 `LabeledEnumValue`(`{ value, label }`)로 지정합니다. |

`simplix-boot` 프로필은 `mutatorStrategy`를 `"boot"`로 정하고, 생성된 뮤테이터의 오류 어댑터로 `bootResponseAdapter`를 가져오는 `mutatorHint`를 두며, `@simplix-react-ext/simplix-boot-auth`를 의존성으로 선언합니다. 생성된 프로젝트는 응답 봉투 처리를 위해 이 패키지를 설치합니다.

### 이름 규칙

`simplixBootNaming`은 `scope.crud.EntityName`(또는 `scope.EntityName`) 형식의 OpenAPI 태그를 읽고, 점으로 나눈 마지막 부분을 엔티티 이름으로 씁니다. 이때 끝의 `RestController`나 `Controller`를 지우고 첫 글자를 소문자로 바꿉니다. 오퍼레이션은 HTTP 메서드와 경로 패턴으로 정합니다.

- `GET /entity/search` → list
- `GET /entity` → getAll
- `GET /entity/{id}` → get
- `GET /entity/{id}/edit` → getForEdit
- `GET /entity/tree`와 `GET /entity/tree/{id}` → tree와 subtree
- `GET /entity/<sub-path>` → 하위 경로 이름을 딴 사용자 정의 쿼리(예: `GET /event/statistics/summary` → summary). 경로 끝에 경로 매개변수가 있으면 `By<Param>`을 추가합니다
- `POST /entity/create` → create
- `POST /entity/search` → search
- `PUT /entity/{id}` → update, `PUT /entity/{id}/<action>` → update<Action>
- `PATCH /entity/batch` → batchUpdate, `PATCH /entity` → multiUpdate, `PATCH /entity/{id}` → update
- `DELETE /entity/{id}` → delete, `DELETE /entity/batch` → batchDelete, `DELETE /entity/{id}/<resource>/...` → delete<Resource>

그 밖의 사용자 정의 하위 경로는 camelCase 동작 이름이 됩니다(예: `POST /entity/{id}/unpair` → unpair, `PATCH /entity/{id}/password` → password).

### 스키마 어댑터

`bootSchemaAdapter`는 스키마에 문자열 `type`과 `message` 속성, 비어 있지 않은 객체 `body`가 있으면 Boot 응답 봉투로 판단합니다. 스키마를 `body` 하위 스키마로 벗기고 타입 이름에서 `SimpliXApiResponse` 접두사를 지워, 생성 타입의 이름이 내부 데이터를 따르게 합니다.

### i18n 내려받기

내려받기 함수는 `<serverOrigin>/api/v1/dev/i18n/messages`에서 번역을 가져오고(제한 시간 30초), 응답이 Boot 응답 봉투이면 봉투를 벗깁니다. 서버 엔티티 키(PascalCase)를 도메인 엔티티 키(camelCase)에 대응시키며, 서버 엔티티 하나가 도메인 엔티티 여러 개에 쓰일 수 있습니다. 결과는 요청한 로케일(locale)별 데이터입니다. 요청이 실패하거나 쓸 수 있는 데이터가 없으면 아무것도 반환하지 않고, 코드 생성은 내려받은 번역 없이 계속합니다.

## 불러오는 방식

플러그인은 설정 파일을 기준으로 불러옵니다. CLI는 `simplix.config.ts`의 `config.plugins`를 읽어 나열된 패키지를 하나씩 가져옵니다. 확장 이름을 코드에 고정하지 않으며 자동으로 불러오지도 않습니다. 이 패키지를 가져오면 등록 코드가 실행되고, 그 뒤부터 `openapi[].profile`에서 `simplix-boot` 프로필을 지정할 수 있습니다.

![simplix openapi는 openapi[].profile을 확인하기 전에 config.plugins의 패키지를 하나씩 불러오고, 그 import가 simplix-boot 프로필을 등록합니다](../../../../docs/assets/figures/pkg-simplix-boot-cli-plugin-loading.ko.svg)

`openapi` 항목이 지정한 프로필의 플러그인이 `plugins`에 없거나 설치되지 않았으면 `simplix openapi`는 프로필이 없다는 오류를 출력하고 종료합니다.

## 관련 문서

- [simplix-boot 확장 개요](../../README.ko.md)
- [CLI 사용 가이드](../../../../docs/ko/guides/cli-usage.md)
- [확장 가이드](../../../../docs/ko/guides/extensions.md)
