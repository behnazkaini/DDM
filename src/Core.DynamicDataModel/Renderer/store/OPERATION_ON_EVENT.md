# OperationOnEvent — How It Works

## Overview

`operationOnEvent` is the system that reacts to field value changes and automatically:
- Computes derived field values (arithmetic, grid sum)
- Makes fields required or disabled

It is fully data-driven — no Blockly runtime is needed at render time. Events are parsed once at layout init and stored as a `DerivationGraph`, which a Zustand store evaluates on every field/grid change.

---

## Architecture

```
Layout.Design.Events (JSON)
        │
        ▼
buildDerivationGraph()          derivationParser.ts
        │  parses events into a Map<targetRowKey, Derivation>
        ▼
createFormStore(graph)          FormValuesStore.ts
        │  Zustand store — holds fields, gridRows, derived, fieldMeta
        ▼
  user edits a field
        │
        ├─ store.getState().setField(rowKey, value)
        │         │
        │         └─ runDerivations() → { derived, fieldMeta }
        │
        ├─ layoutContent.tsx  ← useFormStore(store, s => s.derived)
        │         └─ form.setFieldsValue(derived)   [pushes computed values into AntD form]
        │
        └─ recursiveComponents.tsx ← useFormStore(store, s => s.fieldMeta)
                  └─ fieldMeta[rowKey].required / .disabled  [controls field behaviour]
```

---

## Key Concepts

### rowKey

Every field in the store is identified by a **rowKey**:

| Layout item type | rowKey |
|---|---|
| Column | `ColumnGuid` |
| Reference / SubLayout | `RelationGuid` |

Events may store a `LayoutItemGuid` (the layout item's own Guid) or a `ColumnGuid` directly. `resolveToRowKey()` normalises both to the correct rowKey.

---

### DerivationGraph

`Map<targetRowKey, Derivation>` — built once per layout by `buildDerivationGraph()`.

Each entry says: *"how to compute/control the field identified by `targetRowKey`"*.

The graph is stored in **event declaration order**, which matters for chained derivations (e.g. `c3 = c1 + c2`, then `c4 = c3 * 2` — c3 must be computed before c4).

---

## Action Types (ActionId)

### ActionId 1 — Arithmetic (BlocklyOp)

Triggered by: field change
Effect: computes a new value for the target field

The `CodeXml` is an HTML-entity-encoded Blockly XML string. It is parsed with a lightweight regex (no Blockly runtime) to extract:
- The operator: `ADD | MINUS | MULTIPLY | DIVIDE`
- Two operands — each is either:
  - `{ kind: 'field', rowKey }` — reads value from another form field
  - `{ kind: 'literal', value }` — a hardcoded number (e.g. `* 2`)

**Example (data4):**
```
Event: [Column1, Column2] change → Column3 = Column1 + Column2   (BlocklyOp ADD)
Event: [Column3] changes         → Column4 = Column3 * 2          (BlocklyOp MULTIPLY, literal 2)
```

Chaining works because `runDerivations` merges already-computed `derived` values into `effectiveFields` before computing the next derivation.

---

### ActionId 1 + isGridAction — Grid Sum (GridSum)

Triggered by: SubLayout (grid) row change
Effect: sums a column across all grid rows and writes the total to a form field

**Key GUID resolution challenge:**

The event stores two different kinds of Guid that must be resolved:

1. **Trigger Guid** (`layoutItemTrigger.Guid`) — may be the SubLayout item's `Guid`, but `store.setGrid()` uses `RelationGuid` as key.
   → Fixed by calling `resolveToRowKey()` on the trigger.

2. **Source column** (`action.ExtraData.layoutItem.Id`) — is the archive layout's **item Guid**, but grid rows are keyed by **ColumnGuid** (`ArchiveLayoutHelper.getRowKey`).
   → Fixed by `resolveArchiveItemToColumnGuid()`:
   `trigger Guid → SubLayout item → SubLayoutGuid → archive layout → archive item Guid → ColumnGuid`

**Example (data3):**
```
Event: [TotalGrid grid] changes → TotalGrid field = SUM(TotalScore column across all rows)
```

---

### ActionId 2 — Disable (SetDisabled)

Triggered by: field change
Effect: disables the target field when the source field is **non-empty**

Stored in `fieldMeta[targetRowKey].disabled = true`.
Applied in `recursiveComponents.tsx`:
```ts
Disabled: fieldMeta[data.rowKey]?.disabled ?? staticDesignDisabled
```

---

### ActionId 3 — Required (SetRequired)

Triggered by: field change
Effect: makes the target field required when the source field is **non-empty**

Stored in `fieldMeta[targetRowKey].required = true`.
Applied in `recursiveComponents.tsx` as an AntD validation rule:
```ts
{ required: true, message: translate('Required') }
```

**Example (data5):**
```
Event: [Column1] changes → Column2 becomes required
Event: [Column3] changes → Column4 becomes disabled
```

---

## Zustand Store (FormValuesStore.ts)

One store instance per layout, created with `createFormStore(graph)` (Zustand vanilla — not a singleton).

### State shape

```ts
interface FormSnapshot {
  fields:    Record<string, any>;                    // user-entered values
  gridRows:  Record<string, Record<string, any>[]>;  // grid rows per SubLayout
  derived:   Record<string, any>;                    // computed field values
  fieldMeta: Record<string, { required?; disabled? }>;
}
```

### Actions

| Action | Called from | Effect |
|---|---|---|
| `setField(rowKey, value)` | `recursiveComponents` on field change | re-runs all derivations |
| `setGrid(rowKey, rows)` | `recursiveComponents` on grid change | re-runs all derivations |

### Selective re-renders (Zustand selector advantage)

| Component | Selector | Re-renders when |
|---|---|---|
| `layoutContent` | `s => s.derived` | any computed value changes |
| `recursiveComponents` | `s => s.fieldMeta` | any required/disabled state changes |

Components that only display user-entered values don't subscribe at all — zero wasted re-renders for them.

---

## Files

| File | Role |
|---|---|
| `store/derivationParser.ts` | Parses `Design.Events` → `DerivationGraph` |
| `store/FormValuesStore.ts` | Zustand store factory + `runDerivations` logic |
| `components/defineLayout/defineLayout.tsx` | Creates store on layout init |
| `components/defineLayout/layoutContent.tsx` | Subscribes to `derived`, pushes into AntD form |
| `components/defineLayout/recursiveComponents.tsx` | Subscribes to `fieldMeta`, applies to field props |

---

## Adding a New Action Type

1. Add a new `Derivation` variant in `FormValuesStore.ts`
2. Handle the new `ActionId` in `buildDerivationGraph()` in `derivationParser.ts`
3. Handle the new type in `runDerivations()` or `compute()` in `FormValuesStore.ts`
4. Apply the result in `recursiveComponents.tsx` (or `layoutContent.tsx` for value effects)
