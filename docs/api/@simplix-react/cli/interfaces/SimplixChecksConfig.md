[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / SimplixChecksConfig

# Interface: SimplixChecksConfig

Defined in: [config/types.ts:369](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L369)

Inputs of `simplix cycles` and `simplix meta-removals`, relative to the project root.

## Properties

### cycles?

> `optional` **cycles**: `object`

Defined in: [config/types.ts:370](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L370)

#### roots?

> `optional` **roots**: `string`[]

Directories whose source files are the nodes of the import graph.

***

### metaRemovals?

> `optional` **metaRemovals**: `object`

Defined in: [config/types.ts:374](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L374)

#### acknowledged?

> `optional` **acknowledged**: `string`

A JSON file `{ "acknowledged": ["field Owner.name", ...] }` listing removals that are
intended. Absent, nothing is acknowledged.

#### roots?

> `optional` **roots**: `string`[]

Directories whose source files are searched for names the snapshot lost.

#### snapshot?

> `optional` **snapshot**: `string`

The SimpliX Meta snapshot to compare. Absent, the one `openapi[].meta.snapshot` the config
declares is used.
