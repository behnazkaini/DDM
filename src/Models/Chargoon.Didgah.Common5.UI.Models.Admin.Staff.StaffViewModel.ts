import { StaffUserViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Staff.StaffUserViewModel";

export interface StaffViewModel {
  Id: number;
  PersonGuid: string;
  PersonTitle: string;
  OperationGuid: string;
  Title: string;
  Code: string;
  OrderIndex: number;
  PostCode: string;
  DisplayTitle: string;
  PhoneNumber: string;
  StaffPersonRelationType: number;
  StaffUsers: StaffUserViewModel[];
  ShowPersonDisplayNameInFullTitle: boolean;
  StaffTitleGuid: string;
}
