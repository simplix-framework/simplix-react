# simplix-react Documentation

**English** | [한국어](../ko/README.md)

## Guides by Section

### Getting Started

- [Getting Started](./getting-started/README.md): Section index
- [Overview](./getting-started/overview.md): What simplix-react is and how one contract derives every layer
- [Installation](./getting-started/installation.md): Prerequisites, packages and peer dependencies
- [Quick Start](./getting-started/quick-start.md): Contract, hooks, component and mock backend in one walkthrough
- [TypeScript Setup](./getting-started/typescript.md): Recommended tsconfig and Zod type inference

### Core Concepts

- [Core Concepts](./core-concepts/README.md): Section index
- [API Contracts](./core-concepts/api-contracts.md): Entities, operations and the contract shape
- [Schema Derivation](./core-concepts/schema-derivation.md): How the client, hooks, form hooks and mock handlers derive from one contract
- [Authentication](./core-concepts/authentication.md): Auth architecture and strategy pattern
- [Authorization](./core-concepts/authorization.md): CASL-based RBAC and ABAC access control
- [Form Derivation](./core-concepts/form-derivation.md): Form hooks derived from contracts
- [UI Components](./core-concepts/ui-components.md): CRUD UI component architecture
- [Internationalization](./core-concepts/internationalization.md): i18n framework architecture
- [Extensions](./core-concepts/extensions.md): Extension system for backend-specific adapters
- [Cache Invalidation](./core-concepts/cache-invalidation.md): Automatic query invalidation
- [Mock Data Layer](./core-concepts/mock-data-layer.md): MSW and in-memory store architecture

### Guides

- [Guides](./guides/README.md): Section index
- [Defining Entities](./guides/defining-entities.md): Type-safe CRUD entities with Zod
- [Custom Operations](./guides/custom-operations.md): Operations outside the CRUD roles
- [Parent-Child Relationships](./guides/parent-child.md): Nested entity hierarchies
- [Custom Fetch](./guides/custom-fetch.md): HTTP layer customization
- [React Hooks Reference](./guides/react-hooks-reference.md): Hooks API reference
- [Form Hooks](./guides/form-hooks.md): TanStack Form integration
- [Mock Handlers](./guides/mock-handlers.md): Setting up MSW handlers
- [Testing with Mocks](./guides/testing-with-mocks.md): Vitest and MSW integration
- [Authentication](./guides/authentication.md): Bearer, API Key, OAuth2 and custom auth
- [Authorization](./guides/authorization.md): Setting up CASL-based access control
- [Internationalization](./guides/internationalization.md): Multi-language setup
- [UI Components](./guides/ui-components.md): CRUD list, form, detail and tree components
- [Choose and Add a Design](./guides/designs.md): Picking and adding a UI design
- [Design Customization](./guides/consumer-design-customization.md): Customizing `@simplix-react/ui` components
- [Styling and Token Setup](./guides/consumer-styling-setup.md): Styles and design tokens for `@simplix-react/ui`
- [Extensions](./guides/extensions.md): Creating and using backend extensions
- [CLI Usage](./guides/cli-usage.md): Project scaffolding and validation
- [LLM Integration](./guides/llm-integration.md): Integrating LLM capabilities

### Tutorials

- [Tutorials](./tutorials/README.md): Section index
- [Project App](./tutorials/project-app.md): Build a project management app from scratch
- [Auth Protected App](./tutorials/auth-protected-app.md): Login, logout, token refresh and route guards
- [Full-Stack Mock](./tutorials/full-stack-mock.md): Complete frontend with an in-browser mock layer
- [Petstore OpenAPI](./tutorials/petstore-openapi.md): Generate domain packages from the Swagger Petstore spec

## Package READMEs

- [`@simplix-react/contract`](../../packages/contract/README.md)
- [`@simplix-react/react`](../../packages/react/README.md)
- [`@simplix-react/form`](../../packages/form/README.md)
- [`@simplix-react/auth`](../../packages/auth/README.md)
- [`@simplix-react/access`](../../packages/access/README.md)
- [`@simplix-react/mock`](../../packages/mock/README.md)
- [`@simplix-react/i18n`](../../packages/i18n/README.md)
- [`@simplix-react/ui`](../../packages/ui/README.md)
- [`@simplix-react/calendar`](../../packages/calendar/README.md)
- [`@simplix-react/api`](../../packages/api/README.md)
- [`@simplix-react/headless`](../../packages/headless/README.md)
- [`@simplix-react/gantt-core`](../../packages/gantt-core/README.md)
- [`@simplix-react/gantt`](../../packages/gantt/README.md)
- [`@simplix-react/process-core`](../../packages/process-core/README.md)
- [`@simplix-react/process`](../../packages/process/README.md)
- [`@simplix-react/testing`](../../packages/testing/README.md)
- [`@simplix-react/cli`](../../packages/cli/README.md)
- [`simplix-react`](../../packages/simplix-react/README.md)
- [`simplix-react-ext`](../../packages/simplix-react-ext/README.md)
- [Extensions](../../extensions/README.md)
- [`simplix-boot`](../../extensions/simplix-boot/README.md)
- [`native`](../../extensions/native/README.md)

## API Reference

- [API Documentation](../api/README.md): TypeDoc-generated API reference
