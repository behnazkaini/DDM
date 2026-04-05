import React from "react";
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Label,
  WrappedFormUtils,
} from "didgah/ant-core-component";
import { translate } from "../../../../Utility/language";
import { RangeValidationSetting } from "../../../../typings/Core.DynamicDataModel/Types";
import { StringDataTypeSettingViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.StringDataTypeSettingViewModel";
import { ValidationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";

interface StringRangeSettingProps {
  initialValue: RangeValidationSetting<number>;
  dataTypeSetting: StringDataTypeSettingViewModel;
  form: WrappedFormUtils<any>;
  errorCallback: (errors: string[]) => void;
  onSave: () => void;
}

const StringRangeSetting = (props: StringRangeSettingProps) => {
  const { initialValue, dataTypeSetting, form, errorCallback } = props;
  const { Min, Max } = initialValue; 
  const maxInitialValue = initialValue.Max ? initialValue.Max : dataTypeSetting.MaxLength;
  const [value, setValue] = React.useState<{ Min: number; Max: number }>({
    Min,
    Max,
  });

  const [disabled, setDisabled] = React.useState(
    initialValue.Min != null || initialValue.Max != null ? false : true
  );

  const checkLengthValidation = (
    value: RangeValidationSetting<number>
  ): boolean => {
    if (
      (value.Min != null || value.Min != null) &&
      (value.Min < 0 || value.Max < 0)
    ) {
      return false;
    }

    if (
      value.Max != null &&
      (dataTypeSetting.Max == null || dataTypeSetting.Max != true) &&
      value.Max > dataTypeSetting.MaxLength
    ) {
      return false;
    }

    return true;
  };

  const handleCheckValidation = (valueProp: RangeValidationSetting<number>) => {
    const isLengthValid = checkLengthValidation(valueProp);
    const errors: string[] = [];

    if (
      valueProp.Min != null &&
      valueProp.Max != null &&
      valueProp.Min > valueProp.Max
    ) {
      errors.push(translate("MinIsGreaterThanMax"));
    }

    if (!isLengthValid) {
      errors.push(translate("MinIsNotValidCompareFieldInstancRules"));
    }

    errorCallback(errors);
  };

  const onChangeMaxHandler = (val: number) => {
      setValue((current) => ({ Max: val, Min: current.Min }));
      form.setFieldsValue({
        [ValidationType.Range.toString()]: { Max: val, Min: value.Min },
      });
      handleCheckValidation({ Max: val, Min: value.Min });
  };

  const onChangeMinHandler = (val: number) => {
    setValue((current) => ({ Max: current.Max, Min: val }));
    form.setFieldsValue({
      [ValidationType.Range.toString()]: { Max: value.Max, Min: val },
    });

    handleCheckValidation({ Max: value.Max, Min: val });
  };

  const onChangeDisable = (value) => {
    setDisabled(!value.target.checked);
    if (!value.target.checked) {
      form.setFieldsValue({
        [ValidationType.Range.toString()]: false,
      });
    } else {
      setValue({ Max: maxInitialValue, Min: undefined });
      form.setFieldsValue({
        [ValidationType.Range.toString()]: {
          Min: undefined,
          Max: maxInitialValue,
        },
      });
    }

    handleCheckValidation({ Max:maxInitialValue, Min: undefined });
  };

  React.useEffect(() => {
    if (disabled) {
      form.setFieldsValue({
        [ValidationType.Range.toString()]: false,
      });
    }
  }, []);

  return (
    <div style={{ marginTop: "15px" }}>
      <Form.Row>
        <div>
          <Checkbox onChange={onChangeDisable} checked={!disabled}>
            {translate("Range")}
          </Checkbox>
        </div>
      </Form.Row>
      <div style={{ display: disabled ? "none" : "block" }}>
        <Form.Row>
          <Form.Item
            label={translate("Minimum")}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            colon={true}
          >
            <InputNumber
              value={value.Min}
              defaultValue={Min}
              disabled={disabled}
              onChange={onChangeMinHandler}
            />
          </Form.Item>
        </Form.Row>
        <Form.Row>
          <Form.Item
            label={translate("Maximum")}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            colon={true}
          >
            <InputNumber
              value={value.Max}
              defaultValue={Max}
              disabled={disabled}
              onChange={onChangeMaxHandler}
            />
          </Form.Item>
        </Form.Row>
      </div>

      <div>
        {form.getFieldDecorator(ValidationType.Range.toString(), {
          initialValue: { Max, Min },
        })(<Label></Label>)}
      </div>
    </div>
  );
};

export default StringRangeSetting;
