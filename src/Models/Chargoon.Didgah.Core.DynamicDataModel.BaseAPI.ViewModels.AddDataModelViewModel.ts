import { DataModelType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { AddColumnViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddColumnViewModel";
import { AddRelationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddRelationViewModel";

export class AddDataModelViewModel {
  Guid: string;
  SoftwareGuid: string;
  ScopeGuid: string;
  Type: DataModelType;
  Label: string;
  Name: string;
  AddedColumns: AddColumnViewModel[];
  AddedRelations: AddRelationViewModel[];
}
