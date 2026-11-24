[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / BarChartProps

# Interface: BarChartProps

Defined in: [packages/ui/src/base/charts/types.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/types.ts#L49)

## Extends

- [`BaseChartProps`](BaseChartProps.md)

## Properties

### categories

> **categories**: `string`[]

Defined in: [packages/ui/src/base/charts/types.ts:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/types.ts#L51)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/base/charts/types.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/types.ts#L31)

#### Inherited from

[`BaseChartProps`](BaseChartProps.md).[`className`](BaseChartProps.md#classname)

***

### height?

> `optional` **height**: `string` \| `number`

Defined in: [packages/ui/src/base/charts/types.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/types.ts#L30)

#### Inherited from

[`BaseChartProps`](BaseChartProps.md).[`height`](BaseChartProps.md#height)

***

### horizontal?

> `optional` **horizontal**: `boolean`

Defined in: [packages/ui/src/base/charts/types.ts:52](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/types.ts#L52)

***

### series

> **series**: [`ChartSeries`](ChartSeries.md)[]

Defined in: [packages/ui/src/base/charts/types.ts:50](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/types.ts#L50)

***

### showLegend?

> `optional` **showLegend**: `boolean`

Defined in: [packages/ui/src/base/charts/types.ts:65](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/types.ts#L65)

Draws the legend even where there is only one series.

<p>The renderer hides a legend for a single series by default, on the reasoning that the
chart's own title already names what it draws. That holds where a caller wrote a title and
not where the series name IS the only word saying what the bars count — a column of months
with no legend leaves the reader to infer the unit. Pass this where the series carries the
name and nothing above the chart repeats it.

#### Default Value

```ts
false
```

***

### stacked?

> `optional` **stacked**: `boolean`

Defined in: [packages/ui/src/base/charts/types.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/types.ts#L53)
