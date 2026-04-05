import { MessageChannelPreferenceType } from "./Chargoon.Didgah.Common.Domain.Enumeration.DidgahMessenger.MessageChannelPreferenceType";

export interface EventPatternSaveViewModel {
  Guid: string;
  SmsProviderId: number;
  EmailAccountId: number;
  EventName: string;
  EventGuid: string;
  SoftwareGuid: string;
  MessageChannelPreferenceType: MessageChannelPreferenceType;
  IsDefaultProviderEnabled: boolean;
}
