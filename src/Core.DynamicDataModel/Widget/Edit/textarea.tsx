import * as React from "react";
import { injectContext, Input } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { DirectionType, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

class TextArea extends React.Component<ComponentProps<string>, any> {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, onChange, mode, Direction } = this.props;
    if (mode === "render") {
      onChange(e.target.value);
    }
    return;
  }

  render() {
    const { value, onChange, Direction, mode, Disabled, Widget } = this.props;

    return (
      <Input
        type="textarea"
        direction={Direction === DirectionType.Auto ? null : Direction}
        autosize={{ minRows: 4 }}
        onChange={this.handleOnChange}
        value={value}
        disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
      />
    );
  }
}

export default {
  component: injectContext(TextArea),
} as IWidget;
