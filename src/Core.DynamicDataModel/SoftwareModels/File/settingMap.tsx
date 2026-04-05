import { LayoutType, SettingName, SettingType, WidgetNames } from "./types";

const EditWidgetSetting: Record<string, SettingType> = {
	[WidgetNames.FileSelectorOneToOne]: { [LayoutType.Define]: [SettingName.AllowedExtensions], [LayoutType.Archive]: [SettingName.AllowedExtensions] },
	[WidgetNames.FileSelectorOneToMany]: { [LayoutType.Define]: [SettingName.AllowedExtensions, SettingName.AllowedFileCount], [LayoutType.Archive]: [SettingName.AllowedExtensions, SettingName.AllowedFileCount] }
}

const DisplayWidgetSetting: Record<string, SettingType> = {
	[WidgetNames.FileDisplayOneToOne]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
	[WidgetNames.FileDisplayOneToMany]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] }
}

const settingMap = { ...EditWidgetSetting, ...DisplayWidgetSetting }

export default settingMap