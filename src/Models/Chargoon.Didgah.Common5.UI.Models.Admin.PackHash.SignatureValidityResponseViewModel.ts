import { SignatureValidityStatus } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.SignatureValidityStatus";

export interface SignatureValidityResponseViewModel {
  Id: number;
  ValidityStatus: SignatureValidityStatus;
  FullFilename: string;
  CreationTime: Date;
  HostName: string;
}
