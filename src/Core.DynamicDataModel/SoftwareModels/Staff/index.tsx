import SettingFactoryComponent from "./settingFactory";
import settingMap from "./settingMap";
import WidgetMap from "./widgets";
import GetWidget from "./widgets/index";

(function () {
  window["Modelba18cd70d4fa4706a3986de1e63633e0"] = {
    component: GetWidget,
    widgetMap: WidgetMap,
    settingFactory: SettingFactoryComponent,
    widgetSetting: { ...settingMap }
  };
})();
