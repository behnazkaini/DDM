import { ContentForSignViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.ContentForSignViewModel";
import { SignedContentViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.SignedContentViewModel";

export interface ValidateSingedCmsRequest {
  SourceContents: ContentForSignViewModel[];
  SignedContents: SignedContentViewModel[];
  SigningTimeValidatorKey: string;
}
