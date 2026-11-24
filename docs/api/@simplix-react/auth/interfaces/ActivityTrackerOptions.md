[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / ActivityTrackerOptions

# Interface: ActivityTrackerOptions

Defined in: [packages/auth/src/helpers/activity-tracker.ts:3](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/activity-tracker.ts#L3)

## Properties

### events?

> `optional` **events**: readonly `string`[]

Defined in: [packages/auth/src/helpers/activity-tracker.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/activity-tracker.ts#L7)

Events that count as activity.

***

### target?

> `optional` **target**: `Pick`\<`EventTarget`, `"addEventListener"` \| `"removeEventListener"`\>

Defined in: [packages/auth/src/helpers/activity-tracker.ts:5](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/helpers/activity-tracker.ts#L5)

Element or window to listen on. Defaults to `window`.
