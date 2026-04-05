import { UserCertificateViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserCertificate.UserCertificateViewModel";

export interface SaveUserCertificateListViewModel {
  UserGuid: string;
  Added: UserCertificateViewModel[];
  Edited: UserCertificateViewModel[];
}
