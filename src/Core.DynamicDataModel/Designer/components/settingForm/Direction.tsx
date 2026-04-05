import { Form, SelectEx, WrappedFormUtils } from "didgah/ant-core-component";
import React from "react";
import { translate } from "../../../../Utility/language";
import { DirectionType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { LayoutItemColumnSetting } from "../../../../typings/Core.DynamicDataModel/Types";

export interface DirectionProps {
  initialSettingValues: LayoutItemColumnSetting;
  settingName: string;
  form: WrappedFormUtils<any>;
  onSave: () => void;
  key: string;
}

const Direction = (props: DirectionProps) => {
  const dircetionArrayTypes = [
    { key: translate("Automatic"), value: DirectionType.Auto },
    { key: translate("RightToLeft"), value: DirectionType.Right },
    { key: translate("LeftToRight"), value: DirectionType.Left },
  ];

  const { initialSettingValues, form, settingName, onSave, key } = props;

  return (
    <Form.Item
      key={key}
      label={translate("LanguageDirection")}
      labelCol={{ span: 0, offset: 0 }}
      wrapperCol={{ span: 24, offset: 0 }}
    >
      {form.getFieldDecorator(settingName, {
        initialValue: initialSettingValues.Direction,
      })(<SelectEx dataSource={dircetionArrayTypes} onChange={onSave} />)}
    </Form.Item>
  );
};

export default Direction;
