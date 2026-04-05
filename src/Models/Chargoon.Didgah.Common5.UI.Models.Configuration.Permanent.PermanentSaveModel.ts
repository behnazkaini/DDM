import { PermanentViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Configuration.Permanent.PermanentViewModel";

export interface PermanentSaveModel {
  Added: PermanentViewModel[];
  Edited: PermanentViewModel[];
  Deleted: PermanentViewModel[];
  PermanentType: number;
}
