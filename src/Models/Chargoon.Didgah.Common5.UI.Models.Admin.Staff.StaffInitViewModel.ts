import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { GuidTitlePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GuidTitlePair";
import { NationalityValidatorType } from "./Chargoon.Didgah.Common.Domain.Enumeration.NationalityValidatorType";
import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export interface StaffInitViewModel {
  IsSyncServerAvailable: boolean;
  IsOperationUnitEditAvailable: boolean;
  IsSsnRequired: boolean;
  OperationServers: GenericKeyValuePair<string>[];
  StaffTitleSearchDropDownAvailable: boolean;
  StaffTitleSearchFromPredefinitionOfStaffTitleAvailable: boolean;
  HasStaffUserAssignmentAccess: boolean;
  ManageOtherStaffDelegateAccess: boolean;
  PersonTitle: GuidTitlePair[];
  IndividualPersonComponentToken: string;
  EmailToken: string;
  NativeNationality: string;
  NationalityValidatorType: NationalityValidatorType;
  Nationalities: EncryptedGuidKeyValue<string>[];
}
