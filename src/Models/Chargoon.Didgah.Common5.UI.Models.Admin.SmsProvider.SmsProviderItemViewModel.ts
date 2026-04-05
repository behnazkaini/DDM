import { SmsProviderType } from "./Chargoon.Library.Sms.SmsProviderType";

export interface SmsProviderItemViewModel {
  ID: number;
  DisplayName: string;
  SmsProviderType: SmsProviderType;
  SmsProviderTypeTitle: string;
  SmsAccountNumber: string;
  Active: boolean;
  HourlySendLimit: number;
  DailySendLimit: number;
}
