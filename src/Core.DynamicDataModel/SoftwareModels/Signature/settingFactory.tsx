import React from "react";
import DefaultValue from "./settingForm/DefaultValue";
import { EntityComponentSettingFormProps, SettingName } from "./types";

const SettingFactory = (props: EntityComponentSettingFormProps) => {
	const { form, onSettingChanged, initialSettingValues, commonSettingWidget, settingMap, layoutType, componentName } = props;
	const modelWidgetSetting = settingMap[componentName][layoutType] as Array<string>;
	const modelSettingComponents = modelWidgetSetting.map((settingName) => {
		switch (settingName) {
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
