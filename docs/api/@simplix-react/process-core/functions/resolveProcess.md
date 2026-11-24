[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / resolveProcess

# Function: resolveProcess()

> **resolveProcess**(`definition`, `facts?`, `options?`): [`ResolvedProcess`](../interfaces/ResolvedProcess.md)

Defined in: [packages/process-core/src/resolve.ts:39](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/resolve.ts#L39)

Reads a definition for one case.

A step whose condition fails is excluded, and so is one every act of which is excluded. A
condition that reads an unknown fact leaves its step or act in the case, marked conditional. A
jump is drawn when the step it leaves and the step it arrives at both belong to the case.

## Parameters

### definition

[`ProcessDefinition`](../interfaces/ProcessDefinition.md)

a definition [validateDefinition](validateDefinition.md) finds nothing wrong with

### facts?

[`Facts`](../type-aliases/Facts.md) = `{}`

the facts of the case; pass none to read the definition with every condition undecided

### options?

[`ResolveOptions`](../interfaces/ResolveOptions.md) = `{}`

## Returns

[`ResolvedProcess`](../interfaces/ResolvedProcess.md)
