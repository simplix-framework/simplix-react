# Core Concepts

**English** | [한국어](/ko/core-concepts/README.md)

Architectural explanations of how simplix-react works internally. These documents describe the design decisions, data flow, and structural patterns behind each major subsystem. Read these to understand _why_ things work the way they do.

## Contents

| Document | Description |
| --- | --- |
| [API Contracts](/en/core-concepts/api-contracts.md) | How `defineApi()` assembles EntityDefinitions and OperationDefinitions into a single source of truth, operation roles, `customizeApi()`, and how contracts drive the entire derivation pipeline |
| [Schema Derivation](/en/core-concepts/schema-derivation.md) | The derivation pipeline from one contract to the client, query keys, React Query hooks, form hooks, and MSW mock handlers, and how Zod schemas keep every stage type-safe |
| [Authentication](/en/core-concepts/authentication.md) | Strategy-based auth middleware architecture: how `AuthScheme` implementations (Bearer, API Key, OAuth2, Custom) produce authenticated `fetchFn` wrappers with automatic 401 retry and single-flight token refresh |
| [Authorization](/en/core-concepts/authorization.md) | CASL-powered access control: how `AccessPolicy` wraps CASL abilities, the adapter pattern for extracting rules from JWT tokens or API endpoints, role normalization, and the React integration layer |
| [Cache Invalidation](/en/core-concepts/cache-invalidation.md) | Automatic query cache invalidation strategy: hierarchical query key structure (`[domain, entity, scope, params]`), how mutations invalidate related queries, and the conservative broad-invalidation tradeoff |
| [Extensions](/en/core-concepts/extensions.md) | Extension system architecture: provider pattern for environment-specific implementations, naming conventions (`@simplix-react-ext/`), how extensions implement core abstract interfaces for specific backends like Spring Boot |
| [Form Derivation](/en/core-concepts/form-derivation.md) | How `deriveEntityFormHooks()` derives TanStack Form hooks from contracts and React Query hooks, including automatic dirty-field tracking, server error mapping, and the derivation chain from Zod to form bindings |
| [Internationalization](/en/core-concepts/internationalization.md) | Adapter-based i18n architecture: the `II18nAdapter` interface, domain vs. application translation ownership, namespace scoping for collision prevention, lazy-loaded module translations, and `Intl` API formatting |
| [Mock Data Layer](/en/core-concepts/mock-data-layer.md) | MSW + in-memory Map store architecture: how `deriveMockHandlers()` derives handlers with real CRUD operations, filtering, sorting, pagination, and relation loading, all backed by JavaScript `Map` instances |
| [UI Components](/en/core-concepts/ui-components.md) | The layered component architecture (primitives → base → layout → CRUD), compound component patterns with explicit `value`/`onChange` props, and how `CrudList`, `CrudForm`, `CrudDetail`, and `CrudTree` compose from lower layers |

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/en/core-concepts/README.md" target="_blank" rel="noopener noreferrer">Edit on GitHub</a></p>
