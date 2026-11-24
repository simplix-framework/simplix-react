[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / evaluateCondition

# Function: evaluateCondition()

> **evaluateCondition**(`condition`, `facts`): [`Verdict`](../type-aliases/Verdict.md)

Defined in: [packages/process-core/src/condition.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/condition.ts#L12)

Evaluates a condition under the facts given, in three values.

`all` fails as soon as one part fails and `any` holds as soon as one part holds, whatever the
unknown parts would have been; an empty `all` holds and an empty `any` fails.

## Parameters

### condition

[`Condition`](../type-aliases/Condition.md)

### facts

[`Facts`](../type-aliases/Facts.md)

## Returns

[`Verdict`](../type-aliases/Verdict.md)
