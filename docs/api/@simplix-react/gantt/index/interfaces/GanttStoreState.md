[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / GanttStoreState

# Interface: GanttStoreState

Defined in: [model/gantt-store-types.ts:67](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L67)

Reactive state of one chart, with the edits that change it.

## Properties

### barColoring

> **barColoring**: [`BarColoring`](../type-aliases/BarColoring.md)

Defined in: [model/gantt-store-types.ts:112](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L112)

***

### barText

> **barText**: [`BarText`](../type-aliases/BarText.md)

Defined in: [model/gantt-store-types.ts:111](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L111)

***

### baselineNumber

> **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:84](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L84)

Baseline drawn under the bars, or `null` for none.

***

### baselineSlot

> **baselineSlot**: `number`

Defined in: [model/gantt-store-types.ts:86](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L86)

Baseline the save, show and clear commands work on, 0 to 10.

***

### clipboard

> **clipboard**: `TaskClipboard` \| `null`

Defined in: [model/gantt-store-types.ts:91](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L91)

***

### clipboardText

> **clipboardText**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:93](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L93)

The copied tasks as tab-separated text, as it was handed to the system clipboard.

***

### collapsed

> **collapsed**: `ReadonlySet`\<`string`\>

Defined in: [model/gantt-store-types.ts:74](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L74)

Summary tasks whose rows are folded away.

***

### columns

> **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:104](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L104)

Columns of the task table, in the order they are shown.

***

### columnWidths

> **columnWidths**: [`ColumnWidths`](../type-aliases/ColumnWidths.md)

Defined in: [model/gantt-store-types.ts:106](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L106)

Widths of the columns that have been resized.

***

### dialogTaskId

> **dialogTaskId**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:97](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L97)

The task whose information dialog is open, or `null`.

***

### gridWidth

> **gridWidth**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:108](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L108)

Width of the task table, or `null` to fit its columns.

***

### history

> **history**: `History`\<`Project`\>

Defined in: [model/gantt-store-types.ts:68](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L68)

***

### levelingOptions

> **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:118](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L118)

What resource leveling may do.

***

### pane

> **pane**: [`GanttPane`](../type-aliases/GanttPane.md)

Defined in: [model/gantt-store-types.ts:82](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L82)

Whether the Gantt view shows the table, the timeline or both.

***

### pendingMerge

> **pendingMerge**: [`PendingMerge`](PendingMerge.md) \| `null`

Defined in: [model/gantt-store-types.ts:90](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L90)

The conflicts of the last merge that the reader has not settled yet, or `null`.

***

### printing

> **printing**: `boolean`

Defined in: [model/gantt-store-types.ts:101](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L101)

True while the chart is laid out for paper: every row drawn, scaled to the page width.

***

### projectDialogOpen

> **projectDialogOpen**: `boolean`

Defined in: [model/gantt-store-types.ts:98](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L98)

***

### readOnly

> **readOnly**: `boolean`

Defined in: [model/gantt-store-types.ts:116](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L116)

A chart that only shows its plan: every edit is refused.

***

### recurringDialogOpen

> **recurringDialogOpen**: `boolean`

Defined in: [model/gantt-store-types.ts:99](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L99)

***

### rejection

> **rejection**: [`GanttRejection`](GanttRejection.md) \| `null`

Defined in: [model/gantt-store-types.ts:88](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L88)

The last refused edit; cleared by the next accepted one.

***

### schedule

> **schedule**: `Schedule`

Defined in: [model/gantt-store-types.ts:70](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L70)

Computed dates of `history.present`.

***

### scrollRequest

> **scrollRequest**: \{ `seq`: `number`; `target`: `string`; \} \| `null`

Defined in: [model/gantt-store-types.ts:120](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L120)

The latest request to bring something into view; `seq` tells two requests for the same target apart.

***

### selectedLinkId

> **selectedLinkId**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:95](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L95)

The selected dependency line, or `null`. Selecting rows clears it.

***

### selection

> **selection**: readonly `string`[]

Defined in: [model/gantt-store-types.ts:72](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L72)

Selected task ids, in the order they were selected.

***

### showCriticalPath

> **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:77](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L77)

***

### showLinks

> **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:78](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L78)

***

### showMarkers

> **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:80](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L80)

Whether today, the status date and the ends of the plan are marked on the timeline.

***

### showProgressLine

> **showProgressLine**: `boolean`

Defined in: [model/gantt-store-types.ts:114](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L114)

Whether a line joins the progress of every task at the status date.

***

### view

> **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:102](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L102)

***

### viewOptions

> **viewOptions**: [`ViewOptions`](ViewOptions.md)

Defined in: [model/gantt-store-types.ts:110](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L110)

How the rows are narrowed, ordered and gathered.

***

### zoom

> **zoom**: `number`

Defined in: [model/gantt-store-types.ts:76](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L76)

Index into the zoom steps.

## Methods

### addTask()

> **addTask**(`name?`): `string` \| `null`

Defined in: [model/gantt-store-types.ts:203](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L203)

Inserts a new task under the last selected row, or at the end, and selects it.

#### Parameters

##### name?

`string`

#### Returns

`string` \| `null`

***

### apply()

> **apply**(`label`, `edit`): `boolean`

Defined in: [model/gantt-store-types.ts:128](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L128)

Applies an edit as one undo step. A `ScheduleError` from the edit or
from scheduling its result refuses the edit and records the reason.

#### Parameters

##### label

`string`

##### edit

[`GanttEdit`](../type-aliases/GanttEdit.md)

#### Returns

`boolean`

Whether the edit was accepted.

***

### applyLayout()

> **applyLayout**(`layout`): `void`

Defined in: [model/gantt-store-types.ts:167](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L167)

Puts a stored layout back. Fields a stored layout does not have keep their values.

#### Parameters

##### layout

`Partial`\<[`GanttLayout`](GanttLayout.md)\>

#### Returns

`void`

***

### closeProjectDialog()

> **closeProjectDialog**(): `void`

Defined in: [model/gantt-store-types.ts:150](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L150)

#### Returns

`void`

***

### closeRecurringDialog()

> **closeRecurringDialog**(): `void`

Defined in: [model/gantt-store-types.ts:152](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L152)

#### Returns

`void`

***

### closeTaskDialog()

> **closeTaskDialog**(): `void`

Defined in: [model/gantt-store-types.ts:148](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L148)

#### Returns

`void`

***

### copySelected()

> **copySelected**(): `string` \| `null`

Defined in: [model/gantt-store-types.ts:213](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L213)

Copies the selected tasks and returns them as tab-separated text (name,
duration, start, finish, percent complete) for the system clipboard, or
`null` when nothing is selected.

#### Returns

`string` \| `null`

***

### dismissRejection()

> **dismissRejection**(): `void`

Defined in: [model/gantt-store-types.ts:133](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L133)

#### Returns

`void`

***

### getLayout()

> **getLayout**(): [`GanttLayout`](GanttLayout.md)

Defined in: [model/gantt-store-types.ts:165](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L165)

The chart's layout as it is now, to be stored.

#### Returns

[`GanttLayout`](GanttLayout.md)

***

### indentSelected()

> **indentSelected**(): `void`

Defined in: [model/gantt-store-types.ts:206](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L206)

#### Returns

`void`

***

### insertionPoint()

> **insertionPoint**(): `object`

Defined in: [model/gantt-store-types.ts:154](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L154)

Row to insert new rows at, and the outline level to give them: just under the last selected row, or the end.

#### Returns

`object`

##### at

> **at**: `number`

##### level

> **level**: `number`

***

### load()

> **load**(`project`): `void`

Defined in: [model/gantt-store-types.ts:130](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L130)

Replaces the plan and forgets the undo history.

#### Parameters

##### project

`Project`

#### Returns

`void`

***

### merge()

> **merge**(`base`, `theirs`): readonly `MergeConflict`[]

Defined in: [model/gantt-store-types.ts:177](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L177)

Brings a plan changed elsewhere into this one. `base` is the version
both started from. Records only the other side changed are taken;
a record both changed keeps this side's version.

The conflicts stay in `pendingMerge` until the reader settles them.

#### Parameters

##### base

`Project`

##### theirs

`Project`

#### Returns

readonly `MergeConflict`[]

The records both sides changed.

***

### moveColumn()

> **moveColumn**(`column`, `toIndex`): `void`

Defined in: [model/gantt-store-types.ts:186](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L186)

Moves a column to a place among the columns.

#### Parameters

##### column

[`GanttColumnId`](../type-aliases/GanttColumnId.md)

##### toIndex

`number`

#### Returns

`void`

***

### openProjectDialog()

> **openProjectDialog**(): `void`

Defined in: [model/gantt-store-types.ts:149](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L149)

#### Returns

`void`

***

### openRecurringDialog()

> **openRecurringDialog**(): `void`

Defined in: [model/gantt-store-types.ts:151](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L151)

#### Returns

`void`

***

### openTaskDialog()

> **openTaskDialog**(`id`): `void`

Defined in: [model/gantt-store-types.ts:147](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L147)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### outdentSelected()

> **outdentSelected**(): `void`

Defined in: [model/gantt-store-types.ts:207](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L207)

#### Returns

`void`

***

### paste()

> **paste**(): `void`

Defined in: [model/gantt-store-types.ts:224](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L224)

Pastes the copied tasks under the last selected row, or at the end.

#### Returns

`void`

***

### pasteText()

> **pasteText**(`text`): `void`

Defined in: [model/gantt-store-types.ts:220](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L220)

Pastes text from the system clipboard. Text this chart copied pastes the
copied tasks with their links and assignments. Any other text makes one
task per line, reading the first tab-separated cell as the name and the
second, when it is a duration, as the duration.

#### Parameters

##### text

`string`

#### Returns

`void`

***

### redo()

> **redo**(): `void`

Defined in: [model/gantt-store-types.ts:132](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L132)

#### Returns

`void`

***

### removeSelected()

> **removeSelected**(): `void`

Defined in: [model/gantt-store-types.ts:205](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L205)

Removes the selected dependency line, or else the selected tasks.

#### Returns

`void`

***

### reveal()

> **reveal**(`id`): `void`

Defined in: [model/gantt-store-types.ts:189](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L189)

Selects a task and scrolls its row and its bar into view.

#### Parameters

##### id

`string`

#### Returns

`void`

***

### scrollToStart()

> **scrollToStart**(): `void`

Defined in: [model/gantt-store-types.ts:191](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L191)

Scrolls the timeline to the start of the plan.

#### Returns

`void`

***

### scrollToToday()

> **scrollToToday**(): `void`

Defined in: [model/gantt-store-types.ts:193](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L193)

Scrolls the timeline to today, when today lies on it.

#### Returns

`void`

***

### select()

> **select**(`ids`): `void`

Defined in: [model/gantt-store-types.ts:135](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L135)

#### Parameters

##### ids

readonly `string`[]

#### Returns

`void`

***

### selectLink()

> **selectLink**(`id`): `void`

Defined in: [model/gantt-store-types.ts:146](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L146)

#### Parameters

##### id

`string` | `null`

#### Returns

`void`

***

### selectRow()

> **selectRow**(`id`, `mode?`): `void`

Defined in: [model/gantt-store-types.ts:137](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L137)

Selects one row; with `extend` every row from the last selected one to it, with `toggle` adds or removes it.

#### Parameters

##### id

`string`

##### mode?

`"replace"` | `"extend"` | `"toggle"`

#### Returns

`void`

***

### setBarColoring()

> **setBarColoring**(`coloring`): `void`

Defined in: [model/gantt-store-types.ts:162](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L162)

#### Parameters

##### coloring

[`BarColoring`](../type-aliases/BarColoring.md)

#### Returns

`void`

***

### setBarText()

> **setBarText**(`text`): `void`

Defined in: [model/gantt-store-types.ts:161](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L161)

#### Parameters

##### text

[`BarText`](../type-aliases/BarText.md)

#### Returns

`void`

***

### setBaselineNumber()

> **setBaselineNumber**(`number`): `void`

Defined in: [model/gantt-store-types.ts:145](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L145)

#### Parameters

##### number

`number` | `null`

#### Returns

`void`

***

### setBaselineSlot()

> **setBaselineSlot**(`slot`): `void`

Defined in: [model/gantt-store-types.ts:222](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L222)

Picks the baseline the commands work on; a baseline that is shown follows it.

#### Parameters

##### slot

`number`

#### Returns

`void`

***

### setCollapsed()

> **setCollapsed**(`ids`): `void`

Defined in: [model/gantt-store-types.ts:139](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L139)

#### Parameters

##### ids

readonly `string`[]

#### Returns

`void`

***

### setColumns()

> **setColumns**(`columns`): `void`

Defined in: [model/gantt-store-types.ts:157](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L157)

#### Parameters

##### columns

readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

#### Returns

`void`

***

### setColumnWidth()

> **setColumnWidth**(`column`, `width`): `void`

Defined in: [model/gantt-store-types.ts:158](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L158)

#### Parameters

##### column

[`GanttColumnId`](../type-aliases/GanttColumnId.md)

##### width

`number`

#### Returns

`void`

***

### setDurationText()

> **setDurationText**(`id`, `text`): `boolean`

Defined in: [model/gantt-store-types.ts:226](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L226)

Sets a task's duration from text such as `3d`, `2w` or `4h`.

#### Parameters

##### id

`string`

##### text

`string`

#### Returns

`boolean`

***

### setGridWidth()

> **setGridWidth**(`width`): `void`

Defined in: [model/gantt-store-types.ts:159](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L159)

#### Parameters

##### width

`number`

#### Returns

`void`

***

### setLevelingOptions()

> **setLevelingOptions**(`options`): `void`

Defined in: [model/gantt-store-types.ts:187](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L187)

#### Parameters

##### options

`LevelingOptions`

#### Returns

`void`

***

### setPane()

> **setPane**(`pane`): `void`

Defined in: [model/gantt-store-types.ts:144](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L144)

#### Parameters

##### pane

[`GanttPane`](../type-aliases/GanttPane.md)

#### Returns

`void`

***

### setPredecessorText()

> **setPredecessorText**(`id`, `text`): `boolean`

Defined in: [model/gantt-store-types.ts:228](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L228)

Replaces a task's predecessors from text such as `3, 4SS+2d`, naming rows by number.

#### Parameters

##### id

`string`

##### text

`string`

#### Returns

`boolean`

***

### setPrinting()

> **setPrinting**(`printing`): `void`

Defined in: [model/gantt-store-types.ts:155](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L155)

#### Parameters

##### printing

`boolean`

#### Returns

`void`

***

### setShowCriticalPath()

> **setShowCriticalPath**(`show`): `void`

Defined in: [model/gantt-store-types.ts:141](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L141)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowLinks()

> **setShowLinks**(`show`): `void`

Defined in: [model/gantt-store-types.ts:142](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L142)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowMarkers()

> **setShowMarkers**(`show`): `void`

Defined in: [model/gantt-store-types.ts:143](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L143)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowProgressLine()

> **setShowProgressLine**(`show`): `void`

Defined in: [model/gantt-store-types.ts:163](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L163)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### settleMerge()

> **settleMerge**(`takeTheirs`): `void`

Defined in: [model/gantt-store-types.ts:182](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L182)

Settles the conflicts of the last merge: the listed records take the
other side's version, the rest keep this side's. The change can be undone.

#### Parameters

##### takeTheirs

readonly `MergeConflict`[]

#### Returns

`void`

***

### setView()

> **setView**(`view`): `void`

Defined in: [model/gantt-store-types.ts:156](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L156)

#### Parameters

##### view

[`GanttView`](../type-aliases/GanttView.md)

#### Returns

`void`

***

### setViewOptions()

> **setViewOptions**(`options`): `void`

Defined in: [model/gantt-store-types.ts:160](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L160)

#### Parameters

##### options

`Partial`\<[`ViewOptions`](ViewOptions.md)\>

#### Returns

`void`

***

### setZoom()

> **setZoom**(`zoom`): `void`

Defined in: [model/gantt-store-types.ts:140](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L140)

#### Parameters

##### zoom

`number`

#### Returns

`void`

***

### sync()

> **sync**(`project`): `void`

Defined in: [model/gantt-store-types.ts:200](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L200)

Replaces the plan with one changed elsewhere, such as an edit another
user saved. The undo history is kept; undoing past this point brings back
the plan as it was here, without the outside change. `onChange` is not
called, since the change did not come from this chart.

#### Parameters

##### project

`Project`

#### Returns

`void`

***

### toggleCollapsed()

> **toggleCollapsed**(`id`): `void`

Defined in: [model/gantt-store-types.ts:138](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L138)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### toggleColumn()

> **toggleColumn**(`column`): `void`

Defined in: [model/gantt-store-types.ts:184](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L184)

Shows a column at the end of the table, or hides it.

#### Parameters

##### column

[`GanttColumnId`](../type-aliases/GanttColumnId.md)

#### Returns

`void`

***

### undo()

> **undo**(): `void`

Defined in: [model/gantt-store-types.ts:131](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L131)

#### Returns

`void`
