import { MessageChannelPreferenceType } from "./Chargoon.Didgah.Common.Domain.Enumeration.DidgahMessenger.MessageChannelPreferenceType";

export interface EventPatternLoadViewModel {
  Guid: string;
  SmsProviderId: number;
  EmailAccountId: number;
  EventGuid: string;
  SoftwareGuid: string;
  MessageChannelPreferenceType: MessageChannelPreferenceType;
}
