import SettingFactoryComponent from "./settingFactory";
import WidgetMap from "./widgetMap";
import GetWidget from "./widgets/index";
import settingMap from "./settingMap";
export const FileReferenceDataModelGuid: string = "7C1FCA75-961A-4150-88D3-FEFC2FD7A430";

(function () {
	window["Model7c1fca75961a415088d3fefc2fd7a430"] = {
		component: GetWidget,
		widgetMap: WidgetMap,
		settingFactory: SettingFactoryComponent,
		widgetSetting: { ...settingMap }
	};
})();

