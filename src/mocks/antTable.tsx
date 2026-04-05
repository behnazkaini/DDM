/**
 * mocks/antTable.tsx
 *
 * Shim for "@didgah-components/ant-table"
 *
 * The real package is a Didgah-proprietary editable data grid built on top of
 * react-table + Ant Design.  This shim re-implements it using Ant Design v5
 * Table so the demo renders the same data without the private dependency.
 */

import React from 'react';
import { Table as AntTable } from 'antd';

export interface ModernTableProps {
  dataSource: any[];
  columns: any[];
  rowKey?: string;
  updateTableData?: (rowIndex: number, updates: Record<string, any>) => void;
  onRowClick?: (record: any, index?: number) => void;
  pagination?: any;
  [key: string]: any;
}

const Table: React.FC<ModernTableProps> = ({
  dataSource,
  columns,
  rowKey = '_rowKey',
  onRowClick,
  // strip internal props not known to antd
  updateTableData: _updateTableData,
  ...rest
}) => {
  return (
    <AntTable
      dataSource={dataSource}
      columns={columns}
      rowKey={rowKey}
      size="small"
      pagination={false}
      onRow={(record, index) => ({
        onClick: () => onRowClick?.(record, index),
        style: { cursor: onRowClick ? 'pointer' : undefined },
      })}
      {...rest}
    />
  );
};

export default Table;
