import { PkiRepositorySaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserCertificate.PkiRepositorySaveViewModel";

export interface UserCertificateViewModel {
  Guid: string;
  RowId: string;
  IsLogin: boolean;
  IsSign: boolean;
  IsEncryption: boolean;
  HasLogin: boolean;
  HasSign: boolean;
  HasEncryption: boolean;
  SerialNumber: string;
  Thumbprint: string;
  SubjectDN: string;
  Active: boolean;
  Date: Date;
  UserGuid: string;
  FilePath: string;
  FileName: string;
  PkiRepository: PkiRepositorySaveViewModel;
}
