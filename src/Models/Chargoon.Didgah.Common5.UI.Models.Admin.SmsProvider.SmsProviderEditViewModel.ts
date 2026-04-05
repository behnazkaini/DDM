import { SmsProviderType } from "./Chargoon.Library.Sms.SmsProviderType";
import { SmsProviderSettingViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.SmsProvider.SmsProviderSettingViewModel";
import { SmsProviderOwnerFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.SmsProviderOwnerFlag";

export interface SmsProviderEditViewModel {
  ID: number;
  DisplayName: string;
  SmsProviderType: SmsProviderType;
  SmsProviderTypeTitle: string;
  SmsAccountNumber: string;
  Domain: string;
  Username: string;
  Active: boolean;
  SelectedSmsReceiverSoftwareGuids: string[];
  IsDefault: boolean;
  SmsProviderSettings: SmsProviderSettingViewModel[];
  OwnerFlag: SmsProviderOwnerFlag;
  HourlySendLimit: number;
  DailySendLimit: number;
  ReferenceGuid: string;
}
