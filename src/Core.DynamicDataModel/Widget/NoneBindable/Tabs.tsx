import * as React from "react";
import { Fieldset, injectContext } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

function FieldsetWidget(props){
  return <Fieldset legend={'test'}></Fieldset>
}

export default {
  component: injectContext(FieldsetWidget),
} as IWidget;
