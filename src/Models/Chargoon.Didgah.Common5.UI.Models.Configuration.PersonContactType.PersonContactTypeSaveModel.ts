import { PersonContactTypeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Configuration.PersonContactType.PersonContactTypeViewModel";

export interface PersonContactTypeSaveModel {
  Added: PersonContactTypeViewModel[];
  Edited: PersonContactTypeViewModel[];
  Deleted: PersonContactTypeViewModel[];
}
