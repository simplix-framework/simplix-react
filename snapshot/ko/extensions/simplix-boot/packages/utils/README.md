# @simplix-react-ext/simplix-boot-utils

[English](/en/extensions/simplix-boot/packages/utils/README.md) | **한국어**

Spring Boot 백엔드용 유틸리티 함수 패키지입니다. Boot API 열거형 객체와 일반 문자열을 서로 변환하고, 일반 CRUD 필터를 searchable-jpa 호환 형식으로 바꾸며, 생성된 훅(hook)의 응답을 실행 시점의 DTO로 읽고, 편집용 조회 결과를 수정 요청 본문으로 바꿉니다.

## 설치

```bash
pnpm add @simplix-react-ext/simplix-boot-utils
```

> **사전 요구 사항:** 피어 의존성으로 `@simplix-react/api`가 필요합니다(이 패키지가 그 패키지의 `serverMessage`를 다시 내보냅니다).

## 사용법

### Boot 열거형 값 꺼내기

`resolveBootEnum()`은 Boot가 문자열 또는 `value` 필드가 있는 객체로 반환하는 값에서 일반 문자열을 꺼냅니다.

```ts
import { resolveBootEnum } from "@simplix-react-ext/simplix-boot-utils";

resolveBootEnum("ACTIVE");                                  // "ACTIVE"
resolveBootEnum({ type: "Status", value: "ACTIVE", label: "Active" }); // "ACTIVE"
resolveBootEnum({ value: 3 });                             // "3"
resolveBootEnum(null);                                     // ""
resolveBootEnum(42);                                       // "42"
```

### 레이블 열거형 되돌려 보내기

Boot 백엔드는 `LabeledEnum`을 구현한 열거형을 `{ value, label }`로 직렬화하며, 이 패키지는 그 형태를 `LabeledEnumValue<T>`로 나타냅니다. `toLabeledEnum()`은 `resolveBootEnum()`의 역함수로, 이 객체를 담는 DTO를 보내기 전에 일반 값을 다시 그 형태로 감쌉니다. 레이블에는 값을 그대로 넣으며, 서버는 `value`만 읽습니다.

```ts
import { toLabeledEnum, type LabeledEnumValue } from "@simplix-react-ext/simplix-boot-utils";

const status: LabeledEnumValue<"ACTIVE" | "RETIRED"> = toLabeledEnum("ACTIVE");
// { value: "ACTIVE", label: "ACTIVE" }
toLabeledEnum(undefined); // undefined
```

### 생성된 훅의 응답 읽기

Boot 도메인 패키지(domain package)는 응답 봉투를 푸는 뮤테이터로 동작하므로, 생성된 훅의 `data`는 실행 시점에 일반 DTO입니다. 그러나 생성된 타입은 응답 봉투를 나타냅니다. `bootBody()`는 그 값을 DTO로, `bootPage()`는 조회가 끝나기 전까지 `content`가 빈 `BootPage`로 읽습니다. 응답 봉투는 이미 벗겨졌으므로 `data.body`는 읽지 마세요.

```ts
import { bootBody, bootPage } from "@simplix-react-ext/simplix-boot-utils";

const pet = bootBody<PetDetailDTO>(petQuery.data);      // PetDetailDTO | undefined
const page = bootPage<PetListDTO>(petListQuery.data);   // { content: [] } before the read answers
page.content.map((row) => row.name);
```

### 수정 요청 본문 만들기

`updateBody()`는 편집용 조회(`useGet<Entity>ForEdit`)가 반환한 값을 수정 엔드포인트가 받는 본문으로 바꿉니다. Boot 열거형 객체 `{ type, value, ... }`는 `value`만 남기고, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`은 뺍니다. 결과를 먼저 펼치고 편집한 필드를 그 뒤에 두세요. 레코드가 없으면 빈 본문을 반환합니다.

```ts
import { updateBody } from "@simplix-react-ext/simplix-boot-utils";

await update.mutateAsync({ areaId, data: { ...updateBody(loaded), areaId, areaName } });
```

### 검색 필터 변환하기

`transformSearchableFilters()`는 일반 CRUD 필터 값을 searchable-jpa 백엔드가 기대하는 연산자와 형식으로 다시 씁니다.

```ts
import { transformSearchableFilters } from "@simplix-react-ext/simplix-boot-utils";

const result = transformSearchableFilters({
  "status.in": ["ACTIVE", "PENDING"],
  "createdAt.greaterThanOrEqualTo": "2024-01-01T00:00:00.000Z",
  "createdAt.lessThanOrEqualTo": "2024-12-31T23:59:59.000Z",
  "name.contains": "doe",
  "deletedAt.equals": "",
});

// result:
// {
//   "status.in": "ACTIVE,PENDING",
//   "createdAt.between": "2024-01-01T00:00:00,2024-12-31T23:59:59",
//   "name.contains": "doe",
// }
```

배열 값은 쉼표로 구분한 문자열로 합치고, 짝이 맞는 gte/lte 날짜 쌍은 `.between` 연산자 하나로 합칩니다. ISO 날짜 문자열은 `LocalDateTime` 형식으로 바꾸고, 빈 값은 뺍니다.

## API 레퍼런스

### `resolveBootEnum(v)`

일반 문자열 또는 `value` 필드가 있는 객체로 오는 Boot API 열거형에서 문자열 값을 꺼냅니다.

**매개변수:**

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| `v` | `unknown` | 문자열, `value` 필드가 있는 객체, `null`/`undefined`, 그 밖의 값 |

**반환값:** `string`

**동작:**

- `v`가 `null`이나 `undefined`이면 `""`을 반환합니다
- 이미 문자열이면 `v`를 그대로 반환합니다
- `value` 필드가 있는 객체이면 `String(v.value)`를 반환합니다
- 그 밖의 값은 `String(v)`를 반환합니다

### `transformSearchableFilters(filters)`

일반 CRUD 필터 객체를 searchable-jpa 백엔드가 기대하는 형식으로 바꿉니다.

**매개변수:**

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| `filters` | `Record<string, unknown>` | 필터 키(보통 `field.operator`)와 필터 값의 대응 |

**반환값:** `Record<string, unknown>`

**동작:**

- 값이 `undefined`, `null`, 빈 문자열(`""`)인 항목은 건너뜁니다
- 배열 값은 쉼표로 구분한 문자열로 합칩니다(예: `["A", "B"]` → `"A,B"`, `in` 연산자용)
- ISO 날짜 문자열(`YYYY-MM-DDT…` 형태)은 밀리초와 시간대 접미사를 지워 `LocalDateTime`으로 바꿉니다(예: `2024-01-01T00:00:00.000Z` → `2024-01-01T00:00:00`)
- 짝이 맞는 `<field>.greaterThanOrEqualTo`와 `<field>.lessThanOrEqualTo` 날짜 쌍은 경계값을 쉼표로 이은 `<field>.between` 연산자 하나로 합칩니다
- 날짜 쌍의 한쪽만 있으면 원래의 `greaterThanOrEqualTo` 또는 `lessThanOrEqualTo` 연산자를 유지하고 값만 `LocalDateTime`으로 바꿉니다
- 그 밖의 값은 바꾸지 않습니다

### `toLabeledEnum(value)`

일반 값으로 `LabeledEnumValue` 전송 형태를 만듭니다.

**매개변수:**

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| `value` | `T \| undefined` | 열거형 상수 값 |

**반환값:** `{ value, label: value }`(`LabeledEnumValue<T>`). `value`가 `undefined`이면 `undefined`를 반환합니다.

### `bootBody(data)`와 `bootPage(data)`

| 함수 | 반환값 | 설명 |
| --- | --- | --- |
| `bootBody<T>(data: unknown)` | `T \| undefined` | 훅의 응답을 DTO로 반환합니다. 조회가 끝나기 전에는 `undefined`입니다 |
| `bootPage<T>(data: unknown)` | `BootPage<T>` | 훅의 응답을 페이지로 반환합니다. 아직 `content`가 없으면 `{ content: [] }`입니다 |

### `updateBody(loaded)`

**매개변수:**

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| `loaded` | `T \| null \| undefined` | 편집용 조회가 반환한 레코드. 생성할 때는 없습니다 |

**반환값:** 레코드를 전달하면 `Omit<T, "createdBy" | "createdAt" | "updatedBy" | "updatedAt">`, 인수가 없을 수 있으면 같은 타입의 `Partial<...>`입니다.

**동작:**

- `type`과 `value`가 모두 있는 객체(Boot 열거형)는 `value`로 바꾸고, 그 밖의 객체(예: 번역 맵)는 그대로 둡니다
- 감사 필드 `createdBy`, `createdAt`, `updatedBy`, `updatedAt`은 지웁니다. 그 밖에는 추가, 삭제, 순서 변경을 하지 않습니다
- `null`이나 `undefined`를 전달하면 `{}`를 반환합니다

### `serverMessage(error)`

`@simplix-react/api`에서 다시 내보냅니다. 서버가 거부나 실패와 함께 보낸 문장이 있으면 반환하고, 응답에 문장이 없으면(전송 실패, 또는 `HTTP 500`처럼 상태 코드만 담은 대체 문구) `undefined`를 반환합니다. 그래서 호출하는 쪽은 `serverMessage(caught) ?? fallback`처럼 쓸 수 있습니다.

### 타입

```ts
interface LabeledEnumValue<T extends string = string> {
  value: T;
  label: string;
}

interface BootPage<T> {
  readonly content: readonly T[];
  readonly totalElements?: number;
  readonly totalPages?: number;
  readonly number?: number;
  readonly size?: number;
}
```

## 관련 문서

- [simplix-boot 확장 개요](/ko/extensions/simplix-boot/README.md)

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/extensions/simplix-boot/packages/utils/README.ko.md" target="_blank" rel="noopener noreferrer">원본 보기</a></p>
