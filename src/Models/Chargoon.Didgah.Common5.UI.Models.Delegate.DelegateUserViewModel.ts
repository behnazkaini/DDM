import { DelegateStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.DelegateStatus";

export class DelegateUserViewModel {
  Guid: string;
  UserGuid: string;
  UserFullName: string;
  ShowUserInStaffTitle: boolean;
  TransferViewAuthorities: boolean;
  DelegateStatus: DelegateStatus;
  Confirmed: boolean;
}
