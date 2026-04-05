import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";
import { DynamicAssemblyViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicAssembly.DynamicAssemblyViewModel";

export interface DynamicAssemblyDefineInitViewModel {
  Softwares: EncryptedGuidKeyValue<string>[];
  Entities: EncryptedGuidKeyValue<string>[];
  DynamicAssembly: DynamicAssemblyViewModel;
}
