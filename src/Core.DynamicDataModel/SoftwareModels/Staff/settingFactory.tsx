import React from "react";
import { SettingName, StaffComponentSettingFormProps } from "./types";


const SettingFactory = (props: StaffComponentSettingFormProps) => {
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

