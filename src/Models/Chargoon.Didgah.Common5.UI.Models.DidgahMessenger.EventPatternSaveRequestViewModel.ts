import { EventPatternSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DidgahMessenger.EventPatternSaveViewModel";

export interface EventPatternSaveRequestViewModel {
  Added: EventPatternSaveViewModel[];
  Edited: EventPatternSaveViewModel[];
  Deleted: EventPatternSaveViewModel[];
}
