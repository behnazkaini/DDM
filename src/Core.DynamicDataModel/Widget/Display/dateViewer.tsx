import * as React from "react";
import { injectContext, Label } from "didgah/ant-core-component";
import { calendar } from "didgah/common";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

const DateViewer = (props: ComponentProps) => {
  const { value, DefaultValue } = props;
  const dateValue = value != null ? value : DefaultValue;
  
  if (DefaultValue && value == null) {
    props.onChange(calendar.calculateDateByDayNumber(dateValue) as any);
  }

  return (
    <Label>
      {calendar.getShortDateString(
        calendar.calculateDateByDayNumber(dateValue) as any
      )}
    </Label>
  );
};

export default {
  component: injectContext(DateViewer),
} as IWidget;
