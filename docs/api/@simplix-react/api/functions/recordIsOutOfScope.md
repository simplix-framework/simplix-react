[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/api](../README.md) / recordIsOutOfScope

# Function: recordIsOutOfScope()

> **recordIsOutOfScope**(`error`): `boolean`

Defined in: [packages/api/src/read-failed.ts:32](https://github.com/simplix-framework/simplix-react/blob/main/packages/api/src/read-failed.ts#L32)

Whether a read failed because the record is outside the reader's granted range.

<p><b>「범위 밖이다」 and 「없다」 are different answers too, and the server separates them.</b> A
record this account may not read answers 403; one that is not there answers 404. `query.isError`
conflates the two, and a screen that says 「부여받은 범위 밖입니다」 to a mistyped identifier sends
the reader to ask for a range they do not need — which is the same confusion, told with more
confidence.

## Parameters

### error

`unknown`

whatever the query handed back

## Returns

`boolean`

whether the server refused the read rather than finding nothing
