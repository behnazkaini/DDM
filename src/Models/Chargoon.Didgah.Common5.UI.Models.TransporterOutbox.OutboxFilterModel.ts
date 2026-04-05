import { TransportableItemOutboxStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemOutboxStatus";
import { TransportProtocol } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportProtocol";
import { TransportableItemType } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemType";

export interface OutboxFilterModel {
  Status: TransportableItemOutboxStatus;
  ReceiverInfo: string;
  DateFrom: Date;
  DateTo: Date;
  TransportProtocol: TransportProtocol;
  Type: TransportableItemType;
  SoftwareGuid: string;
}
