import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { DelegateUserViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Delegate.DelegateUserViewModel";
import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export interface DelegateDefineViewModel {
  DelegateGuid: string;
  StartDate: Date;
  EndDate: Date;
  DelegationTypes: GenericKeyValuePair<number>[];
  SelectedDelegationType: number;
  SelectedSoftwares: string[];
  SelectedUsers: DelegateUserViewModel[];
  StaffList: EncryptedGuidKeyValue<string>[];
  SelectedStaffGuid: string;
  SelectedStaffTitle: string;
  AllowTransferViewAuthorities: boolean;
  IsActive: boolean;
}
