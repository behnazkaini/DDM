import { SmsProviderType } from "./Chargoon.Library.Sms.SmsProviderType";
import { SmsProviderOwnerFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.SmsProviderOwnerFlag";

export class SmsProviderFilterViewModel {
  DisplayName: string;
  AccountNumber: string;
  SmsProviderType: SmsProviderType;
  OwnerFlag: SmsProviderOwnerFlag;
}
