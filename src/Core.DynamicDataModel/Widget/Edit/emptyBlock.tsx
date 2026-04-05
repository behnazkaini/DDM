import { injectContext } from "didgah/ant-core-component";
import * as React from "react";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

const EmptyBlock = (props: ComponentProps) => {
  return (
    <div
      style={{
        textAlign: "center",
        fontWeight: "bold",
        background:
          "repeating-linear-gradient(45deg, #eee, #eee 10px, #ddd 10px, #ddd 20px)",
      }}
    >
      فضای خالی
    </div>
  );
};

export default {
  component: injectContext(EmptyBlock),
} as IWidget;
