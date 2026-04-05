import { DataModelType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { RelationType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";

export interface RelationCandidatesRequestViewModel {
  SoftwareGuid: string;
  ScopeGuid: string;
  DataModelType: DataModelType;
  RelationType: RelationType;
  CurrentDataModelGuid: string;
}
