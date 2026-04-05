import * as React from "react";
import { injectContext, Switch } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

const SwitchViewer = (props: ComponentProps<boolean>) => {
  const { value, onChange } = props;

  return (
    <Switch onChange={(value) => onChange(value)} checked={value} disabled />
  );
};

export default {
  component: injectContext(SwitchViewer),
} as IWidget;
