import { EntityType } from "./Chargoon.Didgah.DynamicDataModel.EntityType";
import { DeletedRowModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.DeletedRowModel";

export interface FormDeleteValueModel {
  EntityId: number;
  EntityType: EntityType;
  Rows: DeletedRowModel[];
}
