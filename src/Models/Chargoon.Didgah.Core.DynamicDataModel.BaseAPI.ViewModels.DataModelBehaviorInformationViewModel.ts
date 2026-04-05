import { DataModelType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { RelationBehaviorViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationBehaviorViewModel";

export interface DataModelBehaviorInformationViewModel {
  Type: DataModelType;
  RelationBehaviors: RelationBehaviorViewModel[];
  Shareable: boolean;
  Editable: boolean;
}
