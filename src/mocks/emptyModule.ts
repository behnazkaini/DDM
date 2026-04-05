/**
 * mocks/emptyModule.ts
 *
 * Catch-all stub for Designer-only packages not needed by the Renderer demo.
 *
 * Exports every named symbol that any non-Renderer file imports from a stubbed
 * package so that the ES module named-export check passes in both dev and
 * production builds.
 */

import React from 'react';

// ── Proxy-based stub value ────────────────────────────────────────────────────
// Used as a stand-in for anything callable, component-like, or object-like.
const stub: any = new Proxy(function stub() {} as any, {
  get(_t, key) {
    if (key === '__esModule' || key === 'prototype') return undefined;
    if (key === '$$typeof') return Symbol.for('react.element'); // makes it usable as JSX
    // When used as a computed property key [stub.foo.toString()], JS needs a primitive.
    if (key === 'toString' || key === Symbol.toPrimitive || key === Symbol.toStringTag) {
      return () => '__ddm_stub__';
    }
    return stub;
  },
  apply() { return stub; },
  construct() { return {}; },
});

// ── Default export ────────────────────────────────────────────────────────────
export default stub;

// ── Generic designer/UI stubs ─────────────────────────────────────────────────
export const dragDrop = stub;
export const TokenItem = stub;
export const SideBar = stub;
export const useAppContext = () => ({});
export const EditorProps = stub;
export const TableEx = stub;
export const TableExColumnProps = stub;
export const TextViewerField = stub;
export const TextEditorField = stub;
export const TextViewerComponentField = stub;
export const Notification = stub;
export const Popconfirm = stub;
export const SelfOrderedForm = stub;

// ── react-redux ───────────────────────────────────────────────────────────────
export function useDispatch() { return () => {}; }
export function useSelector(_selector: any) { return undefined; }
export const Provider: React.FC<any> = ({ children }: any) => children ?? null;
export type TypedUseSelectorHook<S> = (selector: (s: S) => any) => any;
export type ProviderProps = any;

// ── @reduxjs/toolkit ─────────────────────────────────────────────────────────
export function createSlice(_opts: any) {
  return { reducer: (_s: any) => _s, actions: {} };
}
export function configureStore(_opts: any) {
  return { getState: () => ({}), dispatch: () => {}, subscribe: () => () => {} };
}
export function createAsyncThunk(_type: string, _fn: any) { return stub; }
export function current(v: any) { return v; }
export type PayloadAction<P = void> = { payload: P; type: string };

// ── react-syntax-highlighter ──────────────────────────────────────────────────
// Default export is already `stub` above (callable component).
// Named style export:
export const vs = {};
export const SyntaxHighlighter = stub;

// ── @didgah-components/ant-querybuilder ──────────────────────────────────────
export const QueryBuilder = stub;
export const QueryBuilderStore = stub;
export type IQueryBuilderViewModel = any;
export type IComplexCondition = any;
export type ISimpleCondition = any;
export type IConditionBase = any;
export type ITreeNode = any;
export type QueryBuilderConditionGroupViewModel = any;

// ── @didgah-components/ant-selectindividual ───────────────────────────────────
export const SelectIndividual = stub;
export const SelectIndividualStore = stub;
export const Individual = stub;
export const TreeSelect = stub;
export const TreeStore = stub;
export type SelectIndividualComponentTypes = any;

// ── @didgah/ddm-plugins ───────────────────────────────────────────────────────
export const DDMPlugin = stub;
export const FilterGrid = stub;
export const ExtensionLite = stub;
export const ExtensionLiteItem = stub;

// ── @models/didgah-components ─────────────────────────────────────────────────
export enum ConditionType {
  Equal = 1, NotEqual = 2, GreaterThan = 3, LessThan = 4,
  Contains = 5, StartsWith = 6, EndsWith = 7,
  IsNull = 8, IsNotNull = 9, GreaterThanOrEqual = 10, LessThanOrEqual = 11, In = 12,
}

// ── Misc types re-exported as values (needed by some files) ──────────────────
export type FieldValue = any;
export type ElementType = any;
export type SelectItem = { key: any; value: string };
export const SelectItemCtor = stub;

// These must be runtime values (not `export type`) because importing modules
// may use them as values (e.g. comparison, switch, instanceof).
export const FieldViewerType = stub;
export const FieldEditorType = stub;
export const CheckboxListStore = stub;

// ── ts-enum-util ($enum) ──────────────────────────────────────────────────────
export const $enum = stub;

// ── TS/Validations exports (Designer-only, aliased here to break circular dep) ─
export function getDefaultDataTypeSetting(_dataType: any): any { return null; }
export const ValidationAssistant = stub;

// ── SimpleDesigner exports (folder deleted — Designer-only stubs) ─────────────
export function createEmptyDDMColumn(_opts?: any): any { return {}; }
export function createEmptyDDMTable(_opts?: any): any { return {}; }
export const availableWidgets = stub;

// ── TableExEditStore — editable table store (Designer-only) ──────────────────
export const TableExEditStore = stub;

// ── LayoutItemType enum ───────────────────────────────────────────────────────
export enum LayoutItemType {
  Field = 1,
  Grid = 2,
  SubLayout = 3,
  Tab = 4,
  Column = 5,
}
