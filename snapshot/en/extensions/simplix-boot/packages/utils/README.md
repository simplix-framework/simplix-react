# @simplix-react-ext/simplix-boot-utils

**English** | [한국어](/ko/extensions/simplix-boot/packages/utils/README.md)

Utility functions for Spring Boot backends. Normalizes Boot API enum objects into plain strings and back, transforms generic CRUD filters into a searchable-jpa compatible format, reads generated hook answers as the DTOs they are at run time, and turns an edit read into an update body.

## Installation

```bash
pnpm add @simplix-react-ext/simplix-boot-utils
```

> **Prerequisites:** Requires `@simplix-react/api` as a peer dependency (this package re-exports its `serverMessage`).

## Usage

### Resolve Boot Enum Values

`resolveBootEnum()` extracts a plain string from values that Boot may return either as a string or as an object that carries a `value` field:

```ts
import { resolveBootEnum } from "@simplix-react-ext/simplix-boot-utils";

resolveBootEnum("ACTIVE");                                  // "ACTIVE"
resolveBootEnum({ type: "Status", value: "ACTIVE", label: "Active" }); // "ACTIVE"
resolveBootEnum({ value: 3 });                             // "3"
resolveBootEnum(null);                                     // ""
resolveBootEnum(42);                                       // "42"
```

### Send a Labeled Enum Back

The Boot backend serializes an enum implementing `LabeledEnum` as `{ value, label }`, typed here as `LabeledEnumValue<T>`. `toLabeledEnum()` is the inverse of `resolveBootEnum()`: it puts a bare value back under that shape before a DTO that carries the object is sent. The label is the value; the server reads only `value`:

```ts
import { toLabeledEnum, type LabeledEnumValue } from "@simplix-react-ext/simplix-boot-utils";

const status: LabeledEnumValue<"ACTIVE" | "RETIRED"> = toLabeledEnum("ACTIVE");
// { value: "ACTIVE", label: "ACTIVE" }
toLabeledEnum(undefined); // undefined
```

### Read Generated Hook Answers

Boot domain packages run on the envelope-unwrapping mutator, so a generated hook's `data` is the plain DTO at run time, while its generated type describes the envelope. `bootBody()` reads it as the DTO and `bootPage()` as a `BootPage` whose `content` is empty until the read answers. Never read `data.body`: the envelope is already gone:

```ts
import { bootBody, bootPage } from "@simplix-react-ext/simplix-boot-utils";

const pet = bootBody<PetDetailDTO>(petQuery.data);      // PetDetailDTO | undefined
const page = bootPage<PetListDTO>(petListQuery.data);   // { content: [] } before the read answers
page.content.map((row) => row.name);
```

### Build an Update Body

`updateBody()` turns what an edit read (`useGet<Entity>ForEdit`) returned into the body the update endpoint accepts: each Boot enum object `{ type, value, ... }` becomes its bare `value`, and `createdBy`, `createdAt`, `updatedBy` and `updatedAt` are dropped. Spread it first and put the edited fields after it. An absent record gives an empty body:

```ts
import { updateBody } from "@simplix-react-ext/simplix-boot-utils";

await update.mutateAsync({ areaId, data: { ...updateBody(loaded), areaId, areaName } });
```

### Transform Searchable Filters

`transformSearchableFilters()` rewrites generic CRUD filter values into the operator/format conventions expected by a searchable-jpa backend:

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

Array values are joined into a comma-separated string, matching gte/lte date pairs are merged into a single `.between` operator, ISO date strings are converted to `LocalDateTime` format, and empty values are dropped.

## API Reference

### `resolveBootEnum(v)`

Extracts a string value from a Boot API enum, which may arrive as a plain string or as an object carrying a `value` field.

**Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `v` | `unknown` | A string, an object with a `value` field, `null`/`undefined`, or any other value |

**Returns:** `string`

**Behavior:**

- Returns `""` when `v` is `null` or `undefined`
- Returns `v` unchanged when it is already a string
- Returns `String(v.value)` when `v` is an object containing a `value` field
- Falls back to `String(v)` for any other value

### `transformSearchableFilters(filters)`

Transforms a generic CRUD filter object into the format expected by a searchable-jpa backend.

**Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `filters` | `Record<string, unknown>` | Filter keys (typically `field.operator`) mapped to filter values |

**Returns:** `Record<string, unknown>`

**Behavior:**

- Skips entries whose value is `undefined`, `null`, or an empty string (`""`)
- Joins array values into a comma-separated string (e.g. `["A", "B"]` → `"A,B"`, for the `in` operator)
- Converts ISO date strings (matching `YYYY-MM-DDT…`) to `LocalDateTime` by stripping the milliseconds and timezone suffix (e.g. `2024-01-01T00:00:00.000Z` → `2024-01-01T00:00:00`)
- Merges a matching `<field>.greaterThanOrEqualTo` and `<field>.lessThanOrEqualTo` date pair into a single `<field>.between` operator with comma-joined bounds
- When only one side of a date pair is present, keeps the original `greaterThanOrEqualTo` or `lessThanOrEqualTo` operator with the value converted to `LocalDateTime`
- Leaves all other values unchanged

### `toLabeledEnum(value)`

Builds the `LabeledEnumValue` wire shape from a bare value.

**Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `value` | `T \| undefined` | A bare enum constant |

**Returns:** `{ value, label: value }` (`LabeledEnumValue<T>`), or `undefined` when `value` is `undefined`.

### `bootBody(data)` and `bootPage(data)`

| Function | Returns | Description |
| --- | --- | --- |
| `bootBody<T>(data: unknown)` | `T \| undefined` | The hook's answer as the DTO, or `undefined` before the read has answered |
| `bootPage<T>(data: unknown)` | `BootPage<T>` | The hook's answer as a page; `{ content: [] }` when it has no `content` yet |

### `updateBody(loaded)`

**Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `loaded` | `T \| null \| undefined` | The record the edit read returned, or nothing on the create path |

**Returns:** `Omit<T, "createdBy" | "createdAt" | "updatedBy" | "updatedAt">` for a record, `Partial<...>` of the same when the argument may be absent.

**Behavior:**

- A value that is an object with both `type` and `value` (a Boot enum) is replaced by its `value`; any other object (for example a translation map) is kept as is
- The audit fields `createdBy`, `createdAt`, `updatedBy`, `updatedAt` are removed; nothing else is added, removed or reordered
- `null` or `undefined` returns `{}`

### `serverMessage(error)`

Re-exported from `@simplix-react/api`. Returns the non-empty sentence the server sent with a refusal or failure, or `undefined` when the response stated none (a transport failure, or a status-only stand-in such as `HTTP 500`), so a caller can write `serverMessage(caught) ?? fallback`.

### Types

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

## Related

- [simplix-boot extension overview](/en/extensions/simplix-boot/README.md)

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/extensions/simplix-boot/packages/utils/README.md" target="_blank" rel="noopener noreferrer">Edit on GitHub</a></p>
