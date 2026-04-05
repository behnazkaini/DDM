import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.PersonalSetting.GenericKeyValuePair";
import { ThemeItem } from "./Chargoon.Didgah.Common5.Infrastructure.Themes.ThemeItem";
import { CurrentUISettings } from "./Chargoon.Didgah.Common5.UI.Models.PersonalSetting.CurrentUISettings";

export interface UserInterfaceSetting {
  AvailableLanguages: GenericKeyValuePair<string>[];
  TimeZones: GenericKeyValuePair<string>[];
  CalendarTypes: GenericKeyValuePair<string>[];
  Sofwares: GenericKeyValuePair<string>[];
  Themes: ThemeItem[];
  StaffIds: GenericKeyValuePair<string>[];
  Fonts: GenericKeyValuePair<string>[];
  WindowSizes: GenericKeyValuePair<string>[];
  CurrentUISettings: CurrentUISettings;
}
