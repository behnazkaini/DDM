import React from "react";
import {
  Checkbox,
  Fieldset,
  Form,
  Input,
  Label,
  SelectEx,
  WrappedFormUtils,
} from "didgah/ant-core-component";
import { translate } from "../../../../Utility/language";
import {
  SimpleRegexValidationDataType,
  SimpleRegexValidationSetting,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { ColumnDataType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { ValidationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";

export interface RegexFieldSettingProps {
  initialValue: SimpleRegexValidationSetting;
  dataTypeSetting: any;
  viewModelDataType: ColumnDataType;
  form: WrappedFormUtils<any>;
  onSave: () => void;
}

const RegexFieldSetting = (props: RegexFieldSettingProps) => {
  const { form, viewModelDataType, initialValue, onSave } = props;
  const [value, setValue] = React.useState(initialValue.Regex);
  const [disabled, setDisabled] = React.useState(
    initialValue.Regex == null ? true : false
  );

  const onChangeHandler = (value) => {
    if (
      value.currentTarget.value == null ||
      value.currentTarget.value.trim() === ""
    ) {
      setValue(value.currentTarget.value);
      form.setFieldsValue({
        [ValidationType.Regex.toString()]: false,
      });
    } else {
      setValue(value.currentTarget.value);
      form.setFieldsValue({
        [ValidationType.Regex.toString()]: { Regex: value.currentTarget.value },
      });
    }
    onSave();
  };

  const onChangeDisable = (value) => {
    setDisabled(!value.target.checked);

    if (!value.target.checked) {
      form.setFieldsValue({
        [ValidationType.Regex.toString()]: false,
      });
      setValue(undefined);
    }
    onSave();
  };

  React.useEffect(() => {
    if (initialValue.Regex != null) {
      form.setFieldsValue({
        [ValidationType.Regex.toString()]: { Regex: initialValue.Regex },
      });
    } else {
      form.setFieldsValue({
        [ValidationType.Regex.toString()]: false,
      });
    }
  }, []);

  return (
    <div style={{ marginTop: "15px" }}>
      <Form.Row>
        <div>
          <Checkbox onChange={onChangeDisable} checked={!disabled}>
            {translate("Regex")}
          </Checkbox>
        </div>
      </Form.Row>
      <div style={{ display: disabled ? "none" : "block" }}>
        <Form.Row>
          <Form.Item
            label={""}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              value={value}
              disabled={disabled}
              onChange={onChangeHandler}
              type="textarea"
            />
          </Form.Item>
        </Form.Row>
      </div>
      <div>
        {form.getFieldDecorator(ValidationType.Regex.toString(), {
          initialValue: initialValue.Regex,
        })(<Label></Label>)}
      </div>
    </div>
  );
};

export default RegexFieldSetting;
