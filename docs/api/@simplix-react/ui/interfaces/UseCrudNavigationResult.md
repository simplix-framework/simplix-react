[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UseCrudNavigationResult

# Interface: UseCrudNavigationResult

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L15)

Return type of [useCrudNavigation](../functions/useCrudNavigation.md).

## Properties

### filters

> **filters**: [`CrudSearchFilters`](../type-aliases/CrudSearchFilters.md) \| `undefined`

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L23)

The list filters the address carries, or `undefined` when it names none.

***

### selectedId

> **selectedId**: `string` \| `undefined`

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:17](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L17)

***

### setFilters()

> **setFilters**: (`filters`) => `void`

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L29)

Writes the list filters into the address, keeping everything else in it (record, mode, tab).
The navigation replaces the current history entry, so narrowing a list does not fill the
history; pass `undefined` to clear them.

#### Parameters

##### filters

[`CrudSearchFilters`](../type-aliases/CrudSearchFilters.md) | `undefined`

#### Returns

`void`

***

### showDetail()

> **showDetail**: (`id`) => `void`

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:19](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L19)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### showEdit()

> **showEdit**: (`id`) => `void`

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L21)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### showList()

> **showList**: () => `void`

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L18)

#### Returns

`void`

***

### showNew()

> **showNew**: () => `void`

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:20](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L20)

#### Returns

`void`

***

### view

> **view**: [`CrudView`](../type-aliases/CrudView.md)

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L16)
