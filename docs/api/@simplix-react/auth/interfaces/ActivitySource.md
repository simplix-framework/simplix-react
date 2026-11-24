[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / ActivitySource

# Interface: ActivitySource

Defined in: [packages/auth/src/types.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L53)

Reports when the user last did something on the page.

## See

[createActivityTracker](../functions/createActivityTracker.md) for the browser implementation.

## Methods

### lastActivityAt()

> **lastActivityAt**(): `number`

Defined in: [packages/auth/src/types.ts:55](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L55)

Epoch milliseconds of the most recent activity.

#### Returns

`number`

***

### onActivity()

> **onActivity**(`listener`): () => `void`

Defined in: [packages/auth/src/types.ts:60](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L60)

Subscribes to activity.

#### Parameters

##### listener

() => `void`

#### Returns

An unsubscribe function.

> (): `void`

##### Returns

`void`
