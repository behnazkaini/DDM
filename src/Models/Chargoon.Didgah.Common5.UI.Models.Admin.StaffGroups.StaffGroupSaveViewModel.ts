import { StaffGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.StaffGroupFlag";
import { StaffGroupViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffGroups.StaffGroupViewModel";

export interface StaffGroupSaveViewModel {
  Flag: StaffGroupFlag;
  TempObjectGuid: string;
  StaffGroup: StaffGroupViewModel;
}
