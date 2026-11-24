[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / AutoRefreshScheduler

# Class: AutoRefreshScheduler

Defined in: [packages/auth/src/helpers/auto-refresh-scheduler.ts:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/auto-refresh-scheduler.ts#L18)

Timer-based background token refresh scheduler.

Schedules a refresh before the access token expires, with deduplication
via a minimum interval guard.

## Constructors

### Constructor

> **new AutoRefreshScheduler**(`options?`): `AutoRefreshScheduler`

Defined in: [packages/auth/src/helpers/auto-refresh-scheduler.ts:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/auto-refresh-scheduler.ts#L22)

#### Parameters

##### options?

[`AutoRefreshSchedulerOptions`](../interfaces/AutoRefreshSchedulerOptions.md) = `{}`

#### Returns

`AutoRefreshScheduler`

## Methods

### isRunning()

> **isRunning**(): `boolean`

Defined in: [packages/auth/src/helpers/auto-refresh-scheduler.ts:43](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/auto-refresh-scheduler.ts#L43)

#### Returns

`boolean`

***

### start()

> **start**(`refreshFn`, `getExpiresAt`): `void`

Defined in: [packages/auth/src/helpers/auto-refresh-scheduler.ts:28](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/auto-refresh-scheduler.ts#L28)

Starts the schedule. `refreshFn` may resolve `null` to say it skipped this refresh; the
schedule then stops until the next `start`.

#### Parameters

##### refreshFn

() => `Promise`\<[`TokenPair`](../interfaces/TokenPair.md) \| `null`\>

##### getExpiresAt

() => `number` \| `null`

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [packages/auth/src/helpers/auto-refresh-scheduler.ts:36](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/auto-refresh-scheduler.ts#L36)

#### Returns

`void`
