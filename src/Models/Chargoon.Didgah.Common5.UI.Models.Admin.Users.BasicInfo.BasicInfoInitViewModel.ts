import { UserAccessZoneViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.AccessZone.UserAccessZoneViewModel";
import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { ThemeItem } from "./Chargoon.Didgah.Common5.Infrastructure.Themes.ThemeItem";
import { GuidTitlePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GuidTitlePair";
import { AuthenticationType } from "./Chargoon.Didgah.InteractionManager.Contracts.Framework.Security.AuthenticationType";
import { NationalityValidatorType } from "./Chargoon.Didgah.Common.Domain.Enumeration.NationalityValidatorType";
import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export interface BasicInfoInitViewModel {
  UserAccessZone: UserAccessZoneViewModel;
  CalendarTypes: GenericKeyValuePair<number>[];
  AvailableLanguages: GenericKeyValuePair<string>[];
  Keyboard: GenericKeyValuePair<number>[];
  DefaultSoftware: GenericKeyValuePair<string>[];
  Themes: ThemeItem[];
  PersonTitle: GuidTitlePair[];
  IsSsnRequired: boolean;
  IsDocumentManagerLicenseAvailable: boolean;
  AvailableAuthenticationTypes: AuthenticationType[];
  AllowChangingPersonOfUser: boolean;
  IsSuperUser: boolean;
  IsOfflineClientAvailable: boolean;
  TokenProfiles: string[];
  IndividualPersonComponentToken: string;
  AvailableExtendedAuthenticationTypes: AuthenticationType[];
  NativeNationality: string;
  NationalityValidatorType: NationalityValidatorType;
  Nationalities: EncryptedGuidKeyValue<string>[];
}
