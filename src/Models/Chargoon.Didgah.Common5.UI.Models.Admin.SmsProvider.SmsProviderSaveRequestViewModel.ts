import { SmsProviderType } from "./Chargoon.Library.Sms.SmsProviderType";
import { SmsProviderSettingSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.SmsProvider.SmsProviderSettingSaveViewModel";
import { SmsProviderOwnerFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.SmsProviderOwnerFlag";

export interface SmsProviderSaveRequestViewModel {
  ID: number;
  DisplayName: string;
  SmsProviderType: SmsProviderType;
  SmsAccountNumber: string;
  Domain: string;
  Username: string;
  Password: string;
  IsPasswordChanged: boolean;
  Active: boolean;
  IsNewProvider: boolean;
  SelectedSmsReceiverSoftwareGuids: string[];
  SmsProviderSettings: SmsProviderSettingSaveViewModel;
  IsDefault: boolean;
  OwnerFlag: SmsProviderOwnerFlag;
  HourlySendLimit: number;
  DailySendLimit: number;
  ReferenceGuid: string;
}
