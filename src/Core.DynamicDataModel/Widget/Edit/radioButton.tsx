import React, { useEffect } from "react";
import { injectContext, Radio, RadioGroup } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { checkIsWidgetDisabled } from "./helper";

const RadioButtonWidget = ({ ItemList, value, onChange, Disabled, Widget, mode }: ComponentProps<string>) => {
  
  useEffect(() => {
    if (mode === 'render' && value !== null && value !== undefined) {
      onChange(value)
    }
  }, []);

  return (
    <RadioGroup
      value={value}
      disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
      onChange={value => onChange(value)}>
      {ItemList?.map(item => (
        <Radio key={item} value={item}>
          {item}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default {
  component: injectContext(RadioButtonWidget),
} as IWidget;
