import { PersonFilterViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonFilterViewModelBase";

export interface IndividualPersonFilterViewModel extends PersonFilterViewModelBase {
  FirstName: string;
  LastName: string;
  DisplayName: string;
  PersonTitleGuid: string;
  Ssn: string;
  IdNumber: string;
  IgnoreWithUsers: boolean;
}
