# @simplix-react-native-ext/qr

**English** | [한국어](/ko/extensions/native/packages/qr/README.md)

QR display for simplix-react-native: a static QR code rendered as SVG, and a rotating presence-token QR that re-issues its token on an interval and shows how long the current token stays valid.

## Installation

```bash
pnpm add @simplix-react-native-ext/qr
```

> **Prerequisites:** Peer dependencies: `@simplix-react-native/ui`, `@simplix-react/i18n`, `react` (>=18), `react-native` (>=0.76), `react-native-svg` (>=15). The package depends on `qrcode` for the matrix.

## Usage

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

## API Reference

### `QrCodeView`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | required | Encoded value |
| `size` | `number` | `240` | Edge length in density-independent pixels |
| `quietZone` | `number` | `2` | Margin in modules |
| `color` | `string` | `"#000000"` | Dark module color |
| `backgroundColor` | `string` | `"#ffffff"` | Background color |
| `errorCorrectionLevel` | `QRCodeErrorCorrectionLevel` | `"M"` | Error correction level of `qrcode` |
| `className` | `string` | none | Root class names |

The colors stay black on white whatever the theme, because scanner contrast comes first.

### `RotatingTokenQr`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fetchToken` | `() => Promise<RotatingToken>` | required | Issues a token `{ value, expiresInSeconds }`; called on mount and then every `rotateMs` while mounted |
| `rotateMs` | `number` | `10000` | Re-issue interval |
| `size` | `number` | `240` | QR edge length |
| `onError` | `(error: unknown) => void` | none | Called after each failed issue |
| `className` | `string` | none | Root class names |

Under the code the component counts down the remaining seconds of the current token. When the first issue fails it shows a retry button instead of the code; when a later issue fails it keeps the last code and shows a refresh-failed line. Tokens are issued only while the component is mounted.

### `buildQrMatrix(value, errorCorrectionLevel?)` and `qrMatrixToPath(matrix)`

Pure helpers behind `QrCodeView`. `buildQrMatrix` returns a `QrMatrix` (`{ size, modules }`, `modules` row-major with `size * size` flags; level defaults to `"M"`). `qrMatrixToPath` turns it into one SVG path on a unit grid.

### Types

The package exports the prop and option types of the API above: `QrCodeViewProps`, `RotatingTokenQrProps`, `RotatingToken`, `QrMatrix`.

## Platform notes

- The package registers its en/ko/ja strings under the `simplix/native-qr` namespace on import.
- `RotatingTokenQr` uses NativeWind `className` utilities, so add the package `src` folder to the app's Tailwind `content`.

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/extensions/native/packages/qr/README.md" target="_blank" rel="noopener noreferrer">Edit on GitHub</a></p>
