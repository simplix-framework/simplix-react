[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / findOverallocations

# Function: findOverallocations()

> **findOverallocations**(`project`, `schedule`): [`Overallocation`](../interfaces/Overallocation.md)[]

Defined in: [packages/gantt-core/src/resources.ts:67](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/resources.ts#L67)

Finds every span in which the assignments of a work resource add up to more
than its maximum units while the resource's calendar has working time.
Results are ordered by resource, then by start.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

## Returns

[`Overallocation`](../interfaces/Overallocation.md)[]
