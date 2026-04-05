import { RelationType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RelationNature } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { AddRelationSettingViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.Relation.AddRelationSettingViewModel";

export interface AddRelationViewModel {
  Guid: string;
  ReferenceDataModelGuid: string;
  Type: RelationType;
  Nature: RelationNature;
  Label: string;
  Name: string;
  Bookmark: string;
  Settings?: AddRelationSettingViewModel[];
}
