import { UserStaffViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserArchive.UserStaffViewModel";

export interface UserOtherInformationViewModel {
  UserGuid: string;
  IPAddresses: string[];
  MachineIdentifiers: string[];
  Staffs: UserStaffViewModel[];
  FirstAutoPermittedIPsCount: number;
  FirstAutoPermittedMachineIdentifiersCount: number;
}
