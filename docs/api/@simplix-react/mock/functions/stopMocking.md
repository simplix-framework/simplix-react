[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/mock](../README.md) / stopMocking

# Function: stopMocking()

> **stopMocking**(`options?`): `Promise`\<`boolean`\>

Defined in: [stop-mocking.ts:35](https://github.com/simplix-framework/simplix-react/blob/main/stop-mocking.ts#L35)

Removes a mock service worker a previous mock-mode run left registered.

<p>A service worker outlives the dev server that installed it. Boot an app against a real
server after a `VITE_ENABLE_MOCK=true` session and the old worker still answers every
request from fixtures: signing in fails against accounts that exist only in the mock, and
because the request never leaves the browser there is nothing in the server log to read.
Call this from the branch that decides NOT to install a worker, so clearing the flag is
enough to be rid of one.

<p>Unregistering does not release the document a worker already controls, so a page still
under its control is reloaded. That happens at most once per stale worker — the next boot
finds no registration left to remove.

## Parameters

### options?

[`StopMockingOptions`](../interfaces/StopMockingOptions.md) = `{}`

tokens to clear alongside the worker

## Returns

`Promise`\<`boolean`\>

whether a reload was triggered, so the caller can skip rendering a page that is
    about to be replaced
