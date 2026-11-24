[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / OWN\_REFUSAL\_META

# Variable: OWN\_REFUSAL\_META

> `const` **OWN\_REFUSAL\_META**: `object`

Defined in: [packages/ui/src/crud/form/use-command.ts:82](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L82)

Marks a mutation as one whose failure the screen reports itself, so the app's mutation cache
does not also raise its error dialog. Shared by [useCommand](../functions/useCommand.md) and any hand-built call that
toasts its own refusal.

## Type Declaration

### suppressErrorDialog

> `readonly` **suppressErrorDialog**: `true` = `true`
