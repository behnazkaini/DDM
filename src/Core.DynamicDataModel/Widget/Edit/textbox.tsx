import * as React from "react";
import { injectContext, Input } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { DirectionType, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { StringDataTypeSettingViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.StringDataTypeSettingViewModel";
import { checkIsWidgetDisabled } from "./helper";

function Textbox({ value = "", onChange, Direction, validationRules, Disabled, Widget, mode, rules }: ComponentProps<string>) {

  const prevRulesRef = React.useRef(rules);

  React.useEffect(() => {
    const prevRules = prevRulesRef.current;
    if (prevRules?.length !== rules?.length) {
      prevRulesRef.current = rules;

      if (typeof onChange === 'function') {
        onChange(value);
      }
    }
  }, [rules]);

  React.useEffect(() => {
    if (mode === 'render' && value !== null && value !== undefined) {//This section is for setting the value after the OperationOnEvents occurs
      onChange(value);
    }
  }, [value]);

  return (
    <Input
      direction={Direction === DirectionType.Auto ? null : Direction}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
      maxLength={
        (validationRules?.setting as StringDataTypeSettingViewModel)?.MaxLength ??
        ((validationRules?.setting as StringDataTypeSettingViewModel)?.Max ? 400 : undefined)
      }
      value={value}
    />
  );
}

export default {
  component: injectContext(Textbox),
} as IWidget;
