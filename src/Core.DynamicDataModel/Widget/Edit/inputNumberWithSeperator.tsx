import * as React from "react";
import { injectContext, NumericalInput } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { DirectionType, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

export class InputNumberWithSeperatorWidget extends React.Component<
  ComponentProps<number>,
  any
> {
  onChange = (event) => {
    this.props.onChange(event);
  };

  render() {
    const { value, Direction, Disabled, Widget, mode } = this.props;

    return (
      <NumericalInput
        direction={Direction === DirectionType.Auto ? null : Direction}
        onChange={(value) => this.onChange(value)}
        allowNegativeNumbers={true}
        value={value}
        formatDecimal
        disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
      />
    );
  }
}

export default {
  component: injectContext(InputNumberWithSeperatorWidget),
} as IWidget;
