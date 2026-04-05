import { StaffDelegationType } from "./Chargoon.Didgah.Common.Domain.Enumeration.StaffDelegationType";
import { DelegateUserViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Delegate.DelegateUserViewModel";

export interface DelegateSaveRequestViewModel {
  DelegateGuid: string;
  StaffGuid: string;
  StaffTitle: string;
  StartDate: Date;
  EndDate: Date;
  DelegationType: StaffDelegationType;
  Softwares: string[];
  AddeddUsers: DelegateUserViewModel[];
  UpdatedUsers: DelegateUserViewModel[];
  DeletedUsers: DelegateUserViewModel[];
  IsActive: boolean;
}
