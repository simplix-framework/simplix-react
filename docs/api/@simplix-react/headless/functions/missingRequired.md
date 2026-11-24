[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / missingRequired

# Function: missingRequired()

> **missingRequired**\<`T`\>(`values`, `required`): `number`

Defined in: [entity/missing-required.ts:19](https://github.com/simplix-framework/simplix-react/blob/main/entity/missing-required.ts#L19)

How many of a form's required values are still empty.

<p><b>A required field's asterisk is a claim the form has to keep.</b> Marked required and left
empty, the press goes to the server, the server refuses it, and what the reader gets back is a
round trip and an error summary — for a fact the screen already had. Worse, a form whose 저장 is
live over an empty required field has told the reader the field is optional after all.

<p><b>Counted rather than judged true or false</b> because SaveButton draws the count on
the button: the reader is told how many are missing before they go looking for which.

<p>Empty means absent, null, or a string of nothing but spaces. A `false` is a value — an
unticked switch is an answer — and a `0` is a value too.

## Type Parameters

### T

`T` *extends* `object`

## Parameters

### values

`T`

what the form holds now

### required

readonly keyof `T` & `string`[]

the fields it draws an asterisk on

## Returns

`number`

how many of them are empty
