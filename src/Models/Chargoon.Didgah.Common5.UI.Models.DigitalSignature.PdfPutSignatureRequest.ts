import { PdfFileSignature } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.PdfFileSignature";
import { PdfSignatureCertificationLevel } from "./Chargoon.Library.Pki.DigitalSignature.PdfSignatureCertificationLevel";

export interface PdfPutSignatureRequest {
  FileSignatures: PdfFileSignature[];
  SignatureImageFileId: string;
  Location: string;
  Reason: string;
  CertificationLevel: PdfSignatureCertificationLevel;
  SelectedCertificateBase64: string;
  WorkspaceKey: string;
  SignTime: string;
}
