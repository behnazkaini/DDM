import * as React from "react";
import { injectContext, SelectEx } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

const CommaSeparableNumberComboBoxComponent = (props: ComponentProps<number>) => {
  const [DataSource, setDataSource] = React.useState([]);
  const { ItemList, value, onChange, Disabled, Widget ,mode} = props;

  React.useEffect(() => {
    if (!!ItemList) {
      setDataSource(
        ItemList.map((item) => {
          return { key: Number(item), value: Number(item) };
        })
      );
    } else {
      setDataSource([]);
    }
  }, []);

  return (
    <SelectEx
      dataSource={DataSource}
      value={value}
      disabled={checkIsWidgetDisabled(Disabled, Widget,mode)}
      onChange={(value: number) => {
        onChange(Number(value));
      }}
    />
  );
};

export default {
  component: injectContext(CommaSeparableNumberComboBoxComponent),
} as IWidget;
