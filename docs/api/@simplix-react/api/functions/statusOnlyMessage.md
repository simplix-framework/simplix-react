[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/api](../README.md) / statusOnlyMessage

# Function: statusOnlyMessage()

> **statusOnlyMessage**(`status`): `string`

Defined in: [packages/api/src/error-utils.ts:233](https://github.com/simplix-framework/simplix-react/blob/main/packages/api/src/error-utils.ts#L233)

The message an error carries when its response stated no sentence of its own: the status alone.

<p>Every client that turns a body-less response into an error writes this, so
[serverMessage](serverMessage.md) can tell it from a sentence the server sent.

## Parameters

### status

`number`

The response's HTTP status.

## Returns

`string`

`HTTP <status>`.
