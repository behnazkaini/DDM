import { CategoryItemModel } from "./Chargoon.Didgah.Common5.UI.Models.Category.CategoryItemModel";

export interface CategoryInitializeViewModel {
  AssignedCategories: CategoryItemModel[];
  ReferenceSoftwareGuid: string;
  ReferenceFlag: number;
  ReferenceId?: string;
  SelectMode: boolean;
  DefinePublicAccess: boolean;
  ReferenceGuid?: string;
  SelectedCategories: string[];
}
