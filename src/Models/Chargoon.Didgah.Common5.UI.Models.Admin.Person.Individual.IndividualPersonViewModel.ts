import { PersonViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonViewModelBase";

export class IndividualPersonViewModel extends PersonViewModelBase {
  Ssn: string;
  IdNumber: string;
  FullName: string;
  LastName: string;
  FirstName: string;
  PersonTitle: string;
  PersonTitleGuid: string;
  DefaultStaffsTitles: string;
  ConnectedExternalSystem: boolean;
}
