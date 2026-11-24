[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / prepareValues

# Function: prepareValues()

> **prepareValues**\<`T`\>(`values`, `options`): `T`

Defined in: [packages/ui/src/crud/form/prepare-values.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/prepare-values.ts#L48)

Turns a form's values into the DTO, by the declaration rather than by hand.

<p><b>Exported because not every screen submits through [useCrudFormSubmit](useCrudFormSubmit.md).</b> A form
whose save is a mutation called directly — a wizard step, a record page that owns its own
lifecycle — cannot reach the hook's declaration, and without this it writes the same four
transforms again in its own body. That copy is the thing being ended, so it must not be the
price of not using the hook.

<p>The order is the order a reader would do it by hand: tidy each value, decide which empty boxes
mean「not given」, then derive the base columns from their maps. The derivation comes last of the
three because it reads the maps as they will be stored, and a map carrying stray space would
otherwise put that space in the column every read projection resolves the reader's language out
of. Dropping the form's own state comes after all of it, so a field can be transformed and then
omitted without the order mattering to the caller.

## Type Parameters

### T

`T`

## Parameters

### values

`T`

the form's state

### options

what to do to it — every field not named passes through

#### fields?

[`DeclaredFields`](../interfaces/DeclaredFields.md)

#### i18nFields?

[`I18nFieldPairs`](../type-aliases/I18nFieldPairs.md)

#### locales?

readonly `object`[]

## Returns

`T`

the DTO to send
