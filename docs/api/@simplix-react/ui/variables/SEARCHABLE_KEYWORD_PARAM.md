[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / SEARCHABLE\_KEYWORD\_PARAM

# Variable: SEARCHABLE\_KEYWORD\_PARAM

> `const` **SEARCHABLE\_KEYWORD\_PARAM**: `"keyword"` = `"keyword"`

Defined in: [packages/headless/dist/index.d.ts:160](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L160)

The query parameter a searchable backend reads its keyword search from: free text matched by
containment against every field the search DTO marks `keyword = true`. Pass it as
[BuildSearchableParamsOptions.searchKey](../interfaces/FiltersToRequestParamsOptions.md#searchkey) on a route whose search DTO declares such fields.
