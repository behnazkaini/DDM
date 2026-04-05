import { AccessZoneConfigViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.AccessZoneConfigViewModel";
import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface AssociationArchiveInitViewModel {
  AccessZoneConfigModel: AccessZoneConfigViewModel;
  SoftwareGuids: GenericKeyValuePair<string>[];
  AccessZoneIsEnabled: boolean;
  UserAccessZoneGuid: string;
  UserAccessZoneTitle: string;
}
