import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { ExternalSystemAccessCodeDefenitionViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ExternalSystem.ExternalSystemAccessCodeDefenitionViewModel";

export interface ExternalSystemAccessCodeInitViewModel {
  SoftwareGuids: GenericKeyValuePair<string>[];
  AccessCodeDefenition: { [key: string]: ExternalSystemAccessCodeDefenitionViewModel[]; };
}
