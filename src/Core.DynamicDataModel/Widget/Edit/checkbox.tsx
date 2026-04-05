import * as React from "react";
import { Checkbox, injectContext } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

const CheckboxWidget = (props: ComponentProps<boolean>) => {
  const { value, onChange, mode, Disabled, Widget } = props;

  React.useEffect(() => {
    if (props.mode === 'render' && props.value !== null && props.value !== undefined) {
      onChange(value)
    }
  }, []);//This section is for setting the value after the OperationOnEvents occurs

  function handleChange(e) {
    if (mode === 'render') {
      onChange(e.target.checked)
    }
  }

  return <Checkbox onChange={handleChange} checked={value} disabled={checkIsWidgetDisabled(Disabled, Widget, mode)} />;
};

export default {
  component: injectContext(CheckboxWidget),
} as IWidget;
