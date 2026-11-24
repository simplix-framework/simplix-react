[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / validateDefinition

# Function: validateDefinition()

> **validateDefinition**(`definition`): [`Problem`](../interfaces/Problem.md)[]

Defined in: [packages/process-core/src/validate.ts:59](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/validate.ts#L59)

Lists everything wrong with a definition, in a fixed order: lanes, sections, steps with their
acts, parallel keys, repeats, then jumps. An empty list means every other function of this
package accepts the definition.

## Parameters

### definition

[`ProcessDefinition`](../interfaces/ProcessDefinition.md)

## Returns

[`Problem`](../interfaces/Problem.md)[]
