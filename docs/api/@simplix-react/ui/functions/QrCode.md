[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / QrCode

# Function: QrCode()

> **QrCode**(`__namedParameters`): `Element`

Defined in: [packages/ui/src/base/display/qr-code.tsx:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/qr-code.tsx#L29)

Renders a QR symbol for an arbitrary payload onto a canvas. Re-encodes
whenever the payload changes, so rotating tokens (e.g. a kiosk presence QR)
update in place without remounting.

## Parameters

### \_\_namedParameters

[`QrCodeProps`](../interfaces/QrCodeProps.md)

## Returns

`Element`

## Example

```tsx
<QrCode value={presenceUrl} size={240} />
```
