[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/api](../README.md) / serverMessage

# Function: serverMessage()

> **serverMessage**(`error`): `string` \| `undefined`

Defined in: [packages/api/src/error-utils.ts:216](https://github.com/simplix-framework/simplix-react/blob/main/packages/api/src/error-utils.ts#L216)

The sentence the server sent with a refusal or a failure.

## Parameters

### error

`unknown`

Whatever the request threw.

## Returns

`string` \| `undefined`

The response's non-empty sentence, or `undefined` when it stated none.

## Remarks

A read refused for being outside the reader's range and a read that failed because the server
is down both arrive as an error, and a screen that draws one message for both tells the reader
to try again about a record they will never be allowed to open. The server already names the
rule, and that sentence is the only thing on hand that separates the two. Unlike
[getErrorMessage](getErrorMessage.md), nothing is put in its place when the error carries none, so a caller
can fall back to its own words: `serverMessage(caught) ?? failed`.

<p>Only a response's own sentence counts: the error carries the response's status (or is the
envelope itself, with its `type`). A transport failure (the browser's 「Failed to fetch」) has no
response, and the stand-in a client writes when the response stated nothing
([statusOnlyMessage](statusOnlyMessage.md), 「HTTP 500」) is not the server speaking, so neither is returned and
the caller's own words stand, in the reader's language.
