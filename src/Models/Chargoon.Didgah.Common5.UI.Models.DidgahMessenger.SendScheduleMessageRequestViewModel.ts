import { MessageChannelPreferenceType } from "./Chargoon.Didgah.Common.Domain.Enumeration.DidgahMessenger.MessageChannelPreferenceType";

export interface SendScheduleMessageRequestViewModel {
  PersonGuids: string[];
  Message: string;
  ChannelPreferenceType: MessageChannelPreferenceType;
  SmsProviderId: number;
  EmailAccountId: number;
  SecheduleTime: Date;
  SoftwareGuid: string;
}
