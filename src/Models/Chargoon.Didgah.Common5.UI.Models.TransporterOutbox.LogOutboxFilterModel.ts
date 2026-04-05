import { TransportableItemOutboxStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemOutboxStatus";
import { TransportableItemType } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemType";
import { TransportProtocol } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportProtocol";

export interface LogOutboxFilterModel {
  Status: TransportableItemOutboxStatus;
  ReceiverInfo: string;
  DateFrom: Date;
  DateTo: Date;
  Type: TransportableItemType;
  TransportProtocol: TransportProtocol;
  SoftwareGuid: string;
}
