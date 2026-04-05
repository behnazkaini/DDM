import { Setting } from "../../../TS/Widgets";
import {
  Checkbox,
  Form,
  InputNumber,
} from "didgah/ant-core-component";
import React, { useState } from "react";
import { translate } from "../../../../Utility/language";
import { BaseColumnSetting, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";

const LabelMutable = (props: SettingFormItemProps<BaseColumnSetting>) => {
  const { initialSettingValues, form, onSave, key } = props;
  const [isMutable, setIsMutable] = useState(initialSettingValues.LabelMutable);

  const OnChangeShowLabelMutableInputs = (event) => {
    if (event.target.checked === false) {
      setIsMutable(event.target.checked);
      form.setFieldsValue({ WrapperCol: null, WrapperLabel: null });
    } else {
      setIsMutable(event.target.checked);
    }

    onSave();
  };

  const onChangeLabelCol = (value) => {
    const { setFieldsValue } = props.form;

    setFieldsValue({ WrapperCol: 24 - value });
    onSave();
  };

  const onChangeWrapperCol = (value) => {
    const { setFieldsValue } = props.form;

    setFieldsValue({ WrapperLabel: 24 - value });
    onSave();
  };

  return (
    <>
      <Form.Item
        key={key}
        label={translate("LabelMutable")}
        labelCol={{ span: 0, offset: 0 }}
        wrapperCol={{ span: 24, offset: 0 }}
      >
        {form.getFieldDecorator(Setting.LabelMutable, {
          valuePropName: "checked",
          initialValue: isMutable,
        })(<Checkbox onChange={OnChangeShowLabelMutableInputs} />)}
      </Form.Item>
      <div style={{ display: isMutable ? "block" : "none" }}>
        <Form.Item
          label={translate("LabelWide")}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          {form.getFieldDecorator(Setting.WrapperLabel.toString(), {
            initialValue:
              initialSettingValues.WrapperLabel == null
                ? 4
                : initialSettingValues.WrapperLabel,
            rules: [{ max: 24, min: 0, type: "number", message: "خطا" }],
          })(<InputNumber onChange={onChangeLabelCol.bind(this)} />)}
        </Form.Item>
        <Form.Item
          label={translate("InputWide")}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          {form.getFieldDecorator(Setting.WrapperCol.toString(), {
            initialValue:
              initialSettingValues.WrapperCol == null
                ? 20
                : initialSettingValues.WrapperCol,
            rules: [{ max: 24, min: 0, type: "number", message: "خطا" }],
          })(<InputNumber onChange={onChangeWrapperCol.bind(this)} />)}
        </Form.Item>
      </div>
    </>
  );
};

export default LabelMutable;
