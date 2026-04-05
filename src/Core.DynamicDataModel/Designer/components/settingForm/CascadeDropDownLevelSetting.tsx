import { Form, Input, InputNumber, SelectEx, useAjax } from "didgah/ant-core-component";
import React, { useState } from "react";
import { translate } from "../../../../Utility/language";
import { SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";
import { Setting } from "../../../TS/Widgets";
import { CasecadePermanentDataModelRequestViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.CasecadePermanentDataModelRequestViewModel";
import { DataModelViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel';
import { getApiUrl } from "../../../../Utility/helpers";

interface CascadeDropDownSettingProps {
  CascadeDropDownLevel: number;
}

const CascadeDropDownSetting = (props: SettingFormItemProps<CascadeDropDownSettingProps>) => {

  const { initialSettingValues, form, onSave, key } = props;
  const ajax = useAjax()
  const [maxLevel, setMaxLevel] = React.useState(1);
  
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
    setMaxLevel(result.length);
  }
  
  React.useEffect(() => {
    getCasecadePermanent();
  }, []);

  return (
    <div>
      <Form.Item
        key={key}
        label={Setting.CascadeDropDownLevel}
        labelCol={{ span: 0, offset: 0 }}
        wrapperCol={{ span: 24, offset: 0 }}
      >
        {form.getFieldDecorator(Setting.CascadeDropDownLevel, {
          initialValue: initialSettingValues.CascadeDropDownLevel,
          rules: [
            { required: true, message: translate("Required") },
          ],
        })(<InputNumber onChange={onSave} max={maxLevel} min={1} />)}
      </Form.Item>
    </div>
  );
};

export default CascadeDropDownSetting;
