# @simplix-react-native-ext/signature

**English** | [한국어](/ko/extensions/native/packages/signature/README.md)

Signature capture for simplix-react-native. `SignaturePad` records a freehand drawing or renders a typed name, and exports the surface as a PNG file for upload, with the same payload contract (PNG + method) as the web `SignaturePad`.

## Installation

```bash
pnpm add @simplix-react-native-ext/signature
```

> **Prerequisites:** Peer dependencies: `@simplix-react-native/ui`, `@simplix-react/i18n`, `react` (>=18), `react-native` (>=0.76), `react-native-svg` (>=15), `react-native-view-shot` (>=4).

## Usage

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

`onChange` receives a local `file://` URI of the PNG about 350 ms after the content last changed, or `null` while the surface is empty or when the snapshot fails.

## API Reference

### `SignaturePad`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `SignatureCaptureMethod` (`"drawn" \| "typed"`) | required | Freehand drawing or typed-name rendering; mirrors the backend's `SignatureMethod` values |
| `typedName` | `string` | `""` | Name rendered in `typed` mode |
| `onChange` | `(fileUri: string \| null) => void` | required | Receives the PNG URI, or `null` while empty |
| `height` | `number` | `200` | Height of the capture surface |
| `strokeWidth` | `number` | `3` | Stroke width in `drawn` mode |
| `strokeColor` | `string` | `"#111111"` | Ink color in both modes |
| `className` | `string` | none | Root class names |

In `drawn` mode the pad shows a hint and a clear button under the surface.

### `signatureFormDataPart(fileUri, fileName?)`

Returns `{ uri, name, type: "image/png" }` for a multipart upload. `fileName` defaults to `"signature.png"`.

### `strokeToPath(points)`

Pure helper that turns captured `StrokePoint` values (`{ x, y }`) into a smoothed SVG path (quadratic segments through midpoints); a single point becomes a dot.

### Types

The package exports the prop and option types of the API above: `SignaturePadProps`, `SignatureCaptureMethod`, `StrokePoint`.

## Platform notes

- The package registers its en/ko/ja strings under the `simplix/native-signature` namespace on import.
- Its component uses NativeWind `className` utilities, so add the package `src` folder to the app's Tailwind `content`.

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/extensions/native/packages/signature/README.md" target="_blank" rel="noopener noreferrer">View source</a></p>
