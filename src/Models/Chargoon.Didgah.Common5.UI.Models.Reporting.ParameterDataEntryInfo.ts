import { ParameterDataEntryType } from "./Chargoon.Reporting.ParameterDataEntryType";
import { CustomParameterEncryptionType } from "./Chargoon.Reporting.CustomParameterEncryptionType";

export class ParameterDataEntryInfo {
  DataEntryType: ParameterDataEntryType;
  Encrypted: boolean;
  EncryptionEntityGuid: string;
  CustomParameterEncryptionType: CustomParameterEncryptionType;
}
