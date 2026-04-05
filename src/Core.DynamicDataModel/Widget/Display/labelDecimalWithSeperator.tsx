import * as React from "react";
import { injectContext, Label } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

const LabelDecimalWithSeperator = (props: ComponentProps) => {
  const { value, Direction, mode, onChange} = props;
  const [currentValue, setCurrentValue] = React.useState(!!value ? addCommas(value) : null);

  React.useEffect(() => {
    if (mode === 'render') {
      isNaN(value) ? handleChange(value) : handleChange(Number(value));
    }
  }, [value]);//This section is for setting the value after the OperationOnEvents occurs

  function addCommas(nStr) {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }

  function handleChange(changedValue) {
    let result = changedValue;
    if (changedValue === null || changedValue === undefined) {
      onChange(null);
      result = null;
    }
    else {
      onChange(isNaN(changedValue) ? changedValue : parseFloat(changedValue));
    }
    setCurrentValue(!!result ? addCommas(result): null);
  }

  return (
    <Label>
      <div style={{ userSelect: "text", direction: Direction }}>
        {currentValue}
      </div>
    </Label>
  );
};

export default {
  component: injectContext(LabelDecimalWithSeperator),
} as IWidget;
