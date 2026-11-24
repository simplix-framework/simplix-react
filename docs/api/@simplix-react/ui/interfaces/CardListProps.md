[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CardListProps

# Interface: CardListProps\<T\>

Defined in: [packages/ui/src/crud/list/card-list.tsx:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/card-list.tsx#L11)

Props for the [CardList](../functions/CardList.md) component.

## Type Parameters

### T

`T`

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/list/card-list.tsx:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/card-list.tsx#L18)

***

### columns?

> `optional` **columns**: `1` \| `2` \| `3`

Defined in: [packages/ui/src/crud/list/card-list.tsx:17](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/card-list.tsx#L17)

Number of grid columns. Defaults to `1`.

***

### data

> **data**: `T`[]

Defined in: [packages/ui/src/crud/list/card-list.tsx:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/card-list.tsx#L13)

Array of items to render as cards.

***

### renderCard()

> **renderCard**: (`item`, `index`) => `ReactNode`

Defined in: [packages/ui/src/crud/list/card-list.tsx:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/card-list.tsx#L15)

Render function for each card.

#### Parameters

##### item

`T`

##### index

`number`

#### Returns

`ReactNode`
