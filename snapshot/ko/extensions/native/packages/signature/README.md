# @simplix-react-native-ext/signature

[English](/en/extensions/native/packages/signature/README.md) | **한국어**

simplix-react-native의 서명 입력 패키지입니다. `SignaturePad`는 손으로 그린 서명을 기록하거나 입력한 이름을 표시하고, 입력 영역을 PNG 파일로 내보내 업로드할 수 있게 합니다. 페이로드 규약(PNG + 방식)은 웹 `SignaturePad`와 같습니다.

## 설치

```bash
pnpm add @simplix-react-native-ext/signature
```

> **사전 요구 사항:** 피어 의존성은 `@simplix-react-native/ui`, `@simplix-react/i18n`, `react`(>=18), `react-native`(>=0.76), `react-native-svg`(>=15), `react-native-view-shot`(>=4)입니다.

## 사용법

```tsx
import { useState } from "react";
import { SignaturePad, signatureFormDataPart } from "@simplix-react-native-ext/signature";

export function SignStep({ name }: { name: string }) {
  const [signature, setSignature] = useState<string | null>(null);

  // On submit: formData.append("signature", signatureFormDataPart(signature) as unknown as Blob);

  return (
    <>
      <SignaturePad mode="drawn" onChange={setSignature} />
      <SignaturePad mode="typed" typedName={name} onChange={setSignature} />
    </>
  );
}
```

`onChange`는 내용이 마지막으로 바뀌고 약 350ms가 지나면 PNG의 로컬 `file://` URI를 받습니다. 입력 영역이 비어 있거나 이미지 저장에 실패하면 `null`을 받습니다.

## API 레퍼런스

### `SignaturePad`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `mode` | `SignatureCaptureMethod`(`"drawn" \| "typed"`) | 필수 | 손글씨 또는 입력한 이름. 백엔드 `SignatureMethod` 값과 같습니다 |
| `typedName` | `string` | `""` | `typed` 모드에서 표시할 이름 |
| `onChange` | `(fileUri: string \| null) => void` | 필수 | PNG URI를 받고, 비어 있으면 `null`을 받습니다 |
| `height` | `number` | `200` | 입력 영역 높이 |
| `strokeWidth` | `number` | `3` | `drawn` 모드의 선 굵기 |
| `strokeColor` | `string` | `"#111111"` | 두 모드에 공통으로 쓰는 글자 · 선 색상 |
| `className` | `string` | 없음 | 루트 클래스 이름 |

`drawn` 모드에서는 입력 영역 아래에 안내 문구와 지우기 버튼을 표시합니다.

### `signatureFormDataPart(fileUri, fileName?)`

multipart 업로드에 쓸 `{ uri, name, type: "image/png" }`을 반환합니다. `fileName`의 기본값은 `"signature.png"`입니다.

### `strokeToPath(points)`

입력한 `StrokePoint` 값(`{ x, y }`)을 부드러운 SVG 경로(중간점을 지나는 2차 곡선)로 바꾸는 순수 함수입니다. 점이 하나뿐이면 점 하나로 그립니다.

### 타입

위 API의 props · 옵션 타입을 함께 내보냅니다. `SignaturePadProps`, `SignatureCaptureMethod`, `StrokePoint`.

## 플랫폼 참고 사항

- 이 패키지를 가져오면 en/ko/ja 문구를 `simplix/native-signature` 네임스페이스에 등록합니다.
- 컴포넌트가 NativeWind `className` 유틸리티를 사용하므로, 앱의 Tailwind `content`에 패키지의 `src` 폴더를 추가하세요.

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/extensions/native/packages/signature/README.ko.md" target="_blank" rel="noopener noreferrer">GitHub에서 편집</a></p>
