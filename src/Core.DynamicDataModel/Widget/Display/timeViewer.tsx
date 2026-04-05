import * as React from "react";
import { injectContext, Label } from "didgah/ant-core-component";
import { calendar } from "didgah/common";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

const TimeViewer = (props: ComponentProps) => {
  const { value, DefaultValue } = props;
  const timeValue = value != null ? value : DefaultValue;

  if (DefaultValue && props.value == null) {
    props.onChange(timeValue);
  }

  return <Label>{calendar.getShortTime(timeValue)}</Label>;
};

export default {
  component: injectContext(TimeViewer),
} as IWidget;
