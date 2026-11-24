# simplix-react-native

[English](/en/extensions/native/packages/meta/README.md) | **한국어**

`@simplix-react-native/*` 핵심 패키지를 의존성 하나로 설치하는 메타 패키지입니다. 웹의 `simplix-react` 메타 패키지에 대응하는 네이티브 패키지입니다.

## 포함된 패키지

| 패키지 | 설명 |
| --- | --- |
| [`@simplix-react-native/ui`](/ko/extensions/native/packages/ui/README.md) | 표준 모바일 UI 키트(프리미티브, 페이지 골격, 컨트롤, 시트 우선 오버레이, FormFields / DetailFields, EntityList + useEntityFeed, 테마 토큰 시트) |
| [`@simplix-react-native/runtime`](/ko/extensions/native/packages/runtime/README.md) | Expo 런타임 연결 코드(토큰 저장소 어댑터, Boot 뮤테이터 조립, 앱 부팅 프로바이더, msw/native 연결) |

기기 계층 확장은 네이티브 모듈을 포함하므로, 사용하는 앱에만 하나씩 설치합니다.

```bash
pnpm add @simplix-react-native-ext/capture    # camera + auto-capture session
pnpm add @simplix-react-native-ext/signature  # drawn/typed signature to PNG
pnpm add @simplix-react-native-ext/qr         # rotating presence-token QR
pnpm add @simplix-react-native-ext/kiosk      # keep-awake, lock task, idle reset, recovery
```

## 설정

pnpm은 엄격한 의존성 해석을 사용하므로 워크스페이스 `.npmrc`에 다음 줄을 추가하세요(`simplix add-app --native`가 자동으로 추가합니다).

```text
public-hoist-pattern[]=@simplix-react-native/*
public-hoist-pattern[]=@simplix-react-native-ext/*
```

각 패키지에서 직접 가져오세요.

```ts
import { EntityList, useEntityFeed, FormFields } from "@simplix-react-native/ui";
import { SimplixNativeProvider, createNativeI18n } from "@simplix-react-native/runtime";
```

RN 패키지는 소스(`src/`)를 배포합니다. Metro가 소스를 변환하고, NativeWind가 클래스를 추출하려면 앱의 Tailwind `content` 글롭에 패키지 소스가 들어 있어야 합니다. `simplix add-app --native`가 생성하는 설정에는 `@simplix-react-native/ui` 소스만 들어 있습니다. 기기 계층 패키지도 `className` 유틸리티를 사용하므로, 설치한 패키지마다 `src` 폴더를 `content`에 추가하세요.

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/extensions/native/packages/meta/README.ko.md" target="_blank" rel="noopener noreferrer">원본 보기</a></p>
