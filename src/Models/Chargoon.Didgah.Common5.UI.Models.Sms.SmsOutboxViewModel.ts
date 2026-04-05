export interface SmsOutboxViewModel {
  SmsProviderID: number;
  ReceiverMobilePhone: string[];
  Message: string;
  ShowSenderName: boolean;
}
