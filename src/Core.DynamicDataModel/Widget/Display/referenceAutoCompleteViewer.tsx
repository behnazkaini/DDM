import { injectContext, Label } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

import * as React from "react";

const ReferenceAutoCompleteViewer = (props: ComponentProps) => {
  const { value, Direction, mode, onChange } = props;

  return (
    <Label>
      <div
        style={{
          userSelect: "text",
          direction: Direction,
          whiteSpace: "pre-wrap",
        }}
      >
        {value?.label}
      </div>
    </Label>
  );
};

export default {
  component: injectContext(ReferenceAutoCompleteViewer),
} as IWidget;
