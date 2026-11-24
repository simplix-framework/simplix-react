# Contributing to simplix-react

**English** | [한국어](/ko/CONTRIBUTING.md)

Thank you for your interest in contributing to simplix-react. This guide covers the development workflow, coding standards, and submission process.

## Prerequisites

- **Node.js** 20 or later
- **pnpm** 10 (the repository pins `pnpm@10.12.4` in `packageManager`)
- **TypeScript** 5.9+

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/simplix-framework/simplix-react.git
cd simplix-react
pnpm install
```

### 2. Build all packages

```bash
pnpm build
```

### 3. Run checks

```bash
pnpm typecheck   # TypeScript type checking
pnpm lint        # oxlint
pnpm test        # Vitest across the workspace, with coverage
```

The `@simplix-react/gantt` end-to-end tests drive the chart in the Google Chrome installed on the machine, against a running Storybook: build the package with `pnpm --filter @simplix-react/gantt build` (Storybook takes its stylesheet from the build), start Storybook with `pnpm storybook`, then run `pnpm --filter @simplix-react/gantt test:e2e`. They are not part of `pnpm test`.

The `@simplix-react/process` end-to-end tests measure the lanes the same way, against the same Storybook: `PROCESS_STORYBOOK_URL` names it when it is not on `http://localhost:6006`, and `node packages/process/e2e/planted-defects.mjs` proves the layout checks by breaking one thing at a time.

The `@simplix-react/gantt-core` tests compare the scheduler with plans saved by Microsoft Project. Their first run fetches those sample files from the MPXJ repository at a pinned commit into `packages/gantt-core/.oracle/` (ignored by git), so it needs network access once.

## Project Structure

```text
simplix-react/
├── packages/
│   ├── contract/          # @simplix-react/contract: Zod-based API contracts
│   ├── react/             # @simplix-react/react: React Query hooks
│   ├── form/              # @simplix-react/form: TanStack Form hooks
│   ├── auth/              # @simplix-react/auth: authentication middleware
│   ├── access/            # @simplix-react/access: CASL authorization
│   ├── ui/                # @simplix-react/ui: CRUD UI components
│   ├── headless/          # @simplix-react/headless: platform-neutral UI logic
│   ├── api/               # @simplix-react/api: Orval mutator singleton
│   ├── mock/              # @simplix-react/mock: MSW handlers + stores
│   ├── i18n/              # @simplix-react/i18n: internationalization
│   ├── calendar/          # @simplix-react/calendar: calendar components
│   ├── gantt-core/        # @simplix-react/gantt-core: scheduling engine
│   ├── gantt/             # @simplix-react/gantt: Gantt chart
│   ├── process-core/      # @simplix-react/process-core: procedure model
│   ├── process/           # @simplix-react/process: procedure lanes
│   ├── cli/               # @simplix-react/cli: scaffolding CLI
│   ├── testing/           # @simplix-react/testing: test utilities
│   ├── simplix-react/     # simplix-react: meta package
│   ├── simplix-react-ext/ # simplix-react-ext: extension meta package
│   └── config-typescript/ # shared TypeScript config
├── extensions/
│   ├── simplix-boot/      # Spring Boot extension
│   │   └── packages/
│   │       ├── auth/        # @simplix-react-ext/simplix-boot-auth
│   │       ├── access/      # @simplix-react-ext/simplix-boot-access
│   │       ├── stream/      # @simplix-react-ext/simplix-boot-stream
│   │       ├── cli-plugin/  # @simplix-react-ext/simplix-boot-cli-plugin
│   │       └── utils/       # @simplix-react-ext/simplix-boot-utils
│   └── native/            # React Native (Expo) extension
├── apps/                  # storybook, icon-explorer
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Development Workflow

### Running a single package

Use a Turborepo filter for builds and a pnpm filter to run one package's tests:

```bash
pnpm build --filter @simplix-react/contract
pnpm --filter @simplix-react/react test
```

### Watch mode

`pnpm dev` only prints a hint. Run the `dev` task of one package, or Storybook with the UI package in watch mode:

```bash
pnpm turbo run dev --filter=@simplix-react/contract
pnpm dev:storybook
```

## Coding Standards

### File naming

Use **kebab-case** for all file names:

```text
define-api.ts       ✔
defineApi.ts        ✖
DefineApi.ts        ✖
```

### TypeScript

- Strict mode is enabled across all packages.
- Use explicit return types for exported functions.
- Prefer `interface` over `type` for object shapes.

### No backward compatibility code

This is a greenfield project. When refactoring:

- Delete old code completely.
- Never add `@deprecated` annotations: remove the code instead.
- No re-export shims or compatibility layers.

### No re-export files

Do not create files whose sole purpose is re-exporting from another location:

```ts
// ✖ FORBIDDEN
export { Foo, Bar } from "../source";

// ✔ Import directly from the source
import { Foo, Bar } from "../source";
```

**Exception:** `index.ts` files that consolidate exports from within the same directory are allowed.

### Shared patterns

If the same pattern appears in 2 or more files, extract it into a shared location and refactor all usages.

## Documentation

The reader's documentation is written in English and in Korean, and a document is changed in both languages in one change.

- Guides live in `docs/en/` and `docs/ko/` with the same file names. A README is English, with the Korean `README.ko.md` beside it.
- The documents of a pair have the same headings, the same code blocks, and the same link targets apart from the language.
- A diagram is an SVG figure drawn once per language by a module under `docs/figures/`. See the [figure guide](https://github.com/simplix-framework/simplix-react/blob/main/docs/figures/README.md), and never edit an SVG by hand.
- `docs/api/` is generated by `pnpm docs:api`.

Check the documents before you commit:

```bash
node scripts/check-docs.mjs all
```

The command checks that every relative link resolves, that the pairs agree, and that the names a code example imports exist in the packages.

### Documentation site

The documents are published as a Docsify site on GitHub Pages, with one folder for each version.

- `docs/site.json` names the site and lists the documents outside `docs/` that become pages. `docs/index.html`, `docs/_coverpage.md` and `docs/_navbar.md` are the frame of the site.
- `docs/en/_sidebar.md` and `docs/ko/_sidebar.md` are the sidebars. Add a new page to both, at the same position.
- A link stays relative, as GitHub reads it. The build rewrites each link to the place its target takes in the site, and fails on a link that leads nowhere.

```bash
node scripts/build-docs.mjs                      # assemble the site under build-docs/
node scripts/preview-docs.mjs --release 0.3.11   # serve it as GitHub Pages does, with a second version to switch to
node --test scripts/tests/docs-site.test.mjs     # the checks of the site tooling
```

The `Deploy Documentation` workflow publishes the site to the `gh-pages` branch. A documentation change on `main` refreshes the `snapshot` folder, and a manual run with a released version such as `0.3.12` builds the tag `v0.3.12` into a folder of that name. The root of the site opens the highest released version, or the snapshot when there is none.

## Submitting Changes

### 1. Create a branch

```bash
git checkout -b feat/your-feature-name
```

### 2. Make your changes

Follow the coding standards above. After any code modification, verify:

```bash
pnpm typecheck    # Fix ALL type errors
pnpm lint         # Fix ALL errors and warnings
pnpm build        # Verify build succeeds for affected packages
pnpm test         # Ensure tests pass
```

### 3. Commit

Write clear, concise commit messages in the conventional commit format:

```text
feat(contract): add filter schema support for entities
fix(react): resolve stale query key in useList
```

### 4. Open a pull request

- Provide a summary of changes and the motivation behind them.
- Reference any related issues.
- Ensure all CI checks pass.

## Reporting Issues

When filing an issue, include:

- A clear description of the problem or feature request.
- Steps to reproduce (for bugs).
- Expected vs. actual behavior.
- Package name and version affected.

## Code of Conduct

Be respectful, constructive, and inclusive. We are committed to providing a welcoming environment for everyone.

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">View source</a></p>
