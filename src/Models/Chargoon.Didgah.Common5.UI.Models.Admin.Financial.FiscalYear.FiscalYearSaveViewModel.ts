import { FiscalYearDetailViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Financial.FiscalYear.FiscalYearDetailViewModel";

export interface FiscalYearSaveViewModel {
  ID: number;
  Title: string;
  IsNew: boolean;
  AddedFiscalYearRanges: FiscalYearDetailViewModel[];
  EditedFiscalYearRanges: FiscalYearDetailViewModel[];
  DeletedFiscalYearRanges: FiscalYearDetailViewModel[];
}
