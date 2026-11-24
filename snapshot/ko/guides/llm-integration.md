# LLM 코딩 에이전트 연동

[English](/en/guides/llm-integration.md) | **한국어**

> LLM 코딩 에이전트가 simplix-react를 정확히 이해하고 코드를 생성하도록 맥락을 제공하는 방법입니다.

## 시작하기 전에

- simplix-react 프로젝트를 구성해 두어야 합니다.
- 사용할 LLM 코딩 에이전트를 설치해 두어야 합니다.

## 제공 자료

simplix-react는 LLM 에이전트용 자료를 여러 형태로 제공합니다. 에이전트의 기능에 맞는 자료를 고르세요.

| 자료 | URL | 설명 |
| --- | --- | --- |
| llms.txt | `https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt` | 링크를 모은 문서 색인 |
| Claude Code 스킬 | `https://github.com/simplix-framework/simplix-react/tree/main/skills/simplix-react` | 스킬 폴더: `SKILL.md`와 `references/` |
| 스킬 매니페스트 | `https://raw.githubusercontent.com/simplix-framework/simplix-react/main/skills/simplix-react.skill` | 스킬의 이름, 버전, 진입 파일, 참조 파일 |
| README | `https://raw.githubusercontent.com/simplix-framework/simplix-react/main/README.md` | 프로젝트 개요 |

## 에이전트별 설정

### Claude Code

가장 깊이 연동됩니다. 스킬 폴더 `skills/simplix-react/`를 프로젝트의 `.claude/skills/`에 복사하세요. 모든 프로젝트에서 쓰려면 `~/.claude/skills/`에 복사합니다. 작업이 스킬 설명과 맞으면 Claude Code가 스킬을 불러오고, `/simplix-react` 명령으로 직접 불러올 수도 있습니다.

```bash
git clone --depth 1 https://github.com/simplix-framework/simplix-react.git simplix-react-src
mkdir -p .claude/skills
cp -R simplix-react-src/skills/simplix-react .claude/skills/
rm -rf simplix-react-src
```

CLAUDE.md에 참조를 직접 추가해도 됩니다.

```markdown
## simplix-react

This project uses simplix-react for API-first development.
Reference: https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

### OpenAI Codex

Codex는 저장소 루트의 `AGENTS.md`를 읽습니다. 이 파일에 프레임워크 맥락을 추가하세요.

```markdown
## Framework: simplix-react

This project uses simplix-react, a contract-driven React framework.
See: https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

### Cursor

프로젝트 루트의 `.cursor/rules` 파일에 맥락을 추가하세요.

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

프로젝트 루트에 `.windsurfrules` 파일을 만드세요.

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

프로젝트에 `.github/copilot-instructions.md` 파일을 만드세요.

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

### Google Gemini(AI Studio · Code Assist)

AI Studio에는 llms.txt를 맥락 파일로 올리고, Code Assist에는 시스템 프롬프트에 포함하세요.

1. `https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt`에서 내용을 내려받습니다.
2. AI Studio: 「Upload file」 또는 「Add context」로 추가합니다.
3. Code Assist: 프로젝트 설정에 참조 문서로 등록합니다.

### Cline

프로젝트 루트에 `.clinerules` 파일을 만드세요.

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

`opencode.json` 설정 파일에 맥락을 추가하세요.

```json
{
  "context": {
    "simplix-react": "https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt"
  }
}
```

### Aider

`.aider.conf.yml`에 문서를 읽기 전용 파일로 등록하세요.

```yaml
read:
  - docs/llms.txt
```

프로젝트에 llms.txt가 없으면 먼저 내려받으세요.

```bash
curl -o docs/llms.txt https://raw.githubusercontent.com/simplix-framework/simplix-react/main/docs/llms.txt
```

## 공통 맥락 스니펫

어떤 LLM 에이전트에도 쓸 수 있는 공통 맥락 블록입니다. 에이전트의 설정 파일이나 시스템 프롬프트에 복사해 넣으세요.

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

## 에이전트 이해도 확인

아래 프롬프트로 에이전트가 simplix-react 맥락을 제대로 이해했는지 확인하세요. 프롬프트마다 에이전트가 올바른 패턴을 사용하는지 봅니다.

### 1. 계약 정의

**프롬프트:** "Define an API contract for a `user` entity with email and role fields"

**기대 결과:**

- Zod 스키마와 함께 `defineApi`를 호출합니다.
- `EntityDefinition` 패턴을 따릅니다.
- `simpleQueryBuilder`를 포함합니다.

### 2. 사용자 정의 오퍼레이션

**프롬프트:** "Add a custom operation to assign a role to a user"

**기대 결과:**

- `OperationDefinition`을 사용합니다.
- 경로 매개변수(`:userId`)와 `invalidates` 콜백을 포함합니다.

### 3. 목 백엔드 구성

**프롬프트:** "Set up a mock backend for the user contract"

**기대 결과:**

- `deriveMockHandlers`와 `setupMockWorker`를 사용합니다.
- `setupMockWorker`에 시드 데이터 설정을 포함합니다.

### 4. 무한 스크롤 컴포넌트

**프롬프트:** "Create a component that lists users with infinite scrolling"

**기대 결과:**

- `deriveEntityHooks`로 얻은 `useInfiniteList` 훅을 사용합니다.
- 프로바이더를 올바르게 구성합니다.

## 관련 문서

- [빠른 시작](/ko/getting-started/quick-start.md): 5분 만에 기능 하나 만들기
- [API 계약](/ko/core-concepts/api-contracts.md): 계약(contract) 설계 자세히 보기
- [목을 사용한 테스트](/ko/guides/testing-with-mocks.md): 목 계층으로 테스트 환경 구성

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/ko/guides/llm-integration.md" target="_blank" rel="noopener noreferrer">원본 보기</a></p>
