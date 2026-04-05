import * as React from "react";
import { DatePickerEx, injectContext } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { calendar } from "didgah/common";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

const DatePickerWidget = (props: ComponentProps<string>) => {
  const { value, onChange, DefaultValue, mode, Disabled, Widget } = props;
  const pattNumber = /^(\d{1,5})$|^([-+]\d{1,5})$/g;

  const handleChange = (selectedDate) => {
    if (mode === "render") {
      if (pattNumber.test(selectedDate)) {
        onChange(calendar.calculateDateByDayNumber(selectedDate) as any);
      } else {
        onChange(selectedDate);
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
    <DatePickerEx
      onChange={handleChange}
      defaultValue={value}
      valueType="string"
      disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
    />
  );
};

export default {
  component: injectContext(DatePickerWidget),
} as IWidget;
