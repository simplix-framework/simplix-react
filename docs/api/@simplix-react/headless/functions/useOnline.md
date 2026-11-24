[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / useOnline

# Function: useOnline()

> **useOnline**(): `boolean`

Defined in: [entity/use-online.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/entity/use-online.ts#L16)

Whether the browser currently has a connection.

<p><b>Read once and then followed.</b> `navigator.onLine` is a value at a moment, and a screen
that reads it on mount alone goes on saying 「오프라인」 after the connection is back — so the
two events the platform fires are what keep it current.

<p><b>True where the platform cannot say.</b> A renderer without `navigator` — a test, a server
render — is not evidence of being offline, and answering `false` there would block writing on a
screen nobody could unblock.

## Returns

`boolean`

true while the browser believes it is connected
