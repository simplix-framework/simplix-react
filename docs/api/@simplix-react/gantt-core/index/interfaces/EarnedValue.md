[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / EarnedValue

# Interface: EarnedValue

Defined in: [packages/gantt-core/src/progress.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L53)

Earned value figures of one task, or of the tasks under a summary task.

## Properties

### actualCost

> **actualCost**: `number`

Defined in: [packages/gantt-core/src/progress.ts:61](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L61)

Actual cost: the recorded one, or the earned value when none is recorded.

***

### budget

> **budget**: `number`

Defined in: [packages/gantt-core/src/progress.ts:55](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L55)

Budget at completion: the baseline cost, or the current cost when the baseline holds none.

***

### costPerformance

> **costPerformance**: `number` \| `null`

Defined in: [packages/gantt-core/src/progress.ts:67](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L67)

Earned value over actual cost; `null` when nothing has been spent.

***

### costVariance

> **costVariance**: `number`

Defined in: [packages/gantt-core/src/progress.ts:63](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L63)

***

### earnedValue

> **earnedValue**: `number`

Defined in: [packages/gantt-core/src/progress.ts:59](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L59)

Earned value: the share of the budget the completed work stands for.

***

### plannedValue

> **plannedValue**: `number`

Defined in: [packages/gantt-core/src/progress.ts:57](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L57)

Planned value: the share of the budget the baseline had scheduled by the status date.

***

### schedulePerformance

> **schedulePerformance**: `number` \| `null`

Defined in: [packages/gantt-core/src/progress.ts:65](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L65)

Earned over planned value; `null` when nothing was planned yet.

***

### scheduleVariance

> **scheduleVariance**: `number`

Defined in: [packages/gantt-core/src/progress.ts:62](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/progress.ts#L62)
