[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EntityOptionsConfig

# Interface: EntityOptionsConfig\<TItem, TParams, TQuery, TArg\>

Defined in: [packages/ui/src/crud/entity/entity-options.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L31)

Configuration for [createEntityOptions](../functions/createEntityOptions.md).

## Type Parameters

### TItem

`TItem`

### TParams

`TParams`

### TQuery

`TQuery` *extends* `object`

### TArg

`TArg`

## Properties

### filter()?

> `optional` **filter**: (`item`, `arg`) => `boolean`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:50](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L50)

Optional row predicate (site scoping / active-only / exclude-self).

#### Parameters

##### item

`TItem`

##### arg

`TArg`

#### Returns

`boolean`

***

### getLabel()

> **getLabel**: (`item`, `arg`) => `string`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L48)

Display label per row; receives the caller arg so it can add discriminators.

#### Parameters

##### item

`TItem`

##### arg

`TArg`

#### Returns

`string`

***

### getValue()

> **getValue**: (`item`) => `string` \| `undefined`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:46](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L46)

FK id per row; rows whose value is empty/undefined are dropped. Annotate the
row parameter (e.g. `(t: ListXResponse["content"][number])`) so
the item type is bound to the real list body.

#### Parameters

##### item

`TItem`

#### Returns

`string` \| `undefined`

***

### listParams

> **listParams**: `TParams`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:40](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L40)

Batch request params — include `{ page: 0, size: 1000 }` plus any fixed filters.

***

### onData()?

> `optional` **onData**: (`items`) => `void`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:54](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L54)

Optional side effect per fresh page (e.g. publishing a name directory).

#### Parameters

##### items

`TItem`[]

#### Returns

`void`

***

### useEnabled()?

> `optional` **useEnabled**: () => `boolean`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:52](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L52)

Optional gate hook — skips the request when it returns false (e.g. a permission check).

#### Returns

`boolean`

***

### useList()

> **useList**: (`params`, `options?`) => `TQuery`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:38](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L38)

The domain's Orval list hook (called unconditionally inside the returned hook).

#### Parameters

##### params

`TParams`

##### options?

###### query?

\{ `enabled?`: `boolean`; \}

###### query.enabled?

`boolean`

#### Returns

`TQuery`
