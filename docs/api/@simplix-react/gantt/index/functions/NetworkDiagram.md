[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / NetworkDiagram

# Function: NetworkDiagram()

> **NetworkDiagram**(): `Element`

Defined in: [components/network-diagram.tsx:22](https://github.com/simplix-react/simplix-react/blob/main/components/network-diagram.tsx#L22)

The network diagram: every task without tasks under it as a box, placed in
a column one past its latest predecessor, with a line for every dependency.
Critical tasks and the links between them are drawn in the destructive
colour. Choosing a box opens the task's information dialog. The diagram
zooms in steps and fits itself to the screen on request.

## Returns

`Element`
