[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / DeclaredFields

# Interface: DeclaredFields

Defined in: [packages/ui/src/crud/form/prepare-values.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/prepare-values.ts#L12)

What a form declares happens to its values on the way to the DTO.

<p><b>Everything not named here passes through untouched.</b> That is the whole point: a form
that lists its fields to build the DTO has written the field list a second time, and a key left
out of that literal is a value that never leaves the browser while the request still answers 200.
Measured on one console, 168 such assignments did four mechanical things and 73 of them copied a
field across so the object would be complete.

## Properties

### emptyToUndefined?

> `readonly` `optional` **emptyToUndefined**: readonly `string`[]

Defined in: [packages/ui/src/crud/form/prepare-values.ts:20](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/prepare-values.ts#L20)

Fields where an empty box means「not given」rather than the empty string.

<p>Applied after `trim`, so a box holding only spaces is not given either.

***

### omit?

> `readonly` `optional` **omit**: readonly `string`[]

Defined in: [packages/ui/src/crud/form/prepare-values.ts:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/prepare-values.ts#L22)

Form-only state — a picker's open tab, a confirmation checkbox — that is not a DTO field.

***

### trim?

> `readonly` `optional` **trim**: readonly `string`[]

Defined in: [packages/ui/src/crud/form/prepare-values.ts:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/prepare-values.ts#L14)

Text fields whose surrounding space is not part of the value.
