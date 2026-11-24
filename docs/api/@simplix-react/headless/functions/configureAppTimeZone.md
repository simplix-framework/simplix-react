[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / configureAppTimeZone

# Function: configureAppTimeZone()

> **configureAppTimeZone**(`zone`): `void`

Defined in: [datetime/app-timezone.ts:103](https://github.com/simplix-framework/simplix-react/blob/main/datetime/app-timezone.ts#L103)

Install the backend-delivered application time zone (the bootstrap response's
`defaultTimeZone`). Call once at app startup; every [useAppTimeZone](useAppTimeZone.md)
consumer re-renders with the new zone. A blank/nullish value clears back to
the build-time fallback, and so does one this runtime cannot resolve — said
out loud, because the deployment then reckons a day in a zone none of its
screens can draw.

## Parameters

### zone

`string` | `null` | `undefined`

## Returns

`void`
