import { ConfigurationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Infrastructure.Configuration.ConfigurationViewModel";

export interface ConfigurationSaveViewModel {
  Added: ConfigurationViewModel[];
  Edited: ConfigurationViewModel[];
  Deleted: ConfigurationViewModel[];
}
