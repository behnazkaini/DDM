import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { SettingType } from "../../../typings/Core.DynamicDataModel/Types";
import { SettingName, WidgetNames } from "./types";

const EditWidgetSetting: Record<string, SettingType> = {
    [WidgetNames.StaffSelectorOneToOne]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
    [WidgetNames.StaffSelectorOneToMany]: {
      [LayoutType.Define]: [],
      [LayoutType.Archive]: [],
    },
}

const DisplayWidgetSetting: Record<string, SettingType> = {
    [WidgetNames.StaffDisplayOneToOne]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
    [WidgetNames.StaffDisplayOneToMany]: {
      [LayoutType.Define]: [],
      [LayoutType.Archive]: [],
    },

}

const settingMap = { ...EditWidgetSetting, ...DisplayWidgetSetting }

export default settingMap