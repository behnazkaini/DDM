export interface OutboxItem {
  Guid: string;
  ScheduleTime: Date;
  TransportableItemType: string;
  TransportProtocol: string;
  Status: string;
  Sender: string;
  Receiver: string;
  Message: string;
}
