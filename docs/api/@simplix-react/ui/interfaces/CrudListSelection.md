[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudListSelection

# Interface: CrudListSelection\<T\>

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:103](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L103)

Selection state returned by [useCrudList](../functions/useCrudList.md).

## Type Parameters

### T

`T`

## Properties

### clear()

> **clear**: () => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:107](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L107)

#### Returns

`void`

***

### isSelected()

> **isSelected**: (`index`) => `boolean`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:108](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L108)

#### Parameters

##### index

`number`

#### Returns

`boolean`

***

### selected

> **selected**: `Set`\<`number`\>

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:104](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L104)

***

### toggle()

> **toggle**: (`index`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:105](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L105)

#### Parameters

##### index

`number`

#### Returns

`void`

***

### toggleAll()

> **toggleAll**: (`data`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:106](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L106)

#### Parameters

##### data

`T`[]

#### Returns

`void`
