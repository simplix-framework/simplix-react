[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / BearerSchemeOptions

# Interface: BearerSchemeOptions

Defined in: [packages/auth/src/types.ts:177](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L177)

Options for [bearerScheme](../functions/bearerScheme.md).

## Properties

### refresh?

> `optional` **refresh**: `object`

Defined in: [packages/auth/src/types.ts:188](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L188)

Optional refresh configuration.

#### activity?

> `optional` **activity**: [`ActivitySource`](ActivitySource.md)

Makes the background refresh activity-aware: a scheduled refresh runs only when the user was
active since the tokens were last stored, and otherwise waits for the next activity. An idle
page then lets the issuer's idle timeout end the session, and an active one never meets it.

#### autoSchedule?

> `optional` **autoSchedule**: `boolean`

Enable background timer-based auto refresh. Defaults to `false`.

#### lock?

> `optional` **lock**: [`RefreshLock`](../type-aliases/RefreshLock.md)

Lock that serialises refreshes across tabs. Defaults to the Web Locks API where present.

#### lockName?

> `optional` **lockName**: `string`

Lock name, unique per token store. Without it, refreshes are serialised within the tab only.

#### minIntervalSeconds?

> `optional` **minIntervalSeconds**: `number`

Minimum interval between scheduled refreshes in seconds. Defaults to `30`.

#### onScheduledRefreshFailed()?

> `optional` **onScheduledRefreshFailed**: (`error`) => `void`

Called when a scheduled background refresh is refused. A refresh that never reached the
issuer (a `TypeError` from `fetch`: offline, a laptop waking up) is retried after
`minIntervalSeconds` instead, since the session itself may still be alive.

##### Parameters

###### error

`unknown`

##### Returns

`void`

#### refreshBeforeExpiry?

> `optional` **refreshBeforeExpiry**: `number`

Seconds before expiry to trigger proactive refresh.

#### refreshFn()

> **refreshFn**: () => `Promise`\<[`TokenPair`](TokenPair.md)\>

Async function that returns a fresh token pair.

##### Returns

`Promise`\<[`TokenPair`](TokenPair.md)\>

***

### store

> **store**: [`TokenStore`](TokenStore.md)

Defined in: [packages/auth/src/types.ts:179](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L179)

Token store for persisting access and refresh tokens.

***

### token

> **token**: `string` \| () => `string` \| `null`

Defined in: [packages/auth/src/types.ts:185](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/types.ts#L185)

Static token string or function returning the current access token.
If a function, called on each request.
