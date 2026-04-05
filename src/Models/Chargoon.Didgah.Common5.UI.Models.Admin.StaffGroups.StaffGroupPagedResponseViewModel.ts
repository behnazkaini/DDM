import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { StaffGroupViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffGroups.StaffGroupViewModel";

export interface StaffGroupPagedResponseViewModel {
  Data: StaffGroupViewModel[];
  Total: number;
}
