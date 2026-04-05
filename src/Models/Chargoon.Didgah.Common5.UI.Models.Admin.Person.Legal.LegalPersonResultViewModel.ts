import { PersonAddressSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonAddressSaveViewModel";
import { PersonContactInfoSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonContactInfoSaveViewModel";

export interface LegalPersonResultViewModel {
  CompanyName: string;
  EconomicalUniqueIdentifier: string;
  CompanyRegistrationDate: Date;
  RegisterNumber: string;
  Addresses: PersonAddressSaveViewModel[];
  ContactInfo: PersonContactInfoSaveViewModel[];
}
