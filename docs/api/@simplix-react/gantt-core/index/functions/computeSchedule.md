[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / computeSchedule

# Function: computeSchedule()

> **computeSchedule**(`project`): [`Schedule`](../interfaces/Schedule.md)

Defined in: [packages/gantt-core/src/schedule.ts:131](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/schedule.ts#L131)

Computes the dates, slack, critical path and conflicts of a project.

A project scheduled from its start places each task as early as its links
and constraints allow and reads late dates back from the resulting finish;
one scheduled from its finish does the reverse. A summary task takes its
dates from the tasks under it, and a link on a summary task binds every
task under it.

## Parameters

### project

[`Project`](../interfaces/Project.md)

## Returns

[`Schedule`](../interfaces/Schedule.md)

## Throws

ScheduleError when the project cannot be scheduled at all: a
duplicate id, a broken outline, a reference to a missing task or calendar,
a negative duration, a constraint without its date, a calendar without
working time or a dependency cycle. A broken link, constraint or deadline
is returned in `conflicts` instead.
