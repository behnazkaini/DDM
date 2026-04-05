import { BaseColumnSetting, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";
import {
  DatePickerEx,
  Form,
  Label,
  NumericalInput,
  Switch,
} from "didgah/ant-core-component";
import React, { useState } from "react";
import { translate } from "../../../../Utility/language";
import { Setting } from "../../../TS/Widgets";
import { calendar } from "didgah/common";
export interface dateDefaultValueSettingState {
  switchComponent: boolean;
}

const DefaultValueDate = (props: SettingFormItemProps<BaseColumnSetting>) => {
  const { initialSettingValues, form, onSave, key } = props;
  const { setFieldsValue } = form;
  const { DefaultValue } = initialSettingValues;
  const patt = /^(\d{1,5})$|^([-+]\d{1,5})$/g;
  const [switchComponent, setSwitchComponent] = useState(
    DefaultValue != null ? patt.test(DefaultValue) : true
  );
  const [value, setValue] = useState<number | string | Date>(DefaultValue);

  const onChangeTypeDefaultValue = (state: boolean) => {
    setSwitchComponent(state);
  };

  const handleDayNumberOnChange = (numDay: number) => {
    if (numDay <= 365 && patt.test(String(numDay))) {
      setFieldsValue({
        [String(Setting.DefaultValue)]: numDay,
      });
      setValue(numDay);
      onSave();
    } else if (numDay == null) {
      setFieldsValue({
        [String(Setting.DefaultValue)]: undefined,
      });
      setValue(undefined);
      onSave();
    }
  };

  const handleDateTimeOnChange = (date: string | Date) => {
    const fullDateTimeString = moment(date).format();
    setFieldsValue({
      [String(Setting.DefaultValue)]: fullDateTimeString,
    });
    setValue(fullDateTimeString);
    onSave(); 
  }

  return (
    <div key={key}>
      <Form.Item
        label={translate("DefaultValue")}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
      >
        <Switch
          checkedChildren={translate("Dynamic")}
          unCheckedChildren={translate("Fix")}
          onChange={onChangeTypeDefaultValue}
          defaultChecked={switchComponent}
        />
      </Form.Item>
      <div style={{ display: switchComponent ? "block" : "none" }}>
        <Form.Item
          label={null}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          colon={false}
        >
          <NumericalInput
            defaultValue={value}
            value={value}
            onChange={handleDayNumberOnChange}
            allowFloatNumbers={false}
            allowNegativeNumbers={false}
            doNotConvertValueToNumber={true}
          />
        </Form.Item>
      </div>
      <div style={{ display: !switchComponent ? "block" : "none" }}>
        <Form.Item
          label={null}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          colon={false}
        >
          <DatePickerEx
            valueType="string"
            onChange={handleDateTimeOnChange}
            defaultValue={value as string}
          />
        </Form.Item>
      </div>
      <Form.Item
        label={null}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        colon={false}
      >
        {form.getFieldDecorator(Setting.DefaultValue, {
          initialValue: initialSettingValues.DefaultValue,
        })(<Label></Label>)}
      </Form.Item>
    </div>
  );
};

export default DefaultValueDate;