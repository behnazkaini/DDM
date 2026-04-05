import { IResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IResponse";
import { OrphanViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.OrphanViewModel";

export class OrphanListViewModel implements IResponse<OrphanViewModel> {
  orphans: OrphanViewModel[];
  Data: OrphanViewModel[];
}
