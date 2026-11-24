[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / StepSpan

# Interface: StepSpan

Defined in: [packages/process-core/src/lane-geometry.ts:81](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L81)

A step on the grid: the rows its title stands beside, and the jumps that leave and reach it.

## Properties

### arrivals

> **arrivals**: `string`[]

Defined in: [packages/process-core/src/lane-geometry.ts:88](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L88)

The jumps whose line arrives at the step.

***

### firstRow

> **firstRow**: `number`

Defined in: [packages/process-core/src/lane-geometry.ts:83](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L83)

***

### jumps

> **jumps**: `string`[]

Defined in: [packages/process-core/src/lane-geometry.ts:86](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L86)

The jumps listed with the step: every drawn jump that leaves it, a line or not.

***

### lastRow

> **lastRow**: `number`

Defined in: [packages/process-core/src/lane-geometry.ts:84](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L84)

***

### node

> **node**: `object`

Defined in: [packages/process-core/src/lane-geometry.ts:94](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L94)

The step's first act, where its jumps leave and arrive: its row, the lane lines on the left
join it in, and the lane lines on the right join it in. The two differ only where the first
act is performed by several lanes together.

#### lane

> **lane**: `number`

#### rightLane

> **rightLane**: `number`

#### row

> **row**: `number`

***

### stepId

> **stepId**: `string`

Defined in: [packages/process-core/src/lane-geometry.ts:82](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L82)
