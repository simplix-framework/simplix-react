[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / LIST\_READ\_META

# Variable: LIST\_READ\_META

> `const` **LIST\_READ\_META**: `object`

Defined in: [adapt-orval-list.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/adapt-orval-list.ts#L33)

The query meta a list read carries: its failure is drawn by the list itself (the list engine's
`emptyReason` is `"error"`, which the list table draws as its error state), so an app's global
error dialog leaves it alone. Told twice, the reader dismisses the modal to reach the sentence
underneath it. A caller that wants the dialog as well passes `meta: { suppressErrorDialog: false }`.

## Type Declaration

### suppressErrorDialog

> `readonly` **suppressErrorDialog**: `true` = `true`
