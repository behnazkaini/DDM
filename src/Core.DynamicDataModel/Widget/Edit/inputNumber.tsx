import * as React from "react";
import { injectContext, NumericalInput } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

export class InputNumberWidget extends React.Component<ComponentProps<number>, any> {

  onChange = (event) => {
    this.props.onChange(event);
  };

  render() {
    const { value, Disabled, Widget, mode } = this.props;
    const numberValue = !value ? null : value;

    return (
      <NumericalInput
        onChange={(value) => this.onChange(value)}
        allowNegativeNumbers={true}
        value={numberValue}
        allowFloatNumbers={false}
        disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
      />
    );
  }
}

export default {
  component: injectContext(InputNumberWidget),
} as IWidget;
