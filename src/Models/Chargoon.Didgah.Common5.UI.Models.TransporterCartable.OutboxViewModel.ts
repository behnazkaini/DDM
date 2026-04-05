import { TransportProtocolItem } from "./Chargoon.Didgah.Common5.UI.Models.TransporterCartable.TransportProtocolItem";
import { StatusItem } from "./Chargoon.Didgah.Common5.UI.Models.TransporterCartable.StatusItem";

export interface OutboxViewModel {
  TransportableItemType: string;
  ReferenceIdentifier: string;
  SoftwareGuid: string;
  TransportProtocolDataSource: TransportProtocolItem[];
  StatusDataSource: StatusItem[];
}
