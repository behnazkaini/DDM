import { LicenseOptionViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.License.LicenseOptionViewModel";
import { SoftwareLicenseOptionsViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.License.SoftwareLicenseOptionsViewModel";
import { SoftwareAccessZoneLicenseViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.License.SoftwareAccessZoneLicenseViewModel";

export interface LicenseDetailsViewModel {
  Owner: string;
  CustomerGuid: string;
  ExpirationDate: Date;
  ShowMobileExpirationDate: boolean;
  MobileExpirationDate: Date;
  GeneralCategories: LicenseOptionViewModel[];
  OtherCategories: SoftwareLicenseOptionsViewModel[];
  SoftwareAccessZoneLicenses: SoftwareAccessZoneLicenseViewModel[];
}
