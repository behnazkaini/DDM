import { Setting } from "../../../TS/Widgets";
import { Form, TimePickerEx } from "didgah/ant-core-component";
import React, { useEffect } from "react";
import { translate } from "../../../../Utility/language";
import { BaseColumnSetting, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";

const TimeDefaultValue = (props: SettingFormItemProps<BaseColumnSetting>) => {
  const { form, onSave, key, initialSettingValues } = props;
  const { getFieldValue } = form;

  const getValueFromEvent = (val) => {
    return moment(val).format();
  }

  useEffect(() => {
    onSave();
  }, [getFieldValue(Setting.DefaultValue)]);

  return (
      <Form.Item
        key={key}
        label={translate("DefaultValue")}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        colon={false}
      >
        {form.getFieldDecorator(Setting.DefaultValue, {
          initialValue: initialSettingValues.DefaultValue,
          getValueFromEvent
        })(<TimePickerEx 
          valueType="string" 
        />
        )}
      </Form.Item>
  );
};

export default TimeDefaultValue;
