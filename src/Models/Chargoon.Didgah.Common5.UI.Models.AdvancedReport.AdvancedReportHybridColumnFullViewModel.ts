import { AdvancedReportHybridColumnSimpleViewModel } from "./Chargoon.Didgah.Common5.UI.Models.AdvancedReport.AdvancedReportHybridColumnSimpleViewModel";
import { Element } from "./Chargoon.Didgah.Common5.UI.Models.AdvancedReport.Element";

export interface AdvancedReportHybridColumnFullViewModel extends AdvancedReportHybridColumnSimpleViewModel {
  Caption: string;
  DataType: number;
  Elements: Element[];
}
