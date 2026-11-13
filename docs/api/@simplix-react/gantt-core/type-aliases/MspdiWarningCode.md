[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / MspdiWarningCode

# Type Alias: MspdiWarningCode

> **MspdiWarningCode** = `"leveling-delay-dropped"` \| `"recurrence-skipped"` \| `"working-time-overnight"` \| `"working-day-without-hours"` \| `"baseline-incomplete"` \| `"timephased-data-dropped"` \| `"link-skipped"` \| `"assignment-skipped"` \| `"null-task-skipped"` \| `"unknown-code"`

Defined in: [packages/gantt-core/src/mspdi/warnings.ts:18](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/warnings.ts#L18)

Reason an MSPDI import left something out or read it differently from the
file.

- `leveling-delay-dropped`: a task's non-zero LevelingDelay was imported as 0.
- `recurrence-skipped`: a recurring calendar exception of a kind that is not expanded.
- `working-time-overnight`: a working time ending past midnight, cut at midnight.
- `working-day-without-hours`: a day marked working with no working times, read as non-working.
- `baseline-incomplete`: a baseline lacking a start, a finish or a duration.
- `timephased-data-dropped`: timephased data (work contours, splits) that is not imported.
- `link-skipped`: a predecessor link to a task that is not in the file or in another project.
- `assignment-skipped`: an assignment naming a task or resource that is not in the file.
- `null-task-skipped`: a blank task row.
- `unknown-code`: a code outside the published set, read as the documented default.
