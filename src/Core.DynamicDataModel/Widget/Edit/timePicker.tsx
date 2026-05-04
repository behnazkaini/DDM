import * as React from "react";
import { injectContext, TimePickerEx } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

const TimePickerWidget = (props: ComponentProps<string>) => {
  const { value, onChange, DefaultValue, mode, Disabled, Widget, resetForm } = props;

  const handleChange = (selectedDate) => {
    if (mode === "render") {
      onChange(selectedDate);
    }
    typeof resetForm === 'function' && resetForm()
  }

  React.useEffect(() => {
    if (typeof value === 'undefined' && DefaultValue) {
      handleChange(DefaultValue);
    }
  }, []);


  return (
    <TimePickerEx
      onChange={handleChange}
      defaultValue={value}
      valueType="string"
      disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
    />
  );
};

export default {
  component: injectContext(TimePickerWidget),
} as IWidget;
