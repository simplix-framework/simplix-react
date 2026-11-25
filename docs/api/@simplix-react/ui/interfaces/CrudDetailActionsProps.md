[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudDetailActionsProps

# Interface: CrudDetailActionsProps

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:330](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L330)

Props for the CrudDetail.Actions sub-component.

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:347](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L347)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:346](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L346)

***

### spread?

> `optional` **spread**: `boolean`

Defined in: [packages/ui/src/crud/detail/crud-detail.tsx:345](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/detail/crud-detail.tsx#L345)

Push the first action away from the rest.

<p>The way out of a panel and the thing that ends the record are opposed, and three screens
were expressing that with a `<span className="flex-1" />` between them — a spacer element in a
row whose layout is this component's business. `CrudForm.Actions` already took this prop; the
detail's did not, so the callers wrote the gap by hand.

<p><b>The rest stay a group however many they are</b>, which is why this is an auto margin on
the first child rather than `justify-between`. Between divides the whole row evenly, so a
third action does not join the group on the right — it lands in the middle of the panel,
equidistant from both ends and reading as a thing of its own. Five footers in one console had
drifted there, each with a destructive verb marooned mid-row between Close and the primary.
