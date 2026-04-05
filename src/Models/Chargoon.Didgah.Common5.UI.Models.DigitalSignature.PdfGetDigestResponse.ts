import { PdfFileDigest } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.PdfFileDigest";

export interface PdfGetDigestResponse {
  Digests: PdfFileDigest[];
  SignTime: string;
}
