import { ContentForSignViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.ContentForSignViewModel";

export interface CmsDefineInfoResponse {
  ContentsForSign: ContentForSignViewModel[];
  SigningTimeValidatorKey: string;
  SigningTime: string;
}
