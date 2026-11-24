[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListProps

# Interface: ListProps

Defined in: [packages/ui/src/crud/list/crud-list.tsx:217](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L217)

Props for the [CrudList](../variables/CrudList.md) compound component root.

## Example

```tsx
<CrudList>
  <CrudList.Toolbar>...</CrudList.Toolbar>
  <CrudList.Table data={items}>...</CrudList.Table>
  <CrudList.Pagination ... />
</CrudList>
```

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:219](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L219)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:218](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L218)

***

### defaultViewMode?

> `optional` **defaultViewMode**: [`CrudListViewMode`](../type-aliases/CrudListViewMode.md)

Defined in: [packages/ui/src/crud/list/crud-list.tsx:236](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L236)

The view the list opens in: `"grid"` draws the rows as cards in a fit grid on the first render,
`"list"` (the default) as the table. It only takes effect on a table that declares card slots
(`cardTitle` / `cardContent`); it is read once, so a later change of the prop moves nothing.

<p>A table that also sets `gridView` offers the list/grid toggle and the reader's pick replaces
this default; one that does not offers no toggle, so the default is the only view.

***

### onViewModeChange()?

> `optional` **onViewModeChange**: (`mode`) => `void`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:241](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L241)

Called with the view the reader switched to through the toggle, so the caller can remember it
and hand it back as [defaultViewMode](#defaultviewmode) on the next visit.

#### Parameters

##### mode

[`CrudListViewMode`](../type-aliases/CrudListViewMode.md)

#### Returns

`void`

***

### ref?

> `optional` **ref**: `Ref`\<`HTMLDivElement`\>

Defined in: [packages/ui/src/crud/list/crud-list.tsx:227](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L227)

The list's own outermost element.

<p>What a screen measures when its column set depends on how much room the list actually has —
which is not how much the window has, because a detail panel takes most of it. Pair with
`useContainerWidth`.
