import { PersonArchiveInitViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonArchiveInitViewModelBase";
import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export interface LegalPersonArchiveInitViewModel extends PersonArchiveInitViewModelBase {
  OwnershipTypes: EncryptedGuidKeyValue<string>[];
  StockStatuses: EncryptedGuidKeyValue<string>[];
  SupplyStatuses: EncryptedGuidKeyValue<string>[];
  EnabledWebService: boolean;
}
