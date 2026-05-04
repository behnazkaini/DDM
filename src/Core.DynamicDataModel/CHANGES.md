# DDM Changes — Branch `dev-new-ddm`

## Overview

This branch delivers two large, interlocking changes to the **Dynamic Data Model** (DDM) module:

1. **Renderer: replace Blockly runtime with a data-driven derivation engine** — form-event execution no longer loads or runs a Blockly workspace at runtime; instead, a lightweight parser extracts the arithmetic/action semantics from the stored XML and executes them through a Zustand store.
2. **Designer: "OperationOnEvent" redesign** — the old QueryBuilder grid is replaced by a hand-crafted card-based list UI. Items (columns and relations) are now sourced from the DataModel rather than from layout items, so fields that are not yet placed on the form are still selectable.

---

## 1. New Renderer Store (`Renderer/store/`)

### `FormValuesStore.ts` _(new file)_

A **per-layout Zustand vanilla store** that owns all runtime form state:

| Slice | Description |
|---|---|
| `fields` | Plain values keyed by `rowKey` (ColumnGuid / RelationGuid) |
| `gridRows` | Archive-table rows keyed by SubLayout's RelationGuid |
| `derived` | Computed output values (pushed back into the AntD form) |
| `fieldMeta` | Dynamic `required` / `disabled` flags per `rowKey` |

**Actions:**
- `setField(rowKey, value)` — called when any regular input changes; re-runs the whole derivation graph.
- `setGrid(rowKey, rows)` — called when a sub-layout (archive) table changes.

**Derivation types:**

| Type | What it does |
|---|---|
| `GridSum` | Sums a column across all rows of a sub-layout grid |
| `BlocklyOp` | Arithmetic (ADD / MINUS / MULTIPLY / DIVIDE) between two operands (field reference or literal) |
| `SetRequired` | Marks a target field required when the source field is non-empty |
| `SetDisabled` | Marks a target field disabled when the source field is non-empty |

### `derivationParser.ts` _(new file)_

Builds a `DerivationGraph` (a `Map<targetRowKey, Derivation>`) from the `FormEvents[]` array stored in a layout's Design JSON **without running Blockly**. The Blockly XML stored in the database is parsed with a lightweight regex instead.

**Key resolution chain:**
- `resolveToRowKey(guid, layout)` — maps a `LayoutItem.Guid` → `ColumnGuid` or `RelationGuid` (the key used by the store).
- `resolveArchiveItemToColumnGuid(...)` — for GridSum: follows `SubLayout item → SubLayoutGuid → archive layout → archive column item → ColumnGuid`.
- `parseBlocklyXml(rawXml, layout)` — decodes HTML entities, extracts the `OP` field, and resolves each slot (`A`/`B`) to either a field reference or a numeric literal.

---

## 2. Renderer: `defineLayout.tsx`

### Before
- `DefineLayout` component held a `form` ref (`useRef<WrappedFormUtils>`).
- On load: Blockly workspaces were created, CodeXml was loaded into them, JS code was generated and injected as `<script>` tags into `<body>`, and the event actions were passed to `SetupData`.
- A hidden `<div id="rendererBlocklyDiv">` was rendered in the DOM just for Blockly.
- `LayoutContent` (inner component) was wrapped with `Form.create()` inside a `useMemo` to support the `ShowFormItemLabelInSepratedRow` label layout; the form instance was forwarded back up via `onFormCreated` callback.

### After
- `DefineLayout` is now itself wrapped with `Form.create()` (exported as `Form.create({})(DefineLayout)`), so it receives `form` as a prop directly.
- On load: `buildDerivationGraph` builds the derivation graph from `designSetting.current.Events`; `createFormStore(graph)` creates the Zustand store. **No Blockly runtime, no `<script>` injection.**
- `SetupData` is now always created with `events: []` — the store handles all action execution.
- The hidden Blockly div is removed.
- `LayoutContent` no longer creates its own inner `Form.create()` wrapper; it receives `form` and `store` directly as props.
- `getFormFunction` is now called inside the initial `useEffect` with `form` (the AntD form prop), rather than watching a ref.

---

## 3. Renderer: `layoutContent.tsx`

- Removed the `InnerLayoutContent` / `LayoutContent` split (previously `LayoutContent` was a `useMemo`-based `Form.create()` wrapper around `InnerLayoutContent`).
- Now a single `LayoutContent` function component that accepts `form` (from parent) and `store` (the Zustand store).
- Added a `useEffect` that watches `derived` from the store and calls `form.setFieldsValue(derived)` — this is how computed values flow from the store back into the AntD form fields.
- Removed the `onFormCreated` callback prop.
- Removed action-related props passed down to `RecursiveComponents`: `getActionsList`, `getActionForSetFieldValue`, `getSublayoutAction`, `getAction`.
- Added `store` prop forwarded to `RecursiveComponents`.

---

## 4. Renderer: `recursiveComponents.tsx`

### Removed (action execution logic)
- `setFieldValue(...)` — set field values by running `getActionForSetFieldValue` results.
- `setSublayoutFieldValue(...)` — set sub-layout grid cell values via `tableHandler`.
- `setDisabeldFormItem(...)` — looked up disabled state through action list.
- `setRequiredRuleByAction(...)` — looked up required state through action list.
- `handleChange(...)` — ran event dispatch through `getActionsList()`.
- `handleChangeSublayout(...)` — ran sub-layout event dispatch.
- All prop types: `getActionsList`, `getSublayoutAction`, `getActionForSetFieldValue`, `getAction`, `ActionListProps`.

### Added (store-based approach)
- `const fieldMeta = useFormStore(store, state => state.fieldMeta)` — subscribed to dynamic required/disabled metadata.
- `setDisabeldFormItem(_layoutItemGuid, data)` — now simply reads `fieldMeta[data?.rowKey]?.disabled`.
- `setRequiredRuleByAction(_layoutItemGuid, data)` — now simply reads `fieldMeta[data?.rowKey]?.required`.
- `handleChange(value, layoutItemGuid, data)` — now calls `store.getState().setField(data.rowKey, value)`.
- `handleChangeSublayout(value, ...)` — now calls `store.getState().setGrid(data.rowKey, value)`.
- `store` prop passed through to recursive child components.

---

## 5. Renderer: `useDefineLayoutHook.tsx`

### Removed
- All action computation: `actions` ref, `getAction`, `getActionForSetFieldValue`, `getActionsList`, `getSublayoutAction`.
- All Blockly-related script injection (the `useEffect` that created `<script>` tags from Blockly-generated JS).
- Helper functions: `getDefaultValue`, `layoutItemFieldValues`.
- Many imports: `ColumnActions`, `ReferenceActions`, `LayoutItemViewModel`, `RelationViewModel`, `RelationNature`, `RelationType`, `ColumnViewModel`, `ColumnDataType`, `LayoutItemColumnViewModel`, `LayoutItemReferenceViewModel`.
- Exported interface `ActionListProps`.

### Added
- `store: FormStore` parameter.
- **Hidden layout items are now included in `getKeyValuesList()`** — items with `Type === LayoutItemType.Hidden` have their values taken from `store.getState().derived` (falling back to the server-loaded `initialData.Row.KeyValues` in edit mode). This ensures fields referenced in events but not on the form surface are still persisted on save.

### Other cleanup
- `layoutManager` made optional in `UseDefineHookProps`.
- Minor code style: trailing semicolons, consistent formatting.

---

## 6. Renderer: `setupDefineLayoutData.ts`

- Items with `Type === LayoutItemType.Hidden` are now excluded from the data setup loop (they are not rendered on the form).

---

## 7. Designer: `LayoutMapper.ts`

### `toSaveViewModel` — now accepts `DataModels`

The `LayoutMapper.toSaveViewModel` method now takes a second parameter `dataModels: DataModelViewModel[]`.

### New: `extractOthersItems`

When saving a layout, this method finds all Column/Relation GUIDs referenced in `Design.Events` (OperationOnEvent rules) that are **not already present** in the layout's items. For each missing GUID it generates a synthetic `LayoutItemViewModel` with `Type = LayoutItemType.Hidden`.

**Why:** Since the new designer allows referencing fields that are not placed on the form (see section 8), those GUIDs must still be sent to the server as `Hidden` items so the backend can process and persist them during form save.

### Caller change — `FormDesigner.tsx`
`layoutMapper.toSaveViewModel(...)` now passes `currentFloor.LayoutModels.DataModels` as the second argument.

---

## 8. Designer: `LayoutItemMapper.ts`

- `toDesignerViewModels` now **filters out `LayoutItemType.Hidden` items** before mapping — hidden synthetic items are not shown in the designer canvas.

---

## 9. Designer: "OperationOnEvent" — Complete UI Redesign

### `index.tsx`

**Before:** Used `TableEx` (a data-grid component) for listing operation-on-event rules. State was managed by `TableExEditStore`. Relied on filtering `currentLayout.Items` for available fields.

**After:**
- Replaced `TableEx` with a `Fieldset` + `List` of `Card` components styled with the new `.ooe-list` CSS classes.
- State is plain React `useState<RecordWithId[]>`.
- Added explicit `handleDelete(id)` / `handleEdit(record)` / `handleAdd()` handlers.
- Available layout items are now sourced from `currentDataModel.Columns` and `currentDataModel.Relations` (not from layout items), so fields not yet placed on the form are available.
- Delete uses `Popconfirm` for confirmation.
- Edit and delete icons displayed per card; respects `globalProps.permission.readOnly`.

### `operationOnEventDetail.tsx` — Completely Rewritten

**Before:**
- Used `QueryBuilder` (a complex rule-builder component from `@didgah-components/ant-querybuilder`) for both the Events section and the Actions section.
- Entire form wrapped in `Form.create()` (AntD HOC).
- Events and actions were stored as `IComplexCondition` objects inside `QueryBuilderStore`.

**After:**
- No `QueryBuilder` dependency. Events and Actions are managed as plain typed arrays (`EventRow[]` / `ActionRow[]`).
- "Draft" pattern: a single draft row is shown inline for add/edit; confirmed on check-button click.
- **Title field** is editable in-place via an edit/confirm icon pair.
- **Events section:**
  - Each saved event row shows a disabled `SelectEx` (field) + `SelectEx` (event type).
  - A new event uses a `TreeSelect` (the data-model tree structure) so the user can pick any column or sub-layout in the hierarchy — this is how grid events are triggered.
  - Event types source from the `Events` enum.
- **Actions section:**
  - Regular (non-grid) actions: `SelectEx` for field, `SelectEx` for action type, optional JSBlock button for `setFieldsValue`.
  - Grid actions: `TreeSelect` for target field, `SelectEx` for action, `SelectEx` for aggregate function (SUM), `SelectEx` for source column from the grid.
- Grid-event awareness: if any event row carries `extraData.isGridEvent`, the action editor switches to grid-action mode.
- `handleSave` serialises rows to the same wire format (`{ Field, Operator, Value, ExtraData }`) that the renderer's `buildDerivationGraph` expects.

### `useLayoutItems.tsx` (Hook)

**Before:** Accepted a `filter` function and returned items by filtering `currentLayout.Items`. Only saw fields placed on the form.

**After:** No filter parameter. Returns items from:
- `currentDataModel.Columns` → `{ key: labelFromLayoutOrDataModel, value: ColumnGuid, Type: LayoutItemType.Column }`
- `currentDataModel.Relations` → `{ key: labelFromLayoutOrDataModel, value: RelationGuid, Type: LayoutItemType.Reference }`

Label resolution: if the column/relation has a layout item, uses `JSON.parse(layoutItem.Design).Label`; otherwise falls back to `dataModel.Label`.

### `basicActionConditionEditor.tsx`

- `getLayoutType()` now checks `currentDataModel.Columns` (by `ColumnGuid`) instead of reading the layout item type.
- `useLayoutItems()` called without a filter.
- `currentDataModel` used instead of `currentLayout`.

### `basicActionConditionViewer.tsx`

- `columnsBlockOptions` now built from `currentDataModel.Columns` + `currentDataModel.Relations` (flat, using `col.Name` / `col.Label` / `col.Guid`).
- `layoutType` determined by checking `currentDataModel.Columns.some(col => col.Guid === field)`.

### `helper.ts` — `generateLayoutTree`

**Before:** Tree only showed columns and references that were **placed on the form**.

**After:** Tree is now driven by the **DataModel**:
- Accepts optional `dataModel?: DataModelViewModel` and `dataModels?: DataModelViewModel[]` parameters.
- Root children: all columns from `dataModel.Columns`; label taken from the corresponding layout item if found, otherwise from the data model. Columns not placed on the form get a `Tooltip: 'this field dosnt in form'` marker.
- Relation children: all relations from `dataModel.Relations`; each relation node has children from the related `DataModel.Columns` (resolved via `dataModels`). Relations not on the form get a similar tooltip.
- Added `mapColumnToTreeNode` and `resolveColumnNode` helper functions.
- Backward-compatible: if `dataModel` is not passed, falls back to the old layout-items-based approach.

### `dataModelTreeStructure.tsx`

- Removed the unused `getTables` / `transportLayer` import.
- Now calls `generateLayoutTree` with the additional `currentDataModel` and `currentFloor.LayoutModels.DataModels` arguments.

### `eventConditionEditor.tsx`

- `React.useContext` replaced with the named import `useContext`.
- Minor import cleanup.

---

## 10. Designer: `LayoutGenerator.tsx`

- `ShowFormItemLabelInSepratedRow` checkbox was previously only shown for `LayoutType.Define`. The condition `{layoutType === LayoutType.Define && (...)}` has been removed — the checkbox is now always rendered.

---

## 11. Designer: Styles

### `operationOnEvent/Styles/index.less`

Added new BEM-style CSS classes:
- `.ddm-operation-on-event_list-header` — styled header row for the operation list.
- `.ddm-operation-on-event_add` — dashed add button.
- `.ddm-operation-on-event_list-column` — column padding inside the list header.
- `.ooe-list` block with elements:
  - `__toolbar`, `__add`, `__cards`, `__card`, `__card-actions`, `__card-title`
  - `__icon`, `__icon--delete` (red), `__icon--edit` (orange)

### `layout.less`

- Removed the `.DDM_Pointer_Event_None` utility class (`pointer-events: none !important`).

---

## 12. `LayoutManager.ts`

_(Changes not fully detailed in the diff, but the file is among the modified list — likely related to exposing or adjusting DataModel-aware helpers used by the new tree/derivation logic.)_

---

## Summary Table

| Area | What changed | Why |
|---|---|---|
| Runtime event engine | Replaced Blockly runtime + `<script>` injection with Zustand store + regex parser | No browser-side Blockly needed; simpler, testable, no DOM side-effects |
| Form derivation | New `FormValuesStore` + `derivationParser` | Centralised, reactive, derived values pushed into AntD form |
| Hidden layout items | New `LayoutItemType.Hidden` synthetic items injected at save time | Fields referenced in events but not on form must still be persisted |
| Designer field picker | Items sourced from DataModel instead of layout items | Designer can reference any field regardless of whether it is on the form |
| OperationOnEvent UI | QueryBuilder replaced by card list + inline draft row editing | Simpler UX, no third-party QB library for this screen |
| Tree structure | Driven by DataModel; fields not on form shown with tooltip | Consistent with the field-picker change above |
| `ShowFormItemLabelInSepratedRow` | No longer restricted to `LayoutType.Define` | Available in all layout types |

---

## Deep Explanation: Replacing the Blockly Runtime

### What was Blockly doing here?

**Blockly** is a visual programming library (like Scratch). In this DDM designer, when a user defines an "operation on event" rule (e.g. *"when field A changes, set field B = field A × 2"*), the rule is stored as **Blockly XML** in the database, inside `layout.Design.Events[].Actions[].CodeXml`. It looks something like this:

```xml
&lt;block type="math_arithmetic"&gt;
  &lt;field name="OP"&gt;MULTIPLY&lt;/field&gt;
  &lt;value name="A"&gt;
    &lt;block type="Columns"&gt;
      &lt;field name="NAME"&gt;{some-layout-item-guid}&lt;/field&gt;
    &lt;/block&gt;
  &lt;/value&gt;
  &lt;value name="B"&gt;
    &lt;block type="math_number"&gt;
      &lt;field name="NUM"&gt;2&lt;/field&gt;
    &lt;/block&gt;
  &lt;/value&gt;
&lt;/block&gt;
```

### What the OLD code did at runtime (`defineLayout.tsx` + `useDefineLayoutHook.tsx`)

Every time a form loaded, the renderer did this:

```
For each event → for each action:
  1. Create a Blockly workspace (createWorkSpace(...))
  2. Load the CodeXml into that workspace (Blockly.Xml.domToWorkspace)
  3. Call Blockly.JavaScript.workspaceToCode()
     → Blockly generates real JavaScript code, e.g.:
        function Main0() {
          return main(parameters)
          // where main() does: fieldA * 2
        }
  4. Create a <script> tag, inject that JS into document.body
  5. Save the action's id so getAction() can later call window["Main0"](...)
```

Then **every time the user changed a field**, `handleChange()` would:

1. Call `getActionsList()` to find which actions apply
2. Serialize all current form values to JSON
3. Find the right `<script>` tag in the DOM, patch it with the current values
4. Call `window["MainXxx"](currentValues)` — literally calling dynamically injected global JS
5. Take the return value and push it back into the form with `form.setFieldsValue(...)`

**Problems with this approach:**

- Requires the full Blockly library to be loaded at **render time** (not just in the designer)
- Injects arbitrary `<script>` tags into `document.body` — a side effect that's hard to clean up
- The function is patched in-place by string manipulation (`replace(...)`) — extremely fragile
- Hard to test, no type safety, global `window["MainXxx"]` pollution
- Any mistake in the XML or the patching silently fails

### What the NEW code does

The insight is: **these rules are simple arithmetic**. Nobody is using Blockly to write arbitrary code — they're using it to express things like:

- `fieldB = fieldA × 2`
- `fieldC = SUM(gridColumn)`
- `fieldD is Required when fieldA is non-empty`

So the new approach **never loads Blockly at runtime**. Instead:

#### Step 1 — Parse at load time (`derivationParser.ts`)

When the form loads, `buildDerivationGraph()` reads the stored XML with a **simple regex**:

```typescript
// Extract the operator
const opMatch = xml.match(/<field[^>]+name\s*=\s*["']OP["'][^>]*>([A-Z]+)<\/field>/);
// → "MULTIPLY"

// Extract slot A (a column reference)
// → { kind: 'field', rowKey: 'some-column-guid' }

// Extract slot B (a literal number)
// → { kind: 'literal', value: 2 }
```

The result is a typed `DerivationGraph` — a plain `Map`:

```typescript
columnB_guid → { type: 'BlocklyOp', op: 'MULTIPLY', operands: [
    { kind: 'field', rowKey: 'columnA_guid' },
    { kind: 'literal', value: 2 }
]}
```

No Blockly. No JS generation. No DOM touching.

#### Step 2 — React to changes at runtime (`FormValuesStore.ts`)

The graph is handed to a **Zustand store** (`createFormStore(graph)`). When a field changes:

```typescript
// In RecursiveComponents — when user types in field A:
store.getState().setField('columnA_guid', newValue);
```

Inside `setField`, the store calls `runDerivations(graph, fields, gridRows)` which simply does:

```typescript
// For each entry in the graph:
// target = columnB_guid, derivation = { type: 'BlocklyOp', op: 'MULTIPLY', ... }

const a = fields['columnA_guid'];  // the current value
const b = 2;                        // the literal
derived['columnB_guid'] = a * b;   // pure JS arithmetic
```

#### Step 3 — Push back into AntD form (`layoutContent.tsx`)

```typescript
const derived = useFormStore(store, state => state.derived);

React.useEffect(() => {
  if (Object.keys(derived).length > 0) {
    form.setFieldsValue(derived);  // updates the visible inputs
  }
}, [derived]);
```

### Before vs After at a glance

| | Before | After |
|---|---|---|
| **Blockly loaded at** | Runtime (every form render) | Designer only |
| **Code generation** | `Blockly.JavaScript.workspaceToCode()` | Never — regex parse only |
| **Execution** | `window["MainXxx"](values)` — global JS call | Pure function: `a * b` |
| **Side effects** | `<script>` tags injected into `document.body` | None |
| **State management** | Scattered refs + manual DOM patching | Zustand store, reactive |
| **Testability** | Very hard (needs browser + Blockly + DOM) | Pure functions, unit-testable |
| **Type safety** | None | Fully typed `DerivationGraph` |

> **Tradeoff:** the new parser only understands the specific patterns that the designer actually produces (single arithmetic operation, GridSum, SetRequired, SetDisabled). It would not handle arbitrarily complex Blockly programs — but those were never used here in practice.
