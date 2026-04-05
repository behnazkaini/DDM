import { UserIdUsername } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Staff.UserIdUsername";

export interface StaffUserViewModel {
  Id: number;
  UserGuid: string;
  User: UserIdUsername;
  UserIsDefault: boolean;
  StaffIsDefault: boolean;
  ShowInStaffTitle: boolean;
  UserFullName: string;
  TransferViewAuthorities: boolean;
  HasDeligate: boolean;
  PhoneNumber:number
}
