import * as React from "react";
import { injectContext, SelectEx } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

const CommaSeparableComboBoxComponent = (props: ComponentProps<string>) => {
  const [DataSource, setDataSource] = React.useState([]);
  const { ItemList, value, onChange, Disabled, Widget, mode } = props;

  React.useEffect(() => {
    if (!!ItemList) {
      setDataSource(
        ItemList.map((item) => {
          return { key: item, value: item };
        })
      );
    } else {
      setDataSource([]);
    }
    if (props.mode === 'render' && props.value !== null && props.value !== undefined) {
      onChange(props.value)
    }//This section is for setting the value after the OperationOnEvents occurs
  }, []);

  return (
    <SelectEx
      dataSource={DataSource}
      value={value}
      disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
      onChange={(value: string) => {
        onChange(value);
      }}
    />
  );
};

export default {
  component: injectContext(CommaSeparableComboBoxComponent),
} as IWidget;
