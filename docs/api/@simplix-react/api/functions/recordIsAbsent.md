[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/api](../README.md) / recordIsAbsent

# Function: recordIsAbsent()

> **recordIsAbsent**(`error`): `boolean`

Defined in: [packages/api/src/read-failed.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/api/src/read-failed.ts#L16)

Whether a read failed because the record is not there.

<p><b>「없다」 and 「못 읽었다」 are different answers and a screen that gives one for the other
sends the reader the wrong way.</b> Told a wording is missing when the read merely failed, they
go off and write one that is already there; told the read failed when the key genuinely has no
wording, they go looking for a fault in a console that is working. `query.isError` alone cannot
separate them — the server can, and does: a record that is not there answers 404 with its own
sentence, and everything else is the read failing.

## Parameters

### error

`unknown`

whatever the query handed back

## Returns

`boolean`

whether the server said the record is not there
