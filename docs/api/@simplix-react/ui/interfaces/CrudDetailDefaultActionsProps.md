[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudDetailDefaultActionsProps

# Interface: CrudDetailDefaultActionsProps

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:387](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L387)

Props for the CrudDetail.DefaultActions sub-component, shared with CrudDetail.ActionFooter.

## Extended by

- [`CrudDetailActionFooterProps`](CrudDetailActionFooterProps.md)

## Properties

### backLabel?

> `optional` **backLabel**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:398](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L398)

Overrides the back button label (defaults to the translated `common.back`).

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:405](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L405)

Extra action buttons rendered in the right-side group, before Edit.

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:403](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L403)

***

### closeLabel?

> `optional` **closeLabel**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:396](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L396)

Overrides the close button label (defaults to the translated `common.close`).

***

### deleteDisabled?

> `optional` **deleteDisabled**: `boolean`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:411](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L411)

Disables Delete on its own (independent of `isPending`); pair with `deleteDisabledReason`.

***

### deleteDisabledReason?

> `optional` **deleteDisabledReason**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:413](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L413)

Native tooltip explaining why Delete is disabled.

***

### deleteLabel?

> `optional` **deleteLabel**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:402](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L402)

Overrides the delete button label (defaults to the translated `common.delete`).

***

### editDisabled?

> `optional` **editDisabled**: `boolean`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:407](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L407)

Disables Edit on its own (independent of `isPending`); pair with `editDisabledReason`.

***

### editDisabledReason?

> `optional` **editDisabledReason**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:409](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L409)

Native tooltip explaining why Edit is disabled.

***

### editLabel?

> `optional` **editLabel**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:400](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L400)

Overrides the edit button label (defaults to the translated `common.edit`).

***

### isPending?

> `optional` **isPending**: `boolean`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:394](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L394)

When true, disables Edit and Delete action buttons.

***

### onBack()?

> `optional` **onBack**: () => `void`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:390](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L390)

Renders a "← Back" button instead of "Close". Mutually exclusive with `onClose`.

#### Returns

`void`

***

### onClose()?

> `optional` **onClose**: () => `void`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:388](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L388)

#### Returns

`void`

***

### onDelete()?

> `optional` **onDelete**: () => `void`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:391](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L391)

#### Returns

`void`

***

### onEdit()?

> `optional` **onEdit**: () => `void`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:392](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L392)

#### Returns

`void`
