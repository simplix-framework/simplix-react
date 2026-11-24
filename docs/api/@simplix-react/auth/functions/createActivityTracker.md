[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / createActivityTracker

# Function: createActivityTracker()

> **createActivityTracker**(`options?`): [`ActivitySource`](../interfaces/ActivitySource.md) & `object`

Defined in: [packages/auth/src/helpers/activity-tracker.ts:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/activity-tracker.ts#L24)

Tracks when the user last interacted with the page, for an activity-aware token refresh.

Page load counts as activity. A tab coming back into view counts too, since the user is looking
at it again.

## Parameters

### options?

[`ActivityTrackerOptions`](../interfaces/ActivityTrackerOptions.md) = `{}`

## Returns

[`ActivitySource`](../interfaces/ActivitySource.md) & `object`

## Example

```ts
const activity = createActivityTracker();
bearerScheme({ store, token, refresh: { refreshFn, autoSchedule: true, activity } });
```
