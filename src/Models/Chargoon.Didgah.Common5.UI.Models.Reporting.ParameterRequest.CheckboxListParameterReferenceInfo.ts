import { BaseParameterReferenceInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.BaseParameterReferenceInfo";
import { CheckboxListParameterReferenceType } from "./Chargoon.Reporting.CheckboxListParameterReferenceType";

export class CheckboxListParameterReferenceInfo extends BaseParameterReferenceInfo {
  ReferenceType: CheckboxListParameterReferenceType;
  IgnoreParameterValueInQuery: boolean;
}
