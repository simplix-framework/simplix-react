[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / OpenAPIMetaConfig

# Interface: OpenAPIMetaConfig

Defined in: [config/types.ts:398](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L398)

DTO metadata generation for one spec.

## Remarks

SimpliX Meta is served by the backend and carries what an OpenAPI document loses — validation
constraints, search operators, `@PreAuthorize` and labeled enums. It is generated into
`src/generated-meta/` of every domain package the spec produces.

## Properties

### export?

> `optional` **export**: `string`[]

Defined in: [config/types.ts:407](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L407)

Domains whose barrel exports the meta output instead of the orval output.

***

### ignoreTags?

> `optional` **ignoreTags**: `string`[]

Defined in: [config/types.ts:413](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L413)

Tags no domain claims on purpose (a development controller, an API browser), as glob patterns
over the dot-separated tag: `*` matches within one segment, `**` across segments. A tag matched
here is neither warned about nor refused by `--strict`.

***

### snapshot?

> `optional` **snapshot**: `string`

Defined in: [config/types.ts:405](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L405)

Where a fetched SimpliX Meta is written for offline regeneration.

***

### source?

> `optional` **source**: `string`

Defined in: [config/types.ts:403](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L403)

Endpoint URL or snapshot path. Omit it and the source is built the way the i18n download
already builds its own: the origin of `spec` plus the profile's `metaEndpoint`.
