import { CategoryItemModel } from "./Chargoon.Didgah.Common5.UI.Models.Category.CategoryItemModel";

export interface CategoryModel {
  AssignedCategories: CategoryItemModel[];
  ReferenceSoftwareGuid: string;
  ReferenceFlag: number;
  ReferenceId: number;
  ReferenceIdEncrypted: string;
  SelectMode: boolean;
  DefinePublicAccess: boolean;
  SelectedCategories: string[];
}
