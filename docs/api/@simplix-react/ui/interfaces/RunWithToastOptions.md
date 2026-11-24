[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / RunWithToastOptions

# Interface: RunWithToastOptions\<T\>

Defined in: [packages/ui/src/crud/form/use-command.ts:147](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L147)

Options for [runWithToast](../functions/runWithToast.md).

## Type Parameters

### T

`T`

## Properties

### done

> **done**: `string` \| (`value`) => `string`

Defined in: [packages/ui/src/crud/form/use-command.ts:149](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L149)

Toasted as success once the action resolves.

***

### failed

> **failed**: `string` \| (`reason`, `caught`) => `string`

Defined in: [packages/ui/src/crud/form/use-command.ts:151](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L151)

Toasted as an error when it rejects; a sentence stands in only where the server sent none.
