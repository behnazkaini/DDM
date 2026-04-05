import { StaffGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.StaffGroupFlag";

export interface StaffGroupTitleAvailableViewModel {
  StaffGroupId: number;
  Title: string;
  OwnerId: number;
  Flag: StaffGroupFlag;
  SoftwareGuid: string;
}
