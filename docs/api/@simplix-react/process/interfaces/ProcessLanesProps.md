[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process](../README.md) / ProcessLanesProps

# Interface: ProcessLanesProps

Defined in: [types.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L13)

Props of [ProcessLanes](../functions/ProcessLanes.md).

## Properties

### className?

> `optional` **className**: `string`

Defined in: [types.ts:58](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L58)

***

### defaultLayout?

> `optional` **defaultLayout**: `LayoutMode`

Defined in: [types.ts:27](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L27)

The layout drawn before the box has been measured, on a server or on the first paint.

#### Default Value

```ts
"lanes"
```

***

### definition

> **definition**: `ProcessDefinition`

Defined in: [types.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L15)

A definition `validateDefinition` finds nothing wrong with.

***

### facts?

> `optional` **facts**: `Readonly`\<`Record`\<`string`, `boolean`\>\>

Defined in: [types.ts:17](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L17)

The facts of the case shown. Left out, every condition is undecided and its step is marked conditional.

***

### highlightLanes?

> `optional` **highlightLanes**: readonly `string`[]

Defined in: [types.ts:35](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L35)

The lanes the reader holds, by id: drawn with a tint of their own and named as the reader's.

***

### laneFilter?

> `optional` **laneFilter**: `boolean`

Defined in: [types.ts:44](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L44)

Draws the row of lane toggles above the procedure.

#### Default Value

```ts
false
```

***

### layout?

> `optional` **layout**: `"lanes"` \| `"auto"` \| `"stack"`

Defined in: [types.ts:25](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L25)

`auto` chooses from the width of the box the component stands in and the lanes it has to
show; `lanes` and `stack` keep one layout whatever the width.

#### Default Value

```ts
"auto"
```

***

### leftOut?

> `optional` **leftOut**: `LeftOut`

Defined in: [types.ts:42](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L42)

What is done with the steps and acts the case leaves out. `drawn`: each keeps its place, drawn
faint and named as not applicable, so the procedure has one shape whatever the facts.
`folded`: a left-out step is one line, and a lane only left-out acts stand in is not drawn.

#### Default Value

```ts
"drawn"
```

***

### marks?

> `optional` **marks**: `Readonly`\<`Record`\<`string`, `string`\>\>

Defined in: [types.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L49)

A word on a step, an act or a jump, by id, set on its element as `data-mark`. The marks `added`,
`changed` and `moved` are drawn by this package's styles; any other is the caller's to style.

***

### metrics?

> `optional` **metrics**: `Partial`\<`LayoutMetrics`\>

Defined in: [types.ts:29](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L29)

Widths the choice of a layout is made from, where they differ from the defaults.

***

### onSelect()?

> `optional` **onSelect**: (`target`) => `void`

Defined in: [types.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L53)

Called when the reader picks a step, an act or a jump.

#### Parameters

##### target

[`ProcessTarget`](ProcessTarget.md)

#### Returns

`void`

***

### onVisibleLanesChange()?

> `optional` **onVisibleLanesChange**: (`lanes`) => `void`

Defined in: [types.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L33)

Called with the lanes to draw when the reader changes them.

#### Parameters

##### lanes

`string`[]

#### Returns

`void`

***

### renderDetail()?

> `optional` **renderDetail**: (`target`) => `ReactNode`

Defined in: [types.ts:55](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L55)

What to draw for the picked target: under the lane grid, or inside the step's card in one column.

#### Parameters

##### target

[`ProcessTarget`](ProcessTarget.md)

#### Returns

`ReactNode`

***

### run?

> `optional` **run**: `ProcessRunState`

Defined in: [types.ts:19](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L19)

The progress of a running case. Left out, the definition is drawn on its own.

***

### scrollToActive?

> `optional` **scrollToActive**: `boolean`

Defined in: [types.ts:57](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L57)

Scrolls the step in progress into view when the procedure is first drawn.

#### Default Value

```ts
true
```

***

### selected?

> `optional` **selected**: [`ProcessTarget`](ProcessTarget.md) \| `null`

Defined in: [types.ts:51](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L51)

What is picked now.

***

### visibleLanes?

> `optional` **visibleLanes**: readonly `string`[]

Defined in: [types.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L31)

The lanes to draw, by id. Left out, the component keeps the choice itself and starts with every lane.
