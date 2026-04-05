import { TransportableItemOutboxStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemOutboxStatus";
import { TransportableItemType } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemType";
import { TransportProtocol } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportProtocol";

export interface TransporterOutboxReportFilterModel {
  Status: TransportableItemOutboxStatus;
  ReceiverInfo: string;
  DateFrom: Date;
  DateTo: Date;
  TransportProtocol: TransportProtocol;
  SoftwareGuid: string;
  Output: string;
  Destination: string;
  Type: TransportableItemType;
}
