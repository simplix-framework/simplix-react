[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / ProcessFormatError

# Class: ProcessFormatError

Defined in: [packages/process-core/src/format.ts:8](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/format.ts#L8)

A stored definition this package cannot read. `reason` says which way; `detail` names the member at fault for `shape`.

## Extends

- `Error`

## Constructors

### Constructor

> **new ProcessFormatError**(`reason`, `detail?`): `ProcessFormatError`

Defined in: [packages/process-core/src/format.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/format.ts#L12)

#### Parameters

##### reason

[`FormatErrorReason`](../type-aliases/FormatErrorReason.md)

##### detail?

`string`

#### Returns

`ProcessFormatError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26](https://github.com/simplix-framework/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2022.error.d.ts#L26)

#### Inherited from

`Error.cause`

***

### detail?

> `readonly` `optional` **detail**: `string`

Defined in: [packages/process-core/src/format.ts:10](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/format.ts#L10)

***

### message

> **message**: `string`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1077](https://github.com/simplix-framework/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1077)

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1076](https://github.com/simplix-framework/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1076)

#### Inherited from

`Error.name`

***

### reason

> `readonly` **reason**: [`FormatErrorReason`](../type-aliases/FormatErrorReason.md)

Defined in: [packages/process-core/src/format.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/format.ts#L9)

***

### stack?

> `optional` **stack**: `string`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1078](https://github.com/simplix-framework/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1078)

#### Inherited from

`Error.stack`
