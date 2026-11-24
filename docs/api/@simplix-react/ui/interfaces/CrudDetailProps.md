[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudDetailProps

# Interface: CrudDetailProps

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:99](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L99)

Props for the [CrudDetail](../variables/CrudDetail.md) compound component root.

```
┌─────────────────────────────────────┐
│  header                       [X]   │
├─────────────────────────────────────┤
│  Section: "Basic Info"              │
│  Name:    Pet A                     │
│  Status:  Active                    │
│                                     │
│  Section: "Location"               │
│  Address: 123 Main St              │
│           [loading overlay...]      │
├─────────────────────────────────────┤
│  [← Back]        [Delete] [Edit]   │
└─────────────────────────────────────┘
```

## Properties

### auditData?

> `optional` **auditData**: [`AuditData`](AuditData.md)

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:115](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L115)

Audit metadata rendered as a fixed bar between the scrollable body and the footer.

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:125](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L125)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:124](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L124)

***

### displayZone?

> `optional` **displayZone**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:122](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L122)

IANA display timezone for the audit footer's timestamps. Falls back to the
ambient `DisplayZoneProvider` zone (then the browser zone) when omitted —
pass it on screens whose fields pin a zone other than the ambient one so
the audit stamps agree with the rest of the panel.

***

### fieldVariant?

> `optional` **fieldVariant**: [`FieldVariant`](FieldVariant.md)

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:123](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L123)

***

### footer?

> `optional` **footer**: `ReactNode`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:107](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L107)

Fixed footer rendered below the scrollable content (e.g. action buttons).

***

### header?

> `optional` **header**: `ReactNode`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:105](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L105)

Content rendered at the left side of the header toolbar (e.g. breadcrumb, back button, label).

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:101](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L101)

Shows a semi-transparent overlay with a spinner on top of the detail content.

***

### onClose()?

> `optional` **onClose**: () => `void`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:103](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L103)

Renders a close button (panel-right-close icon) at the right side of the header toolbar.

#### Returns

`void`

***

### variant?

> `optional` **variant**: [`CrudDetailVariant`](../type-aliases/CrudDetailVariant.md)

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:113](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L113)

Layout variant.
- `"default"` — compact padding for side panels (px-3).
- `"dialog"` — generous padding for use inside Dialog (px-5, extra vertical padding on header/footer).
