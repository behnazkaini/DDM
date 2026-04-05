import { SoftwareSetting } from "./Chargoon.Didgah.Common5.UI.Models.Admin.SoftwareSetting.SoftwareSetting";

export interface SoftwareSettingViewModel {
  SoftwareSettings: SoftwareSetting[];
  SeparationFactorGuid: string;
  SeparationFactorTitle: string;
}
