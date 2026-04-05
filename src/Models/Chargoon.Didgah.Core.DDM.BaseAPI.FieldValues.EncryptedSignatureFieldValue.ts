import { EncryptedSignatureExtraDataFieldValue } from "./Chargoon.Didgah.Core.DDM.BaseAPI.FieldValues.EncryptedSignatureExtraDataFieldValue";

export interface EncryptedSignatureFieldValue {
  SignatureId: string;
  Version: number;
  ExtraData: EncryptedSignatureExtraDataFieldValue;
}
