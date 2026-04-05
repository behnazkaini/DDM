import {
  LayoutItemColumnSetting,
  RangeValidationSetting,
} from "../../../../typings/Core.DynamicDataModel/Types";
import {
  Checkbox,
  DatePickerEx,
  DateTimePicker,
  Form,
  Label,
  TimePickerEx,
  WrappedFormUtils,
} from "didgah/ant-core-component";
import React from "react";
import { ValidationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { calendar, translate } from "didgah/common";
 
interface dateTimeSettingProps {
  initialValue: RangeValidationSetting<string>;
  dataTypeSetting: any;
  layoutItemDesign: string;
  form: WrappedFormUtils<any>;
  value: any;
  errorCallback: (errors: string[]) => void;
}

const DateTimeRangeSetting = (props: dateTimeSettingProps) => {
  const { initialValue, form, layoutItemDesign, errorCallback, value } = props;
  const widgetDesign = JSON.parse(layoutItemDesign) as LayoutItemColumnSetting;
  const { Min, Max } = initialValue;

  const [valueState, setValue] = React.useState<{ Min: string; Max: string }>({
    Min,
    Max,
  });

  const [disabled, setDisabled] = React.useState(
    initialValue.Min != null || initialValue.Max != null ? false : true
  );

  const handleCheckValidation = (valueProp: RangeValidationSetting<string>) => {
    const minDate = new Date(valueProp.Min);
    const maxDate = new Date(valueProp.Max);

    const errors: string[] = [];

    if (minDate != null && maxDate != null && minDate.getTime() > maxDate.getTime()) {
      errors.push(translate("MinIsGreaterThanMax"));
    }

    errorCallback(errors);
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

  const onChangeMinHandler = (val) => {
    const fullDateTimeString = moment(val).format();

    form.setFieldsValue({
      [ValidationType.Range.toString()]: { Max: valueState.Max, Min: fullDateTimeString },
    });
    setValue((current) => ({ Max: current.Max, Min: fullDateTimeString }));
    handleCheckValidation({ Max: valueState.Max, Min: fullDateTimeString });
  };

  const onChangeMaxHandler = (val) => {
    const fullDateTimeString = moment(val).format();
    form.setFieldsValue({
      [ValidationType.Range.toString()]: { Max: fullDateTimeString, Min: valueState.Min },
    });
    setValue((current) => ({ Max: fullDateTimeString, Min: current.Min }));
    handleCheckValidation({ Max: fullDateTimeString, Min: valueState.Min });
  };

  const FormFactory = (props: {
    widgetId: number;
    value: string;
    defaultValue: string;
    disabled: boolean;
    onChange: (date: any, dateString?: string) => void;
  }) => {
    const { widgetId, value, defaultValue, disabled, onChange } = props;
    switch (widgetId.toString()) {
      case "0":
        return (
          <DateTimePicker
            onChange={onChange}
            defaultValue={defaultValue}
            value={value}
            valueType="string"
            allowClear
          ></DateTimePicker>
        );
      case "1":
        return <DatePickerEx onChange={onChange} value={value} valueType="string" allowClear defaultValue={defaultValue}></DatePickerEx>;
      case "2":
        return <TimePickerEx onChange={onChange} value={value} valueType="string" defaultValue={defaultValue}></TimePickerEx>;
      default:
        return (
          <DateTimePicker
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
            valueType="string"
            allowClear
          ></DateTimePicker>
        );
    }
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
            <FormFactory
              widgetId={widgetDesign.EditWidget.Id}
              value={valueState.Min}
              defaultValue={Min}
              disabled={disabled}
              onChange={onChangeMinHandler}
            />
          </Form.Item>
        </Form.Row>
      </div>
      <div style={{ display: disabled ? "none" : "block" }}>
        <Form.Row>
          <Form.Item
            label={translate("Maximum")}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            colon={true}
          >
            <FormFactory
              widgetId={widgetDesign.EditWidget.Id}
              value={valueState.Max}
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

export default DateTimeRangeSetting;
