[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / ProblemCode

# Type Alias: ProblemCode

> **ProblemCode** = `"duplicate-lane"` \| `"duplicate-section"` \| `"duplicate-step"` \| `"duplicate-act"` \| `"duplicate-jump"` \| `"step-without-acts"` \| `"act-without-lanes"` \| `"act-repeats-lane"` \| `"unknown-lane"` \| `"invalid-condition"` \| `"jump-unknown-from"` \| `"jump-unknown-to"` \| `"jump-to-self"` \| `"jump-target-count"` \| `"repeat-unknown-end"` \| `"repeat-end-not-after"` \| `"parallel-not-adjacent"` \| `"parallel-single"` \| `"parallel-spans-sections"`

Defined in: [packages/process-core/src/validate.ts:5](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/validate.ts#L5)

Every way a definition can be wrong. The code is what a caller branches on; the rest locates it.
