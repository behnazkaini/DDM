import { DataModelIdViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.DataModelIdViewModel";

export interface OrphanShareViewModel extends DataModelIdViewModel {
  ScopeGuids: { [key: string]: boolean; };
}
