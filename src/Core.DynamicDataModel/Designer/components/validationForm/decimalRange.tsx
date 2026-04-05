import React from "react";
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Label,
  NumericalInput,
  WrappedFormUtils,
} from "didgah/ant-core-component";
import { translate } from "../../../../Utility/language";
import { RangeValidationSetting } from "../../../../typings/Core.DynamicDataModel/Types";
import { ValidationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { DecimalDataTypeSettingViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DecimalDataTypeSettingViewModel";

interface DecimalRangeSettingProps {
  initialValue: RangeValidationSetting<number>;
  dataTypeSetting: DecimalDataTypeSettingViewModel;
  form: WrappedFormUtils<any>;
  errorCallback: (errors: string[]) => void;
}

const DecimalRangeSetting = (props: DecimalRangeSettingProps) => {
  const { initialValue, dataTypeSetting, form, errorCallback } = props;
  const { Min, Max } = initialValue;

  const [value, setValue] = React.useState<RangeValidationSetting<string>>({
    Min: !!Min || Min === 0 ? Min.toString() : undefined,
    Max: !!Max || Max === 0 ? Max.toString() : undefined,
  });

  const [disabled, setDisabled] = React.useState(
    initialValue.Min != null || initialValue.Max != null ? false : true
  );

  const maxValue =
    Math.pow(10, dataTypeSetting.Precision) -
    Math.pow(10, -dataTypeSetting.Scale);
  const minValue = -(
    Math.pow(10, dataTypeSetting.Precision) -
    Math.pow(10, -dataTypeSetting.Scale)
  );

  const checkLengthValidation = (
    value: RangeValidationSetting<string>
  ): boolean => {
    
    if (value.Min != null && parseFloat(value.Min) < minValue) {
      return false;
    }

    if (value.Max != null && (parseFloat(value.Max) > maxValue)) {
      return false;
    }

    return true;
  };

  const handleCheckValidation = (valueProp: RangeValidationSetting<string>) => {
    const isLengthValid = checkLengthValidation(valueProp);
    const errors: string[] = [];

    if (
      valueProp.Min != null &&
      valueProp.Max != null &&
      parseFloat(valueProp.Min) > parseFloat(valueProp.Max)
    ) {
      errors.push(translate("MinIsGreaterThanMax"));
    }

    if (!isLengthValid) {
      errors.push(translate("MinIsNotValidCompareFieldInstancRules"));
    }

    errorCallback(errors);
  };

  const onChangeMaxHandler = (val: string) => {
    setValue((current) => ({ Max: val, Min: current.Min }));

    form.setFieldsValue({
      [ValidationType.Range.toString()]: { Max: val, Min: value.Min },
    });

    handleCheckValidation({ Max: val, Min: value.Min });
  };

  const onChangeMinHandler = (val) => {
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
      setValue({ Max: undefined, Min: undefined });
      form.setFieldsValue({
        [ValidationType.Range.toString()]: {
          Min: undefined,
          Max: undefined,
        },
      });
    }

    handleCheckValidation({ Max: undefined, Min: undefined });
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
            <NumericalInput
              direction="ltr"
              value={value.Min}
              defaultValue={Min}
              disabled={disabled}
              onChange={onChangeMinHandler}
              doNotConvertValueToNumber={true}
              allowNegativeNumbers={true}
              allowFloatNumbers={true}
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
            <NumericalInput
              direction="ltr"
              value={value.Max}
              defaultValue={Max}
              disabled={disabled}
              onChange={onChangeMaxHandler}
              doNotConvertValueToNumber={true}
              allowNegativeNumbers={true}
              allowFloatNumbers={true}
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

export default DecimalRangeSetting;
