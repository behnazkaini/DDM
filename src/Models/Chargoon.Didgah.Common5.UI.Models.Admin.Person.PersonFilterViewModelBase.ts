import { PersonDynamicFilterItemViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonDynamicFilterItemViewModel";

export class PersonFilterViewModelBase {
  Active: boolean;
  DomainCode: string;
  Comments: string;
  ContactTypes: PersonDynamicFilterItemViewModel[];
  AddressTypes: PersonDynamicFilterItemViewModel[];
}
