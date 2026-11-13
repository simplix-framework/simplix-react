[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttStoreState

# Interface: GanttStoreState

Defined in: [model/gantt-store-types.ts:57](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L57)

Reactive state of one chart, with the edits that change it.

## Properties

### barColoring

> **barColoring**: [`BarColoring`](../type-aliases/BarColoring.md)

Defined in: [model/gantt-store-types.ts:98](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L98)

***

### barText

> **barText**: [`BarText`](../type-aliases/BarText.md)

Defined in: [model/gantt-store-types.ts:97](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L97)

***

### baselineNumber

> **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:72](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L72)

Baseline drawn under the bars, or `null` for none.

***

### baselineSlot

> **baselineSlot**: `number`

Defined in: [model/gantt-store-types.ts:74](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L74)

Baseline the save, show and clear commands work on, 0 to 10.

***

### clipboard

> **clipboard**: `TaskClipboard` \| `null`

Defined in: [model/gantt-store-types.ts:77](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L77)

***

### clipboardText

> **clipboardText**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:79](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L79)

The copied tasks as tab-separated text, as it was handed to the system clipboard.

***

### collapsed

> **collapsed**: `ReadonlySet`\<`string`\>

Defined in: [model/gantt-store-types.ts:64](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L64)

Summary tasks whose rows are folded away.

***

### columns

> **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:90](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L90)

Columns of the task table, in the order they are shown.

***

### columnWidths

> **columnWidths**: [`ColumnWidths`](../type-aliases/ColumnWidths.md)

Defined in: [model/gantt-store-types.ts:92](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L92)

Widths of the columns that have been resized.

***

### dialogTaskId

> **dialogTaskId**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:83](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L83)

The task whose information dialog is open, or `null`.

***

### gridWidth

> **gridWidth**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:94](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L94)

Width of the task table, or `null` to fit its columns.

***

### history

> **history**: `History`\<`Project`\>

Defined in: [model/gantt-store-types.ts:58](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L58)

***

### levelingOptions

> **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:104](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L104)

What resource leveling may do.

***

### printing

> **printing**: `boolean`

Defined in: [model/gantt-store-types.ts:87](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L87)

True while the chart is laid out for paper: every row drawn, scaled to the page width.

***

### projectDialogOpen

> **projectDialogOpen**: `boolean`

Defined in: [model/gantt-store-types.ts:84](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L84)

***

### readOnly

> **readOnly**: `boolean`

Defined in: [model/gantt-store-types.ts:102](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L102)

A chart that only shows its plan: every edit is refused.

***

### recurringDialogOpen

> **recurringDialogOpen**: `boolean`

Defined in: [model/gantt-store-types.ts:85](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L85)

***

### rejection

> **rejection**: [`GanttRejection`](GanttRejection.md) \| `null`

Defined in: [model/gantt-store-types.ts:76](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L76)

The last refused edit; cleared by the next accepted one.

***

### schedule

> **schedule**: `Schedule`

Defined in: [model/gantt-store-types.ts:60](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L60)

Computed dates of `history.present`.

***

### scrollRequest

> **scrollRequest**: \{ `seq`: `number`; `target`: `string`; \} \| `null`

Defined in: [model/gantt-store-types.ts:106](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L106)

The latest request to bring something into view; `seq` tells two requests for the same target apart.

***

### selectedLinkId

> **selectedLinkId**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:81](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L81)

The selected dependency line, or `null`. Selecting rows clears it.

***

### selection

> **selection**: readonly `string`[]

Defined in: [model/gantt-store-types.ts:62](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L62)

Selected task ids, in the order they were selected.

***

### showCriticalPath

> **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:67](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L67)

***

### showLinks

> **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:68](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L68)

***

### showMarkers

> **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:70](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L70)

Whether today, the status date and the ends of the plan are marked on the timeline.

***

### showProgressLine

> **showProgressLine**: `boolean`

Defined in: [model/gantt-store-types.ts:100](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L100)

Whether a line joins the progress of every task at the status date.

***

### view

> **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:88](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L88)

***

### viewOptions

> **viewOptions**: [`ViewOptions`](ViewOptions.md)

Defined in: [model/gantt-store-types.ts:96](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L96)

How the rows are narrowed, ordered and gathered.

***

### zoom

> **zoom**: `number`

Defined in: [model/gantt-store-types.ts:66](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L66)

Index into the zoom steps.

## Methods

### addTask()

> **addTask**(`name?`): `string` \| `null`

Defined in: [model/gantt-store-types.ts:181](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L181)

Inserts a new task under the last selected row, or at the end, and selects it.

#### Parameters

##### name?

`string`

#### Returns

`string` \| `null`

***

### apply()

> **apply**(`label`, `edit`): `boolean`

Defined in: [model/gantt-store-types.ts:114](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L114)

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

Defined in: [model/gantt-store-types.ts:152](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L152)

Puts a stored layout back. Fields a stored layout does not have keep their values.

#### Parameters

##### layout

`Partial`\<[`GanttLayout`](GanttLayout.md)\>

#### Returns

`void`

***

### closeProjectDialog()

> **closeProjectDialog**(): `void`

Defined in: [model/gantt-store-types.ts:135](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L135)

#### Returns

`void`

***

### closeRecurringDialog()

> **closeRecurringDialog**(): `void`

Defined in: [model/gantt-store-types.ts:137](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L137)

#### Returns

`void`

***

### closeTaskDialog()

> **closeTaskDialog**(): `void`

Defined in: [model/gantt-store-types.ts:133](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L133)

#### Returns

`void`

***

### copySelected()

> **copySelected**(): `string` \| `null`

Defined in: [model/gantt-store-types.ts:191](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L191)

Copies the selected tasks and returns them as tab-separated text (name,
duration, start, finish, percent complete) for the system clipboard, or
`null` when nothing is selected.

#### Returns

`string` \| `null`

***

### dismissRejection()

> **dismissRejection**(): `void`

Defined in: [model/gantt-store-types.ts:119](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L119)

#### Returns

`void`

***

### getLayout()

> **getLayout**(): [`GanttLayout`](GanttLayout.md)

Defined in: [model/gantt-store-types.ts:150](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L150)

The chart's layout as it is now, to be stored.

#### Returns

[`GanttLayout`](GanttLayout.md)

***

### indentSelected()

> **indentSelected**(): `void`

Defined in: [model/gantt-store-types.ts:184](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L184)

#### Returns

`void`

***

### insertionPoint()

> **insertionPoint**(): `object`

Defined in: [model/gantt-store-types.ts:139](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L139)

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

Defined in: [model/gantt-store-types.ts:116](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L116)

Replaces the plan and forgets the undo history.

#### Parameters

##### project

`Project`

#### Returns

`void`

***

### merge()

> **merge**(`base`, `theirs`): readonly `MergeConflict`[]

Defined in: [model/gantt-store-types.ts:160](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L160)

Brings a plan changed elsewhere into this one. `base` is the version
both started from. Records only the other side changed are taken;
a record both changed keeps this side's version.

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

Defined in: [model/gantt-store-types.ts:164](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L164)

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

Defined in: [model/gantt-store-types.ts:134](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L134)

#### Returns

`void`

***

### openRecurringDialog()

> **openRecurringDialog**(): `void`

Defined in: [model/gantt-store-types.ts:136](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L136)

#### Returns

`void`

***

### openTaskDialog()

> **openTaskDialog**(`id`): `void`

Defined in: [model/gantt-store-types.ts:132](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L132)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### outdentSelected()

> **outdentSelected**(): `void`

Defined in: [model/gantt-store-types.ts:185](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L185)

#### Returns

`void`

***

### paste()

> **paste**(): `void`

Defined in: [model/gantt-store-types.ts:202](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L202)

Pastes the copied tasks under the last selected row, or at the end.

#### Returns

`void`

***

### pasteText()

> **pasteText**(`text`): `void`

Defined in: [model/gantt-store-types.ts:198](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L198)

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

Defined in: [model/gantt-store-types.ts:118](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L118)

#### Returns

`void`

***

### removeSelected()

> **removeSelected**(): `void`

Defined in: [model/gantt-store-types.ts:183](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L183)

Removes the selected dependency line, or else the selected tasks.

#### Returns

`void`

***

### reveal()

> **reveal**(`id`): `void`

Defined in: [model/gantt-store-types.ts:167](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L167)

Selects a task and scrolls its row and its bar into view.

#### Parameters

##### id

`string`

#### Returns

`void`

***

### scrollToStart()

> **scrollToStart**(): `void`

Defined in: [model/gantt-store-types.ts:169](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L169)

Scrolls the timeline to the start of the plan.

#### Returns

`void`

***

### scrollToToday()

> **scrollToToday**(): `void`

Defined in: [model/gantt-store-types.ts:171](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L171)

Scrolls the timeline to today, when today lies on it.

#### Returns

`void`

***

### select()

> **select**(`ids`): `void`

Defined in: [model/gantt-store-types.ts:121](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L121)

#### Parameters

##### ids

readonly `string`[]

#### Returns

`void`

***

### selectLink()

> **selectLink**(`id`): `void`

Defined in: [model/gantt-store-types.ts:131](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L131)

#### Parameters

##### id

`string` | `null`

#### Returns

`void`

***

### selectRow()

> **selectRow**(`id`, `mode?`): `void`

Defined in: [model/gantt-store-types.ts:123](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L123)

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

Defined in: [model/gantt-store-types.ts:147](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L147)

#### Parameters

##### coloring

[`BarColoring`](../type-aliases/BarColoring.md)

#### Returns

`void`

***

### setBarText()

> **setBarText**(`text`): `void`

Defined in: [model/gantt-store-types.ts:146](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L146)

#### Parameters

##### text

[`BarText`](../type-aliases/BarText.md)

#### Returns

`void`

***

### setBaselineNumber()

> **setBaselineNumber**(`number`): `void`

Defined in: [model/gantt-store-types.ts:130](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L130)

#### Parameters

##### number

`number` | `null`

#### Returns

`void`

***

### setBaselineSlot()

> **setBaselineSlot**(`slot`): `void`

Defined in: [model/gantt-store-types.ts:200](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L200)

Picks the baseline the commands work on; a baseline that is shown follows it.

#### Parameters

##### slot

`number`

#### Returns

`void`

***

### setCollapsed()

> **setCollapsed**(`ids`): `void`

Defined in: [model/gantt-store-types.ts:125](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L125)

#### Parameters

##### ids

readonly `string`[]

#### Returns

`void`

***

### setColumns()

> **setColumns**(`columns`): `void`

Defined in: [model/gantt-store-types.ts:142](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L142)

#### Parameters

##### columns

readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

#### Returns

`void`

***

### setColumnWidth()

> **setColumnWidth**(`column`, `width`): `void`

Defined in: [model/gantt-store-types.ts:143](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L143)

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

Defined in: [model/gantt-store-types.ts:204](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L204)

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

Defined in: [model/gantt-store-types.ts:144](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L144)

#### Parameters

##### width

`number`

#### Returns

`void`

***

### setLevelingOptions()

> **setLevelingOptions**(`options`): `void`

Defined in: [model/gantt-store-types.ts:165](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L165)

#### Parameters

##### options

`LevelingOptions`

#### Returns

`void`

***

### setPredecessorText()

> **setPredecessorText**(`id`, `text`): `boolean`

Defined in: [model/gantt-store-types.ts:206](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L206)

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

Defined in: [model/gantt-store-types.ts:140](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L140)

#### Parameters

##### printing

`boolean`

#### Returns

`void`

***

### setShowCriticalPath()

> **setShowCriticalPath**(`show`): `void`

Defined in: [model/gantt-store-types.ts:127](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L127)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowLinks()

> **setShowLinks**(`show`): `void`

Defined in: [model/gantt-store-types.ts:128](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L128)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowMarkers()

> **setShowMarkers**(`show`): `void`

Defined in: [model/gantt-store-types.ts:129](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L129)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowProgressLine()

> **setShowProgressLine**(`show`): `void`

Defined in: [model/gantt-store-types.ts:148](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L148)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setView()

> **setView**(`view`): `void`

Defined in: [model/gantt-store-types.ts:141](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L141)

#### Parameters

##### view

[`GanttView`](../type-aliases/GanttView.md)

#### Returns

`void`

***

### setViewOptions()

> **setViewOptions**(`options`): `void`

Defined in: [model/gantt-store-types.ts:145](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L145)

#### Parameters

##### options

`Partial`\<[`ViewOptions`](ViewOptions.md)\>

#### Returns

`void`

***

### setZoom()

> **setZoom**(`zoom`): `void`

Defined in: [model/gantt-store-types.ts:126](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L126)

#### Parameters

##### zoom

`number`

#### Returns

`void`

***

### sync()

> **sync**(`project`): `void`

Defined in: [model/gantt-store-types.ts:178](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L178)

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

Defined in: [model/gantt-store-types.ts:124](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L124)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### toggleColumn()

> **toggleColumn**(`column`): `void`

Defined in: [model/gantt-store-types.ts:162](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L162)

Shows a column at the end of the table, or hides it.

#### Parameters

##### column

[`GanttColumnId`](../type-aliases/GanttColumnId.md)

#### Returns

`void`

***

### undo()

> **undo**(): `void`

Defined in: [model/gantt-store-types.ts:117](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L117)

#### Returns

`void`
