[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / periodStanding

# Function: periodStanding()

> **periodStanding**(`startOn`, `endOn`): [`PeriodStanding`](../type-aliases/PeriodStanding.md)

Defined in: [datetime/period-distance.ts:27](https://github.com/simplix-framework/simplix-react/blob/main/datetime/period-distance.ts#L27)

Where a period stands from today, which is what decides what it is called.

<p><b>기간은 오늘로부터의 거리로 그린다.</b> Whether a period is 예정, 진행 중 or 종료 is decided
by that distance, so a screen that draws only its two dates has drawn something that stops
agreeing with the status beside it after one day — and the reader has to do the subtraction to
find out which of the three they are looking at.

<p><b>The dates stay.</b> The distance is what the reader judges by and the dates are what they
check against; a screen showing only 「6일 남음」 cannot be compared with anything.

## Parameters

### startOn

the first day, as a calendar date

`string` | `null` | `undefined`

### endOn

the last day, as a calendar date

`string` | `null` | `undefined`

## Returns

[`PeriodStanding`](../type-aliases/PeriodStanding.md)

where the period stands, or `unknown` when neither date is known
