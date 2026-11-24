# Guides

**English** | [한국어](/ko/guides/README.md)

Practical how-to guides for accomplishing specific tasks with simplix-react. Each guide focuses on a single goal, provides step-by-step instructions, and includes working code examples.

## Contents

### Contract & Entity Definition

| Document | Description |
| --- | --- |
| [Defining Entities](/en/guides/defining-entities.md) | Define type-safe CRUD entities as a Zod schema and a map of operations (`{ method, path, input? }`), register them in a contract via `defineApi()`, and use the derived client and query keys |
| [Custom Operations](/en/guides/custom-operations.md) | Add non-CRUD endpoints (batch actions, RPC calls, file uploads) inside an entity or as a top-level `OperationDefinition`, with path parameters, input/output schemas, multipart and blob handling, and cache invalidation |
| [Parent-Child](/en/guides/parent-child.md) | Configure nested entity hierarchies so child resources are listed and created under parent URL paths (e.g., `/projects/:projectId/tasks`) with parent-scoped list query keys |

### React Integration

| Document | Description |
| --- | --- |
| [React Hooks Reference](/en/guides/react-hooks-reference.md) | Derive and use type-safe React Query hooks (`useList`, `useGet`, `useCreate`, `useUpdate`, `useDelete`, `useInfiniteList`) with automatic cache invalidation, optimistic updates, and query key factories |
| [Form Hooks](/en/guides/form-hooks.md) | Derive TanStack Form hooks from contracts via `deriveEntityFormHooks()`, build create/update forms with automatic dirty-field tracking, default value handling, and server validation error mapping |
| [UI Components](/en/guides/ui-components.md) | Build CRUD interfaces using `CrudList`, `CrudForm`, `CrudDetail`, and `CrudTree` compound components with explicit field configuration, custom column rendering, and composable layout patterns |
| [Designs](/en/guides/designs.md) | Choose the design every component is drawn in (`classic`, `clarity`) on the root `UIProvider`, mark what a component draws with slot and part declarations, and add a design from a spec of class replacements and per-slot overrides |
| [Consumer Styling Setup](/en/guides/consumer-styling-setup.md) | Reference for what a project that depends on `@simplix-react/ui` must define: Tailwind wiring, `@source` globs, the stylesheet import and design tokens |
| [Consumer Design Customization](/en/guides/consumer-design-customization.md) | Customize how `@simplix-react/ui` components look in your project after the styling setup is in place |

### HTTP & Auth

| Document | Description |
| --- | --- |
| [Custom Fetch](/en/guides/custom-fetch.md) | Customize the HTTP layer for headers, interceptors, logging, and error transformation with `createFetch`, `configureDefaultFetch`, a wrapper around `defaultFetch`, or a fully custom `FetchFn` implementation |
| [Authentication](/en/guides/authentication.md) | Set up authenticated API requests using Bearer tokens, API keys, or OAuth2 via `@simplix-react/auth` with automatic token refresh, 401 retry, and `AuthProvider` React integration |
| [Authorization](/en/guides/authorization.md) | Implement role-based access control using `@simplix-react/access` with CASL rules, JWT/API/static adapters, `AccessProvider` context, and `useCan()` hook for conditional UI rendering |

### i18n & Testing

| Document | Description |
| --- | --- |
| [Internationalization](/en/guides/internationalization.md) | Add multi-language support with `@simplix-react/i18n`: configure `createI18nConfig`, organize translation files by namespace/locale, register domain translations, and use `useTranslation` hooks |
| [Testing with Mocks](/en/guides/testing-with-mocks.md) | Configure Vitest and React Testing Library with `@simplix-react/testing` helpers: `createMockClient` for deterministic data, `createTestWrapper` for provider setup, and mock access control testing |
| [Mock Handlers](/en/guides/mock-handlers.md) | Set up and customize MSW mock handlers derived from contracts: seed data, override individual handlers, and configure relation loading behavior |

### Tooling & Extensions

| Document | Description |
| --- | --- |
| [CLI Usage](/en/guides/cli-usage.md) | Use the `simplix` CLI to scaffold projects (`init`), add domains and modules (`add-domain`, `add-module`), import OpenAPI specs (`openapi`), validate project structure (`validate`), and generate i18n types |
| [Extensions](/en/guides/extensions.md) | Set up Spring Boot authentication, authorization, and CLI code generation using `@simplix-react-ext/simplix-boot-*` extension packages with Boot-specific adapters and naming conventions |
| [LLM Integration](/en/guides/llm-integration.md) | Provide context for LLM coding agents (Claude Code, Cursor, Copilot) using `llms.txt`, Claude Code skills, and CLAUDE.md references so agents can accurately generate simplix-react code |

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/en/guides/README.md" target="_blank" rel="noopener noreferrer">Edit on GitHub</a></p>
