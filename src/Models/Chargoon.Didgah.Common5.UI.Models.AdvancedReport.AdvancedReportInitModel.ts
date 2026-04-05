import { ListItem } from "./Chargoon.Didgah.Core5.Components.Models.SelectEx.ListItem";
import { ReportTemplateViewModel } from "./Chargoon.Didgah.Common5.UI.Models.AdvancedReport.ReportTemplateViewModel";
import { AdvancedReportColumn } from "./Chargoon.Didgah.Common5.UI.Models.AdvancedReport.AdvancedReportColumn";

export interface AdvancedReportInitModel {
  Groups: ListItem[];
  Templates: ReportTemplateViewModel[];
  AccessCodes: ListItem[];
  UsableColumns: AdvancedReportColumn[];
  ShowAdvancedReportAccessLevel: boolean;
}
