import { ParameterDataEntryType } from "./Chargoon.Reporting.ParameterDataEntryType";
import { NumberParameterType } from "./Chargoon.Reporting.NumberParameterType";
import { ListOptionModel } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.ListOptionModel";
import { SearchDropDownParameterReferenceInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.SearchDropDownParameterReferenceInfo";
import { PopupParameterReferenceInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.PopupParameterReferenceInfo";
import { CustomParameterInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.CustomParameterInfo";
import { DropdownParameterReferenceInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.DropdownParameterReferenceInfo";
import { CheckboxListParameterReferenceInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.CheckboxListParameterReferenceInfo";
import { CustomParameterEncryptionType } from "./Chargoon.Reporting.CustomParameterEncryptionType";

export class ParameterDataEntryInfo {
  DataEntryType: ParameterDataEntryType;
  NumberParameterType: NumberParameterType;
  ListOptions: ListOptionModel[];
  SearchDropDownParameterReferenceInfo: SearchDropDownParameterReferenceInfo;
  PopupParameterReferenceInfo: PopupParameterReferenceInfo;
  CustomParameterInfo: CustomParameterInfo;
  DropdownParameterReferenceInfo: DropdownParameterReferenceInfo;
  CheckboxListParameterReferenceInfo: CheckboxListParameterReferenceInfo;
  Encrypted: boolean;
  EncryptionEntityGuid: string;
  CustomParameterEncryptionType: CustomParameterEncryptionType;
}
