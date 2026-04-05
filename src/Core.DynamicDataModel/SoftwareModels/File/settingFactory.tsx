import React from "react";
import AllowedExtensions from "./settingForm/AllowedExtensions";
import AllowedFileCount from "./settingForm/AllowedFileCount";
import { EntityComponentSettingFormProps, SettingName } from "./types";

const SettingFactory = (props: EntityComponentSettingFormProps) => {
	const { form, onSettingChanged, initialSettingValues, commonSettingWidget, settingMap, layoutType, componentName } = props;
	const modelWidgetSetting = settingMap[componentName][layoutType] as Array<string>;
	const modelSettingComponents = modelWidgetSetting.map((settingName) => {
		switch (settingName) {
			case SettingName.AllowedExtensions:
				return AllowedExtensions({ form, settingName, initialSettingValues, onSave: onSettingChanged, key: settingName })
			case SettingName.AllowedFileCount:
				return AllowedFileCount({ form, settingName, initialSettingValues, onSave: onSettingChanged, key: settingName })
			default:
				return null
		}
	})

	return (
		<>
			{commonSettingWidget}
			{modelSettingComponents}
		</>
	);
};

export default SettingFactory;
