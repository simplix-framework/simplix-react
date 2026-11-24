[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / messageLength

# Function: messageLength()

> **messageLength**(`body`): [`MessageLength`](../interfaces/MessageLength.md)

Defined in: [app/message-length.ts:27](https://github.com/simplix-framework/simplix-react/blob/main/app/message-length.ts#L27)

How long a wording is, both ways a channel counts it.

<p><b>A channel's ceiling is in bytes and a person reads characters</b>, so the two are said
together — a wording that fits on screen can still be refused for being twice as long as it
looks.

<p><b>Two bytes for anything outside ASCII, which is what an SMS gateway counts.</b> Not UTF-8,
where a Korean letter is three: the figure exists to be held against a channel's limit, and a
limit of 90 is 90 of these. A server storing the UTF-8 length and a screen computing this one
put two different numbers on the same wording, which is why there is one function.

## Parameters

### body

the wording

`string` | `null` | `undefined`

## Returns

[`MessageLength`](../interfaces/MessageLength.md)

its length in characters and in bytes
