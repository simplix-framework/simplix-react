[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/mock](../README.md) / StopMockingOptions

# Interface: StopMockingOptions

Defined in: [stop-mocking.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/stop-mocking.ts#L7)

Options for [stopMocking](../functions/stopMocking.md).

## Properties

### storePrefix?

> `optional` **storePrefix**: `string`

Defined in: [stop-mocking.ts:14](https://github.com/simplix-framework/simplix-react/blob/main/stop-mocking.ts#L14)

Auth store prefix whose stored tokens are dropped when a stale worker is found. Mock
sign-in mints tokens that authenticate nothing on a real server, so leaving them behind
lands the app on a login page it was already trying to skip. Omit for apps that store
no tokens.
