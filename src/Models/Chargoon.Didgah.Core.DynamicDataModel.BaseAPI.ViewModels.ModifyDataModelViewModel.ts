import { AddColumnViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddColumnViewModel";
import { ModifyColumnViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyColumnViewModel";
import { AddRelationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddRelationViewModel";
import { ModifyRelationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyRelationViewModel";

export class ModifyDataModelViewModel {
  Guid: string;
  Label: string;
  AddedColumns: AddColumnViewModel[];
  ModifiedColumns: ModifyColumnViewModel[];
  AddedRelations: AddRelationViewModel[];
  ModifiedRelations: ModifyRelationViewModel[];
}
