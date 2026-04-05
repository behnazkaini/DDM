import Table from '@didgah-components/ant-table';
import { ModernTableColumnProps, useModernTable } from '@didgah-components/ant-table/utils';

import * as React from "react";
import { IWidget, LayoutItemColumnSetting, LayoutItemReferenceSetting, ReferenceArchiveWidgetProps } from "../../../typings/Core.DynamicDataModel/Types";
import { utility } from "didgah/common";
import { Checkbox, Icon, Input, Modal, Tooltip, injectContext, DateTimePicker } from "didgah/ant-core-component";
import { translate } from "../../../Utility/language";
import transportLayer from '../../Renderer/transportLayer';
import { SortType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.SortType';
import { LayoutViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { LayoutItemColumnViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel';
import { DefineLayoutViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineLayoutViewModel';

interface CustomEditComponentProps {
  value?: any;
  onChange?: (value: any) => void;
  record?: any;
  dataIndex?: string;
  Component: any;
  initValue?: any;
  index?: number;
  mode: "design" | "render";
  setting: string;
}

class CustomViewComponent extends React.Component<
  CustomEditComponentProps,
  {}
> {
  static defaultProps: CustomEditComponentProps = {
    onChange: () => { },
    Component: undefined,
    mode: "render",
    setting: undefined,
  };

  constructor(props) {
    super(props);
    this.hanldeInputChange = this.hanldeInputChange.bind(this);
  }

  hanldeInputChange(value) {
    this.props.onChange(value);
  }

  render() {
    const {
      onChange,
      Component,
      initValue,
      value,
      index,
      record,
      dataIndex,
      mode,
      ...restProps
    } = this.props;
    const formData = initValue.find((x) => x.rowKey === dataIndex).formData;
    const recordIsAlreadyExist = formData[index]?.value;
    const configForAddedRecord = formData[0]?.value;
    const currentInitValue = recordIsAlreadyExist
      ? formData[index]?.value
      : configForAddedRecord;
    const referenceColumnSetting: LayoutItemReferenceSetting = JSON.parse(restProps.setting);
    return (
      <Component
        value={value}
        mode={mode}
        initValue={currentInitValue}
        onChange={this.hanldeInputChange}
        {...referenceColumnSetting}
      />
    );
  }
}


export const ReferenceArchiveViewer = (props: ReferenceArchiveWidgetProps) => {
  const {
    initValue,
    mode,
    columns,
    onChange,
    onRowClick,
    onActionOnTable = () => { },
    layoutDesign,
    layoutGuid,
    context,
    softwareGuid,
    primaryKey,
    label,
    initialData,
    dataModelGuid
  } = props;
  const { Widget } = layoutDesign;
  const {
    HasPagination = false,
    HasSort = false,
    CanImportDataTable = false,
    CanExportDataTable = false,
    SearchSetting
  } = Widget;
  const showStatusRowColumn = React.useRef<boolean>(false);
  const requiredColumns = React.useRef<string[]>([]);

  function getColumnFilterComponent(dataType: number) {
    switch (dataType) {
      case 4:
        return BooleanColumnFilter;

      default:
        return TextColumnFilter;
    }
  }

  function filterInclude(rows, id, filterValue, dataIndex) {
    if (filterValue?.length > 0) {
      return rows.filter(row => {
        const rowValue = row[dataIndex]?.toString();
        return rowValue ? rowValue.includes(filterValue) : false;
      })
    } else return rows;
  }

  const handleSortColumn = async (rows, sortType, dataIndex) => {
    const model = {
      LayoutGuid: layoutGuid,
      PrimaryKey: primaryKey,
      SoftwareGuid: softwareGuid,
      ColumnOptions: {
        ColumnGuid: dataIndex,
        SortType: sortType ? SortType[sortType] : SortType.None,
        Filter: { Value: '' },
      },
    };

    const isAdded = rows.some((row) => row.__status === "added");
    try {
      if (isAdded) {
        Modal.warning({
          title: translate('SortWarningMessage'),
          okText: translate('Confirm'),
        });
        throw new Error('cancel')
      }
      const data = await transportLayer(context.ajax).GetConditionValueByPrimaryKey(model);
      const tableData = data.Row.KeyValues.find((value) => {
        if (Array.isArray(value.Value)) {
          return value.Value.some((val) => val.KeyValues.some((key) => key.Key === dataIndex));
        } else {
          return false;
        }
      });

      if (tableData) {
        const sortedRow = tableData.Value.map((val) => {
          const rowData = {};
          const selectedRow = rows?.find((r) => r.Guid === val.PrimaryKey);
          val.KeyValues?.forEach((keyValue) => {
            if (selectedRow) {
              rowData[keyValue.Key] = selectedRow[keyValue.Key];
            }
          });
          return { Guid: val.PrimaryKey, ...rowData };
        });

        return sortedRow;
      }
    } catch (err) {
      throw err
    }
  };

  function isFormFieldRequired(layouts: LayoutViewModel[], columnGuid: string) {
    const formLayout = layouts.find(l => l.Type === 1 && l.DataModelGuid === dataModelGuid);
    if (!formLayout) return false;

    const formItem = (formLayout.Items as any[]).find((item) => item.ColumnGuid === columnGuid || item.RelationGuid === columnGuid);
    if (!formItem) return false;

    const validations = (formLayout as DefineLayoutViewModel).Validations.filter(v => v.LayoutItemGuid === formItem.Guid);
    const requiredValidation = validations.find(v => {
      if (v.Type !== 1) return false;
      const setting = JSON.parse(v.Setting || "{}");
      return setting.Required === true;
    });

    if (!!requiredValidation) {
      if (!showStatusRowColumn.current) showStatusRowColumn.current = true;
      requiredColumns.current.push(columnGuid)
    }
  }

  const tableColumns = React.useMemo<ModernTableColumnProps<any>[]>(
    () =>
      columns.map((column) => {
        const layoutItemDesign: LayoutItemColumnSetting = JSON.parse(column["staticProps"]["columnSetting"]);
        return {
          ...column,
          Header: <div style={{ display: "flex", justifyContent: "center" }}>
            {column.Header}
            {!!layoutItemDesign.HelpTooltip && <Tooltip placement="top" title={layoutItemDesign.HelpTooltip}>
              <Icon
                key={Math.random()}
                type="info-circle"
                style={{ fontSize: "14px", cursor: "help", marginRight: "10px" }}
              />
            </Tooltip>}
          </div>,
          editComponent: (column.editComponent as any).component,
          viewComponent:
            mode === "render"
              ? ({ value, record, index }) => (
                <CustomViewComponent
                  onChange={onChange}
                  record={record}
                  value={value}
                  dataIndex={column.dataIndex}
                  index={index}
                  mode={mode}
                  Component={(column.viewComponent as any).component}
                  initValue={initValue}
                  setting={column.staticProps.columnSetting}
                />
              )
              : (column.viewComponent as any).component,
          filter: (a, b, c) => !!SearchSetting.ColumnViewModelGuid && (SearchSetting.ColumnViewModelGuid.toLowerCase() === column.dataIndex.toLowerCase()) ? filterInclude(a, b, c, column.dataIndex) : [],
          Filter: !!SearchSetting.ColumnViewModelGuid && (SearchSetting.ColumnViewModelGuid.toLowerCase() === column.dataIndex.toLowerCase()) ? getColumnFilterComponent(column.staticProps?.dataType) : undefined,
          width: 150,
          sort: handleSortColumn as any,
          resizable: mode === 'render' ? true : false,
        } as ModernTableColumnProps<any>;
      }),
    [columns]
  );

  const tableRecords = React.useMemo<any[]>(
    () => {
      const records = getRecords();
      if (records.length) {
        initialData?.Layouts && Object.keys(records[0]).map(key => isFormFieldRequired(initialData.Layouts, key))
      }
      return records
    }, [initValue])

  function hasEmptyRequiredValue(
    record: Record<string, any>,
  ): boolean {

    if (requiredColumns.current.some(col => record[col] === undefined || record[col] === null || record[col] === '')) return true
    else if (
      requiredColumns.current.some(col => {
        const value = record[col]
        if (typeof value === 'object' && 'key' in value) {
          if ('label' in value) return !value.label
          else if ('tokens' in value) return Array.isArray(value.tokens) && value.tokens.length === 0
        }
        return false
      })
    ) {
      return true
    }
    else return false
  }

  const extraRow = React.useMemo<ModernTableColumnProps<any>>(
    () => {
      return {
        Header: translate("Status"),
        accessor: "Status",
        dataIndex: 'Status',
        editComponent: (record) => {
          return <i className={hasEmptyRequiredValue(record) ? 'common online-16x' : 'common offline-16x'} />
        },
        viewComponent: ({ record }) => {
          return hasEmptyRequiredValue(record) ? <Tooltip title={translate('FillRequiredData')}><i className={'common offline-16x'} /></Tooltip> : <i className={'common online-16x'} />
        },
        align: 'center',
        width: 70,
        rules: {
          validator: (value, record) => {
            const isDataValid = hasEmptyRequiredValue(record);
            return !isDataValid
          },
        },
        resizable: mode === 'render' ? true : false,
      }
    }, [columns])

  const {
    tableConfig,
    validateForms,
    addNewRow,
    deleteRow,
    getChanges,
    setInvalidRecords,
    getData
  } = useModernTable({
    initialData: showStatusRowColumn.current ? [...tableRecords.map(record => ({ ...record, Status: "null" }))] : tableRecords,
    columns: showStatusRowColumn.current ? [extraRow, ...tableColumns] : tableColumns,
    pageSize: 100,
    mode: "VIEW",
    hasPagination: HasPagination,
    hasSort: mode === 'render' ? HasSort : false,
    hasFilter: true,
    fixedWidth: true,
    allowImportFile: CanImportDataTable,
    allowExportData: CanExportDataTable,
    draggable: mode === 'render' ? true : false,
    label
  });

  function SUM(columnName: string) {
    return getData().map(item => item[columnName]).reduce((a, b) => { if (b) { return a + b } else { return a } }, 0);
  }

  function handleDeleteRow(index: number) {
    deleteRow(index);
    props.onChange(null);// This section is for setting the value after the OperationOnEvents occurs
  }

  function SUMForGrid(columnName: string, targetColumn: string) {
    const allDataWithSumColumn = [];
    getData().forEach((data, index) => {
      const eventColumnValue = data[columnName] ? data[columnName] : 0;
      const sum = index === 0 ? eventColumnValue : eventColumnValue + allDataWithSumColumn[index - 1][targetColumn];
      allDataWithSumColumn.push({
        ...data,
        [targetColumn]: sum
      })
    });
    return allDataWithSumColumn
  }
  function TextColumnFilter({
    column: { filterValue, setFilter },
  }) {
    const [value, setValue] = React.useState(filterValue || '');
    const count = getData().length;
    const onChangeHandler = (e) => {
      setValue(e.target.value);
      setFilter(e.target.value || '');
    }
    return (
      <Input
        value={value}
        onChange={onChangeHandler}
        placeholder={`${translate("Search")} ${translate("For")} ${count} ${translate("Record")}...`}
      />
    )
  }
  function BooleanColumnFilter({
    column: { filterValue, setFilter, id },
  }) {
    const [value, setValue] = React.useState(filterValue || '');
    const count = getData().length;
    const onChangeHandler = (e) => {
      setValue(e.target.checked);
      setFilter(e.target.checked || undefined);
    }
    return (
      <Checkbox
        checked={value}
        onChange={onChangeHandler}
      />
    )
  }

  function getRecords() {
    const records = [];
    const currentInitValue = [];
    initValue?.forEach((value) => {
      records.push(...value.formData);
    });
    if (!!records.length) {
      Object.values(utility.groupBy(records, "primaryKey")).forEach(
        (record) => {
          const result = {};
          record.forEach((item) => {
            result[item.key] = item.value;
          });
          currentInitValue.push({ Guid: record[0].primaryKey, ...result });
        }
      );
    }
    return currentInitValue;
  }

  function removeExtraKey(data: any[]) {
    let result = [...data]
    if (Array.isArray(data)) {
      result = result.map(item => {
        const { Status, errors, ...rest } = item;
        return rest;
      });
    }

    return result;
  }

  function getTableChanges() {
    const changes = getChanges();
    if (showStatusRowColumn.current) {
      const keys = Object.keys(changes);
      keys.forEach(key => {
        changes[key] = removeExtraKey(changes[key])
      })
    }

    return changes
  }

  function getTableData() {
    const data = getData()

    return showStatusRowColumn.current ? removeExtraKey(data) : data
  }

  React.useEffect(() => {
    onActionOnTable({
      addNewRow,
      deleteRow: handleDeleteRow,
      updateRow: tableConfig.updateTableData,
      setInvalidRecords,
      validateForms,
      getChanges: getTableChanges,
      getData: getTableData,
      SUM,
      SUMForGrid
    });

  }, []);

  return <Table {...tableConfig} onRowClick={onRowClick} />;
};

export default {
  component: injectContext(ReferenceArchiveViewer),
} as IWidget;
