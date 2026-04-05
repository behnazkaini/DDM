import * as React from "react";
import { injectContext, Label } from "didgah/ant-core-component";
import { IWidget, ComponentProps } from "../../../typings/Core.DynamicDataModel/Types";

const LabelNumberWithSeperator = (props: ComponentProps) => {
  const { value, Direction } = props;
  return (
    <Label>
      <div style={{ userSelect: "text", direction: Direction }}>
        {value !== null &&
          value !== undefined &&
          value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
      </div>
    </Label>
  );
};

export default {
  component: injectContext(LabelNumberWithSeperator),
} as IWidget;
