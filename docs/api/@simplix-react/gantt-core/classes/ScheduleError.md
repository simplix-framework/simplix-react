[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / ScheduleError

# Class: ScheduleError

Defined in: [packages/gantt-core/src/errors.ts:23](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/errors.ts#L23)

Raised when a project is structurally unusable: a dependency cycle, a
calendar without working time, a reference to a missing record.

Violated links, constraints and deadlines are not errors; the scheduler
reports them as conflicts on the computed schedule.

## Extends

- `Error`

## Constructors

### Constructor

> **new ScheduleError**(`code`, `message`, `ids?`): `ScheduleError`

Defined in: [packages/gantt-core/src/errors.ts:28](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/errors.ts#L28)

#### Parameters

##### code

[`ScheduleErrorCode`](../type-aliases/ScheduleErrorCode.md)

##### message

`string`

##### ids?

readonly `string`[] = `[]`

#### Returns

`ScheduleError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26](https://github.com/simplix-react/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2022.error.d.ts#L26)

#### Inherited from

`Error.cause`

***

### code

> `readonly` **code**: [`ScheduleErrorCode`](../type-aliases/ScheduleErrorCode.md)

Defined in: [packages/gantt-core/src/errors.ts:24](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/errors.ts#L24)

***

### ids

> `readonly` **ids**: readonly `string`[]

Defined in: [packages/gantt-core/src/errors.ts:26](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/errors.ts#L26)

Ids of the records involved, when the reason names any.

***

### message

> **message**: `string`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1077](https://github.com/simplix-react/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1077)

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1076](https://github.com/simplix-react/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1076)

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: [node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1078](https://github.com/simplix-react/simplix-react/blob/main/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1078)

#### Inherited from

`Error.stack`
