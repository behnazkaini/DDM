import { CategoryItemModel } from "./Chargoon.Didgah.Common5.UI.Models.Category.CategoryItemModel";

export interface UpdateItemCategoryModel {
  ReferenceSoftwareGuid: string;
  ReferenceFlag: number;
  ReferenceIds: string[];
  AssignedCategories: CategoryItemModel[];
  ReferenceGuids: string[];
}
