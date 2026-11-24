[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / useUnsavedChanges

# Function: useUnsavedChanges()

> **useUnsavedChanges**(`options`): [`UseUnsavedChangesReturn`](../interfaces/UseUnsavedChangesReturn.md)

Defined in: [packages/ui/src/crud/form/use-unsaved-changes.tsx:50](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-unsaved-changes.tsx#L50)

Guard navigation with an unsaved changes confirmation dialog.

## Parameters

### options

[`UseUnsavedChangesOptions`](../interfaces/UseUnsavedChangesOptions.md)

[UseUnsavedChangesOptions](../interfaces/UseUnsavedChangesOptions.md)

## Returns

[`UseUnsavedChangesReturn`](../interfaces/UseUnsavedChangesReturn.md)

`guardedNavigate` wrapper and a `dialog` ReactNode to render.

## Remarks

Combines `useBeforeUnload` (browser tab close) with an in-app alert dialog. While the form is
dirty the dialog is asked for every way out of the route: a callback wrapped in
`guardedNavigate`, and, when the router adapter offers `useBlocker`, the browser's Back and
Forward and any link or `navigate` call that the page does not wrap. Without a router adapter
(or one with no `useBlocker`) only the wrapped callbacks and the tab close are guarded.

## Example

```tsx
const { guardedNavigate, dialog } = useUnsavedChanges({ isDirty });

const handleClose = () => guardedNavigate(() => router.back());

return (
  <>
    <CrudForm onClose={handleClose}>...</CrudForm>
    {dialog}
  </>
);
```
