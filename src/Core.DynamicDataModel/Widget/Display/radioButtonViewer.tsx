import React from "react";
import { injectContext, Radio, RadioGroup } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

const RadioButtonViewerWidget = ({ ItemList, value }: ComponentProps<string>) => {

  return (
    <RadioGroup value={value} style={{ pointerEvents: 'none' }}>
      {ItemList?.map(item => (
        <Radio key={item} value={item}>
          {item}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default {
  component: injectContext(RadioButtonViewerWidget),
} as IWidget;
