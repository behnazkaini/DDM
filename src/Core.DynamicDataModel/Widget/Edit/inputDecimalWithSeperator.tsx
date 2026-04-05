import * as React from "react";
import { NumericalInput } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { DirectionType, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { DecimalDataTypeSettingViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DecimalDataTypeSettingViewModel";
import { checkIsWidgetDisabled } from "./helper";

export function InputDecimalWithSeperator(props: ComponentProps) {
  const [value, setValue] = React.useState<any>(props.value);
  const { Direction, Disabled, mode, Widget } = props;

  React.useEffect(() => {
    if (mode === 'render' && props.value !== null && props.value !== undefined) {
      isNaN(props.value) ? onChange(props.value) : onChange(Number(props.value));
    }
  }, [props.value]);//This section is for setting the value after the OperationOnEvents occurs

  const onChange = (changedValue) => {
    if (!!changedValue) {
      props.onChange(isNaN(changedValue) ? changedValue : parseFloat(changedValue));
    } else {
      props.onChange(changedValue);
    }

    setValue(changedValue);
  };

  function getMaxLength() {
    const { validationRules } = props;
    const setting: DecimalDataTypeSettingViewModel = validationRules?.setting;

    const sepratedValue = props.value?.toString().split('.');
    if (!!sepratedValue && sepratedValue[1]?.length >= setting?.Scale) {
      return sepratedValue[0]?.length + setting.Scale
    }
    return
  }

  return (
    <NumericalInput
      direction={Direction === DirectionType.Auto ? null : Direction}
      onChange={(e) => onChange(e)}
      value={value}
      formatDecimal
      maxLength={getMaxLength()}
      disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
    />
  );
}

export default {
  component: InputDecimalWithSeperator,
} as IWidget;
