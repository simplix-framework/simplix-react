[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / installClipboardFallback

# Function: installClipboardFallback()

> **installClipboardFallback**(): `boolean`

Defined in: [packages/headless/dist/index.d.ts:1314](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L1314)

Gives a page with no Clipboard API one that works.

## Returns

`boolean`

whether a fill was installed, which is false on a page that already had the API

## Remarks

ISSUE #22. `navigator.clipboard` exists only in a secure context. `localhost` and `127.0.0.1`
count as one; `http://` at a LAN address does not — which is how an on-premises console is
normally reached from the next desk. `@simplix-react/ui` reaches for
`navigator.clipboard.writeText` with nothing around it in two components, so at that address
the call throws inside the framework's own click handler, reaches nobody, and every copy
control answers a click by doing nothing at all.
