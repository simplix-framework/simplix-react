[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / OpenAPISpecConfig

# Interface: OpenAPISpecConfig

Defined in: [config/types.ts:417](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L417)

Per-spec OpenAPI configuration

## Properties

### crud?

> `optional` **crud**: `Partial`\<`Record`\<`CrudRole`, [`CrudEndpointPattern`](CrudEndpointPattern.md)\>\>

Defined in: [config/types.ts:434](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L434)

CRUD role detection patterns. When omitted, no CRUD roles are assigned.

***

### domains

> **domains**: `Record`\<`string`, `string`[]\>

Defined in: [config/types.ts:432](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L432)

Tag-based domain splitting: domainName → tagPatterns (exact string or /regex/)

***

### meta?

> `optional` **meta**: [`OpenAPIMetaConfig`](OpenAPIMetaConfig.md)

Defined in: [config/types.ts:436](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L436)

DTO metadata generation. Omit the block and the meta pipeline does not run for this spec.

***

### naming?

> `optional` **naming**: [`OpenApiNamingStrategy`](OpenApiNamingStrategy.md)

Defined in: [config/types.ts:428](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L428)

NamingStrategy — overrides profile's naming if both are set

***

### profile?

> `optional` **profile**: `string`

Defined in: [config/types.ts:426](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L426)

Spec Profile preset name (bundles naming + responseAdapter)

***

### responseAdapter?

> `optional` **responseAdapter**: [`ResponseAdapterConfig`](../type-aliases/ResponseAdapterConfig.md)

Defined in: [config/types.ts:430](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L430)

ResponseAdapter — overrides profile's responseAdapter if both are set

***

### spec?

> `optional` **spec**: `string`

Defined in: [config/types.ts:424](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L424)

The OpenAPI document the Orval half reads. Optional: a project that has finished migrating
runs `simplix meta`, which needs no document — it states `meta.source` instead. `simplix
openapi` still requires one and says so.
