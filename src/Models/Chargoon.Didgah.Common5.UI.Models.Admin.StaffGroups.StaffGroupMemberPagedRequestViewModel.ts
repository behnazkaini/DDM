import { StaffGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.StaffGroupFlag";

export interface StaffGroupMemberPagedRequestViewModel {
  TempObjectGuid: string;
  Flag: StaffGroupFlag;
  SearchKeyword: string;
  PageSize: number;
  PageIndex: number;
}
