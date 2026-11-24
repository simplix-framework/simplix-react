# TypeScript 설정

[English](/en/getting-started/typescript.md) | **한국어**

simplix-react는 TypeScript로 작성했고, Zod의 타입 추론으로 계약(contract)부터 화면까지 타입 안전성을 유지합니다. 이 문서는 권장 설정을 설명합니다.

## 권장 tsconfig.json

simplix-react를 쓰는 프로젝트에는 다음 설정을 권장합니다.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "resolveJsonModule": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 주요 설정 설명

| 설정 | 값 | 이유 |
| --- | --- | --- |
| `target` | `ES2022` | `structuredClone`, 최상위 `await`, `Array.at()` 같은 최신 기능을 쓸 수 있습니다. |
| `module` | `ESNext` | simplix-react가 쓰는 ESM 전용 패키지에 필요합니다. |
| `moduleResolution` | `bundler` | Vite, webpack, esbuild 같은 번들러의 모듈 해석 방식과 맞춥니다. package.json의 `exports` 필드를 지원합니다. |
| `strict` | `true` | 모든 엄격한 타입 검사 옵션을 켭니다. Zod 타입을 정확히 추론하는 데 필요합니다. |
| `isolatedModules` | `true` | esbuild, SWC 같은 파일 단위 트랜스파일러와 호환되게 합니다. |
| `verbatimModuleSyntax` | `true` | 타입만 가져올 때 `type` 키워드를 명시하게 해 런타임 import 오류를 막습니다. |

## strict 모드

simplix-react에서 타입을 정확히 추론하려면 `"strict": true`가 필요합니다. strict 모드가 켜는 개별 플래그는 다음과 같습니다.

- `strictNullChecks`: null을 허용하지 않는 타입에 `null`이나 `undefined`를 대입하지 못하게 합니다
- `strictFunctionTypes`: 함수 매개변수 타입을 정확히 검사합니다
- `strictBindCallApply`: `bind`, `call`, `apply`의 타입을 검사합니다
- `noImplicitAny`: 암시적 `any` 타입을 금지합니다
- `noImplicitThis`: 암시적 `any` 타입인 `this`를 금지합니다
- `strictPropertyInitialization`: 클래스 속성을 초기화하도록 요구합니다
- `useUnknownInCatchVariables`: `catch` 변수를 `unknown` 타입으로 지정합니다
- `alwaysStrict`: `"use strict"`를 출력하고 strict 모드로 해석합니다

strict 모드를 끄면 Zod의 `z.infer<>`가 지나치게 넓은 타입을 만들 수 있습니다(예: `string`이어야 할 곳에 `string | undefined`). 그러면 잘못된 오류가 보고되거나 실제 오류를 놓칩니다.

## 경로 별칭

규모가 큰 프로젝트에서는 경로 별칭으로 import 경로를 짧게 만들 수 있습니다. `tsconfig.json`에 설정하세요.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

그러면 코드 전체에서 짧은 경로로 가져올 수 있습니다.

```ts
// Without aliases
import { projectApi } from "../../../contracts/project";

// With aliases
import { projectApi } from "@/contracts/project";
```

※ **번들러 설정 필요:** `tsconfig.json`의 경로 별칭은 TypeScript 타입 검사기에만 적용됩니다. 번들러에도 같은 별칭을 설정하세요.

**Vite** (`vite.config.ts`):

```ts
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

## Zod 타입 추론

simplix-react는 `z.infer<>`로 Zod 스키마에서 TypeScript 타입을 바로 얻습니다. 계약의 스키마에서 타입을 추론하므로 타입 정의를 따로 작성할 필요가 없습니다.

### 스키마에서 타입 추출

```ts
import { z } from "zod";

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

// Derive the TypeScript type from the schema
type Task = z.infer<typeof taskSchema>;
// Result: { id: string; title: string; status: string; createdAt: string }
```

### 파이프라인을 따라 전달되는 타입

계약을 정의하면 타입이 파생한 계층으로 그대로 전달됩니다.

```ts
import { z } from "zod";
import { defineApi, simpleQueryBuilder } from "@simplix-react/contract";
import { deriveEntityHooks } from "@simplix-react/react";

const projectApi = defineApi({
  domain: "project",
  basePath: "/api/v1",
  entities: {
    task: {
      schema: z.object({ id: z.string(), title: z.string() }),
      operations: {
        list: { method: "GET", path: "/tasks" },
        get: { method: "GET", path: "/tasks/:id" },
        create: { method: "POST", path: "/tasks", input: z.object({ title: z.string() }) },
        update: { method: "PATCH", path: "/tasks/:id", input: z.object({ title: z.string().optional() }) },
      },
    },
  },
  queryBuilder: simpleQueryBuilder,
});

const hooks = deriveEntityHooks(projectApi);

// All fully typed, no manual annotations needed:
// hooks.task.useList()    → UseQueryResult<{ id: string; title: string }[]>
// hooks.task.useGet(id)   → UseQueryResult<{ id: string; title: string }>
// hooks.task.useCreate()  → UseMutationResult<..., { title: string }>
// hooks.task.useUpdate()  → UseMutationResult<..., { id: EntityId; dto: { title?: string } }>
```

### 추론한 타입 활용

컴포넌트와 유틸리티에서 쓸 수 있게 추론한 타입을 계약과 함께 내보내세요.

```ts
// src/contracts/project.ts
import { z } from "zod";
import { defineApi, simpleQueryBuilder } from "@simplix-react/contract";

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
});

const taskCreateSchema = z.object({
  title: z.string(),
  status: z.string(),
});

const taskUpdateSchema = z.object({
  title: z.string().optional(),
  status: z.string().optional(),
});

export const projectApi = defineApi({
  domain: "project",
  basePath: "/api/v1",
  entities: {
    task: {
      schema: taskSchema,
      operations: {
        list: { method: "GET", path: "/tasks" },
        get: { method: "GET", path: "/tasks/:id" },
        create: { method: "POST", path: "/tasks", input: taskCreateSchema },
        update: { method: "PATCH", path: "/tasks/:id", input: taskUpdateSchema },
        delete: { method: "DELETE", path: "/tasks/:id" },
      },
    },
  },
  queryBuilder: simpleQueryBuilder,
});

// Export inferred types for use in components
export type Task = z.infer<typeof taskSchema>;
export type TaskCreate = z.infer<typeof taskCreateSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;
```

컴포넌트에서는 다음과 같이 씁니다.

```tsx
import type { Task } from "@/contracts/project";

function TaskCard({ task }: { task: Task }) {
  return (
    <div>
      <h3>{task.title}</h3>
      <span>{task.status}</span>
    </div>
  );
}
```

## IDE 설정 팁

### VS Code

다음 확장 프로그램을 설치하세요.

- **TypeScript and JavaScript Language Features**: 기본 제공 확장이며, 켜져 있는지 확인하세요
- **Zod Intellisense**: Zod 스키마 메서드를 자동 완성합니다
- **ESLint**: 프로젝트의 린트 규칙과 연동합니다

권장 작업 공간 설정(`.vscode/settings.json`):

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### import 정리

권장 tsconfig에 들어 있는 `verbatimModuleSyntax`로 타입 전용 import를 명시하게 하세요.

```ts
// Correct: type imports are explicit
import type { Task } from "@/contracts/project";
import { projectApi } from "@/contracts/project";

// Error with verbatimModuleSyntax: type should use 'import type'
import { Task, projectApi } from "@/contracts/project";
```

이렇게 하면 타입이 런타임 번들에 들어가지 않고, 값 import와 타입 import가 명확히 구분됩니다.

## 다음 단계

- [개요](/ko/getting-started/overview.md): 프레임워크 구조를 이해합니다
- [빠른 시작](/ko/getting-started/quick-start.md): simplix-react로 첫 기능을 만듭니다

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/ko/getting-started/typescript.md" target="_blank" rel="noopener noreferrer">GitHub에서 편집</a></p>
