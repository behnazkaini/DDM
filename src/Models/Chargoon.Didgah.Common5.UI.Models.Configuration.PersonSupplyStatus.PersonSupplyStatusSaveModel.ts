import { PersonSupplyStatusViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Configuration.PersonSupplyStatus.PersonSupplyStatusViewModel";

export interface PersonSupplyStatusSaveModel {
  Added: PersonSupplyStatusViewModel[];
  Edited: PersonSupplyStatusViewModel[];
  Deleted: PersonSupplyStatusViewModel[];
}
