import { LayoutViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.LayoutViewModel";
import { LayoutFieldViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.LayoutFieldViewModel";

export interface LayoutPageViewModel {
  SoftwareGuid: string;
  EntityGuid: string;
  DataModelId: number;
  Layouts: LayoutViewModel[];
  FieldInstances: LayoutFieldViewModel[];
  ValidationRules: { [key: string]: string[]; };
}
