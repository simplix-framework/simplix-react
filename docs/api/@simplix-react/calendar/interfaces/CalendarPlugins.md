[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/calendar](../README.md) / CalendarPlugins

# Interface: CalendarPlugins

Defined in: [context/calendar-context.tsx:38](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L38)

Data injected into the timeline and heatmap views.

## Extended by

- [`CalendarProviderProps`](CalendarProviderProps.md)

## Properties

### dayHighlights?

> `optional` **dayHighlights**: [`DayHighlight`](DayHighlight.md)[]

Defined in: [context/calendar-context.tsx:46](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L46)

Generic per-day emphasis applied across month/day/week/timeline (holiday mechanism).

***

### heatmap?

> `optional` **heatmap**: [`HeatmapCell`](HeatmapCell.md)[]

Defined in: [context/calendar-context.tsx:42](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L42)

Aggregate date×hour×count buckets for the heatmap month view.

***

### heatmapMax?

> `optional` **heatmapMax**: `number`

Defined in: [context/calendar-context.tsx:44](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L44)

Relative scale denominator; when absent, the visible month's max count is used.

***

### renderDayBadge()?

> `optional` **renderDayBadge**: (`date`) => `ReactNode`

Defined in: [context/calendar-context.tsx:48](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L48)

Render extra summary badges inside a heatmap day cell.

#### Parameters

##### date

`Date`

#### Returns

`ReactNode`

***

### renderDayContent()?

> `optional` **renderDayContent**: (`date`, `items`) => `ReactNode`

Defined in: [context/calendar-context.tsx:57](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L57)

Replaces the month-view day-cell item badges with consumer-rendered content
(e.g. per-day aggregate chips). Receives the cell date and the items that
overlap it; the day number and highlight label still render above.

Consumed by the month view only — the year view has its own slot,
[CalendarPlugins.renderYearDayContent](#renderyeardaycontent).

#### Parameters

##### date

`Date`

##### items

[`CalendarItem`](CalendarItem.md)\<`unknown`\>[]

#### Returns

`ReactNode`

***

### renderGanttRowExtra()?

> `optional` **renderGanttRowExtra**: (`resource`, `date`) => `ReactNode`

Defined in: [context/calendar-context.tsx:80](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L80)

Appends metadata (worked totals, badges) after the resource name on a
gantt-view row. Receives the row's resource and date.

#### Parameters

##### resource

[`CalendarResource`](CalendarResource.md)

##### date

`Date`

#### Returns

`ReactNode`

***

### renderItemOverlay()?

> `optional` **renderItemOverlay**: (`item`) => `ReactNode`

Defined in: [context/calendar-context.tsx:84](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L84)

Render an action overlay pinned to a time-grid item's bottom-right corner.

#### Parameters

##### item

[`CalendarItem`](CalendarItem.md)

#### Returns

`ReactNode`

***

### renderWeekDayHeader()?

> `optional` **renderWeekDayHeader**: (`date`) => `ReactNode`

Defined in: [context/calendar-context.tsx:82](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L82)

Render an extra per-day summary block under the week-view day header.

#### Parameters

##### date

`Date`

#### Returns

`ReactNode`

***

### renderYearDayContent()?

> `optional` **renderYearDayContent**: (`date`, `items`) => `ReactNode`

Defined in: [context/calendar-context.tsx:70](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L70)

Replaces the year-view day-cell indicator dots with consumer-rendered
content (e.g. one dot plus a `+N` count). Receives the cell date and the
items that overlap it; the day number still renders above, and the returned
node owns its own row layout, so a consumer that wants the dots aligned
differently sets that here.

Consumed by the year view only — the month view has its own slot,
[CalendarPlugins.renderDayContent](#renderdaycontent). When it is absent, the year cell
keeps its built-in rendering: one dot per item up to three, then a single
dot in `items[0]`'s color followed by `+N`.

#### Parameters

##### date

`Date`

##### items

[`CalendarItem`](CalendarItem.md)\<`unknown`\>[]

#### Returns

`ReactNode`

***

### showItemCountBadge?

> `optional` **showItemCountBadge**: `boolean`

Defined in: [context/calendar-context.tsx:75](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L75)

Shows the item-count badge next to the header title. Defaults to true;
consumers whose data is not item-based (aggregate views) turn it off.

***

### timeBands?

> `optional` **timeBands**: [`TimeBand`](TimeBand.md)[]

Defined in: [context/calendar-context.tsx:40](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L40)

Full-width background bands drawn on the resource-timeline axis.

***

### timelineEmptyState?

> `optional` **timelineEmptyState**: `ReactNode`

Defined in: [context/calendar-context.tsx:90](https://github.com/simplix-framework/simplix-react/blob/main/context/calendar-context.tsx#L90)

Replaces the built-in empty state of the gantt and resource-timeline views.
Consumers whose rows only exist for timed records use this to explain what
a rowless day means (e.g. "absences appear in the side panel").
