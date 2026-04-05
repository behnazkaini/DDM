import * as React from "react";
import { Fieldset, injectContext } from "didgah/ant-core-component";
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";

function FieldsetWidget(props){
  const { Label } = props;
  return <Fieldset legend={Label}>{Array.isArray(props.children)? [...props.children] : props.children}</Fieldset>
} 
 
export default {
  component: injectContext(FieldsetWidget),
} as IWidget;
