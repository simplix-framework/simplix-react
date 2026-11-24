[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / DialogContentProps

# Type Alias: DialogContentProps

> **DialogContentProps** = `ComponentPropsWithRef`\<*typeof* `DialogPrimitive.Content`\> & `object`

Defined in: [packages/ui/src/base/overlay/dialog.tsx:139](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/overlay/dialog.tsx#L139)

## Type Declaration

### flush?

> `optional` **flush**: `boolean`

Drops the panel padding, for a body that draws its own.

### frame?

> `optional` **frame**: `"auto"` \| `"column"`

`"column"` gives the panel the banded frame (a column with a height ceiling, the bottom sheet
below `sm`) without wrapping the children, for content that draws its own header, scrolling
body and footer (a CRUD detail or form). Otherwise the frame follows the children (`"auto"`).

### maximizable?

> `optional` **maximizable**: `boolean`

Adds a maximize / restore toggle beside the close button and near-fullscreens the dialog.

### showCloseButton?

> `optional` **showCloseButton**: `boolean`
