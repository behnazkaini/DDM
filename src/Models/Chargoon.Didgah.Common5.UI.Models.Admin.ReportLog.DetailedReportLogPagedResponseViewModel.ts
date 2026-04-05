import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { DetailedReportLogViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ReportLog.DetailedReportLogViewModel";

export interface DetailedReportLogPagedResponseViewModel {
  Data: DetailedReportLogViewModel[];
  Total: number;
}
