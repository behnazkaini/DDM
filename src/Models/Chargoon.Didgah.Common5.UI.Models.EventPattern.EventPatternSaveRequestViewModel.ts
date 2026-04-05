import { EventPatternSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.EventPattern.EventPatternSaveViewModel";

export interface EventPatternSaveRequestViewModel {
  Added: EventPatternSaveViewModel[];
  Edited: EventPatternSaveViewModel[];
  Deleted: EventPatternSaveViewModel[];
}
