import { PersonArchiveInitViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonArchiveInitViewModelBase";
import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export interface IndividualPersonArchiveInitViewModel extends PersonArchiveInitViewModelBase {
  PersonTitles: EncryptedGuidKeyValue<string>[];
}
