[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UseCrudFormSubmitResult

# Interface: UseCrudFormSubmitResult\<T\>

Defined in: [packages/ui/src/crud/form/use-crud-form-submit.ts:112](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-crud-form-submit.ts#L112)

Return type of [useCrudFormSubmit](../functions/useCrudFormSubmit.md).

## Type Parameters

### T

`T`

## Properties

### fieldErrors

> **fieldErrors**: `Record`\<`string`, `string`\>

Defined in: [packages/ui/src/crud/form/use-crud-form-submit.ts:120](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-crud-form-submit.ts#L120)

Server validation errors keyed by field name. Empty when no errors.

***

### fieldLabels

> **fieldLabels**: `Record`\<`string`, `string`\>

Defined in: [packages/ui/src/crud/form/use-crud-form-submit.ts:131](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-crud-form-submit.ts#L131)

What the server calls each refused field, keyed by field name. Empty when no errors, and
missing entries for fields the server labelled nothing.

#### Remarks

A form can only name the fields it draws. When the server refuses one it does not — a field it
fills in itself, or one added to the DTO since — a summary that resolves names out of the
form's own catalogue has nothing to resolve and prints the lookup key at the reader. These are
the server's own names, already localized, so that case has something readable to fall back to.

***

### handleSubmit()

> **handleSubmit**: (`values`) => `void`

Defined in: [packages/ui/src/crud/form/use-crud-form-submit.ts:116](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-crud-form-submit.ts#L116)

Submit handler that dispatches to create or update mutation.

#### Parameters

##### values

`T`

#### Returns

`void`

***

### isEdit

> **isEdit**: `boolean`

Defined in: [packages/ui/src/crud/form/use-crud-form-submit.ts:114](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-crud-form-submit.ts#L114)

Whether the form is in edit mode (entity already exists).

***

### isPending

> **isPending**: `boolean`

Defined in: [packages/ui/src/crud/form/use-crud-form-submit.ts:118](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-crud-form-submit.ts#L118)

Whether the active mutation is pending.
