import { SelectedFields } from "./Chargoon.Didgah.Common5.UI.Models.AdvancedReport.SelectedFields";

export interface AdvancedReportLoadModel {
  Title: string;
  DisplayTitle: string;
  ReportTemplateType: number;
  GroupId: string;
  AdvancedReportAccessCode: number;
  SortDirection: string;
  Active: boolean;
  InsertDate: boolean;
  Fields: SelectedFields[];
}
