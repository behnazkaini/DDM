import { BundleIdViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.BundleIdViewModel";
import { FieldViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.FieldViewModel";

export interface BundleViewModel extends BundleIdViewModel {
  Guid: string;
  ParentGuid: string;
  FieldInstanceReferenceGuid: string;
  FieldInstances: FieldViewModel[];
}
