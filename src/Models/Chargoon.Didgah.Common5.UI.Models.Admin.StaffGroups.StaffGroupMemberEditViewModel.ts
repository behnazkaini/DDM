import { StaffGroupMemberViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffGroups.StaffGroupMemberViewModel";
import { StaffGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.StaffGroupFlag";

export interface StaffGroupMemberEditViewModel {
  StaffGroupId: number;
  TempObjectGuid: string;
  Members: StaffGroupMemberViewModel[];
  Flag: StaffGroupFlag;
  SelectAllStaffs: boolean;
  AccessZoneId: number;
}
