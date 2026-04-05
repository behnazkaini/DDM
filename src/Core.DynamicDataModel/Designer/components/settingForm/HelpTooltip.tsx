import { Form, Input } from "didgah/ant-core-component";
import React from "react";
import { translate } from "../../../../Utility/language";
import { BaseColumnSetting, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";

const HelpTooltipSetting = (props: SettingFormItemProps<BaseColumnSetting>) => {
  const { initialSettingValues, form, settingName, onSave, key } = props;
  return (
    <Form.Item
      key={key}
      label={translate("HelpTooltip")}
      labelCol={{ span: 0, offset: 0 }}
      wrapperCol={{ span: 24, offset: 0 }}
    >
      {form.getFieldDecorator(settingName, {
        initialValue: initialSettingValues.HelpTooltip,
      })(<Input type="textarea" maxLength={255} onChange={onSave} />)}
    </Form.Item>
  );
};

export default HelpTooltipSetting;
