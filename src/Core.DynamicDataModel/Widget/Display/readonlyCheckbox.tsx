import * as React from "react";
import { Checkbox, injectContext } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

const ReadonlyCheckbox = (props: ComponentProps<boolean>) => {
  const { value, onChange } = props;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked)
  }

  return (
    <Checkbox onChange={handleChange} checked={value} disabled />
  );
};

export default {
  component: injectContext(ReadonlyCheckbox),
} as IWidget;
