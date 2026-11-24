[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / applyEdit

# Function: applyEdit()

> **applyEdit**(`definition`, `operation`, `options?`): [`EditResult`](../type-aliases/EditResult.md)

Defined in: [packages/process-core/src/edit.ts:289](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/edit.ts#L289)

Applies one operation and returns a new definition; the one given is left as it is, and every
member no operation names is carried over, the ones this package does not know included.

An operation is applied only when it leaves no problem [validateDefinition](validateDefinition.md) did not
already report, so a definition without problems stays without them. Where steps are added,
moved or removed, what depends on them follows: a step put inside a parallel run joins it, a
run left with one step loses its key (also when `set-parallel` takes steps out of it), a repeat whose ending step is gone is cleared and a jump
from or to a removed step is removed. Each of those is listed in `consequences`.

With `keepFlow` an operation that changes what the procedure does is refused as `flow-changed`,
for a product whose flow is fixed elsewhere and whose procedures are only worded and assigned here.

## Parameters

### definition

[`ProcessDefinition`](../interfaces/ProcessDefinition.md)

### operation

[`EditOperation`](../type-aliases/EditOperation.md)

### options?

[`EditOptions`](../interfaces/EditOptions.md) = `{}`

## Returns

[`EditResult`](../type-aliases/EditResult.md)

## Example

```ts
const result = applyEdit(definition, { type: "remove-step", id: "review" });
if (result.ok) save(result.definition);
else explain(result.refusal);
```
