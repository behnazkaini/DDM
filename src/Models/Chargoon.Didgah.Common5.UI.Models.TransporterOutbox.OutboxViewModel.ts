import { TransportableItemOutboxStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemOutboxStatus";
import { TransportProtocol } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportProtocol";

export interface OutboxViewModel {
  Guid: string;
  Status: TransportableItemOutboxStatus;
  ReceiverInfo: string;
  SenderProviderInfo: string;
  TryTime: Date;
  TransportProtocol: TransportProtocol;
}
