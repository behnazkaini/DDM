import { DataModelType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { Column } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Dtos.Column";
import { Relation } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Dtos.Relation";

export class DataModel {
  Guid: string;
  SoftwareGuid: string;
  ScopeGuid: string;
  Name: string;
  Label: string;
  Type: DataModelType;
  Columns: Column[];
  Relations: Relation[];
}
