import { AutoCompleteEx, Button, StackPanel } from "didgah/ant-core-component";
import * as React from "react";
import { IWidget, ComponentProps, AggregationOneToOneValue } from "../../../typings/Core.DynamicDataModel/Types";
import { getApiUrl } from '../../../Utility/helpers';
import { translate } from "../../../Utility/language";
import { ColumnDataType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

const ReferenceAutoComplete = (props: ComponentProps<AggregationOneToOneValue>) => {
  const { value, onChange, initValue, Disabled, ReferenceAutoCompleteColumnsConfige = { SeperableCharachter: ',', Columns: {} }, mode, dataModels, Widget } = props;
  const columnDataModels = React.useRef(dataModels?.find(dtm => dtm?.Guid === initValue?.metadata?.DataModelGuid)?.Columns);
  const formData = React.useRef([]);
  const autoCompleteRefrenceColumnGuids = React.useRef(Object.keys(ReferenceAutoCompleteColumnsConfige?.Columns))

  function defineCustomDataLabelName(result) {
    const filtredValues = result.KeyValues.
      filter(keyValue => autoCompleteRefrenceColumnGuids.current.some(columnGuid => columnGuid === keyValue.Key)).
      sort((prev, next) => +ReferenceAutoCompleteColumnsConfige?.Columns[prev.Key]?.order - +ReferenceAutoCompleteColumnsConfige?.Columns[next.Key]?.order).
      map(keyValue => (+columnDataModels.current.find(cdm => cdm.Guid === keyValue.Key)?.DataType === +ColumnDataType.Boolean) ? { ...keyValue, Value: translate(keyValue.Value ? 'True' : 'False') } : keyValue);

    const filtredResult = { ...result, KeyValues: filtredValues };

    const values: string[] = (filtredResult.KeyValues as Array<{ Value: string; Key: string }>).map((column) => column.Value);
    formData.current.push(filtredResult);
    return (values).join(ReferenceAutoCompleteColumnsConfige.SeperableCharachter);
  }

  function handleChange(selectedItem) {
    const rowData = formData.current.find((data) => data.PrimaryKey === selectedItem.key);
    if (!!selectedItem) {
      onChange({
        key: selectedItem.key,
        label: selectedItem.label,
        metadata: initValue.metadata,
        rowData: rowData.KeyValues
      });
    } else {
      onChange(null);
    }

    formData.current = [];
  }
  return (
    <div style={{
      display: "flex",
      alignItems: "center"
    }}>

      <AutoCompleteEx style={{ width: "100%" }}
        remoteDataSource={{
          url: getApiUrl('DynamicDataModel', 'DataModel', 'SearchByKeyword'),
          metadata: {
            ColumnGuids: initValue?.metadata.ColumnGuids,
            DataModelGuid: initValue?.metadata.DataModelGuid,
          },
          dataValueName: "PrimaryKey",
          dataLabelName: 'KeyValues',
          defineCustomDataLabelName: defineCustomDataLabelName
        }}
        defaultValue={value}
        onChange={handleChange}
        disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
        allowClear
      />

      {/* <Button icon={"search"} onClick={() => null}></Button> */}
    </div>
  );
};

export default {
  component: ReferenceAutoComplete,
} as IWidget;
