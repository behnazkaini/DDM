import { ReportParameterInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterRequest.ReportParameterInfo";

export interface ParameterRequestInitViewModel {
  Templates: { [key: string]: string; };
  OutputTypes: { [key: string]: string; };
  Destinations: { [key: string]: string; };
  ReportParametersInfo: ReportParameterInfo[];
}
