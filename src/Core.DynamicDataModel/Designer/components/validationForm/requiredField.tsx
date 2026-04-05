import React from "react";
import {
  Checkbox,
  Form,
  Label,
  WrappedFormUtils,
} from "didgah/ant-core-component";
import { translate } from "../../../../Utility/language";
import { RequiredValidationSetting } from "../../../../typings/Core.DynamicDataModel/Types";
import { ValidationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";

export interface RequiredSettingProps {
  initialValue: RequiredValidationSetting;
  form: WrappedFormUtils<any>;
  onSave: () => void;
}

const RequiredSetting = (props: RequiredSettingProps) => {
  const { initialValue, form, onSave } = props;

  const onChange = (value) => {
    if (value.target.checked) {
      form.setFieldsValue({
        [ValidationType.Required.toString()]: {
          Required: value.target.checked,
        },
      });
    } else {
      form.setFieldsValue({
        [ValidationType.Required.toString()]: false,
      });
    }
    onSave();
  };

  React.useEffect(() => {
    if (initialValue.Required == null) {
      form.setFieldsValue({
        [ValidationType.Required.toString()]: false,
      });
    } else {
      form.setFieldsValue({
        [ValidationType.Required.toString()]: { Required: true },
      });
    }
  }, []);

  return (
    <>
      <Form.Row>
        <Form.Item
          label={translate("Required")}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Checkbox
            defaultChecked={initialValue.Required}
            onChange={onChange}
          />
        </Form.Item>
      </Form.Row>
      <div>
        {form.getFieldDecorator(ValidationType.Required.toString(), {
          initialValue: initialValue.Required,
        })(<Label></Label>)}
      </div>
    </>
  );
};

export default RequiredSetting;
