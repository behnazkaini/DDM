import { DataModelIdViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.DataModelIdViewModel";
import { FieldViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.FieldViewModel";
import { BundleViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.BundleViewModel";

export interface DataModelViewModel extends DataModelIdViewModel {
  Guid?: string;
  SoftwareGuid: string;
  EntityGuid: string;
  ScopeGuid: string;
  Name: string;
  FieldInstances: FieldViewModel[];
  Bundles?: BundleViewModel[];
}
