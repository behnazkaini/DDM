import { SoftwareSettingLogDetailViewModel } from "./Chargoon.Didgah.Common5.UI.Models.SoftwareSettings.Log.SoftwareSettingLogDetailViewModel";

export interface SoftwareSettingSeparationFactorLogViewModel {
  UserFullName: string;
  Hour: string;
  Ip: string;
  SeparationFactor: string;
  Details: SoftwareSettingLogDetailViewModel[];
}
