[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudListFilters

# Interface: CrudListFilters

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:57](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L57)

Filter state returned by [useCrudList](../functions/useCrudList.md).

## Properties

### apply()

> **apply**: () => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:66](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L66)

#### Returns

`void`

***

### clear()

> **clear**: () => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:65](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L65)

#### Returns

`void`

***

### committedValues

> **committedValues**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:77](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L77)

Committed (applied) filter values — used by badges, URL sync, and queries.

***

### commitValue()

> **commitValue**: (`key`, `value`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:79](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L79)

Update a single filter in both pending and committed state, triggering a re-query.

#### Parameters

##### key

`string`

##### value

`unknown`

#### Returns

`void`

***

### commitValues()

> **commitValues**: (`updates`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:81](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L81)

Update multiple filters in both pending and committed state, triggering a re-query.

#### Parameters

##### updates

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:75](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L75)

Whether the list's first page is still in flight — no rows and no total
have arrived yet. `CrudList.FilterBar` reads it to hold the total-count
badge in its unknown state instead of stating `Total 0`, which a reader
takes as "there is nothing here". Stays `false` on a refetch that already
has data, so paging does not blank a known count.

***

### isPending

> **isPending**: `boolean`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:67](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L67)

***

### search

> **search**: `string`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:58](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L58)

***

### setAll()

> **setAll**: (`filters`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:64](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L64)

#### Parameters

##### filters

###### search

`string`

###### values

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### setSearch()

> **setSearch**: (`value`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:59](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L59)

#### Parameters

##### value

`string`

#### Returns

`void`

***

### setValue()

> **setValue**: (`key`, `value`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:62](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L62)

#### Parameters

##### key

`string`

##### value

`unknown`

#### Returns

`void`

***

### setValues()

> **setValues**: (`updates`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:63](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L63)

#### Parameters

##### updates

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### values

> **values**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:61](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L61)

Pending (draft) filter values — used by popover form fields.
