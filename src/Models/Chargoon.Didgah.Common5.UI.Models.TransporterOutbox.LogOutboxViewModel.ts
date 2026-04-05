import { TransportableItemOutboxStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemOutboxStatus";
import { TransportableItemType } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemType";
import { TransportProtocol } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportProtocol";

export interface LogOutboxViewModel {
  ID: number;
  Status: TransportableItemOutboxStatus;
  ReceiverInfo: string;
  TryTime: Date;
  Type: TransportableItemType;
  TransportProtocol: TransportProtocol;
}
