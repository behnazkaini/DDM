import { ExternalSystemViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ExternalSystem.ExternalSystemViewModel";

export interface ExternalSystemSaveViewModel extends ExternalSystemViewModel {
  AccessModified: boolean;
  AccessCodes: { [key: string]: string[]; };
}
