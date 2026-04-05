import { PersonSaveViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonSaveViewModelBase";

export interface IndividualPersonSaveViewModel extends PersonSaveViewModelBase {
  Ssn: string;
  IdNumber: string;
  FirstName: string;
  LastName: string;
  PersonTitleGuid: string;
}
