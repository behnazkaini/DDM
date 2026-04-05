import { PersonDefineInitViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonDefineInitViewModelBase";
import { IndividualPersonViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.Individual.IndividualPersonViewModel";
import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export interface IndividualPersonDefineInitViewModel extends PersonDefineInitViewModelBase<IndividualPersonViewModel> {
  RequiredSsn: boolean;
  ConnectedExternalSystem: boolean;
  DisplayNamePattern: string;
  PersonTitles: EncryptedGuidKeyValue<string>[];
}
