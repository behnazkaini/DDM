import { PersonDefineInitViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonDefineInitViewModelBase";
import { LegalPersonViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.Legal.LegalPersonViewModel";
import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export interface LegalPersonDefineInitViewModel extends PersonDefineInitViewModelBase<LegalPersonViewModel> {
  IsEconomicalUniqueIdRequired: boolean;
  StockStatus: EncryptedGuidKeyValue<string>[];
  SupplyStatus: EncryptedGuidKeyValue<string>[];
  OwnershipTypes: EncryptedGuidKeyValue<string>[];
}
