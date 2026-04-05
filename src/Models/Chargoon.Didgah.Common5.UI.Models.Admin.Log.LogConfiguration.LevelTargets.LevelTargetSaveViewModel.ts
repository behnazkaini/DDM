import { LevelTargetFiltersSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogConfiguration.LevelTargets.LevelTargetFiltersSaveViewModel";

export interface LevelTargetSaveViewModel {
  Guid: string;
  Level: number;
  TargetGuid: string;
  Age: number;
  Filters: LevelTargetFiltersSaveViewModel;
}
