import { DataModel } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Dtos.DataModel";
import { RelationType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RelationNature } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";

export class Relation {
  Guid: string;
  DataModel: DataModel;
  ReferenceDataModel: DataModel;
  Name: string;
  Label: string;
  Type: RelationType;
  Nature: RelationNature;
  Bookmark: string;
}
