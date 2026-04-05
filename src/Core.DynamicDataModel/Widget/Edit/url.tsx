import * as React from "react";
import { injectContext, Input } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

export class Url extends React.Component<ComponentProps, any> {
  render() {
    const { value, onChange, Disabled, Widget, mode } = this.props;

    return (
      <Input
        direction={"ltr"}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        value={value}
        disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
      />
    );
  }
}

export default {
  component: injectContext(Url),
} as IWidget;
