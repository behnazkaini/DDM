import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";
import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface BackgroundTaskListInitViewModel {
  Softwares: EncryptedGuidKeyValue<string>[];
  BackgroundTaskTypes: GenericKeyValuePair<number>[];
  BackgroundTaskStates: GenericKeyValuePair<number>[];
}
