[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / SignaturePadProps

# Interface: SignaturePadProps

Defined in: [packages/ui/src/base/inputs/signature-pad.tsx:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/signature-pad.tsx#L9)

Props for the [SignaturePad](../functions/SignaturePad.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/base/inputs/signature-pad.tsx:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/signature-pad.tsx#L25)

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [packages/ui/src/base/inputs/signature-pad.tsx:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/signature-pad.tsx#L24)

***

### height?

> `optional` **height**: `number`

Defined in: [packages/ui/src/base/inputs/signature-pad.tsx:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/signature-pad.tsx#L23)

Canvas height in CSS pixels; defaults to 160. The width tracks the container.

***

### mode

> **mode**: `"drawn"` \| `"typed"`

Defined in: [packages/ui/src/base/inputs/signature-pad.tsx:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/signature-pad.tsx#L14)

Capture mode: `drawn` opens a freehand canvas (finger / stylus / mouse),
`typed` renders [SignaturePadProps.typedName](#typedname) in a script typeface.

***

### onChange()?

> `optional` **onChange**: (`dataUrl`) => `void`

Defined in: [packages/ui/src/base/inputs/signature-pad.tsx:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/signature-pad.tsx#L21)

Fires with the captured signature as a PNG data URL, or `null` while the
pad is empty (nothing drawn / blank typed name).

#### Parameters

##### dataUrl

`string` | `null`

#### Returns

`void`

***

### typedName?

> `optional` **typedName**: `string`

Defined in: [packages/ui/src/base/inputs/signature-pad.tsx:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/signature-pad.tsx#L16)

Name rendered as the signature in `typed` mode.
