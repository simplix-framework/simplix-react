# simplix-react-ext

[English](/en/packages/simplix-react-ext/README.md) | **한국어**

`@simplix-react-ext/*` 확장(extension) 패키지 전체를 의존성 하나로 설치하는 메타 패키지입니다.

이 확장은 simplix-react를 **simplix-boot** 백엔드에 맞춥니다(Boot 응답 봉투(envelope), 인증, SSE 스트림, OpenAPI 코드 생성 CLI 플러그인). 핵심 메타 패키지 [`simplix-react`](/ko/packages/simplix-react/README.md)와 함께 사용하세요.

## 설치

```bash
pnpm add simplix-react-ext
```

### pnpm 설정

pnpm은 의존성을 엄격하게 해석합니다. `@simplix-react-ext/*` 하위 패키지에서 가져오려면 `.npmrc`에 다음 설정을 추가하세요.

```ini
public-hoist-pattern[]=@simplix-react-ext/*
```

> `simplix init`으로 만든 프로젝트에는 이 설정이 이미 들어 있습니다.

이 패키지 하나로 다음 패키지를 설치합니다.

| 패키지 | 설명 |
| --- | --- |
| `@simplix-react-ext/simplix-boot-access` | `@simplix-react/access`용 Spring Security 인가 어댑터 |
| `@simplix-react-ext/simplix-boot-auth` | Spring Security 인증 어댑터 |
| `@simplix-react-ext/simplix-boot-cli-plugin` | CLI 플러그인: Boot OpenAPI 명세 프로필과 코드 생성 어댑터 |
| `@simplix-react-ext/simplix-boot-stream` | Boot SSE 스트리밍(EventSource 관리, 구독, 최신 상태 감지) |
| `@simplix-react-ext/simplix-boot-utils` | Boot 응답 봉투 도우미(`resolveBootEnum`, mutator) |

## 사용 방법

각 패키지에서 직접 가져오세요.

```ts
import { resolveBootEnum } from "@simplix-react-ext/simplix-boot-utils";
import { useStreamSubscription } from "@simplix-react-ext/simplix-boot-stream";
```

## 선택 설치

일부 패키지만 필요하면 그 패키지만 설치하세요.

```bash
pnpm add @simplix-react-ext/simplix-boot-utils @simplix-react-ext/simplix-boot-stream
```

## 라이선스

MIT

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/packages/simplix-react-ext/README.ko.md" target="_blank" rel="noopener noreferrer">GitHub에서 편집</a></p>
