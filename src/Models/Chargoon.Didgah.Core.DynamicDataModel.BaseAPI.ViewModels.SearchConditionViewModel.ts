import { ConditionType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { SearchConditionMetaDataViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SearchConditionMetaDataViewModel";

export class SearchConditionViewModel {
  DataModelGuid: string;
  RelationGuid: string;
  ColumnGuid: string;
  Type: ConditionType;
  Value: Object;
  Metadat: SearchConditionMetaDataViewModel;
}
