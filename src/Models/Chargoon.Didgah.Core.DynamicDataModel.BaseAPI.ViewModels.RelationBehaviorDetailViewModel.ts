import { RelationType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RelationNature } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";

export interface RelationBehaviorDetailViewModel {
  RelationType: RelationType;
  RelationNature: RelationNature;
  CanCreate: boolean;
  CanReuse: boolean;
}
