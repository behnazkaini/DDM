import * as React from "react";
import { injectContext, Switch } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

export class SwitchWidget extends React.Component<ComponentProps<boolean>, any> {
  render() {
    const { value, onChange, Disabled, Widget, mode } = this.props;
    return <Switch onChange={(value) => onChange(value)} checked={value} disabled={checkIsWidgetDisabled(Disabled, Widget, mode)} />;
  }
}

export default {
  component: injectContext(SwitchWidget),
} as IWidget;
