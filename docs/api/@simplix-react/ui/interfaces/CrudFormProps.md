[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudFormProps

# Interface: CrudFormProps

Defined in: [packages/ui/src/crud/form/crud-form.tsx:50](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L50)

Props for the [CrudForm](../variables/CrudForm.md) compound component root.

```
┌─────────────────────────────────────┐
│  header                       [X]   │
├─────────────────────────────────────┤
│  Section: "Basic Info"              │
│  ┌───────────┐ ┌───────────┐       │
│  │ [Name...] │ │ [Email..] │       │
│  └───────────┘ └───────────┘       │
│  Section: "Settings"               │
│  ┌───────────────────────┐         │
│  │ [Timezone ▼]          │         │
│  └───────────────────────┘         │
├─────────────────────────────────────┤
│  footer: [Cancel]  [Save]          │
└─────────────────────────────────────┘
```

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:76](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L76)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:75](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L75)

***

### fieldVariant?

> `optional` **fieldVariant**: [`FieldVariant`](FieldVariant.md)

Defined in: [packages/ui/src/crud/form/crud-form.tsx:67](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L67)

***

### footer?

> `optional` **footer**: `ReactNode`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:57](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L57)

Fixed footer rendered below the scrollable content (e.g. action buttons).

***

### header?

> `optional` **header**: `ReactNode`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:55](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L55)

Content rendered at the left side of the header toolbar (e.g. breadcrumb, back button, label).

***

### isSubmitting?

> `optional` **isSubmitting**: `boolean`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:59](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L59)

When true, indicates form is being submitted. Propagated via `data-submitting` attribute.

***

### noValidate?

> `optional` **noValidate**: `boolean`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:74](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L74)

Turns off the browser's own constraint check (`noValidate`) for a form that validates its
values itself. Without it the browser stops the submit on a `required` field with its own
bubble, in the browser's language and style, before the form's handler can mark the field.

***

### onClose()?

> `optional` **onClose**: () => `void`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L53)

Renders a close button (panel-right-close icon) at the right side of the header toolbar.

#### Returns

`void`

***

### onSubmit()

> **onSubmit**: (`e`) => `void`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L51)

#### Parameters

##### e

`FormEvent`\<`HTMLFormElement`\>

#### Returns

`void`

***

### variant?

> `optional` **variant**: `"page"` \| `"panel"`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:66](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L66)

Layout context. `"panel"` (default) fills its host, scrolls its own body,
and pads header/body/footer edges for the panel scrollbar. `"page"` flows
with the document — the page owns the scroll and no horizontal inset is
added, so sections align with surrounding page content.

***

### warnOnUnsavedChanges?

> `optional` **warnOnUnsavedChanges**: `boolean`

Defined in: [packages/ui/src/crud/form/crud-form.tsx:68](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/crud-form.tsx#L68)
