import { BaseColumnSetting, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";
import { Setting } from "../../../TS/Widgets";
import {
  Checkbox,
  DateTimePicker,
  Form,
  Label,
} from "didgah/ant-core-component";
import React, { useState } from "react";
import { translate } from "didgah/common";

export interface DateTimeDefaultValueSettingState {
  switchComponent: boolean;
}

const DateTimeDefaultValue = (props: SettingFormItemProps<BaseColumnSetting>) => {
  const { initialSettingValues, form, onSave, key } = props;
  const { setFieldsValue } = form;
  const { DefaultValue } = initialSettingValues;
  const [value, setValue] = useState<number | string | Date>(DefaultValue == '0' ? null : DefaultValue);
  const [currentDateSelected, setCurrentDateSelected] = useState<boolean>(DefaultValue == '0');

  const handleDateTimeOnChange = (date: string | Date) => {
    const fullDateTimeString = moment(date).format();
    setFieldsValue({
      [String(Setting.DefaultValue)]: fullDateTimeString,
    });
    setValue(fullDateTimeString);
    onSave();
  }

  const handleCurrentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDateSelected((e.target).checked);
    setFieldsValue({
      [String(Setting.DefaultValue)]: (e.target).checked ? '0' : null,
    });
    setValue(null);
    onSave()
  }

  return (
    <div key={key}>
      <p>{translate("DefaultValue")}:</p>
      <Form.Item
        label={translate("PickerFromCalendar")}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        colon={false}
      >
        <DateTimePicker
          defaultValue={value as string}
          valueType="string"
          onChange={handleDateTimeOnChange}
          size={"small"}
          allowClear={true}
          disabled={currentDateSelected}
        />
      </Form.Item>
      <Form.Item
        label={translate("PickCurrentDay")}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        colon={false}

      >
        <Checkbox
          checked={currentDateSelected}
          onChange={handleCurrentDateChange}
        />
      </Form.Item>
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

export default DateTimeDefaultValue;
