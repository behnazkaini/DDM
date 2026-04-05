import { PaperSize } from "./Chargoon.Didgah.Common.Domain.Enumeration.PaperSize";
import { DynamicReportViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicReport.DynamicReportViewModel";

export interface DynamicReportSaveModel {
  ReportId: number;
  SoftwareGuid: string;
  TableKey: number;
  Title: string;
  PaperSize: PaperSize;
  ShowDate: boolean;
  GroupInNewPage: boolean;
  SuppressZero: boolean;
  SuppressNullRows: boolean;
  IsLandscape: boolean;
  Details: DynamicReportViewModel[];
}
