[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / installRandomUUIDFallback

# Function: installRandomUUIDFallback()

> **installRandomUUIDFallback**(): `boolean`

Defined in: [crypto/install-random-uuid-fallback.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/crypto/install-random-uuid-fallback.ts#L30)

Gives a page with no `crypto.randomUUID` one that works.

## Returns

`boolean`

Whether a fill was installed, which is false where the method already exists or there
  is no `crypto` at all.

## Remarks

Browsers expose `crypto.randomUUID` only in a secure context. `localhost` counts as one, and
`http://` at a LAN address does not, which is how an on-premises app is normally reached from
the next desk; there every call that names a new record client-side throws. `getRandomValues`
has no such restriction, so the fill builds the same version 4 UUID from it. It is installed
ONLY where the browser left the method undefined, so a page with the real one keeps it. Call it
once at boot, beside `installClipboardFallback`.
