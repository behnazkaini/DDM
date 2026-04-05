import { DataModelType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { RelationBehaviorDetailViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationBehaviorDetailViewModel";

export interface RelationBehaviorViewModel {
  DataModelType: DataModelType;
  Details: RelationBehaviorDetailViewModel[];
}
