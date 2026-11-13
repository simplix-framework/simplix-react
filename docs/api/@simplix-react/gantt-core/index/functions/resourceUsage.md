[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / resourceUsage

# Function: resourceUsage()

> **resourceUsage**(`project`, `schedule`, `fromDay`, `toDay`): `Map`\<`string`, [`ResourceUsage`](../interfaces/ResourceUsage.md)\>

Defined in: [packages/gantt-core/src/resources.ts:135](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/resources.ts#L135)

Totals the booked work of every work resource for each day of an inclusive
range of day indexes. An assignment counts its units against the working
time of the resource's calendar inside the task's dates.

## Parameters

### project

[`Project`](../interfaces/Project.md)

### schedule

[`Schedule`](../interfaces/Schedule.md)

### fromDay

`number`

### toDay

`number`

## Returns

`Map`\<`string`, [`ResourceUsage`](../interfaces/ResourceUsage.md)\>
