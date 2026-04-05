import settingMap from "./settingMap";
import WidgetMap from "./widgetMap";
import GetWidget from "./widgets/index";
import SettingFactoryComponent from "./settingFactory";
export const SignatureReferenceDataModelGuid: string = "4d6184d2-0637-4185-8abc-b9be561f4208";

(function () {
	window["Model4d6184d2063741858abcb9be561f4208"] = {
		component: GetWidget,
		widgetMap: WidgetMap,
		settingFactory: SettingFactoryComponent,
		widgetSetting: { ...settingMap }
	};
})();
 