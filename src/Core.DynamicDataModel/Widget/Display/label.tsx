import * as React from "react";
import { injectContext, Label } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

const LabelComponent = (props: ComponentProps) => {
  const { value, Direction, mode, onChange } = props;

  React.useEffect(()=>{
    if(mode === 'render' && value !== null && value !== undefined){
     onChange(value);
     
    }
  },[value]);//This section is for setting the value after the OperationOnEvents occurs

  return (
    <Label>
      <div
        style={{
          userSelect: "text",
          direction: Direction,
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </div>
    </Label>
  );
};
export default {
  component: injectContext(LabelComponent),
} as IWidget;
