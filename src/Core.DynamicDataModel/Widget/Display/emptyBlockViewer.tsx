import { injectContext } from "didgah/ant-core-component";
import * as React from "react";
import { IWidget } from "../../../typings/Core.DynamicDataModel/Types";

export function EmptyBlockViewer() {
  return <div></div>;
}

export default {
  component: injectContext(EmptyBlockViewer),
} as IWidget;
