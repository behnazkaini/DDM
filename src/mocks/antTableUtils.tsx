/**
 * mocks/antTableUtils.tsx
 *
 * Shim for "@didgah-components/ant-table/utils"
 *
 * Exports:
 *   ModernTableColumnProps  — column descriptor type used throughout the Renderer
 *   useModernTable          — hook that powers the editable grid widgets
 *
 * The real implementation wraps react-table with pagination, sorting, inline
 * editing, row dragging, import/export, etc.  This shim provides the minimum
 * contract needed by referenceArchive.tsx and referenceArchiveViewer.tsx.
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import type { ColumnType } from 'antd/es/table';

// ─────────────────────────────────────────────────────────────────────────────
// Type
// ─────────────────────────────────────────────────────────────────────────────

export interface ModernTableColumnProps<T = any> {
  /** Column header (React node or string) */
  Header: React.ReactNode;
  /** Accessor alias (same as dataIndex for Ant) */
  accessor?: string;
  /** Row data key */
  dataIndex: string;
  /** Component rendered in edit mode */
  editComponent?: React.ComponentType<any> | ((props: { value: any; onChange: (v: any) => void; record: T; index: number }) => React.ReactNode);
  /** Component rendered in view mode */
  viewComponent?: React.ComponentType<any> | ((props: { value: any; record: T; index: number; onChange?: (v: any) => void }) => React.ReactNode);
  /** Passed straight through from LayoutManager */
  staticProps?: {
    columnSetting: string;
    dataType: number;
    validationRules?: any;
  };
  width?: number;
  rules?: any;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
  sort?: any;
  filter?: any;
  Filter?: any;
  [key: string]: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// useModernTable
// ─────────────────────────────────────────────────────────────────────────────

export interface UseModernTableOptions<T = any> {
  initialData: T[];
  columns: ModernTableColumnProps<T>[];
  /** "VIEW" = read-only, "EDIT_ALL" = all cells editable inline */
  mode?: 'VIEW' | 'EDIT_ALL';
  hasPagination?: boolean;
  hasInitialRow?: boolean;
  getActions?: (index: number) => Array<{ title: string; handler: (record: T) => void }>;
  pageSize?: number;
  hasSort?: boolean;
  hasFilter?: boolean;
  fixedWidth?: boolean;
  draggable?: boolean;
  allowImportFile?: boolean;
  allowExportData?: boolean;
  customActionBarItems?: React.ReactNode;
  label?: string;
  onChangeTable?: (value: any) => void;
}

export interface UseModernTableResult<T = any> {
  data: T[];
  tableConfig: {
    dataSource: T[];
    columns: ColumnType<T>[];
    rowKey: string;
    /** Used by defineArchiveLayout / onActionOnTable as updateRow */
    updateTableData: (rowIndex: number, updates: Partial<T>) => void;
    customActionBarItems?: React.ReactNode;
  };
  validateForms: () => Promise<boolean>;
  addNewRow: (index: number, initialValues?: Partial<T>) => void;
  deleteRow: (index: number) => void;
  getChanges: () => { added: T[]; deleted: T[]; edited: T[] };
  setInvalidRecords: (records: any[]) => void;
  getData: () => T[];
}

let _rowCounter = 0;
function nextRowKey() {
  return `_row_${++_rowCounter}`;
}

export function useModernTable<T extends Record<string, any> = Record<string, any>>(
  options: UseModernTableOptions<T>
): UseModernTableResult<T> {
  const {
    initialData = [],
    columns = [],
    mode = 'VIEW',
    customActionBarItems,
  } = options;

  // Stamp each incoming row with a stable internal key
  const stamp = (row: any): T => ({
    ...row,
    _rowKey: row._rowKey ?? nextRowKey(),
  });

  const [data, setData] = useState<T[]>(() => initialData.map(stamp));

  // Keep a ref so callbacks below always see the latest rows without stale closure
  const dataRef = useRef(data);
  dataRef.current = data;

  // ── Cell-level update (used internally by edit renders) ───────────────────
  const updateCell = useCallback((rowIndex: number, key: string, value: any) => {
    setData(prev => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], [key]: value, __status: next[rowIndex].__status ?? 'modified' };
      return next;
    });
  }, []);

  // ── Row-level replace (used by defineArchiveLayout as updateRow) ──────────
  const updateTableData = useCallback((rowIndex: number, updates: Partial<T>) => {
    setData(prev => {
      const next = [...prev];
      const existing = next[rowIndex] ?? {} as T;
      next[rowIndex] = { ...existing, ...updates, _rowKey: existing._rowKey ?? nextRowKey() } as T;
      return next;
    });
  }, []);

  // ── Build Ant Design column definitions ───────────────────────────────────
  const antColumns = useMemo<ColumnType<T>[]>(() => {
    return columns.map((col, colIdx) => ({
      title: col.Header,
      dataIndex: col.dataIndex,
      key: col.dataIndex ?? String(colIdx),
      width: col.width,
      align: (col.align as any) ?? undefined,
      render: (value: any, record: T, rowIndex: number) => {
        if (mode === 'EDIT_ALL' && col.editComponent) {
          const EC = col.editComponent as any;
          if (typeof EC === 'function') {
            return EC({
              value,
              onChange: (v: any) => updateCell(rowIndex, col.dataIndex, v),
              record,
              index: rowIndex,
            });
          }
        }
        const VC = col.viewComponent as any;
        if (VC) {
          if (typeof VC === 'function') {
            return VC({ value, record, index: rowIndex });
          }
        }
        // Fallback: render primitive value as string
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      },
    }));
  }, [columns, mode, updateCell]);

  // ── CRUD helpers ──────────────────────────────────────────────────────────
  const addNewRow = useCallback((index: number, initialValues: Partial<T> = {}) => {
    setData(prev => {
      const next = [...prev];
      const newRow = stamp({ ...initialValues, __status: 'added' });
      next.splice(index, 0, newRow);
      return next;
    });
  }, []);

  const deleteRow = useCallback((index: number) => {
    setData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const getChanges = useCallback(() => ({
    added:   dataRef.current.filter(r => r.__status === 'added'),
    deleted: [] as T[],
    edited:  dataRef.current.filter(r => r.__status === 'modified'),
  }), []);

  const getData = useCallback(() => dataRef.current, []);

  const validateForms = useCallback(() => Promise.resolve(true), []);

  const setInvalidRecords = useCallback((_records: any[]) => {}, []);

  // ── tableConfig (spread into <Table />) ───────────────────────────────────
  const tableConfig = useMemo(() => ({
    dataSource: data,
    columns: antColumns,
    rowKey: '_rowKey',
    updateTableData,
    customActionBarItems,
  }), [data, antColumns, updateTableData, customActionBarItems]);

  return {
    data,
    tableConfig,
    validateForms,
    addNewRow,
    deleteRow,
    getChanges,
    setInvalidRecords,
    getData,
  };
}
