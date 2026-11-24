[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / AddressedFilters

# Interface: AddressedFilters

Defined in: [packages/ui/src/crud/list/addressed-filters.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/addressed-filters.ts#L16)

Where a list keeps its committed filters when the address owns them.

## Properties

### controls?

> `readonly` `optional` **controls**: readonly [`FilterControl`](../type-aliases/FilterControl.md)[]

Defined in: [packages/ui/src/crud/list/addressed-filters.ts:37](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/addressed-filters.ts#L37)

The controls the list draws. A key whose field has a toggle or number control is read back as
a boolean or a number; without it, only the membership operators (`in`, `notIn`) are
recognised and every other value stays a string.

***

### forced?

> `readonly` `optional` **forced**: `Readonly`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/ui/src/crud/list/addressed-filters.ts:43](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/addressed-filters.ts#L43)

The request parameters the page forces on the list, such as a tab's. A filter over a field one
of them pins is not applied: the forced value wins in the request and the control is hidden, so
the filter would narrow with nothing on the screen to show it.

***

### onChange()

> `readonly` **onChange**: (`next`) => `void`

Defined in: [packages/ui/src/crud/list/addressed-filters.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/addressed-filters.ts#L31)

Receives the committed filters, in the address's form, each time the reader changes them.
`undefined` means no filter is applied. The page writes them into its address with `replace`.

#### Parameters

##### next

[`CrudSearchFilters`](../type-aliases/CrudSearchFilters.md) | `undefined`

#### Returns

`void`

***

### value

> `readonly` **value**: [`CrudSearchFilters`](../type-aliases/CrudSearchFilters.md) \| `undefined`

Defined in: [packages/ui/src/crud/list/addressed-filters.ts:26](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/addressed-filters.ts#L26)

The filters the address carries now, or `undefined` when it names none.

<p>It must read back every key the list wrote itself through [AddressedFilters.onChange](#onchange):
the list compares the address with its own state, and an address that lacks a key the list
committed (a time range, a pressed tile) is taken for somebody else's change and replaces the
list's state, so the key is lost at the reader's next filter change. A screen that narrows the
address to the keys its entity declares keeps the keys it wrote itself out of the narrowing.
