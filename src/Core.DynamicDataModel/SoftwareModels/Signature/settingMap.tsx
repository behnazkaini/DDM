import { LayoutType, SettingName, SettingType, WidgetNames } from "./types";

const EditWidgetSetting: Record<string, SettingType> = {
	[WidgetNames.SignatureSelectorOneToOne]: { [LayoutType.Define]: [SettingName.DefaultValue], [LayoutType.Archive]: [SettingName.DefaultValue] },
}

const DisplayWidgetSetting: Record<string, SettingType> = {
	[WidgetNames.SignatureDisplayOneToOne]: { [LayoutType.Define]: [SettingName.DefaultValue], [LayoutType.Archive]: [SettingName.DefaultValue] },
}

const settingMap = { ...EditWidgetSetting, ...DisplayWidgetSetting }

export default settingMap