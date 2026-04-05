import { AdavncedReportGetInitModel } from "./Chargoon.Didgah.Common5.UI.Models.AdvancedReport.AdavncedReportGetInitModel";

export interface AdavncedReportGetRequestModel extends AdavncedReportGetInitModel {
  ReportId: string;
  IsEnabaleSignatureSets?: boolean;
}
