import { Layer } from "./Chargoon.Didgah.Layer";
import { ListOptionModel } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.ListOptionModel";

export class BaseParameterReferenceInfo {
  SoftwareGuid: string;
  Layer: Layer;
  EnumName: string;
  ClassName: string;
  MethodName: string;
  KeyFieldName: string = "ID";
  TitleFieldName: string = "Title";
  GuidEnumName: string;
  MethodParameters: Object[];
  ListOptions: ListOptionModel[];
}
