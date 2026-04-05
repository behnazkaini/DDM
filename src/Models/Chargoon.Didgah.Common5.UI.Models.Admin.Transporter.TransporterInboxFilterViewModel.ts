import { TransportableItemType } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemType";
import { TransportProtocol } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportProtocol";
import { TransportableItemInboxStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemInboxStatus";

export interface TransporterInboxFilterViewModel {
  ItemType: TransportableItemType;
  Protocol: TransportProtocol;
  ItemStatus: TransportableItemInboxStatus;
}
