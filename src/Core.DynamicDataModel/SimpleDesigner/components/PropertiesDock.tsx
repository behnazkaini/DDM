import * as React from "react";
import { PropertiesDockTabs, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import {
  IWidgetFactory,
} from "../../../typings/Core.DynamicDataModel/Types";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { ValidationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import FormPropertiesDock from "./FormPropertiesDock";
import LayoutItemPropertiesDock from "./LayoutItemPropertiesDock";

interface RightSideContainerProps {
  widgetFactory: IWidgetFactory;
  toggleDockCallBack: () => void;
  activeTab: PropertiesDockTabs;
  layoutItemFocus: string;
  type: LayoutType;
  validationRules: ValidationViewModel[];
  softwareModels: WebSoftwareComponentViewModel[];
  onChangeCallback?: () => void;
  isFormFocused: boolean;
  layoutGuid: string;
}

export const PropertiesDock = (props: RightSideContainerProps) => {
  return props.isFormFocused ? <FormPropertiesDock layoutGuid={props.layoutGuid} toggleDockCallBack={props.toggleDockCallBack} /> : <LayoutItemPropertiesDock {...props} />
}

export default PropertiesDock;
