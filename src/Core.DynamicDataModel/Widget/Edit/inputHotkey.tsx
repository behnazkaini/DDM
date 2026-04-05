import * as React from "react";
import { injectContext, HotkeyInput, useCommandHandler } from "didgah/ant-core-component";
import { IWidget } from "../../../typings/Core.DynamicDataModel/Types";

function InputHotkeyWidget(props) {
  const [value, setValue] = React.useState<string>(props.value);
  const commandHandler = useCommandHandler();

  const onChange = (changedValue) => {
    if (!!changedValue) {
      props.onChange(changedValue);
    }
    setValue(changedValue);
  };

  const openControl = (args: number) => {
    return commandHandler.openControlFormByCode({ controlCode: args });
  }

  return (
    <HotkeyInput openControl={openControl} onChange={onChange} value={value} />
  );
}


export default {
  component: injectContext(InputHotkeyWidget),
} as IWidget;
