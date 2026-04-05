import * as React from "react";
import { NumericalInput } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { DirectionType, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { DecimalDataTypeSettingViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DecimalDataTypeSettingViewModel";
import { checkIsWidgetDisabled } from "./helper";

interface InputDecimalWidgetStates {
  initialValue: string | number;
}
function InputDecimalWidget({ Disabled, Direction, validationRules, value, onChange, mode, Widget }: ComponentProps<number> &
  InputDecimalWidgetStates) {

  const [currentValue, setCurrentValue] = React.useState(value);

  React.useEffect(() => {
    if (mode === 'render') {
      isNaN(value) ? handleChange(value) : handleChange(Number(value));
    }
  }, [value]);//This section is for setting the value after the OperationOnEvents occurs

  function handleChange(changedValue) {
    let result = changedValue;
    if (changedValue === null || changedValue === undefined) {
      onChange(null);
      result = null;
    }
    else {
      onChange(isNaN(changedValue) ? changedValue : parseFloat(changedValue));
    }
    setCurrentValue(result)
  }

  function getMaxLength() {
    const setting: DecimalDataTypeSettingViewModel = validationRules?.setting;
    const sepratedValue = value?.toString().split('.');
    if (!!sepratedValue && sepratedValue.length > 1 && sepratedValue[1]?.length >= setting?.Scale) {
      return sepratedValue[0]?.length + setting.Scale
    }
    return
  }

  return (
    <NumericalInput
      direction={Direction === DirectionType.Auto ? null : Direction}
      onChange={handleChange}
      value={currentValue}
      allowFloatNumbers={true}
      allowNegativeNumbers={true}
      maxLength={getMaxLength()}
      disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
    />
  );
}

export default {
  component: InputDecimalWidget,
} as IWidget;
