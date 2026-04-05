import { StaffGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.StaffGroupFlag";

export class StaffGroupViewModel {
  Guid: string;
  Id: number;
  AccessZoneId: number;
  AccessZoneTitle: string;
  OrderIndex: number;
  Title: string;
  OwnerId: number;
  SoftwareGuid: string;
  Flag: StaffGroupFlag;
  HotListFlag: boolean;
}
