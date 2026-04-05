import { StaffGroupMemberViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffGroups.StaffGroupMemberViewModel";

export interface StaffGroupAddMemberResponseViewModel {
  Members: StaffGroupMemberViewModel[];
  Duplicates: StaffGroupMemberViewModel[];
  TotalCount: number;
}
