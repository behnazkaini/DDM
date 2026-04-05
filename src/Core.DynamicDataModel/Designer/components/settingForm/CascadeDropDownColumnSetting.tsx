import { Alert, Form, Input, InputNumber, SelectEx, useAjax } from "didgah/ant-core-component";
import React, { useState } from "react";
import { translate } from "../../../../Utility/language";
import { BaseColumnSetting, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";
import { Setting } from "../../../TS/Widgets";
import { CasecadePermanentDataModelRequestViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.CasecadePermanentDataModelRequestViewModel";
import { getApiUrl } from "../../../../Utility/helpers";
import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";

interface CascadeDropDownSettingProps {
  CascadeDropdownSelectedColumns: string;
}

const CascadeDropDownSetting = (props: SettingFormItemProps<CascadeDropDownSettingProps>) => {
  const ajax = useAjax();
  const [columnDataSources, setColumnDataSources] = useState([]);
  const [error, setError] = useState(null);

  const getCasecadePermanent = async () => {
    const sendModel: CasecadePermanentDataModelRequestViewModel = {
      Guid: props.dataModel.Guid
    };
    const dataModels: DataModelViewModel[] = await ajax.post({
      url: getApiUrl('DynamicDataModel', 'DataModel', 'GetCasecadePermanent'),
      data: sendModel
    });
    let result = [...dataModels];
    result = dataModels.filter((a, index, array) => array.findIndex((b) => b.Guid === a.Guid) === index);
    setColumnDataSources(result.map((item, index) => ({
      dataModelGuid: item.Guid,
      title: item.Label,
      dataSource: item.Columns.map(c => ({ key: c.Label, value: c.Guid })),
      level: index + 1
    })));
    form.setFieldsValue({[Setting.CascadeDropdownSelectedColumns]: initialSettingValues.CascadeDropdownSelectedColumns });
  }

  const onSelectedColumnChange = (dataModelGuid, columnGuid) => {
    let selectedColumns = form.getFieldValue(Setting.CascadeDropdownSelectedColumns);
    if (!selectedColumns) {
      selectedColumns = {};
    }
    selectedColumns[dataModelGuid] = columnGuid;
    form.setFieldsValue({ [Setting.CascadeDropdownSelectedColumns]: selectedColumns });
    let isValid = true;
    columnDataSources.slice(0, form.getFieldValue(Setting.CascadeDropDownLevel)).forEach(ds => {
      if(!selectedColumns[ds.dataModelGuid]) {
        isValid = false;
      }
    })
    if(isValid) {
      setError(null);
      props.onSave();
    } else {
      setError(translate("DDM_PleaseSelectColumns"));
    }
  }

  const getSelectValue = (dataModelGuid) => {
    const selectedColumns = form.getFieldValue(Setting.CascadeDropdownSelectedColumns);
    return selectedColumns?.[dataModelGuid] ?? null;
  }

  React.useEffect(() => {
    getCasecadePermanent();
  }, []);

  const { initialSettingValues, form, onSave, key } = props;
  return (
    <div>
      {error && <Alert type="error" message={error} />  }
      {form.getFieldDecorator(Setting.CascadeDropdownSelectedColumns, {
        initialValue: null,
        rules: [
          { required: true, message: translate("Required") },
        ],
      })(<></>)} 
      {columnDataSources.map((dsi, index) => (
        <Form.Item 
          key={index}
          label={dsi.title}
          labelCol={{ span: 0, offset: 0 }}
          wrapperCol={{ span: 24, offset: 0 }}
          required

        >
          <SelectEx
            key={index}
            value={getSelectValue(dsi.dataModelGuid)}
            dataSource={columnDataSources[index]?.dataSource ?? []}
            onChange={(value) => {
              onSelectedColumnChange(dsi.dataModelGuid, value);
            }}
          />
        </Form.Item>

      )).slice(0, form.getFieldValue(Setting.CascadeDropDownLevel)).reverse()
      }
    </div>
  );
};

export default CascadeDropDownSetting;
