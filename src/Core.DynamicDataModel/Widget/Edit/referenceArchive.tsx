
import Table from '@didgah-components/ant-table';
import { ModernTableColumnProps, useModernTable } from '@didgah-components/ant-table/utils';
import * as React from "react";
import { ComponentDefaultProps, IWidget, LayoutItemColumnSetting, LayoutItemReferenceSetting, ReferenceArchiveValue, ReferenceArchiveWidgetProps } from "../../../typings/Core.DynamicDataModel/Types";
import { translate, utility } from 'didgah/common';
import { Button, Checkbox, Icon, Input, Message, Modal, Tooltip, injectContext, DateTimePicker } from "didgah/ant-core-component";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { RelationType } from "../../../Core.DynamicDataModel/Modeler/Models/RelationType";
import { SortType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.SortType';
import transportLayer from '../../Renderer/transportLayer';
import { DataModelViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel';


interface CustomEditComponentProps {
  value?: any;
  onChange?: (value: any) => void;
  record?: any;
  dataIndex?: string;
  Component: (props: LayoutItemReferenceSetting & ComponentDefaultProps) => JSX.Element;
  initValue?: any;
  index?: number;
  mode: 'design' | 'render';
  validationRules?: any;
  setting: string;
  primaryKey?: string;
  dataModelGuid?: string
  isGrid?: boolean
  dataModels?: DataModelViewModel[]
  rules?: Array<{ required: boolean }>
}


function CustomEditComponent(props: CustomEditComponentProps) {
  const {
    onChange = () => { },
    Component = undefined,
    mode = 'render',
    setting = undefined,
    initValue,
    value,
    index,
    record,
    dataIndex,
    validationRules,
    primaryKey,
    dataModelGuid,
    isGrid = false,
    dataModels,
    rules
  } = props;
  const test = React.useMemo(() => {
    const formData = initValue.find(x => x.rowKey === dataIndex).formData;
    const recordIsAlreadyExist = formData[index]?.value;
    const configForAddedRecord = formData[0]?.value;
    const currentInitValue = recordIsAlreadyExist ? formData[index]?.value : configForAddedRecord;
    const referenceColumnSetting: LayoutItemReferenceSetting = JSON.parse(setting);
    return {
      currentInitValue,
      referenceColumnSetting
    }
  }, []);

  return (
    <Component value={value || undefined} mode={mode} validationRules={validationRules} initValue={test.currentInitValue} onChange={(val) => { onChange(val) }} {...test.referenceColumnSetting} primaryKey={primaryKey} dataModelGuid={dataModelGuid} isGrid={isGrid} dataModels={dataModels} rules={rules} />
  )
}

function CustomViewComponent({ onChange = () => { },
  Component = undefined,
  mode = 'render',
  setting = undefined,
  initValue,
  value,
  index,
  record,
  dataIndex,
  validationRules,
  isGrid,
  rules
}: CustomEditComponentProps) {

  const test = React.useMemo(() => {
    const formData = initValue.find(x => x.rowKey === dataIndex).formData;
    const recordIsAlreadyExist = formData[index]?.value;
    const configForAddedRecord = formData[0]?.value;
    const currentInitValue = recordIsAlreadyExist ? formData[index]?.value : configForAddedRecord;
    const referenceColumnSetting: LayoutItemReferenceSetting = JSON.parse(setting);
    return {
      currentInitValue,
      referenceColumnSetting
    }
  }, []);
  return (
    <Component value={value} validationRules={validationRules} mode={mode} initValue={test.currentInitValue} onChange={(val) => { onChange(val) }} {...test.referenceColumnSetting} isGrid={isGrid} rules={rules} />
  )

}

export const ReferenceArchive = (props: ReferenceArchiveWidgetProps<Array<ReferenceArchiveValue>>) => {
  const { initValue, mode, columns, onRowClick, onActionOnTable, layoutDesign, validationRules, onChange = () => { }, primaryKey, dataModelGuid, currentLayout, layoutGuid, softwareGuid, context, label, dataModels } = props;
  const { Widget } = layoutDesign;
  const {
    HasPagination = false,
    HasSort = false,
    CanImportDataTable = false,
    CanExportDataTable = false,
    SearchSetting
  } = Widget;


  function handleChange(value, tableOnChange = (value: any) => null, record, dataIndex) {
    tableOnChange(value);
    onChange(value, dataIndex);
  }

  const handleSortColumn = async (rows, sortType, dataIndex, dataType) => {

    const model = {
      LayoutGuid: layoutGuid,
      PrimaryKey: primaryKey,
      SoftwareGuid: softwareGuid,
      ColumnOptions: { ColumnGuid: dataIndex, SortType: sortType ? SortType[sortType] : SortType.None, Filter: { Value: '' } },
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
          editComponent: mode === 'render' ? ({ value, onChange, record, index }) => <CustomEditComponent
            onChange={(value) => handleChange(value, onChange, record, column.dataIndex)}
            record={record}
            value={value}
            dataIndex={column.dataIndex}
            index={index}
            Component={layoutItemDesign?.Widget === 'DisplayWidget' ? (column.viewComponent as any).component : (column.editComponent as any).component}
            initValue={initValue}
            mode={mode}
            validationRules={column.staticProps.validationRules}
            setting={column.staticProps.columnSetting}
            primaryKey={primaryKey}
            dataModelGuid={dataModelGuid}
            isGrid={true}
            dataModels={dataModels}
            rules={[column.rules]}
          /> : layoutItemDesign?.Widget === 'DisplayWidget' ? (column.viewComponent as any).component : (column.editComponent as any).component,
          viewComponent: mode === 'render' ? ({ value, record, onChange, index }) => <CustomViewComponent
            onChange={(value) => handleChange(value, onChange, record, column.dataIndex)}
            record={record}
            value={value}
            dataIndex={column.dataIndex}
            index={index}
            Component={(column.viewComponent as any).component}
            initValue={initValue}
            mode={mode}
            validationRules={column.staticProps.validationRules}
            setting={column.staticProps.columnSetting}
            isGrid={true}
            dataModels={dataModels}
            rules={[column.rules]}
          /> : (column.viewComponent as any).component,
          filter: (a, b, c) => !!SearchSetting.ColumnViewModelGuid && (SearchSetting.ColumnViewModelGuid.toLowerCase() === column.dataIndex.toLowerCase()) ? filterInclude(a, b, c, column.dataIndex) : undefined,
          Filter: !!SearchSetting.ColumnViewModelGuid && (SearchSetting.ColumnViewModelGuid.toLowerCase() === column.dataIndex.toLowerCase()) ? getColumnFilterComponent(column.staticProps?.dataType) : undefined,
          width: 150,
          sort: handleSortColumn as any,
          resizable: mode === 'render' ? true : false
        } as ModernTableColumnProps<any>;
      }),
    []
  );

  function getTableActions(index: number) {
    const actions = [];
    if (!Widget.ImpossibilityAdd) {
      actions.push({
        title: translate('AddRowToNext'),
        handler: (record) => { handleAddNewRow(index + 1); }
      })
    }
    if (!Widget.ImpossibilityRemove) {
      actions.push({
        title: translate('Delete'),
        handler: (record) => { handleRemoveRow(index); }
      })
    }
    return actions;
  }

  const getRecords = () => {
    const records = [];
    const currentInitValue = [];
    initValue?.forEach(value => {
      if (value.dataModelNature === RelationNature.Aggregation) {
        switch (value.dataModelType) {
          case RelationType.OneToOne:
          case RelationType.OneToMany:
            records.push(...value.formData.filter((data) => !!data.primaryKey));
            break;
        }
      } else if (value.dataModelNature == null) {
        records.push(...value.formData);
      }
    });
    if (!!records.length) {
      Object.values(utility.groupBy(records, 'primaryKey')).forEach(record => {
        const result = {};
        record.forEach((item) => {
          result[item.key] = item.value
        })
        currentInitValue.push({ Guid: record[0].primaryKey, ...result })
      });
    }
    return currentInitValue;
  }

  const handleAddNewRow = (index: number) => {
    const tableRows = getData();
    if (Widget.MaxRow && tableRows.length >= Widget.MaxRow) {
      Message.warning(translate('TableCanNotAddMoreRow').replace('{0}', currentLayout.Label).replace('{1}', Widget.MaxRow.toString()))
      return
    }
    addNewRow(index)
  }
  const handleRemoveRow = (index: number) => {
    const tableRows = getData();
    if (Widget.MinRow && tableRows.length <= Widget.MinRow) {
      Message.warning(translate('TableCanNotRemoveMoreRow').replace('{0}', currentLayout.Label).replace('{1}', Widget.MinRow.toString()))
      return
    }
    deleteRow(index);
    onChange(null, index.toString());
  }

  function getCustomItems() {
    return (!Widget.ImpossibilityAdd ? [
      <Button type={'primary'} onClick={() => handleAddNewRow(getData().length)}>{translate('Add')}</Button>
    ] : null);
  }

  const {
    data,
    tableConfig,
    validateForms,
    addNewRow,
    deleteRow,
    getChanges,
    setInvalidRecords,
    getData,
  } = useModernTable({
    initialData: getRecords(),
    columns: tableColumns,
    mode: "EDIT_ALL",
    hasPagination: HasPagination,
    hasInitialRow: true,
    getActions: getTableActions,
    pageSize: 100,
    hasSort: mode === 'render' ? HasSort : false,
    //onChangeTable: handleChange,
    hasFilter: true,
    // @ts-ignore
    fixedWidth: true,
    draggable: mode === 'render' ? true : false,
    allowImportFile: CanImportDataTable,
    allowExportData: CanExportDataTable,
    customActionBarItems: getCustomItems(),
    label: label
  });

  function SUM(columnName: string) {
    return getData().map(item => item[columnName]).reduce((a, b) => { if (b) { return a + b } else { return a } }, 0);
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
    column: { filterValue, setFilter, id },
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

  function filterInclude(rows: any, id: any, filterValue: any, dataIndex) {
    return rows.filter(row => {
      const rowValue = row[dataIndex]?.toString();
      return rowValue ? rowValue.includes(filterValue) : false;
    })
  }

  function getColumnFilterComponent(dataType: number) {
    switch (dataType) {
      case 4:
        return BooleanColumnFilter

      default:
        return TextColumnFilter
    }
  }

  React.useEffect(() => {
    onActionOnTable({
      addNewRow,
      deleteRow,
      updateRow: tableConfig.updateTableData,
      setInvalidRecords,
      validateForms,
      getChanges,
      getData,
      SUM,
      SUMForGrid
    });
  }, []);


  return <div>
    <Table {...tableConfig} onRowClick={onRowClick} />
  </div>;
};

export default {
  component: injectContext(ReferenceArchive),
} as IWidget;






