export interface PkiRepositoryViewModel {
  SerialNumber: string;
  SubjectDN: string;
  Thumbprint: string;
  DistinguishedName: string;
  ProfileName: string;
  Name: string;
  HasLogin: boolean;
  HasSign: boolean;
  HasEncryption: boolean;
}
