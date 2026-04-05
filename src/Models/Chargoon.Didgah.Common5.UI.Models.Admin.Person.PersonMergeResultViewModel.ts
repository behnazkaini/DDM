import { PersonMergeErrorViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonMergeErrorViewModel";

export interface PersonMergeResultViewModel {
  Succeed: boolean;
  GroupId: string;
  Errors: PersonMergeErrorViewModel[];
}
