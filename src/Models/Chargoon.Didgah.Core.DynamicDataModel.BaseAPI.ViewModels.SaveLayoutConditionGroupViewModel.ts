import { LayoutConditionGroupType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutConditionGroupType";
import { SaveLayoutConditionViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutConditionViewModel";

export class SaveLayoutConditionGroupViewModel {
  Guid: string;
  ParentGuid: string;
  Type: LayoutConditionGroupType;
  Conditions: SaveLayoutConditionViewModel[];
}
