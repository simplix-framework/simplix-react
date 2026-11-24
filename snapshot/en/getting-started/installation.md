# Installation

**English** | [한국어](/ko/getting-started/installation.md)

## Prerequisites

Before installing simplix-react, ensure you have the following:

| Requirement | Version | Check Command |
| --- | --- | --- |
| Node.js | >= 20.0.0 | `node --version` |
| pnpm | 10 (the version this repository uses) | `pnpm --version` |

If you do not have pnpm installed:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Installing Packages

### All-in-One (Recommended)

Install the meta package to get the `@simplix-react/*` packages in a single dependency:

```bash
pnpm add simplix-react
```

It depends on these packages: access, api, auth, calendar, cli, contract, form, gantt, gantt-core, i18n, mock, process, process-core, react, testing, ui. Import directly from individual packages:

```ts
import { defineApi } from "@simplix-react/contract";
import { deriveEntityHooks } from "@simplix-react/react";
```

#### pnpm Hoist Configuration

pnpm uses strict dependency resolution: transitive dependencies are not accessible by default. When using the `simplix-react` meta package, configure `.npmrc` to hoist `@simplix-react/*` packages:

```text
# .npmrc
public-hoist-pattern[]=@simplix-react/*
```

This allows your code to import from `@simplix-react/contract`, `@simplix-react/react`, and the others even though only `simplix-react` is declared in `package.json`.

> **Note:** Projects created with `simplix init` include this `.npmrc`.

### Selective Installation

Alternatively, install only the packages you need:

#### Core Packages

The contract and React hooks packages are the foundation of every simplix-react project:

```bash
pnpm add @simplix-react/contract @simplix-react/react
```

### Mock Data Layer (Optional)

For frontend-first development with an in-browser mock backend:

```bash
pnpm add -D @simplix-react/mock
```

### Internationalization (Optional)

For multi-language support:

```bash
pnpm add @simplix-react/i18n
```

### Testing Utilities (Optional)

For testing simplix-react applications:

```bash
pnpm add -D @simplix-react/testing
```

### CLI (Optional)

For project scaffolding and validation:

```bash
pnpm add -D @simplix-react/cli
```

## Peer Dependencies

Each package requires specific peer dependencies. Install them alongside the simplix-react packages.

### @simplix-react/contract

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `zod` | >= 4.0.0 | Yes |

```bash
pnpm add zod
```

### @simplix-react/react

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `@simplix-react/contract` | (any `@simplix-react` package) | Yes |
| `@tanstack/react-query` | >= 5.0.0 | Yes |
| `@tanstack/react-query-persist-client` | >= 5.0.0 | Yes |
| `@tanstack/query-sync-storage-persister` | >= 5.0.0 | Yes |
| `react` | >= 18.0.0 | Yes |
| `zod` | >= 4.0.0 | Yes |

```bash
pnpm add @tanstack/react-query @tanstack/react-query-persist-client \
  @tanstack/query-sync-storage-persister react zod
```

### @simplix-react/form

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `@simplix-react/api` | (any `@simplix-react` package) | Yes |
| `@simplix-react/contract` | (any `@simplix-react` package) | Yes |
| `@simplix-react/react` | (any `@simplix-react` package) | Yes |
| `@tanstack/react-form` | >= 1.0.0 | Yes |
| `@tanstack/react-query` | >= 5.0.0 | Yes |
| `react` | >= 18.0.0 | Yes |
| `zod` | >= 4.0.0 | Yes |

```bash
pnpm add @simplix-react/api @tanstack/react-form
```

### @simplix-react/auth

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `@simplix-react/contract` | (any `@simplix-react` package) | Yes |
| `react` | >= 18.0.0 | Optional |

`react` is needed only for the React bindings.

### @simplix-react/access

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `@casl/ability` | >= 6.0.0 | Yes |
| `@simplix-react/auth` | (any `@simplix-react` package) | Optional |
| `react` | >= 18.0.0 | Optional |

```bash
pnpm add @casl/ability
```

### @simplix-react/mock

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `@simplix-react/contract` | (any `@simplix-react` package) | Yes |
| `msw` | >= 2.0.0 | Optional |
| `vite` | >= 5.0.0 | Optional |
| `zod` | >= 4.0.0 | Yes |

```bash
pnpm add -D msw
```

### @simplix-react/i18n

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `i18next` | >= 25.0.0 | Optional |
| `react` | >= 18.0.0 | Optional |
| `react-i18next` | >= 16.0.0 | Optional |

```bash
pnpm add i18next react-i18next
```

### @simplix-react/ui

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `@simplix-react/api` | (any `@simplix-react` package) | Yes |
| `@simplix-react/form` | (any `@simplix-react` package) | Yes |
| `@simplix-react/i18n` | (any `@simplix-react` package) | Yes |
| `@simplix-react/react` | (any `@simplix-react` package) | Yes |
| `@tanstack/react-query` | >= 5.0.0 | Yes |
| `react` | >= 18.0.0 | Yes |
| `react-router-dom` | >= 6.0.0 | Optional |

Install `react-router-dom` when you use the router integration.

### @simplix-react/testing

| Peer Dependency | Version | Required |
| --- | --- | --- |
| `@simplix-react/access` | (any `@simplix-react` package) | Optional |
| `@simplix-react/contract` | (any `@simplix-react` package) | Yes |
| `@tanstack/react-query` | >= 5.0.0 | Yes |
| `react` | >= 18.0.0 | Yes |

No additional peer dependencies beyond what `@simplix-react/react` already requires.

## All-In-One Installation

To install the core, i18n, mock, testing and CLI packages with their peers at once:

```bash
# Runtime dependencies
pnpm add @simplix-react/contract @simplix-react/react @simplix-react/i18n \
  zod @tanstack/react-query @tanstack/react-query-persist-client \
  @tanstack/query-sync-storage-persister react

# Dev dependencies
pnpm add -D @simplix-react/mock @simplix-react/testing @simplix-react/cli \
  msw
```

## Using the CLI for Scaffolding

The CLI scaffolds a new project. The `simplix` command takes the project name:

```bash
npx -p @simplix-react/cli simplix init my-app
```

It creates the project directory with its configuration files. `--yes` accepts every default, and `--no-demo`, `--no-i18n`, `--no-auth` and `--no-access` leave those parts out.

## Verify Installation

After installation, verify everything is working by running a type check:

```bash
npx tsc --noEmit
```

If there are no errors, you are ready to define your first contract.

## Next Steps

- [Quick Start](/en/getting-started/quick-start.md): build your first contract-driven feature
- [TypeScript Setup](/en/getting-started/typescript.md): configure TypeScript for type inference

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/en/getting-started/installation.md" target="_blank" rel="noopener noreferrer">View source</a></p>
