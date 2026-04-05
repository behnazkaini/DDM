import { ProcessDTSRequestViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DTS.ProcessDTSRequestViewModel";

export interface ProcessExcelImportDTSRequestViewModel extends ProcessDTSRequestViewModel {
  FilePath: string;
  FileName: string;
}
