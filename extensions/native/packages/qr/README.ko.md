# @simplix-react-native-ext/qr

[English](./README.md) | **한국어**

simplix-react-native의 QR 표시 패키지입니다. SVG로 그리는 정적 QR 코드와, 일정한 간격으로 토큰을 다시 발급하고 현재 토큰의 남은 유효 시간을 표시하는 순환 출입 토큰 QR을 제공합니다.

## 설치

```bash
pnpm add @simplix-react-native-ext/qr
```

> **사전 요구 사항:** 피어 의존성은 `@simplix-react-native/ui`, `@simplix-react/i18n`, `react`(>=18), `react-native`(>=0.76), `react-native-svg`(>=15)입니다. QR 행렬은 의존성인 `qrcode`로 만듭니다.

## 사용법

```tsx
import { QrCodeView, RotatingTokenQr } from "@simplix-react-native-ext/qr";

<QrCodeView value="https://example.com/visit/123" size={200} />

<RotatingTokenQr
  fetchToken={async () => {
    const token = await issuePresenceToken();
    return { value: token.url, expiresInSeconds: token.expiresInSeconds };
  }}
  rotateMs={10_000}
/>
```

## API 레퍼런스

### `QrCodeView`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `string` | 필수 | 인코딩할 값 |
| `size` | `number` | `240` | 한 변의 길이(밀도 독립 픽셀) |
| `quietZone` | `number` | `2` | 여백(모듈 단위) |
| `color` | `string` | `"#000000"` | 어두운 모듈 색상 |
| `backgroundColor` | `string` | `"#ffffff"` | 배경 색상 |
| `errorCorrectionLevel` | `QRCodeErrorCorrectionLevel` | `"M"` | `qrcode`의 오류 정정 수준 |
| `className` | `string` | 없음 | 루트 클래스 이름 |

스캐너가 읽을 대비를 우선하므로 테마와 관계없이 흰 바탕에 검은 코드로 표시합니다.

### `RotatingTokenQr`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `fetchToken` | `() => Promise<RotatingToken>` | 필수 | 토큰 `{ value, expiresInSeconds }`를 발급합니다. 마운트할 때 한 번, 그 뒤로 마운트되어 있는 동안 `rotateMs`마다 호출합니다 |
| `rotateMs` | `number` | `10000` | 재발급 간격 |
| `size` | `number` | `240` | QR 한 변의 길이 |
| `onError` | `(error: unknown) => void` | 없음 | 발급에 실패할 때마다 호출합니다 |
| `className` | `string` | 없음 | 루트 클래스 이름 |

코드 아래에는 현재 토큰의 남은 시간을 초 단위로 표시합니다. 첫 발급에 실패하면 코드 대신 다시 시도 버튼을 표시하고, 그 뒤의 발급에 실패하면 마지막 코드를 유지한 채 갱신 실패 문구를 표시합니다. 토큰은 컴포넌트가 마운트되어 있는 동안에만 발급합니다.

### `buildQrMatrix(value, errorCorrectionLevel?)`와 `qrMatrixToPath(matrix)`

`QrCodeView`가 사용하는 순수 함수입니다. `buildQrMatrix`는 `QrMatrix`(`{ size, modules }`, `modules`는 행 우선 순서의 `size * size`개 플래그, 수준 기본값 `"M"`)를 반환합니다. `qrMatrixToPath`는 행렬을 단위 격자 위의 SVG 경로 하나로 바꿉니다.

### 타입

위 API의 props · 옵션 타입을 함께 내보냅니다. `QrCodeViewProps`, `RotatingTokenQrProps`, `RotatingToken`, `QrMatrix`.

## 플랫폼 참고 사항

- 이 패키지를 가져오면 en/ko/ja 문구를 `simplix/native-qr` 네임스페이스에 등록합니다.
- `RotatingTokenQr`가 NativeWind `className` 유틸리티를 사용하므로, 앱의 Tailwind `content`에 패키지의 `src` 폴더를 추가하세요.
