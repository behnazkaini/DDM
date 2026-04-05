import { SignatureValidityStatus } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.SignatureValidityStatus";

export interface SignatureValidityRequestFilterViewModel {
  DateFrom: Date;
  DateTo: Date;
  Name: string;
  ValidityStatus: SignatureValidityStatus;
}
