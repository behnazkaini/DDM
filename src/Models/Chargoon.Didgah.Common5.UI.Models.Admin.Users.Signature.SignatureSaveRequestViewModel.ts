import { SignatureViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.Signature.SignatureViewModel";
import { Signature } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.Signature.Signature";

export interface SignatureSaveRequestViewModel {
  AddedOrEditedSignature: SignatureViewModel[];
  DeletedSignature: Signature[];
  UserGuid: string;
}
