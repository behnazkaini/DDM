import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export interface PhysicalDatabaseEditInitViewModel {
  OperatingServers: EncryptedGuidKeyValue<string>[];
  FinancialSoftwares: EncryptedGuidKeyValue<string>[];
  FinancialActivityTypes: EncryptedGuidKeyValue<string>[];
}
