import { PersonConflictBaseViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonConflictBaseViewModel";

export interface IndividualPersonConflictViewModel extends PersonConflictBaseViewModel {
  Ssn: string;
  FirstName: string;
  LastName: string;
  HasUser: boolean;
}
