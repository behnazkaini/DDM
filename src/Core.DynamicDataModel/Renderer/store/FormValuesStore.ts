// ── FormValuesStore ───────────────────────────────────────────────────────────
// Per-layout Zustand store that holds form field values and grid rows, and
// computes derived values + field meta (required/disabled) from the derivation
// graph on every mutation.
//
// Uses createStore (vanilla) so each layout gets its own isolated instance.
// Components subscribe with useStore(store, selector) for fine-grained re-renders.

import { createStore, useStore } from 'zustand';

export type BlocklyOperand =
  | { kind: 'field'; rowKey: string }
  | { kind: 'literal'; value: number };

export type Derivation =
  | { type: 'GridSum'; subLayoutRowKey: string; sourceColumnGuid: string }
  | { type: 'BlocklyOp'; op: 'MULTIPLY' | 'ADD' | 'MINUS' | 'DIVIDE'; operands: BlocklyOperand[] }
  | { type: 'SetRequired'; sourceRowKey: string }
  | { type: 'SetDisabled'; sourceRowKey: string };

/** targetRowKey → how to compute the derived value */
export type DerivationGraph = Map<string, Derivation>;

export interface FieldMeta {
  required?: boolean;
  disabled?: boolean;
}

export interface FormSnapshot {
  /** Plain form field values keyed by rowKey (ColumnGuid / RelationGuid) */
  fields: Record<string, any>;
  /** Grid rows keyed by subLayoutRowKey (RelationGuid of the SubLayout item) */
  gridRows: Record<string, Record<string, any>[]>;
  /** Computed derived values keyed by rowKey; push these into the AntD form */
  derived: Record<string, any>;
  /** Dynamic required/disabled state keyed by rowKey */
  fieldMeta: Record<string, FieldMeta>;
}

export interface FormStoreActions {
  /** Call when a regular form field changes. */
  setField: (rowKey: string, value: any) => void;
  /** Call when a grid (SubLayout archive) changes. rows = tableActionHandler.getData(). */
  setGrid: (rowKey: string, rows: Record<string, any>[]) => void;
}

export type FormStoreState = FormSnapshot & FormStoreActions;

/** The Zustand vanilla store type — one instance per layout. */
export type FormStore = ReturnType<typeof createFormStore>;

/** Create an isolated Zustand store for one layout instance. */
export function createFormStore(graph: DerivationGraph) {
  return createStore<FormStoreState>((set, get) => {
    const { derived, fieldMeta } = runDerivations(graph, {}, {});
    return {
      fields: {},
      gridRows: {},
      derived,
      fieldMeta,

      setField(rowKey, value) {
        const nextFields = { ...get().fields, [rowKey]: value };
        const next = runDerivations(graph, nextFields, get().gridRows);
        set({ fields: nextFields, ...next });
      },

      setGrid(rowKey, rows) {
        const nextGridRows = { ...get().gridRows, [rowKey]: rows };
        const next = runDerivations(graph, get().fields, nextGridRows);
        set({ gridRows: nextGridRows, ...next });
      },
    };
  });
}

/** Selector hook — only re-renders the component when the selected slice changes. */
export function useFormStore<T>(store: FormStore, selector: (state: FormStoreState) => T): T {
  return useStore(store, selector);
}

// ── Derivation computation ────────────────────────────────────────────────────

function runDerivations(
  graph: DerivationGraph,
  fields: Record<string, any>,
  gridRows: Record<string, Record<string, any>[]>,
): { derived: Record<string, any>; fieldMeta: Record<string, FieldMeta> } {
  const derived: Record<string, any> = {};
  const fieldMeta: Record<string, FieldMeta> = {};

  graph.forEach((derivation, targetRowKey) => {
    if (derivation.type === 'SetRequired' || derivation.type === 'SetDisabled') {
      const active = isNonEmpty(extractValue(fields[derivation.sourceRowKey]));
      if (active) {
        const key = derivation.type === 'SetRequired' ? 'required' : 'disabled';
        fieldMeta[targetRowKey] = { ...fieldMeta[targetRowKey], [key]: true };
      }
    } else {
      // Merge already-computed derived values so chained derivations work.
      const effectiveFields = { ...fields, ...derived };
      derived[targetRowKey] = compute(derivation, effectiveFields, gridRows);
    }
  });

  return { derived, fieldMeta };
}

function compute(
  derivation: Derivation,
  fields: Record<string, any>,
  gridRows: Record<string, Record<string, any>[]>,
): any {
  switch (derivation.type) {
    case 'GridSum': {
      const rows = gridRows[derivation.subLayoutRowKey] ?? [];
      return rows.reduce((sum, row) => {
        const val = extractValue(row[derivation.sourceColumnGuid]);
        return sum + (Number(val) || 0);
      }, 0);
    }
    case 'BlocklyOp': {
      const [a, b] = derivation.operands.map(op =>
        op.kind === 'literal'
          ? op.value
          : Number(extractValue(fields[op.rowKey])) || 0,
      );
      switch (derivation.op) {
        case 'MULTIPLY': return a * b;
        case 'ADD':      return a + b;
        case 'MINUS':    return a - b;
        case 'DIVIDE':   return b !== 0 ? a / b : 0;
        default:         return 0;
      }
    }
    default:
      return undefined;
  }
}

function isNonEmpty(v: any): boolean {
  return v !== null && v !== undefined && v !== '';
}

function extractValue(v: any): any {
  if (v !== null && v !== undefined && typeof v === 'object' && 'Value' in v) {
    return v.Value;
  }
  return v;
}
