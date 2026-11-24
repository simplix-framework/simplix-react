[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / chooseLayout

# Function: chooseLayout()

> **chooseLayout**(`input`, `metrics?`): [`LayoutMode`](../type-aliases/LayoutMode.md)

Defined in: [packages/process-core/src/layout-mode.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/layout-mode.ts#L48)

Chooses a layout from the width of the container and what the grid has to hold.

A width that sits on a threshold would otherwise flip the layout on every pixel of resizing, so
a layout once narrowed is kept until the container is wider than the threshold by `slack`.

## Parameters

### input

[`LayoutInput`](../interfaces/LayoutInput.md)

### metrics?

[`LayoutMetrics`](../interfaces/LayoutMetrics.md) = `DEFAULT_LAYOUT_METRICS`

## Returns

[`LayoutMode`](../type-aliases/LayoutMode.md)
