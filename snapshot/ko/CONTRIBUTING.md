# simplix-react에 기여하기

[English](/en/CONTRIBUTING.md) | **한국어**

simplix-react에 관심을 가져 주셔서 감사합니다. 이 문서는 개발 절차, 코딩 표준, 변경 제출 방법을 설명합니다.

## 사전 요구 사항

- **Node.js** 20 이상
- **pnpm** 10(저장소의 `packageManager`가 `pnpm@10.12.4`로 고정)
- **TypeScript** 5.9 이상

## 시작하기

### 1. 저장소 복제와 설치

```bash
git clone https://github.com/simplix-framework/simplix-react.git
cd simplix-react
pnpm install
```

### 2. 전체 패키지 빌드

```bash
pnpm build
```

### 3. 검사 실행

```bash
pnpm typecheck   # TypeScript type checking
pnpm lint        # oxlint
pnpm test        # Vitest across the workspace, with coverage
```

`@simplix-react/gantt`의 종단 간 테스트는 실행 중인 Storybook을 대상으로, 이 컴퓨터에 설치된 Google Chrome에서 차트를 조작합니다. `pnpm --filter @simplix-react/gantt build`로 패키지를 빌드하고(Storybook이 빌드 결과에서 스타일시트를 읽습니다), `pnpm storybook`으로 Storybook을 시작한 다음 `pnpm --filter @simplix-react/gantt test:e2e`를 실행하세요. 이 테스트는 `pnpm test`에 포함되지 않습니다.

`@simplix-react/process`의 종단 간 테스트도 같은 Storybook에서 같은 방식으로 레인을 측정합니다. Storybook이 `http://localhost:6006`이 아니면 `PROCESS_STORYBOOK_URL`에 주소를 지정하세요. `node packages/process/e2e/planted-defects.mjs`는 한 번에 한 곳씩 레이아웃을 일부러 망가뜨려, 레이아웃 검사가 그 결함을 검출하는지 확인합니다.

`@simplix-react/gantt-core`의 테스트는 일정 계산 결과를 Microsoft Project가 저장한 계획과 비교합니다. 처음 실행할 때 고정된 커밋의 MPXJ 저장소에서 예제 파일을 `packages/gantt-core/.oracle/`(git이 무시하는 경로)로 내려받으므로, 한 번은 네트워크 연결이 필요합니다.

## 프로젝트 구조

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

## 개발 절차

### 패키지 하나만 실행

빌드에는 Turborepo 필터를, 패키지 하나의 테스트에는 pnpm 필터를 쓰세요.

```bash
pnpm build --filter @simplix-react/contract
pnpm --filter @simplix-react/react test
```

### 감시 모드

`pnpm dev`는 안내 문구만 출력합니다. 패키지 하나의 `dev` 작업을 실행하거나, UI 패키지를 감시 모드로 둔 채 Storybook을 실행하세요.

```bash
pnpm turbo run dev --filter=@simplix-react/contract
pnpm dev:storybook
```

## 코딩 표준

### 파일 이름

모든 파일 이름은 **kebab-case**로 짓습니다.

```text
define-api.ts       ✔
defineApi.ts        ✖
DefineApi.ts        ✖
```

### TypeScript

- 모든 패키지에서 strict 모드를 켭니다.
- 내보내는 함수에는 반환 타입을 명시합니다.
- 객체 모양에는 `type`보다 `interface`를 씁니다.

### 하위 호환 코드 금지

이 프로젝트는 그린필드 프로젝트입니다. 리팩터링할 때는 다음을 지키세요.

- 이전 코드를 완전히 삭제합니다.
- `@deprecated` 주석을 달지 말고 코드를 삭제합니다.
- 다시 내보내기용 심이나 호환 계층을 두지 않습니다.

### 다시 내보내기 전용 파일 금지

다른 위치의 내용을 다시 내보내기만 하는 파일을 만들지 마세요.

```ts
// ✖ FORBIDDEN
export { Foo, Bar } from "../source";

// ✔ Import directly from the source
import { Foo, Bar } from "../source";
```

**예외:** 같은 디렉터리 안의 내보내기를 모으는 `index.ts`는 허용합니다.

### 공통 패턴

같은 패턴이 파일 2개 이상에 나타나면 공통 위치로 추출하고 모든 사용처를 그쪽으로 바꾸세요.

## 문서

독자용 문서는 영어와 한국어로 작성하며, 문서를 고칠 때는 두 언어를 한 변경에서 함께 고칩니다.

- 가이드는 `docs/en/`과 `docs/ko/`에 같은 파일 이름으로 둡니다. README는 영어로 쓰고, 한국어 `README.ko.md`를 같은 폴더에 둡니다.
- 한 쌍의 문서는 제목 구조와 코드 블록이 같고, 링크 대상도 언어만 다르고 같습니다.
- 다이어그램은 `docs/figures/`의 모듈로 언어마다 한 번씩 그리는 SVG 그림입니다. [그림 안내](https://github.com/simplix-framework/simplix-react/blob/main/docs/figures/README.md)를 참고하고, SVG를 직접 고치지 마세요.
- `docs/api/`는 `pnpm docs:api`로 생성합니다.

커밋하기 전에 문서를 검사하세요.

```bash
node scripts/check-docs.mjs all
```

이 명령은 상대 링크가 모두 유효한지, 두 언어의 문서가 서로 대응하는지, 코드 예제가 가져오는 이름이 패키지에 있는지 검사합니다.

### 문서 사이트

문서는 GitHub Pages에 Docsify 사이트로 게시하며, 버전마다 폴더를 하나씩 둡니다.

- `docs/site.json`에는 사이트 이름과, `docs/` 밖에 있으면서 사이트 페이지가 되는 문서의 목록을 적습니다. `docs/index.html`, `docs/_coverpage.md`, `docs/_navbar.md`는 사이트의 틀입니다.
- `docs/en/_sidebar.md`와 `docs/ko/_sidebar.md`는 사이드바입니다. 새 페이지는 두 파일의 같은 위치에 추가하세요.
- 링크는 GitHub에서 읽는 그대로 상대 경로로 씁니다. 빌드는 링크를 대상이 사이트에서 놓이는 위치로 바꾸고, 대상이 없는 링크가 있으면 실패합니다.

```bash
node scripts/build-docs.mjs                      # assemble the site under build-docs/
node scripts/preview-docs.mjs --release 0.3.11   # serve it as GitHub Pages does, with a second version to switch to
node --test scripts/tests/docs-site.test.mjs     # the checks of the site tooling
```

`Deploy Documentation` 워크플로는 사이트를 `gh-pages` 브랜치에 게시합니다. `main`의 문서가 바뀌면 `snapshot` 폴더를 갱신하고, `0.3.12` 같은 릴리스 버전을 입력해 직접 실행하면 태그 `v0.3.12`를 그 이름의 폴더로 빌드합니다. 사이트 루트는 가장 높은 릴리스 버전을 열고, 릴리스가 없으면 스냅샷을 엽니다.

## 변경 제출

### 1. 브랜치 만들기

```bash
git checkout -b feat/your-feature-name
```

### 2. 변경 작업

위 코딩 표준을 따르세요. 코드를 고친 뒤에는 다음을 확인하세요.

```bash
pnpm typecheck    # Fix ALL type errors
pnpm lint         # Fix ALL errors and warnings
pnpm build        # Verify build succeeds for affected packages
pnpm test         # Ensure tests pass
```

### 3. 커밋

커밋 메시지는 conventional commit 형식으로 간결하게 작성하세요.

```text
feat(contract): add filter schema support for entities
fix(react): resolve stale query key in useList
```

### 4. 풀 리퀘스트 열기

- 변경 내용과 그 이유를 요약합니다.
- 관련 이슈를 연결합니다.
- 모든 CI 검사를 통과하는지 확인합니다.

## 이슈 보고

이슈를 등록할 때는 다음을 적어 주세요.

- 문제나 기능 요청에 대한 명확한 설명
- 재현 절차(버그인 경우)
- 기대한 동작과 실제 동작
- 영향을 받는 패키지 이름과 버전

## 행동 강령

서로 존중하고 건설적이며 포용적으로 행동해 주세요. 모두가 환영받는 환경을 만들려고 노력합니다.

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/CONTRIBUTING.ko.md" target="_blank" rel="noopener noreferrer">GitHub에서 편집</a></p>
