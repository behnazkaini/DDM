import { LayoutItemColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import * as React from "react";
import { ColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { SimpleDesignerGlobalPropsContext } from "../store/reducers/designLayoutSlice";
import useFloorStack from "./useFloorStack";
import { groupFieldTypesByWidget } from "../../../Core.DynamicDataModel/TS/Widgets";
import { EditWidget } from "../../../typings/Core.DynamicDataModel/Enums";

export const availableWidgets = groupFieldTypesByWidget().map((item, index) => ({
  key: index, icon: '', iconType: 'CustomIcon', id: item.Widget, WidgetType: item.Widget, fieldTypes: item.FieldTypes, LayoutItemType: LayoutItemType.Column
}));
const excludedWidgets = [EditWidget.DatePicker, EditWidget.TimePicker, EditWidget.InputDecimal, EditWidget.InputDecimalWithSeperator, EditWidget.InputNumberWithSeperator, EditWidget.CommaSeparableNumberComboBox];

const UseField = () => {
  return [[...availableWidgets.filter( w => !excludedWidgets.includes(w.id as EditWidget) ), {
    key: 'HelpBlock',
    id: 'HelpBlock', 
    icon: 'icon-circle-o',
    iconType: 'Icon', 
    WidgetType: null,
    LayoutItemType: LayoutItemType.NoneBindable,
    fieldTypes: [], 
  }]];

};


export default UseField;
