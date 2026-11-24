# TypeScript Setup

**English** | [한국어](/ko/getting-started/typescript.md)

simplix-react is built with TypeScript and leverages Zod's type inference to provide end-to-end type safety. This guide covers the recommended configuration for optimal developer experience.

## Recommended tsconfig.json

The following configuration is recommended for projects using simplix-react:

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

### Key Settings Explained

| Setting | Value | Why |
| --- | --- | --- |
| `target` | `ES2022` | Enables modern features like `structuredClone`, top-level `await`, and `Array.at()`. |
| `module` | `ESNext` | Required for ESM-only packages used by simplix-react. |
| `moduleResolution` | `bundler` | Matches how bundlers (Vite, webpack, esbuild) resolve modules. Supports `exports` field in package.json. |
| `strict` | `true` | Enables all strict type-checking options. Required for accurate Zod type inference. |
| `isolatedModules` | `true` | Ensures compatibility with single-file transpilers (esbuild, SWC). |
| `verbatimModuleSyntax` | `true` | Enforces explicit `type` keyword on type-only imports, preventing runtime import errors. |

## Strict Mode

simplix-react requires `"strict": true` for accurate type inference. The individual flags enabled by strict mode are:

- `strictNullChecks`: prevents `null`/`undefined` from being assigned to non-nullable types
- `strictFunctionTypes`: enforces correct function parameter types
- `strictBindCallApply`: type-checks `bind`, `call`, and `apply`
- `noImplicitAny`: disallows implicit `any` types
- `noImplicitThis`: disallows `this` with an implicit `any` type
- `strictPropertyInitialization`: requires class properties to be initialized
- `useUnknownInCatchVariables`: types `catch` variables as `unknown`
- `alwaysStrict`: emits `"use strict"` and parses in strict mode

Without strict mode, Zod's `z.infer<>` may produce overly wide types (e.g., `string | undefined` where `string` is expected), leading to false positives and missed errors.

## Path Aliases

Path aliases simplify imports in larger projects. Configure them in `tsconfig.json`:

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

Then use clean imports throughout your code:

```ts
// Without aliases
import { projectApi } from "../../../contracts/project";

// With aliases
import { projectApi } from "@/contracts/project";
```

※ **Bundler configuration required:** path aliases in `tsconfig.json` only affect TypeScript's type checker. Your bundler must also resolve them:

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

## Type Inference with Zod

simplix-react uses `z.infer<>` to derive TypeScript types directly from Zod schemas. You never need to write separate type definitions: the contract schemas are the types.

### Extracting Types from Schemas

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

### Types Flow Through the Pipeline

When you define a contract, the types propagate automatically:

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

### Working with Inferred Types

Export inferred types alongside your contract for use in components and utilities:

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

Then use them in your components:

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

## IDE Setup Tips

### VS Code

Install the following extensions for the best experience:

- **TypeScript and JavaScript Language Features**: built in; ensure it is enabled
- **Zod Intellisense**: provides autocomplete for Zod schema methods
- **ESLint**: integrates with the project's lint rules

Recommended workspace settings (`.vscode/settings.json`):

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

### Import Organization

Use `verbatimModuleSyntax` (already included in the recommended tsconfig) to enforce explicit type-only imports:

```ts
// Correct: type imports are explicit
import type { Task } from "@/contracts/project";
import { projectApi } from "@/contracts/project";

// Error with verbatimModuleSyntax: type should use 'import type'
import { Task, projectApi } from "@/contracts/project";
```

This prevents types from being included in the runtime bundle and makes the distinction between value and type imports clear.

## Next Steps

- [Overview](/en/getting-started/overview.md): understand the framework architecture
- [Quick Start](/en/getting-started/quick-start.md): build your first feature with simplix-react

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/en/getting-started/typescript.md" target="_blank" rel="noopener noreferrer">Edit on GitHub</a></p>
