[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / SEARCHABLE\_KEYWORD\_PARAM

# Variable: SEARCHABLE\_KEYWORD\_PARAM

> `const` **SEARCHABLE\_KEYWORD\_PARAM**: `"keyword"` = `"keyword"`

Defined in: [build-searchable-params.ts:25](https://github.com/simplix-framework/simplix-react/blob/main/build-searchable-params.ts#L25)

The query parameter a searchable backend reads its keyword search from: free text matched by
containment against every field the search DTO marks `keyword = true`. Pass it as
[BuildSearchableParamsOptions.searchKey](../interfaces/BuildSearchableParamsOptions.md#searchkey) on a route whose search DTO declares such fields.
