import { ScopeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.ScopeViewModel";
import { OrphanListViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.OrphanListViewModel";

export interface OrphanListPageViewModel {
  ScopeList: ScopeViewModel[];
  OrphanList: OrphanListViewModel;
}
