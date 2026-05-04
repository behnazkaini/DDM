import React, { useEffect } from "react";
import { DatePickerEx, injectContext } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

enum DefaultValueEnum {
  CurrentDate = '0'
}

const DateViewer = (props: ComponentProps) => {
  const { value, DefaultValue } = props;

  const getValue = () => {
    let dateValue = value;
    if (!dateValue && (DefaultValue === DefaultValueEnum.CurrentDate)) dateValue = new Date()
    return dateValue
  }

  return (
    <div style={{ pointerEvents: 'none' }}>
      <DatePickerEx
        defaultValue={getValue()}
        valueType="string"
        allowClear={false}
      />
    </div>
  );
};

export default {
  component: injectContext(DateViewer),
} as IWidget;
