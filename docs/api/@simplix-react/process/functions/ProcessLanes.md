[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process](../README.md) / ProcessLanes

# Function: ProcessLanes()

> **ProcessLanes**(`__namedParameters`): `Element`

Defined in: [components/process-lanes.tsx:32](https://github.com/simplix-framework/simplix-react/blob/main/components/process-lanes.tsx#L32)

A procedure drawn from its definition: steps and acts on a grid of lanes where the box it
stands in is wide enough, the same grid scrolled sideways where it is not, and one column of
step cards on a narrow box.

The layout follows the width of the component's own box and the lanes it has to show, never
the width of the screen, so a narrow side panel on a wide screen gets the narrow layout.

## Parameters

### \_\_namedParameters

[`ProcessLanesProps`](../interfaces/ProcessLanesProps.md)

## Returns

`Element`

## Example

```tsx
<ProcessLanes definition={definition} facts={{ large: true }} onSelect={(target) => open(target)} />
```
