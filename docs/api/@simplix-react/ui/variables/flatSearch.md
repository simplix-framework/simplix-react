[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / flatSearch

# Variable: flatSearch

> `const` **flatSearch**: `object`

Defined in: [packages/ui/src/adapters/tanstack-router.ts:43](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/tanstack-router.ts#L43)

A URL's search as a flat map of strings, written and read the same way on every route.

## Type Declaration

### parseSearch()

> `readonly` **parseSearch**(`searchStr`): `Record`\<`string`, `string` \| `Record`\<`string`, `string` \| `string`[]\>\>

#### Parameters

##### searchStr

`string`

#### Returns

`Record`\<`string`, `string` \| `Record`\<`string`, `string` \| `string`[]\>\>

### stringifySearch()

> `readonly` **stringifySearch**(`search`): `string`

#### Parameters

##### search

`Record`\<`string`, `unknown`\>

#### Returns

`string`

## Remarks

TanStack Router's own serializer writes every value as JSON, so a list filter `status=ACTIVE`
reaches the address bar as `status=%22ACTIVE%22` and a shared link stops reading back the way
the framework's list state wrote it. A list screen keeps its state as plain strings
(`status.in=ACTIVE,PAUSED`), so the search is kept flat: empty, `null` and `undefined` values are
left out, everything else is written with `String()`, and parsing hands back strings.

The one exception is the page's list filters, `CrudSearch.filters`: an object of filter keys
to a string or an array of strings. It is written as one parameter per filter in the bracket form
(`filters[status.in]=FAILED`, `filters[status.in]=FAILED&filters[status.in]=PAUSED` for an
array) and read back into an object. A filter held once reads back as a string even if it was
written as a one-element array; the list reads a set's operators (`in`, `notIn`) as arrays either
way. Writing the filters as top-level keys is not possible, because nothing could then tell
a filter from the other keys a page keeps in its search.

## Example

```ts
const router = createRouter({ routeTree, ...flatSearch });
flatSearch.stringifySearch({ filters: { "status.in": ["FAILED"] } });
// "?filters%5Bstatus.in%5D=FAILED"
```
