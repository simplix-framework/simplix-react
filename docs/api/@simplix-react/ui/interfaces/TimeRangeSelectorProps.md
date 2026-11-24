[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / TimeRangeSelectorProps

# Interface: TimeRangeSelectorProps

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L30)

Props for the [TimeRangeSelector](../functions/TimeRangeSelector.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:82](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L82)

CSS class

***

### colorStepBaseMinutes?

> `optional` **colorStepBaseMinutes**: `number`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:60](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L60)

Bucket size (in minutes) that colorSteps are calibrated for.

#### Default Value

```ts
60
```

***

### colorSteps?

> `optional` **colorSteps**: `number`[]

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:58](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L58)

Color scale step boundaries calibrated to 1-hour buckets (e.g., [1, 3, 5, 10]).
 Steps are auto-scaled proportionally when bucket size differs from 1 hour.
 0 and max are auto-added.

***

### colorTheme?

> `optional` **colorTheme**: [`HeatmapColorTheme`](../type-aliases/HeatmapColorTheme.md)

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:62](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L62)

Heatmap color theme.

#### Default Value

```ts
"slate"
```

***

### defaultWindow?

> `optional` **defaultWindow**: `string`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:66](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L66)

Initial window preset key.

#### Default Value

```ts
"1d"
```

***

### displayZone?

> `optional` **displayZone**: `string`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:80](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L80)

IANA display zone for the selector's calendar semantics: the calendar-flavored
preset boundaries ("today"-anchored day windows, calendar-month windows) are
computed at THIS zone's midnights, and axis/hover/range labels render in it.
Omitted → browser zone (legacy). Relative windows (last N minutes/hours) are
zone-independent instants either way.

***

### fetchCounts()

> **fetchCounts**: (`from`, `to`, `bucketCount`) => `Promise`\<`number`[]\>

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:52](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L52)

Fetch counts for the visible window. Called when view range changes.

#### Parameters

##### from

`Date`

##### to

`Date`

##### bucketCount

`number`

#### Returns

`Promise`\<`number`[]\>

***

### hour12?

> `optional` **hour12**: `boolean`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:72](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L72)

Use 12-hour time formatting (AM/PM).

#### Default Value

```ts
false — compact 24-hour, suited to the dense label row.
```

***

### maxCount?

> `optional` **maxCount**: `number`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:54](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L54)

Fixed max value for heatmap scale. Auto-calculated if omitted.

***

### maxDate?

> `optional` **maxDate**: `Date`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:70](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L70)

Latest allowed date

***

### minDate?

> `optional` **minDate**: `Date`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:68](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L68)

Earliest allowed date

***

### onChange()

> **onChange**: (`range`) => `void`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:40](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L40)

Range change callback

#### Parameters

##### range

[`TimeRangeValue`](TimeRangeValue.md)

#### Returns

`void`

***

### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:50](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L50)

Called when the reader turns the selection off: pressing the lit preset again, the clear action
beside the range, Escape on the strip, or the select's "Clear selection" entry in a narrow bar.
The host answers by setting `value` to null.

<p>[TimeRangeSelectorProps.onChange](#onchange) always carries a range, so without this a selection
can only be replaced by another one and a screen that narrows its list by it cannot go back to
unnarrowed. Left out, those controls select the visible window as they always did.

#### Returns

`void`

***

### presets?

> `optional` **presets**: [`WindowPreset`](WindowPreset.md)[]

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:64](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L64)

Available window presets. Defaults provided if omitted.

***

### value

> **value**: [`TimeRange`](TimeRange.md) \| `null`

Defined in: [packages/ui/src/base/inputs/time-range-selector/types.ts:38](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/time-range-selector/types.ts#L38)

The selected sub-range, or null when nothing is selected.

<p>A screen opens with null: the strip shows its default window's shape and the list under
it is unnarrowed. Selecting a span is a deliberate act, not the state a page loads in.
