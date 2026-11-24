[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudListSort

# Interface: CrudListSort

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:85](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L85)

Sort state returned by [useCrudList](../functions/useCrudList.md).

## Properties

### direction

> **direction**: `"desc"` \| `"asc"`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:87](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L87)

***

### field

> **field**: `string` \| `null`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:86](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L86)

***

### setSort()

> **setSort**: (`field`, `direction`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:88](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L88)

#### Parameters

##### field

`string`

##### direction

`"desc"` | `"asc"`

#### Returns

`void`

***

### toggleSort()

> **toggleSort**: (`field`) => `void`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:89](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L89)

#### Parameters

##### field

`string`

#### Returns

`void`
