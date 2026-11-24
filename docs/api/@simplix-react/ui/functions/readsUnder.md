[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / readsUnder

# Function: readsUnder()

> **readsUnder**(`apiPrefix`): (`query`) => `boolean`

Defined in: [packages/ui/src/crud/form/use-invalidate-entity.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-invalidate-entity.ts#L13)

Whether a query reads under an API prefix: its first key element is a string starting with it.

Generated query keys lead with the route (`['/api/v1/company/4']`, `['/api/v1/company/search',
params]`), so a prefix is every read of one entity.

## Parameters

### apiPrefix

`string`

The entity's base path, such as a generated `<entity>EntityPath`.

## Returns

A predicate for `invalidateQueries`.

> (`query`): `boolean`

### Parameters

#### query

`Query`

### Returns

`boolean`
