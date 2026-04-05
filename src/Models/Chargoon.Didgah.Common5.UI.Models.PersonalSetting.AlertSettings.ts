import { DidgahMobileSetting } from "./Chargoon.Didgah.Common5.UI.Models.PersonalSetting.DidgahMobileSetting";
import { NotificationSetting } from "./Chargoon.Didgah.Common5.UI.Models.PersonalSetting.NotificationSetting";

export interface AlertSettings {
  DidgahMobileSettings: DidgahMobileSetting[];
  NotificationSettings: NotificationSetting[];
  IsSMSTabVisible: boolean;
  IsEmailTabVisible: boolean;
  IsDidgahMobileTabVisible: boolean;
  IsAutomaticAlertEnabled: boolean;
  IsAlertSoundMuted: boolean;
  IsOtherAssignedStaffAlertsEnabled: boolean;
}
