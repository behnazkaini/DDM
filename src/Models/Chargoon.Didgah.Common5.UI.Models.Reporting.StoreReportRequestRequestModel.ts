import { ReportParameterInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ReportParameterInfo";

export interface StoreReportRequestRequestModel {
  SoftwareGuid: string;
  EntityGuid: string;
  ReportGuid: string;
  TemplateGuid: string;
  InputRequesterReportParametersInfo: ReportParameterInfo[];
  OutputType: string;
  Destination: string;
  FolderID: number;
}
