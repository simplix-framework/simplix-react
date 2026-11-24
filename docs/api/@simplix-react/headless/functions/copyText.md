[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / copyText

# Function: copyText()

> **copyText**(`value`): `Promise`\<[`CopyOutcome`](../type-aliases/CopyOutcome.md)\>

Defined in: [clipboard/copy-text.ts:26](https://github.com/simplix-framework/simplix-react/blob/main/clipboard/copy-text.ts#L26)

Puts a value on the clipboard, by whichever route this page actually has.

<p>`navigator.clipboard` only exists in a secure context. A console reached over plain HTTP at
a LAN address — which is how an on-premises deployment is normally reached from the next desk —
has no `navigator.clipboard` at all, so touching `.writeText` on it throws
`Cannot read properties of undefined`, and every copy control on every screen answers a click
with an unexplained error. The older selection-based route still works there, so it is tried
before giving up.

<p>Never throws. The caller gets an outcome and decides what to say about it, because the one
thing a copy control must not do is leave the click unanswered.

## Parameters

### value

`string`

the text to place on the clipboard

## Returns

`Promise`\<[`CopyOutcome`](../type-aliases/CopyOutcome.md)\>

which route succeeded, or why none did
