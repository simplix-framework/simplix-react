# LLM Coding Agent Integration

**English** | [한국어](../../ko/guides/llm-integration.md)

> How to provide context so that LLM coding agents can accurately understand and generate code for simplix-react.

## Before You Begin

- A simplix-react project must be set up
- The LLM coding agent you want to use must be installed

## Available Resources

simplix-react provides several resources for LLM agents. Choose the appropriate resource based on your agent's capabilities.

| Resource | URL | Description |
| --- | --- | --- |
| llms.txt | `https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt` | Navigation index with links |
| Agent skills | `https://github.com/simplix-framework/simplix-skills` | The `simplix` plugin for Claude Code and Codex: handbooks for the frontend, the backend and the browser audit of screens |
| README | `https://raw.githubusercontent.com/simplix-framework/simplix-react/main/README.md` | Project overview |

## Agent-Specific Setup

### Claude Code

Provides the deepest level of integration. Install the `simplix` plugin of the simplix-skills repository. Claude Code loads the `simplix:frontend` handbook when a task matches its description, and the `/simplix:frontend` command loads it on demand.

```bash
git clone https://github.com/simplix-framework/simplix-skills.git
node simplix-skills/tools/install.mjs claude
```

Alternatively, add a direct reference in CLAUDE.md:

```markdown
## simplix-react

This project uses simplix-react for API-first development.
Reference: https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

### OpenAI Codex

Codex loads the same plugin. With the repository cloned as above, link its skills:

```bash
node simplix-skills/tools/install.mjs codex
```

Codex also reads `AGENTS.md` at the repository root. Add the framework context there:

```markdown
## Framework: simplix-react

This project uses simplix-react, a contract-driven React framework.
See: https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

### Cursor

Add context to the `.cursor/rules` file in the project root:

```markdown
## Framework: simplix-react

This project uses simplix-react, a contract-driven React framework.

Core pipeline:
1. defineApi(): Zod schemas → { config, client, queryKeys }
2. deriveEntityHooks(): contract → React Query hooks
3. deriveMockHandlers(): contract → MSW handlers (backed by in-memory stores)

Key rules:
- Entity ≠ model; derive ≠ generate; contract ≠ schema
- One contract per domain (defineApi per bounded context)
- File naming: kebab-case

@docs https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

### Windsurf

Create a `.windsurfrules` file in the project root:

```markdown
## Framework: simplix-react

This project uses simplix-react, a contract-driven React framework.

Core pipeline:
1. defineApi(): Zod schemas → { config, client, queryKeys }
2. deriveEntityHooks(): contract → React Query hooks
3. deriveMockHandlers(): contract → MSW handlers (backed by in-memory stores)

Key rules:
- Entity ≠ model; derive ≠ generate; contract ≠ schema
- One contract per domain (defineApi per bounded context)
- File naming: kebab-case

Full docs: https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

### GitHub Copilot

Create a `.github/copilot-instructions.md` file in the project:

```markdown
## Framework: simplix-react

This project uses simplix-react, a contract-driven React framework.

Core pipeline:
1. defineApi(): Zod schemas → { config, client, queryKeys }
2. deriveEntityHooks(): contract → React Query hooks
3. deriveMockHandlers(): contract → MSW handlers (backed by in-memory stores)

Key rules:
- Entity ≠ model; derive ≠ generate; contract ≠ schema
- One contract per domain (defineApi per bounded context)
- File naming: kebab-case

Package map:
- @simplix-react/contract: defineApi, EntityDefinition, OperationDefinition
- @simplix-react/react: deriveEntityHooks
- @simplix-react/form: deriveEntityFormHooks
- @simplix-react/mock: deriveMockHandlers, setupMockWorker
- @simplix-react/i18n: createI18nConfig, I18nextAdapter
- @simplix-react/cli: project scaffolding

Full docs: https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

### Google Gemini (AI Studio / Code Assist)

Upload llms.txt as a context file in AI Studio, or include it in the Code Assist system prompt:

1. Download the content from `https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt`
2. AI Studio: Add via "Upload file" or "Add context"
3. Code Assist: Register as a reference document in the project settings

### Cline

Create a `.clinerules` file in the project root:

```markdown
## Framework: simplix-react

This project uses simplix-react, a contract-driven React framework.

Core pipeline:
1. defineApi(): Zod schemas → { config, client, queryKeys }
2. deriveEntityHooks(): contract → React Query hooks
3. deriveMockHandlers(): contract → MSW handlers (backed by in-memory stores)

Key rules:
- Entity ≠ model; derive ≠ generate; contract ≠ schema
- One contract per domain (defineApi per bounded context)
- File naming: kebab-case

Full docs: https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

### OpenCode

Add context in the `opencode.json` configuration file:

```json
{
  "context": {
    "simplix-react": "https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt"
  }
}
```

### Aider

Register the document as a read-only file in `.aider.conf.yml`:

```yaml
read:
  - docs/llms.txt
```

If llms.txt is not included in the project, download it first:

```bash
curl -o docs/llms.txt https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

## Universal Context Snippet

A universal context block that can be used with any LLM agent. Copy and paste it into the agent's configuration file or system prompt.

```markdown
## simplix-react: Package-first React Framework

This project uses simplix-react, a contract-driven React framework.

### Core Pipeline
1. defineApi(): Zod schemas → { config, client, queryKeys }
2. deriveEntityHooks(): contract → React Query hooks (useList, useGet, useCreate, useUpdate, useDelete, useInfiniteList, useTree)
3. deriveMockHandlers(): contract → MSW handlers (backed by in-memory stores)

### Key Rules
- Entity ≠ model; derive ≠ generate; contract ≠ schema
- One contract per domain (defineApi per bounded context)
- File naming: kebab-case
- Always use simpleQueryBuilder unless custom pagination needed

### Package Map
- @simplix-react/contract: defineApi, EntityDefinition, OperationDefinition
- @simplix-react/react: deriveEntityHooks
- @simplix-react/form: deriveEntityFormHooks
- @simplix-react/mock: deriveMockHandlers, setupMockWorker
- @simplix-react/i18n: createI18nConfig, I18nextAdapter
- @simplix-react/testing: test utilities
- @simplix-react/cli: project scaffolding

### Full Docs
https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

## Verifying Agent Understanding

Test prompts to verify that the agent correctly understands simplix-react context. Check that the agent uses the correct patterns for each prompt.

### 1. Contract Definition

**Prompt:** "Define an API contract for a `user` entity with email and role fields"

**Expected result:**

- Should use `defineApi` call with Zod schemas
- Should follow the `EntityDefinition` pattern
- Should include `simpleQueryBuilder`

### 2. Custom Operation

**Prompt:** "Add a custom operation to assign a role to a user"

**Expected result:**

- Should use `OperationDefinition`
- Should include path params (`:userId`) and `invalidates` callback

### 3. Mock Backend Setup

**Prompt:** "Set up a mock backend for the user contract"

**Expected result:**

- Should use `deriveMockHandlers` + `setupMockWorker`
- Should include seed data setup with `setupMockWorker`

### 4. Infinite Scrolling Component

**Prompt:** "Create a component that lists users with infinite scrolling"

**Expected result:**

- Should use `deriveEntityHooks` → `useInfiniteList` hook
- Should have correct Provider setup

## Related

- [Quick Start](../getting-started/quick-start.md): build a feature in 5 minutes
- [API Contracts](../core-concepts/api-contracts.md): deep dive into contract design
- [Testing with Mocks](./testing-with-mocks.md): test setup with the mock layer
