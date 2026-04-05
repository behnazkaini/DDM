import { RelationNature } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { RelationType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RelationSettingViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.Relation.RelationSettingViewModel";

export interface RelationViewModel {
  Guid: string;
  ReferenceDataModelGuid: string;
  Name: string;
  Label: string;
  Nature: RelationNature;
  Type: RelationType;
  Bookmark: string;
  BookmarkType:number;
  VariableGuid?: string;
  Settings?: RelationSettingViewModel[];
}
