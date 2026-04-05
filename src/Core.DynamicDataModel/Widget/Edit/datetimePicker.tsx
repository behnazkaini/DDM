import * as React from "react";
import { DateTimePicker, injectContext } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { calendar } from "didgah/common";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

export const DateTimePickerWidget = (props: any) => {
  const { value, onChange, DefaultValue, mode, Disabled, Widget } = props;
  const pattNumber = /^(\d{1,5})$|^([-+]\d{1,5})$/g;

  const handleChange = (selectedDateTime) => {
    if (mode === "render") {
      if (pattNumber.test(selectedDateTime)) {
        onChange(calendar.calculateDateByDayNumber(selectedDateTime) as any);
      } else {
        onChange(selectedDateTime);
      }
      props.resetForm()
    }
  }

  React.useEffect(() => {
    if (typeof value === 'undefined' && DefaultValue) {
      handleChange(DefaultValue);
    }
  }, []);

  return (
    <DateTimePicker
      onChange={handleChange}
      defaultValue={value}
      valueType="string"
      disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
    />
  );
};

export default {
  component: injectContext(DateTimePickerWidget),
} as IWidget;
