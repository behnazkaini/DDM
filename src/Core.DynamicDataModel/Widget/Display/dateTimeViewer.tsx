import * as React from "react";
import { DateTimePicker, injectContext, Label } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";


enum DefaultValueEnum {
  CurrentDate = '0'
}

const DateTimeViewer = (props: ComponentProps) => {
  const { value, DefaultValue } = props;

  const getValue = () => {
    let dateValue = value;
    if (!dateValue && (DefaultValue === DefaultValueEnum.CurrentDate)) dateValue = new Date()
    return dateValue
  }

  return (
    <div style={{ pointerEvents: 'none' }}>
      <DateTimePicker
        defaultValue={getValue()}
        valueType="string"
      />
    </div>
  );
};

export default {
  component: injectContext(DateTimeViewer),
} as IWidget;
