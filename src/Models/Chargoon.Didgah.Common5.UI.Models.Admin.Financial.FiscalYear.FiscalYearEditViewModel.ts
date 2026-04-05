import { FiscalYearDetailEditViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Financial.FiscalYear.FiscalYearDetailEditViewModel";

export interface FiscalYearEditViewModel {
  ID: number;
  Title: string;
  FiscalYearRanges: FiscalYearDetailEditViewModel[];
}
