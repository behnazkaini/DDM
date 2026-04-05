import { PkiRepositorySaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserCertificate.PkiRepositorySaveViewModel";

export interface UserCertificateValidationQueryViewModel {
  UserGuid: string;
  FilePath: string;
  PkiRepository: PkiRepositorySaveViewModel;
}
